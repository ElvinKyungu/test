<script lang="ts" setup>
  import { useUserStore } from './../../stores/store'
  import { defineEmits, ref, onMounted, onBeforeUnmount } from 'vue'
  import router from '../../routes/router'
  import { useDark } from '@vueuse/core'
  import IconClose from '../icons/IconClose.vue'
  import gsap from 'gsap'

  const userStore = useUserStore()
  const isDark = useDark()
  const modalRef = ref<HTMLElement | null>(null)
  const modalContentRef = ref<HTMLElement | null>(null)
  const isClosing = ref<boolean>(false)

  const emit = defineEmits<{
    (e: 'closeModal'): void
  }>()

  const logout = (): void => {
    animateClose().then(() => {
      userStore.clearUserData()
      router.push('/auth')
    })
  }

  const closeModal = (): void => {
    animateClose().then(() => {
      emit('closeModal')
    })
  }

  const handleOutsideClick = (event: MouseEvent): void => {
    if (modalRef.value && modalContentRef.value) {
      // Si le clic est en dehors du contenu du modal mais dans le backdrop
      if (
        !modalContentRef.value.contains(event.target as Node) &&
        modalRef.value.contains(event.target as Node)
      ) {
        closeModal()
      }
    }
  }

  const animateOpen = (): Promise<void> => {
    return new Promise((resolve) => {
      gsap.fromTo(modalRef.value, { opacity: 0 }, { opacity: 1, duration: 0.3 })

      gsap.fromTo(
        modalContentRef.value,
        { opacity: 0, y: -50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.7)',
          onComplete: resolve
        }
      )
    })
  }

  const animateClose = (): Promise<void> => {
    if (isClosing.value) return Promise.resolve()

    isClosing.value = true

    return new Promise((resolve) => {
      gsap.to(modalRef.value, {
        opacity: 0,
        duration: 0.2
      })

      gsap.to(modalContentRef.value, {
        opacity: 0,
        y: -30,
        scale: 0.9,
        duration: 0.3,
        onComplete: () => {
          isClosing.value = false
          resolve()
        }
      })
    })
  }

  onMounted(() => {
    animateOpen()
    document.addEventListener('keydown', handleEscKey)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleEscKey)
  })

  const handleEscKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }
</script>

<template>
  <div
    ref="modalRef"
    @click="handleOutsideClick"
    class="flex items-center justify-center h-screen w-full fixed inset-0 bg-black/50 z-50 font-ones"
  >
    <div
      ref="modalContentRef"
      :class="{ dark: isDark, 'bg-white': !isDark, 'bg-dark': isDark }"
      class="relative w-full md:min-h-[25%] flex overflow-auto flex-col items-start max-w-[80%] lg:max-w-[30%] rounded-xl shadow-2xl justify-between p-5"
    >
      <div class="flex relative justify-between w-full pr-10">
        <div>
          <h1 :class="{ 'text-white': isDark }" class="text-3xl text-left font-medium text-gray-800">
            Log out
          </h1>
          <span :class="{ 'text-white': isDark, 'text-gray-700': !isDark }" class="block mt-4">
            Are you sure you want to disconnect?
          </span>
        </div>
        <div class="h-[140px] bg-secondary relative">
          <div
            @click="closeModal"
            class="fixed z-30 text-gray-700 bg-black/5 cursor-pointer rounded-full p-2 hover:bg-black/10 transition-colors"
            :class="{ 'text-white': isDark }"
          >
            <IconClose />
          </div>
        </div>
      </div>
      <div class="flex justify-end w-full gap-4">
        <button
          :class="{ 'bg-gray-900/5 text-white border border-gray-500/15 hover:bg-gray-500/10': isDark }"
          class="py-2 px-6 text-gray-800 border rounded transition-colors hover:bg-gray-100"
          @click="closeModal"
        >
          Cancel
        </button>
        <button
          @click="logout"
          class="py-2 px-6 text-beige bg-red-500 rounded transition-colors hover:bg-red-500/80"
        >
          Log out
        </button>
      </div>
    </div>
  </div>
</template>
