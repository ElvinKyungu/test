<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import IconTop from '../icons/IconTop.vue'
import IconDown from '../icons/IconDown.vue'
import type { UserDeviceData } from '../../types/type'

defineProps({
  sortColumn: {
    type: String as () => keyof UserDeviceData,
    required: true
  },
  sortDesc: {
    type: Boolean,
    required: true
  },
  isDark: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['sortBy', 'toggleSort'])

const sortBy = (column: keyof UserDeviceData) => {
  emit('sortBy', column)
}

const toggleSort = (column: keyof UserDeviceData, defaultDesc: boolean = false) => {
  emit('toggleSort', column, defaultDesc)
}
</script>

<template>
  <thead
    :class="{'dark text-white': isDark}"
    class="text-xs text-gray-700"
  >
    <tr>
      <th class="">
        <div class="px-6 py-3 flex items-center justify-between gap-2">
          <span @click="sortBy('device_name')" class="text-lg font-light">Device name</span>
          <div class="flex flex-col">
            <IconTop
              class="cursor-pointer"
              @click="toggleSort('device_name', true)"
              :class="{ 
                'text-black': sortColumn === 'device_name' && !sortDesc, 
                'text-gray-400': sortColumn !== 'device_name' || sortDesc 
              }"
            />
            <IconDown
              class="cursor-pointer"
              @click="toggleSort('device_name', false)" 
              :class="{ 
                'text-black': sortColumn === 'device_name' && sortDesc, 
                'text-gray-400': sortColumn !== 'device_name' || !sortDesc 
              }"
            />
          </div>
        </div>
      </th>
      <th class="">
        <div class="px-6 py-3 flex items-center justify-between gap-2">
          <span class="text-lg font-light">Division name</span>
          <div class="flex flex-col">
            <IconTop
              class="cursor-pointer"
              @click="toggleSort('division_name', true)"
              :class="{ 
                'text-black': sortColumn === 'division_name' && !sortDesc, 
                'text-gray-400': sortColumn !== 'division_name' || sortDesc 
              }"
            />
            <IconDown
              class="cursor-pointer"
              @click="toggleSort('division_name', false)" 
              :class="{ 
                'text-black': sortColumn === 'division_name' && sortDesc, 
                'text-gray-400': sortColumn !== 'division_name' || !sortDesc 
              }"
            />
          </div>
        </div>
      </th>
      <th class="">
        <div class="px-6 py-3 flex items-center justify-between gap-2">
          <span class="text-lg font-light">Last latitude</span>
          <div class="flex flex-col">
            <IconTop
              class="cursor-pointer"
              @click="toggleSort('last_latitude', true)"
              :class="{ 
                'text-black': sortColumn === 'last_latitude' && !sortDesc, 
                'text-gray-400': sortColumn !== 'last_latitude' || sortDesc 
              }"
            />
            <IconDown
              class="cursor-pointer"
              @click="toggleSort('last_latitude', false)" 
              :class="{ 
                'text-black': sortColumn === 'last_latitude' && sortDesc, 
                'text-gray-400': sortColumn !== 'last_latitude' || !sortDesc 
              }"
            />
          </div>
        </div>
      </th>
      <th class="">
        <div class="px-6 py-3 flex items-center justify-between gap-2">
          <span class="text-lg font-light">Last longitude</span>
          <div class="flex flex-col">
            <IconTop
              class="cursor-pointer"
              @click="toggleSort('last_longitude', true)"
              :class="{ 
                'text-black': sortColumn === 'last_longitude' && !sortDesc, 
                'text-gray-400': sortColumn !== 'last_longitude' || sortDesc 
              }"
            />
            <IconDown
              class="cursor-pointer"
              @click="toggleSort('last_longitude', false)" 
              :class="{ 
                'text-black': sortColumn === 'last_longitude' && sortDesc, 
                'text-gray-400': sortColumn !== 'last_longitude' || !sortDesc 
              }"
            />
          </div>
        </div>
      </th>
    </tr>
  </thead>
</template>