
<script setup lang="ts">
  import { onMounted, ref, Ref } from 'vue'
  import { supabase } from '../api/supabaseClient'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '../stores/store'
  import { getUserProfile } from '../lib/api'
  import { UserProfile } from '../types/type'
  import Spinner from '../components/Spinner.vue'

  const userStore = useUserStore()

  onMounted(async () => {
    const router = useRouter()
    const userProfile: Ref<UserProfile | { error: any }> = ref({} as UserProfile)
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')

    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error(error)
    } else {
      if (data.session?.user && accessToken) {
        const { id, email } = data.session.user
        const result = await getUserProfile(id)
        if ('error' in result) {
          console.error(result.error)
        } else {
          userProfile.value = result
          if ('avatar' in userProfile.value) { 
            const { name, lastname } = data.session.user.user_metadata;
            if (email) {
              userStore.setUserData({
                userID: id,
                first_name: name,
                last_name: lastname,
                token: accessToken,
                email: email,
                avatar: userProfile.value.avatar
              })
              router.push({ name: 'Home' })
            }
          }
        }
      } else {
        console.log('No user found in session')
      }
    }
  })
</script>
<template>
  <div 
    class="
      p-6 bg-white border border-gray-200 flex-col gap-10
      rounded-lg shadow-md hover:bg-gray-100 w-full h-screen flex justify-center items-center
    "
  >
    <div class="flex flex-col items-center justify-center gap-4">
      <Spinner class="text-gray-700"/>
      <p class="font-normal text-gray-500">
        Redirecting...
      </p>
    </div>
  </div>
</template>

