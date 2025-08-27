<script lang="ts" setup>
  import { useUserStore } from '../../stores/store'
  import { ref, defineEmits } from 'vue'
  import { uploadAvatar, } from '../../lib/api'
  import { useDark } from '@vueuse/core'
  import IconClose from '../icons/IconClose.vue'
  import IconDelete from '../icons/IconDelete.vue'
  import IconPhoto from '../icons/IconPhoto.vue'
  const userStore = useUserStore()
  const isDark = useDark()
  const isChooseAvatar = ref(false)
  const emit = defineEmits(['closeModal', 'upload', 'update:path'])

  const closeModal = () => {
    emit('closeModal')
  }
  const handleUploadAvatar = async (event: Event) => {
    const inputEvent = event as InputEvent & { target: HTMLInputElement }
    try{
      const result = await uploadAvatar(inputEvent)
      const userInfo = userStore.getUserInfo
      userStore.setUserData({
        userID: userInfo.userID || '',
        first_name: userInfo.first_name || '',
        last_name: userInfo.last_name || '',
        token: userInfo.token || '',
        email: userInfo.email || '',
        avatar: result !== null ? result : ''
      })
    }
    catch (error) {
      console.log(error)
    } finally {
    }
  }

  const deleteAvatar = ()=>{
    const userInfo = userStore.getUserInfo
    userStore.setUserData({
      userID: userInfo.userID || '',
      first_name: userInfo.first_name || '',
      last_name: userInfo.last_name || '',
      token: userInfo.token || '',
      email: userInfo.email || '',
      avatar: ''
    })
  }
</script>
<template>
  <div
    class="flex items-center justify-center h-screen w-full fixed inset-0 bg-black/50 z-50"
  >
    <div
      :class="{'dark': isDark, 'bg-white': !isDark}"
      class="
        relative  w-full h-[23%] flex overflow-auto flex-col items-start
        max-w-[90%] lg:max-w-[30%] rounded-xl shadow-2xl justify-between p-5
      "
    >
      <div class="flex flex-col relative w-full">
        <div class="flex relative justify-between w-full pr-10">
          <h1
            :class="{'text-white': isDark}"
            class="text-2xl text-left"
          >
            Choose or delete your avatar
          </h1>
          <div
            @click="closeModal"
            class="
              z-30  text-white right-0 absolute
              bg-black/20 cursor-pointer rounded-full p-3
            "
          >
            <IconClose />
          </div>
        </div>
        <div>
          <ul class="mt-10 flex flex-col gap-3 text-lg" :class="{'text-white': isDark}">
            <li
              class="cursor-pointer"
              @click="isChooseAvatar = true"
            >
              <label for="chooseAvatar" class="cursor-pointer flex w-full justify-between">
                <span>Choose a new avatar</span>
                <IconPhoto/>
                <input
                  style="visibility: hidden; position: absolute"
                  type="file"
                  id="chooseAvatar"
                  accept="image/*"
                  @change="handleUploadAvatar"
                />
              </label>
            </li>
            <li
              class="cursor-pointer flex justify-between"
              @click="deleteAvatar"
            >
              <span>Delete avatar</span>
              <IconDelete class="text-red-500"/>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
