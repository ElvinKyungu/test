<script setup lang="ts">
import { ref, watch } from 'vue'
import IconSearch from '../icons/IconSearch.vue'

const props = defineProps({
  searchTerm: String,
  isDark: Boolean
})

const emit = defineEmits(['update:searchTerm'])

const localSearchTerm = ref(props.searchTerm)

const onSearch = () => {
  emit('update:searchTerm', localSearchTerm.value)
}

watch(() => props.searchTerm, (newVal) => {
  localSearchTerm.value = newVal
})
</script>
<template>
  <div class="w-full md:w-1/2 relative">
    <form @submit.prevent="onSearch" class="flex items-center">
      <div class="relative w-full">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <IconSearch :class="isDark? 'text-gray-300':'text-gray-500'"/>
        </div>
        <input 
          type="text" 
          v-model="localSearchTerm"
          @input="onSearch"
          id="simple-search"
          placeholder="Search"
          class="text-sm border focus:outline-none rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
          :class="
            {
              'bg-gray-50 border-gray-300 text-gray-900': !isDark, 
              'dark border-gray-600 placeholder-gray-400 dark:text-white': isDark
            }
          "
        >
      </div>
    </form>
  </div>
</template>
