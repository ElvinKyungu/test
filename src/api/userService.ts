import { supabase } from './supabaseClient'
import type { SupabaseError, User } from '../types'
import { useUserStore } from '../stores/store'

const getUserProfile = async (userId: string): Promise<User | { error: any }> => {
  try {
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single()
    if (error) {
      return { error }
    }
    if (!data) {
      console.error('User profile not found.')
      return { error: 'User profile not found.' }
    }
    console.log('User profile retrieved successfully:', data)
    return data
  } catch (error) {
    console.error((error as SupabaseError).message)
    throw error
  }
}

const downloadAvatar = async (path: string): Promise<string | null> => {
  try {
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)

    if (!data) {
      console.error('No data received from Supabase download')
      return null
    }
    const url = data.publicUrl
    return url
  } catch (error) {
    console.error(error)
    return null
  }
}

const convertToBase64 = (file: File): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const uploadAvatar = async (event: InputEvent & { target: HTMLInputElement }): Promise<string | null> => {
  try {
    const files = event.target.files
    if (!files || files.length === 0) return null
    const file = files[0]
    const base64Image = await convertToBase64(file)
    if (!base64Image) return null

    const fileExt = file.name.split('.').pop()
    const filePath = `${Math.random()}.${fileExt}`
    const { data, error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

    if (uploadError) throw uploadError

    const blobUrl = await downloadAvatar(data.path)
    const userStore = useUserStore()
    if (typeof blobUrl === 'string') {
      const userData = {
        userID: userStore.userID ?? '',
        email: userStore.email ?? '',
        avatar: blobUrl,
        first_name: userStore.first_name ?? '',
        last_name: userStore.last_name ?? '',
        token: userStore.token ?? ''
      }
      userStore.setUserData(userData)
    }
    return blobUrl
  } catch (error) {
    console.log(error)
    return null
  }
}

const editUserProfile = async (updates: User): Promise<boolean> => {
  console.log('Editing user profile:', updates)
  try {
    const { role, ...safeUpdates } = updates

    const { error } = await supabase.from('users').update(safeUpdates).eq('id', updates.id)
    if (error) throw error

    const userStore = useUserStore()
    const avatar = updates.avatar || ''
    const token = userStore.getUserInfo.token || ''

    userStore.setUserData({
      userID: updates.id,
      email: updates.email,
      avatar,
      first_name: updates.first_name || '',
      last_name: updates.last_name || '',
      token
    })

    return true
  } catch (error) {
    console.log((error as SupabaseError).message)
    return false
  }
}

export { getUserProfile, editUserProfile, uploadAvatar }
