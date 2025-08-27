// composables/useAuth.ts
import { supabase } from '@/supabase' // ta config Supabase
import { ref } from 'vue'

export function useAuth() {
  const error = ref<string | null>(null)
  const loading = ref(false)

  const sendResetPasswordEmail = async (email: string) => {
    loading.value = true
    error.value = null

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://ton-app.com/reset-password',
    })

    if (err) {
      error.value = err.message
    }

    loading.value = false
  }

  return {
    sendResetPasswordEmail,
    error,
    loading,
  }
}
