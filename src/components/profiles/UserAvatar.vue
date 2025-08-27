<script setup lang="ts">
  import { computed } from 'vue'
  import { useUserStore } from '../../stores/store'

  const userStore = useUserStore()

  const imageUrl = computed(() => userStore.getUserInfo.avatar)

  const props = defineProps({
    srcImage: String,
    size: {
      type: String as () => 'small' | 'medium' | 'large',
      default: 'medium'
    },
    altText: {
      type: String,
      default: 'User Avatar'
    }
  })

  const avatarClass = computed(() => {
    switch (props.size) {
      case 'small':
        return 'h-10 w-10' // 50px
      case 'medium':
        return 'h-14 w-14' // 90px
      default:
        return 'h-16 w-16' // Par défaut, taille moyenne
    }
  })
</script>

<template>
  <div>
    <div class="flex items-center">
      <div
        :class="avatarClass"
        class="
          shadow-md rounded-full
          cursor-pointer -mt-5
        "
      >
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="altText"
          class="w-full h-full rounded-full object-center object-cover"
        >
        <img
          v-else
          src="../../assets/user_profil.jpg"
          :alt="altText"
          class="w-full h-full rounded-full object-center object-cover"
        >
      </div>
    </div>
  </div>
</template>