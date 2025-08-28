<script setup lang="ts">
  import { useUserStore } from '../../stores/store'
  import { ref, onMounted, defineEmits } from 'vue'
  import Swal from 'sweetalert2'
  import { editUserProfile, getUserProfile } from '../../api/userService'
  import Spinner from '../Spinner.vue'
  import { UserProfile } from '../../types/index'
  import { useDark } from '@vueuse/core'
  import { useForm } from 'vee-validate'
  import * as Yup from 'yup'
  import IconUser from '../icons/IconUser.vue'
  import IconMail from '../icons/IconMail.vue'

  const isDark = useDark()
  const userStore = useUserStore()
  const isLoading = ref(false)
  const currentProfilContent = ref('form')
  const emit = defineEmits()
  const userProfile = ref<UserProfile | null>(null)
 
  const schema = Yup.object().shape({
    first_name: Yup.string().required().min(3).max(15),
    last_name: Yup.string().required().min(3).max(15),
    role: Yup.string().required().min(3).max(15),
    email: Yup.string().required().email()
  })

  const { handleSubmit } = useForm({
    initialValues: userProfile.value,
    validationSchema: schema,
    validateOnMount: true
  })

  const editProfile = async () => {
    isLoading.value = true
    try {
      if (userProfile.value !== null) {
        const src = userStore.getUserInfo.avatar? userStore.getUserInfo.avatar: ''
        userProfile.value.avatar = src
        await editUserProfile(userProfile.value)
        Swal.fire({
          title: 'Success!',
          text: 'Profile changed!',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        isLoading.value = false
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while updating the profile.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      isLoading.value = false
    }
  }

  onMounted(async () => {
    if (userStore.userID !== null) {
      const userProfileData = await getUserProfile(userStore.userID)
      if ('error' in userProfileData) {
        console.error("Error retrieving profile:", userProfileData.error)
      } else {
        userProfile.value = {
          id: userStore.userID || '',
          first_name: userProfileData.first_name || '',
          last_name: userProfileData.last_name || '',
          role: userProfileData.role || '',
          email: userProfileData.email || '',
          avatar: userStore.getUserInfo.avatar || ''
        }
      }
    }
  })
</script>

<template>
  <div 
    v-if="currentProfilContent === 'form'"
    class="w-full"
  >
    <form 
      v-if="userProfile"
      @submit.prevent="handleSubmit(editProfile)" 
      class="flex justify-start w-full"
    >
      <div class="flex flex-col gap-3 justify-start w-full">
        <p 
          :class="{'text-white': isDark}"
          class="text-base text-slate-700"
        >
          Your last name: 
        </p>
        <div 
          :class="{'dark border-gray-500/30': isDark}"
          class="flex items-center gap-3 px-2 py-3 rounded border w-full"
        >
          <div
            class="flex items-center gap-3"
          >
            <IconUser :class="{'text-white': isDark}"/>
            <div class="leading-3">
              <div>
                <input
                  name="name" 
                  rules="required" 
                    v-if="userProfile"
                    v-model="userProfile.last_name"
                  type="text" 
                  class="
                   text-gray-900 text-sm
                    rounded-lg focus:ring-transparent focus:border-transparent block 
                    w-full outline-none border-none
                  "
                  :class="{'dark text-white': isDark}"
                  placeholder="Your last name"
                />
              </div>
            </div>
          </div>
        </div>
        <span 
          class="text-red-500 block" 
          v-if="userProfile?.last_name === ''"
        >
          Enter last name
        </span>
        <p 
          :class="{'text-white': isDark}"
          class="text-base text-slate-700"
        >
          Your first name: 
        </p>
        <div
          :class="{'dark border-gray-500/30': isDark}"
          class="flex items-center gap-3 px-2 py-3 rounded border w-full" 
        >
          <IconUser :class="{'text-white': isDark}"/>
          <div class="leading-3">
            <div>
              <input
                v-if="userProfile"
                v-model="userProfile.first_name"
                type="text" 
                class="
                  text-gray-900 text-sm
                  rounded-lg focus:ring-transparent focus:border-transparent block 
                  w-full outline-none border-none
                "
                :class="{'dark text-white': isDark}"
                placeholder="Your first name" 
                required
              />
            </div>
          </div>
        </div>
        <span class="text-red-500 block" v-if="userProfile?.first_name === ''">
          Enter first name
        </span>
        <p 
          :class="{'text-white': isDark}"
          class="text-base text-slate-700"
        > 
          Your role: 
        </p>
        <div 
          :class="{'text-white dark border-gray-500/30': isDark}"
          class="flex items-center gap-3 px-2 py-3 rounded border w-full"
        >
          <IconUser :class="{'text-white ': isDark}"/>
          <div class="leading-3">
            <div>
              <input
                v-if="userProfile"
                v-model="userProfile.role"
                type="text" 
                class="
                  text-gray-900 text-sm
                  rounded-lg focus:ring-transparent focus:border-transparent block 
                  w-full outline-none border-none
                "
                :class="{'dark text-white': isDark}"
                placeholder="Chef marketing officer" 
                required 
              />
            </div>
          </div>
        </div>
        <span class="text-red-500 block" v-if="userProfile?.role === ''">
          Enter your role
        </span>
        <p 
          :class="{'text-white': isDark}"
          class="text-base text-slate-700"
        >
          Your mail: 
        </p>
        <div
          :class="{'text-white dark border-gray-500/30': isDark}"
          class="flex items-center gap-3 px-2 py-3 rounded border w-full"
        >
          <IconMail :class="{'text-white': isDark}"/>
          <div class="leading-3 w-ful relative">
            <div class="w-ful">
              <input
                v-if="userProfile"
                v-model="userProfile.email"
                type="text" 
                class="
                  text-gray-900 text-sm
                  rounded-lg focus:ring-transparent focus:border-transparent block 
                  w-full outline-none border-none
                "
                :class="{'dark text-white ': isDark}"
                placeholder="Mail adress" 
                required
              />
            </div>
          </div>
        </div>
        <span class="text-red-500 block" v-if="userProfile?.email === ''">
          Enter your email adress
        </span>
        <div 
          class="flex items-center gap-3 px-2 py-3  rounded justify-end w-full"
        >
          <button
            @click="editProfile"
            type="submit"
            class="bg-[#6cd2e7] text-white py-2 px-6 rounded-md"
          >
            <Spinner v-if="isLoading === true"/>
            <span v-else>Save my profile</span>
          </button>
        </div>
      </div>
    </form>
    <div 
      v-else
      class="flex items-center justify-center"
    >
      <Spinner />
    </div>
  </div>
</template>
