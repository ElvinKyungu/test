import { supabase } from '../api/supabaseClient'
import { useUserStore } from '../stores/store'
import router from '../routes/router'

async function signinWithPassword({password, email}: any): Promise<any> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (error) {
      throw error
    }
    console.log('data', data)
    if (data) {
      const store = useUserStore()
      const {name, email, lastname, avatar} = data.user.user_metadata
      const id = data.user.id
      const token = data.session.access_token

      store.setUserData({
        userID: id,
        first_name: name,
        last_name: lastname,
        token: token,
        email: email,
        avatar: avatar
      })
      router.push('/')
      return { data: { id, email, name, token } }
    }

    return { data: null }
  } catch (error) {
    throw error
  }
}
export { 
  signinWithPassword,
}
