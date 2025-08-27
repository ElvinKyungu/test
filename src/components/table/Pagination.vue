<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'
import IconLeft from '../icons/IconLeft.vue'
import IconRight from '../icons/IconRight.vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  isDark: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['changePage'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))
const startItem = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
const endItem = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))

const changePage = (page: number) => {
  emit('changePage', page)
}

const prevPage = () => {
  if (props.currentPage > 1) {
    emit('changePage', props.currentPage - 1)
  }
}

const nextPage = () => {
  if (props.currentPage < totalPages.value) {
    emit('changePage', props.currentPage + 1)
  }
}
</script>
<template>
  <nav class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4">
    <span class="text-sm font-normal" :class="{'text-white': isDark}">
      Showing
      <span class="font-semibold">
        {{ startItem }} -
        {{ endItem }}
      </span>
      of
      <span class="font-semibold">
        {{ totalItems }}
      </span>
    </span>
    <ul class="inline-flex items-stretch -space-x-px">
      <li>
        <button 
          :class="{
            'text-gray-400': isDark,
            'bg-white': !isDark
          }"
          class="flex border border-gray-500 items-center justify-center text-sm py-2 px-3 leading-tight rounded-l-lg"
          @click="prevPage"
          :disabled="currentPage === 1"
        >
          <span class="sr-only">Previous</span>
          <IconLeft />
        </button>
      </li>
      <li 
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
      >
        <button
          :class="{
            'text-gray-400': isDark,
            'bg-gray-700': page === currentPage,
            'bg-white': !isDark,
            'hover:bg-gray-700': page !== currentPage
          }"
          class="flex items-center justify-center border-gray-500 text-sm py-[0.579rem] border px-3 leading-tight"
        > 
          {{ page }}
        </button>
      </li>
      <li>
        <button
          :class="{
            'text-gray-400': isDark,
            'bg-white': !isDark
          }"
          class="flex items-center justify-center text-sm py-2 border border-gray-500 px-3 leading-tight rounded-r-lg cursor-pointer"
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          <span class="sr-only">Next</span>
          <IconRight />
        </button>
      </li>
    </ul>
  </nav>
</template>
