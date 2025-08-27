<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { UserDeviceData } from '../../types/type'

defineProps({
  devices: {
    type: Array as () => UserDeviceData[],
    required: true
  },
  isDark: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['setDevicePosition'])

const setDevicePosition = (deviceID: number) => {
  emit('setDevicePosition', deviceID)
}
</script>

<template>
  <tbody class="relative">
    <tr
      :class="{
        'dark text-white hover:bg-gray-800': isDark,
        'border border-gray-200 bg-gray-100': index % 2 !== 0 && !isDark,
        'bg-[#1a1919] border-gray-200': index % 2 === 0 && isDark,
        'hover:bg-gray-300': !isDark
      }"
      v-for="(device, index) in devices" 
      :key="index"
      @click="setDevicePosition(device.device_id)"
      class="cursor-pointer"
    >
      <td
        :class="{'bg-[#55545422]': isDark}"
        class="px-6 py-4 whitespace-nowrap"
      >
        {{ device.device_name }}
      </td>
      <td 
        :class="{'bg-[#55545422]': isDark}"
        class="px-6 py-4 whitespace-nowrap"
      >
        {{ device.division_name }}
      </td>
      <td
        :class="{'bg-[#55545422]': isDark}"
        class="px-6 py-4 whitespace-nowrap"
      >
        {{ device.last_latitude !== null ? device.last_latitude : 'No data '  }}
      </td>
      <td
        :class="{'bg-[#55545422]': isDark}"
        class="px-6 py-4 whitespace-nowrap"
      >
        {{ device.last_longitude !== null ? device.last_longitude : 'No data ' }}
      </td>
    </tr>
  </tbody>
</template>