<script setup lang="ts">
  import { ref } from 'vue'
  import IconMail from '../icons/IconMail.vue'
  import { useDark } from '@vueuse/core'
  // import { useAuth } from '@/composables/useAuth'

  const email = ref('')
  // const { sendResetPasswordEmail, error, loading } = useAuth()
  const handleSubmit = () => {
    // sendResetPasswordEmail(email.value)
  }
  const isDark = useDark()
</script>
<template>
  <h1 :class="{ 'text-white': isDark }" class="text-gray-900 text-center">
    To reset your password, please click on the button below. We will send you a reset link by e-mail.
  </h1>
  <div class="flex flex-col space-y-5 justify-center">
    <form @submit.prevent="handleSubmit">
      <div
        :class="{ 'text-white dark border-gray-500/30': isDark }"
        class="flex items-center gap-3 px-2 py-3 rounded border w-full"
      >
        <IconMail :class="{ 'text-white': isDark }" />
        <div class="leading-3 relative w-1/2">
          <div class="relative">
            <input
              type="text"
              class="text-gray-900 text-sm rounded-lg focus:ring-transparent focus:border-transparent block outline-none border-none"
              :class="{ 'dark text-white ': isDark }"
              placeholder="Mail adress"
              required
            />
          </div>
        </div>
      </div>
      <!-- <span class="text-red-500 block" v-if="userProfile?.email === ''">
          Enter your email adress
        </span> -->
      <button type="submit" class="bg-[#6cd2e7] flex relative text-white p-2 mt-5 rounded">
        Send reset link
      </button>
      <!-- <span v-if="error" class="text-gray-500 text-sm mt-2">
          {{ error ? error : '' }}
        </span> -->
    </form>
  </div>
</template>
