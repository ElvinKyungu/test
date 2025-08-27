<script setup lang="ts">
import { ref } from 'vue'
import iconDown from '../icons/IconDown.vue'

defineProps({
  devicesPerPage: Number,
  isDark: Boolean
})

const emit = defineEmits(['update:devicesPerPage'])

const isShowFilter = ref(false)

const toggleFilter = () => {
  isShowFilter.value = !isShowFilter.value
}

const changePerPage = (n: number) => {
  emit('update:devicesPerPage', n)
  isShowFilter.value = false
}
</script>
<template>
  <div class="flex items-center space-x-3 w-full md:w-auto">
    <div class="flex justify-center items-center gap-2">
      <button
        @click="toggleFilter"
        :class="{
          'focus:ring-gray-700 dark text-gray-400 dark:border-gray-600': isDark,
          'text-gray-900 focus:outline-none bg-white': !isDark
        }"
        class="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm 
        font-medium rounded-lg border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-200"
        type="button"
      >
        <span>{{ devicesPerPage }}</span>
        <iconDown />
      </button>
      <span class="text-lg" :class="{'text-white': isDark}">entries per page</span>
    </div>
    <div 
      class="z-50 w-48 p-3 rounded-lg shadow"
      :class="{'hidden': !isShowFilter}"
    >
      <div 
        class="z-50 w-48 p-3 rounded-lg shadow-xl fixed top-40 left-24 border"
        :class="{'bg-[#292929] text-white border-gray-700': isDark, 'bg-[#f3f2f2] text-gray-500': !isDark}"
      >
        <h6 
          class="mb-3 text-sm font-medium"
        >
          Choose number per page
        </h6>
        <ul class="space-y-2 text-sm">
            <li @click="changePerPage(5)" class="flex items-center cursor-pointer">
              <span 
                class="ml-2 text-sm font-medium"
              >
                5
              </span>
            </li>
            <li @click="changePerPage(10)" class="flex items-center cursor-pointer">
              <span 
                class="ml-2 text-sm font-medium"
              >
                10
              </span>
            </li>
            <li @click="changePerPage(15)" class="flex items-center cursor-pointer">
              <span 
                class="ml-2 text-sm font-medium"
              >
                15
              </span>
            </li>
        </ul>
      </div>
    </div>
  </div>
</template>
