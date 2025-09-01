<script lang="ts" setup>
import { ref } from 'vue'
import { useMapStore } from '../stores/mapStore'
import { useDark } from '@vueuse/core'
import { darkModeStyles, lightModeStyles } from '../google-map/googlemaploader'

import LogoutModal from './modal/LogoutModal.vue'
import Profile from './profiles/Profile.vue'
import UserAvatar from './profiles/UserAvatar.vue'
import DevicesDetails from './DevicesTable.vue'
import IconListAside from './icons/IconListAside.vue'
import IconDark from './icons/IconDark.vue'
import IconLight from './icons/IconLight.vue'
import IconPowerOff from './icons/IconPowerOff.vue'

const useMap = useMapStore()

const isDarkMode = useDark()
const toggleMode = () => {
  isDarkMode.value = !isDarkMode.value
  const map = useMap.getMap
  if (map) {
    map.setOptions({ styles: isDarkMode.value ? darkModeStyles : lightModeStyles })
  }
}
const currentComponent = ref(false)
const currentSidebarContent = ref('')

const showSidebarContent = (content: string) => {
  currentComponent.value = true
  currentSidebarContent.value = content
}

const closeModal = () => {
  currentComponent.value = false
}

const closeTable = () => {
  currentComponent.value = false
  currentSidebarContent.value = ''
}
</script>

<template>
  <aside class="flex relative">
    <div class="flex relative">
      <div
        :class="{ 'bg-[#222': isDarkMode, 'bg-[#6cd2e7] border-r border-white/30': !isDarkMode }"
        class="h-full flex flex-col justify-between items-center pt-8"
      >
        <div class="h-full flex flex-col justify-start items-center mt-5">
          <div
            @click="showSidebarContent('profile')"
            class="flex justify-between items-center cursor-pointer"
          >
            <UserAvatar size="small" />
          </div>
          <div
            @click="showSidebarContent('details')"
            class="aside_link py-3 mt-5"
            :class="[
              isDarkMode ? 'hover:bg-gray-500/10 text-white' : 'text-gray-800 hover:bg-gray-100',
              !isDarkMode && currentSidebarContent === 'details' ? 'bg-white' : ''
            ]"
            title="Devices"
          >
            <IconListAside />
          </div>
          <div
            @click="toggleMode"
            class="aside_link py-3"
            :class="{ 'hover:bg-gray-500/10': isDarkMode, 'text-gray-800 hover:bg-gray-100': !isDarkMode }"
            title="Devices"
          >
            <IconDark v-if="isDarkMode" />
            <IconLight v-else />
          </div>
        </div>
        <div class="h-full space-y-3 mb-5 flex flex-col justify-end items-center">
          <div
            @click="showSidebarContent('LogoutModal')"
            class="aside_link py-3"
            :class="{ 'hover:bg-gray-500/10': isDarkMode, 'text-gray-800 hover:bg-gray-100': !isDarkMode }"
            title="Logout"
          >
            <IconPowerOff />
          </div>
          <div class="logo">
            <img src="../assets/logo-icon.svg" alt="" class="w-10 h-10 object-cover rounded-full" />
          </div>
        </div>
      </div>
      <div v-if="currentComponent" class="z-30">
        <div
          v-if="currentSidebarContent === 'searchContent'"
          class="scroll w-[80vw] sm:w-[46vw] md:w-[45vw] lg:w-[35vw] xl:w-[30vw] relative overflow-y-auto"
        >
          <SearchContent />
        </div>
        <div v-if="currentSidebarContent === 'profile'">
          <Profile @closeModal="closeModal" />
        </div>
        <div v-else-if="currentSidebarContent === 'LogoutModal'">
          <LogoutModal @closeModal="closeModal" />
        </div>
        <div v-if="currentSidebarContent === 'details'" class="scroll w-[50vw] relative overflow-y-hidden">
          <DevicesDetails @closeTableDevices="closeTable" />
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped></style>
