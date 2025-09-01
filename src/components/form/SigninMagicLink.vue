<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { signinWithOtp } from '../../lib/auth'
  import Spinner from '../Spinner.vue'

  const isSubmited = ref(false)
  const emailWithMagicLink = ref('')

  const errorEmailMagicLink = ref('')

  const handleSigninWithOtp = async () => {
    if (EmailMagicLinkValid.value) {
      isSubmited.value = !isSubmited.value
      await signinWithOtp(emailWithMagicLink.value)
    } else {
      console.log('Veuillez remplir tous les champs correctement.')
    }
  }

  const EmailMagicLinkValid = computed(() => {
    return emailWithMagicLink.value !== '' && errorEmailMagicLink.value === ''
  })

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailWithMagicLink.value)) {
      errorEmailMagicLink.value = 'Invalid e-mail address'
    } else {
      errorEmailMagicLink.value = ''
    }
  }
</script>
<template>
  <form @submit.prevent="" autocomplete="off">
    <div>
      <div class="flex gap-4 w-full relative mt-4">
        <div class="relative w-full">
          <div class="text-lg font-bold text-gray-700 tracking-wide ml-4 mb-2">Your mail adress</div>
          <div
            class="flex items-center text-lg font-bold py-4 rounded-full bg-[#f6f6f6] focus:border-indigo-500 px-5 gap-4 border border-gray-300"
            :class="{ 'border-red-500': errorEmailMagicLink !== '' }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
            <input
              class="focus:outline-none bg-[#f6f6f6] w-full"
              type="email"
              placeholder="johndoe@gmail.com"
              v-model="emailWithMagicLink"
              @blur="validateEmail"
              @keyup="validateEmail"
            />
          </div>
          <span class="text-red-500 ml-4 mt-2 block" v-if="errorEmailMagicLink !== ''">
            {{ errorEmailMagicLink }}
          </span>
        </div>
      </div>
      <div class="mt-10 flex gap-10">
        <button
          @click="handleSigninWithOtp"
          class="bg-[#388087] text-gray-100 p-4 w-full flex justify-center rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-[#295f64] shadow-lg"
          :class="{ 'hover:bg-[#388087] cursor-not-allowed curs': !EmailMagicLinkValid }"
          :disabled="!EmailMagicLinkValid"
        >
          <span v-if="!isSubmited">Signin with magic link</span>
          <Spinner v-else />
        </button>
      </div>
    </div>
  </form>
</template>
<style></style>
