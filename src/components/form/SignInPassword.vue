<script lang="ts" setup>
import { ref, computed } from 'vue'
import { signinWithPassword } from '../../lib/auth'
import Spinner from '../Spinner.vue'
import IconMail from '../icons/IconMail.vue'
import IconEye from '../icons/IconEye.vue'
import IconEyeOff from '../icons/IconEyeOff.vue'
import IconLock from '../icons/IconLock.vue'
// const disableButton = ref(false)
const isSubmited = ref(false)
const showPassword = ref(false)
const userLoginData = ref({
  email: '',
  password: '',
  name: '',
  lastname: ''
})

const errors = ref({
  invalidEmail: '',
  invalidPassword:''
})

const generalError = ref('')

const handleSigninWithPassword = async () => {
  generalError.value = ''
  if (isFormValid.value) {
   
    isSubmited.value = true
    try {
      const result = await signinWithPassword(userLoginData.value)
      if (result.error) {
        generalError.value = 'Invalid email or password'
        isSubmited.value = false
      } else {
        console.log('Successfully signed in', result)
        // TODO: redirect or next step
      }
    } catch (error) {
      console.error(error)
      generalError.value = "Incorrect email/password. Please try again."
      isSubmited.value = false
    }
  } else {
    generalError.value = 'Please fill in all fields correctly.'
  }
}

const isFormValid = computed(() => {
  return (
    userLoginData.value.email !== '' &&
    userLoginData.value.password !== '' &&
    errors.value.invalidEmail === '' &&
    errors.value.invalidPassword === ''
  )
})

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(userLoginData.value.email)) {
    errors.value.invalidEmail = 'Invalid e-mail address'
  } else {
    errors.value.invalidEmail = ''
  }
}
const validatePassword = ()=>{
  errors.value.invalidPassword = userLoginData.value.password.length > 5 ? '' : 'Invalid password'
}

const togglePasswordVisibility = ()=>{
  showPassword.value = !showPassword.value
}

</script>
<template>
  <form @submit.prevent="" autocomplete="off">
    <div>
      <div class="mt-8">
        <div class="flex gap-4 w-full relative mt-4">
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
              <icon-mail/>
              <input 
                class="
                focus:outline-none bg-[#f6f6f6] w-full
                " 
                type="email" 
                placeholder="johndoe@gmail.com"
                v-model="userLoginData.email"
                @blur="validateEmail"
                @keyup="validateEmail"
              >
            </div>
            <span class="text-red-500 ml-4 mt-2 block" v-if="errors.invalidEmail !== ''">
              {{ errors.invalidEmail }}
            </span>
          </div>
        </div>
        <div class="mt-6">
          <div class="text-lg font-bold text-gray-700 tracking-wide ml-4 mb-2">Your password</div>
          <div 
            class="
              flex items-center
              text-lg font-bold py-4 rounded-full bg-[#f6f6f6]
              focus:border-indigo-500 px-5 gap-4 border border-gray-300 
            "
            :class="{ 'border-red-500': errors.invalidPassword !== '' }"
          >
            <icon-lock/>
            <input
              class="
              focus:outline-none bg-[#f6f6f6] w-full
              " 
              :type="showPassword ? 'text' : 'password'"  
              placeholder="Your password"
              v-model="userLoginData.password"
              @keyup="validatePassword"
              @blur="validatePassword"
            >
            <div @click="togglePasswordVisibility" class="cursor-pointer">
              <icon-eye v-if="!showPassword"/>
              <icon-eye-off v-else/>
            </div>
          </div>
          <span class="text-red-500 ml-4 mt-2 block" v-if="errors.invalidPassword !== ''">
            {{ errors.invalidPassword }}
          </span>
        </div>
      </div>
      <div v-if="generalError" class="text-red-500 text-center mt-4 font-medium">
        {{ generalError }}
      </div>
      <div class="mt-10 flex gap-10">
        <button
          @click="handleSigninWithPassword"
          class="
          bg-[#388087]  text-gray-100 p-4 w-full flex justify-center rounded-full tracking-wide
            font-semibold font-display focus:outline-none focus:shadow-outline 
            shadow-lg 
          "
          :class="{ 'hover:bg-[#388087] cursor-not-allowed': !isFormValid }"
          :disabled="!isFormValid"
        >
          <span v-if="!isSubmited">Signin with password</span>
          <Spinner v-else/>
        </button>
      </div>
    </div>
  </form>
</template>
<style>

</style>