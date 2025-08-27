<script lang="ts" setup>
import { ref, computed } from 'vue'
const errors = ref({
  invalidEmail: ''
})
const email = ref('')
const handleRegister = async() => {
}
const isFormValid = computed(() => {
  return (
    email.value === '' &&
    errors.value.invalidEmail === ''
  )
})

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errors.value.invalidEmail = 'Invalid e-mail address'
  } else {
    errors.value.invalidEmail = ''
  }
}
</script>
<template>
  <div>
    <div class="lg:flex">
      <div class="lg:w-1/2 xl:max-w-screen-sm min-h-screen overflow-y-auto">
        <div class="py-12 bg-indigo-100 lg:bg-white flex flex-col justify-center lg:justify-start lg:px-12">
          <div class="cursor-pointer flex items-center">
            <div class="w-16 h-16 object-cover">
              <img src="../assets/logo-icon.svg" alt="">
            </div>
            <div class="text-4xl text-[#388087] tracking-wide ml-2 font-semibold">Strategic zone</div>
          </div>
          <div class="mt-8">
            <div class="text-xl text-[#222] text-center tracking-wide ml-2 ">
              To reset your password, please enter your e-mail address and we will send you an e-mail containing the reset link. 
            </div>
            <form @submit.prevent="" autocomplete="off">
              <div>
                <div class="flex gap-4 w-full relative mt-8">
                  <div class="relative w-full">
                    <div class="text-lg font-bold text-gray-700 tracking-wide ml-4 mb-2">Your mail adress</div>
                    <div 
                      class="
                        flex items-center
                         text-lg font-bold py-4 rounded-full bg-[#f6f6f6]
                        focus:border-indigo-500 px-5 gap-4 border border-gray-300 
                      "
                      :class="{ 'border-red-500': errors.invalidEmail !== '' }"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                      <input 
                        class="
                        focus:outline-none bg-[#f6f6f6] w-full
                        " 
                        type="email" 
                        placeholder="johndoe@gmail.com"
                        v-model="email"
                        @keyup="validateEmail"
                        @blur="validateEmail"
                      >
                    </div>
                    <span class="text-red-500 ml-4 mt-2 block" v-if="errors.invalidEmail !== ''">
                      {{ errors.invalidEmail }}
                    </span>
                  </div>
                </div>
                <div class="mt-10 flex gap-10">
                  <button 
                    @click="handleRegister"
                    class="
                    bg-[#388087]  text-gray-100 p-4 w-full rounded-full tracking-wide
                      font-semibold font-display focus:outline-none focus:shadow-outline 
                      hover:bg-[#295f64] shadow-lg
                    "
                    :class="{ 'hover:bg-[#388087] cursor-not-allowed curs': !isFormValid }"
                    :disabled="!isFormValid"
                  >
                    Reset password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="hidden relative lg:flex items-center justify-center bg-[#C2EDCE] flex-1 h-screen">
        <div class="absolute  w-full h-full">
          <img src="../assets/bg_auth.png" class="w-full h-full object-cover" alt="">
        </div>
      </div>
    </div>
  </div>
</template>