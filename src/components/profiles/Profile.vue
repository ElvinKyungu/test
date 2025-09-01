<script lang="ts" setup>
  // import { useUserStore } from '../../stores/store'
  import SetProfile from './SetProfile.vue'
  import ResetPassword from './ResetPassword.vue'
  import UserAvatar from './UserAvatar.vue'
  import IconClose from '../icons/IconClose.vue'
  import ChooseAvatar from './ChooseAvatar.vue'
  import { ref, defineEmits, onMounted, onBeforeUnmount } from 'vue'
  import { useDark } from '@vueuse/core'
  import gsap from 'gsap'

  const isDark = useDark()
  const currentProfilContent = ref('form')
  const showUserAvatrOption = ref(false)
  const modalRef = ref<HTMLElement | null>(null)
  const modalContentRef = ref<HTMLElement | null>(null)
  const isClosing = ref(false)

  const emit = defineEmits(['closeModal', 'upload', 'update:path'])

  const closeModalProfile = () => {
    animateClose().then(() => {
      emit('closeModal')
    })
  }

  const closeModalAvatar = () => {
    showUserAvatrOption.value = false
  }

  const showFormContent = (content: string) => {
    currentProfilContent.value = content
  }

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      modalRef.value instanceof HTMLElement &&
      modalContentRef.value instanceof HTMLElement &&
      !modalContentRef.value.contains(event.target as Node) &&
      modalRef.value.contains(event.target as Node)
    ) {
      closeModalProfile()
    }
  }

  const animateOpen = () => {
    // Animation du backdrop (fade in)
    gsap.fromTo(modalRef.value, { opacity: 0 }, { opacity: 1, duration: 0.3 })

    // Animation du contenu du modal (scale + fade)
    return gsap.fromTo(
      modalContentRef.value,
      { opacity: 0, y: -50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
    )
  }

  const animateClose = () => {
    if (isClosing.value) return Promise.resolve()

    isClosing.value = true

    // Animation de fermeture du backdrop
    gsap.to(modalRef.value, {
      opacity: 0,
      duration: 0.2
    })

    // Animation de fermeture du contenu
    return gsap.to(modalContentRef.value, {
      opacity: 0,
      y: -30,
      scale: 0.95,
      duration: 0.3,
      onComplete: () => {
        isClosing.value = false
      }
    })
  }

  onMounted(() => {
    animateOpen()
    document.addEventListener('keydown', handleEscKey)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleEscKey)
  })

  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModalProfile()
    }
  }
</script>

<template>
  <div
    ref="modalRef"
    @click="handleOutsideClick"
    class="flex items-center justify-center h-screen w-full fixed inset-0 bg-black/50 z-50"
  >
    <div
      ref="modalContentRef"
      :class="{ dark: isDark, 'bg-white': !isDark, 'bg-gray-800': isDark }"
      class="relative w-full flex max-w-[95%] lg:max-w-[70%] rounded-xl shadow-2xl overflow-hidden h-[90%]"
    >
      <div :class="{ dark: isDark, 'bg-white': !isDark }" class="md:mx-auto rounded-xl w-full flex flex-col">
        <div class="sticky top-0 z-10">
          <div class="h-[140px] bg-[#6cd2e7] relative">
            <div
              @click="closeModalProfile"
              class="absolute z-30 right-7 top-5 text-white bg-black/5 cursor-pointer rounded-full p-3 hover:bg-black/10 transition-colors"
            >
              <IconClose />
            </div>
          </div>
          <div class="px-5 py-2 bg-inherit">
            <div class="flex items-center gap-4">
              <UserAvatar size="large" @click="showUserAvatrOption = true" class="-mt-5 z-30" />
              <ChooseAvatar @closeModal="closeModalAvatar" v-if="showUserAvatrOption" />
            </div>
            <h4
              :class="{ 'text-white': isDark }"
              class="text-lg my-4 leading-3 text-start mt-10 text-gray-700"
            >
              Profile informations
            </h4>
          </div>
        </div>
        <!-- Partie scrollable du modal (contenu) -->
        <div class="flex-1 overflow-y-auto">
          <div class="flex justify-between px-5 h-full">
            <!-- Menu latéral -->
            <div
              class="w-1/4 border-r relative"
              :class="{
                'border-gray-500/30': isDark,
                'hover:[#6cd2e7]': !isDark
              }"
            >
              <ul class="sticky top-0">
                <li
                  @click="showFormContent('form')"
                  class="p-2 cursor-pointer text-gray-700 hover:text-white hover:bg-[#6cd2e7] text-xs sm:text-sm lg:text-base transition-colors"
                  :class="{
                    'bg-[#6cd2e7] text-white': currentProfilContent === 'form',
                    'text-white': isDark,
                    'hover:[#6cd2e7]': !isDark
                  }"
                >
                  General Informations
                </li>
                <li
                  @click="showFormContent('privacy')"
                  class="p-2 cursor-pointer text-gray-700 hover:text-white hover:bg-[#6cd2e7] text-xs sm:text-sm lg:text-base transition-colors"
                  :class="{
                    'bg-[#6cd2e7] text-white': currentProfilContent === 'privacy',
                    'text-white': isDark,
                    'hover:[#6cd2e7]': !isDark
                  }"
                >
                  Privacy and password
                </li>
              </ul>
            </div>
            <!-- Contenu principal -->
            <div class="w-3/4 pl-4 py-2 pr-2">
              <div v-if="currentProfilContent === 'form'" class="w-full">
                <SetProfile />
              </div>
              <div v-else class="w-full flex flex-col gap-6">
                <ResetPassword />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
