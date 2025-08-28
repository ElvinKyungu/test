<script setup lang="ts">
  import { onMounted, ref, computed, ComputedRef } from 'vue'
  import { useDark } from '@vueuse/core'
  // import Spinner from './Spinner.vue'
  import Pagination from './table/Pagination.vue'
  import IconClose from './icons/IconClose.vue'
  import SearchBar from './table/SearchBars.vue'
  import IconDown from './icons/IconDown.vue'
  import IconTop from './icons/IconTop.vue'
  import EntriesPerPage from './table/EntriesPerPage.vue'
  import { 
    deleteMarkers,
    createAndDisplayDevicesPositions,
    zoomAndCenterMap
  } from '../lib/map'
  import { useMapStore } from '../stores/mapStore'
  import { useUserDataStore } from '../stores/userStore'
  import type { UserDeviceData } from '../types/index'
  import { useUserStore } from '../stores/store'

  const userStore = useUserStore()
  const userDataStore = useUserDataStore()
  const userDeviceDatas = ref<UserDeviceData[] | null>()
  const useMap = useMapStore()
  let map: google.maps.Map | null = null
  const isDark = useDark()
  const searchTerm = ref<string>('')
  const filteredDevices = ref<UserDeviceData[]>([])
  const currentPage = ref<number>(1)
  const devicesPerPage = ref<number>(10)
  const emit = defineEmits()
  let sortColumn: keyof UserDeviceData = 'device_name'
  let sortDesc = false
  const isShowFilter = ref(false)

  const closeTable = ()=> {
    emit('closeTableDevices')
  }

  const sortDevices = () => {
    if (!userDeviceDatas.value) return;

    const sortedDevices = [...userDeviceDatas.value].sort((a, b) => {
      const valueA = a[sortColumn]
      const valueB = b[sortColumn]

      if (valueA === null || valueB === null) {
        return valueA === valueB ? 0 : valueA === null ? 1 : -1
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB)
      }

      return Number(valueA) - Number(valueB)
    })

    if (sortDesc) sortedDevices.reverse()

    filteredDevices.value = sortedDevices.slice(0, devicesPerPage.value)
  }

  const toggleSort = (column: keyof UserDeviceData, defaultDesc: boolean = false) => {
    if (sortColumn === column) {
      sortDesc = !sortDesc
    } else {
      sortColumn = column
      sortDesc = defaultDesc
    }
    sortDevices()
  }

  const sortBy = (column: keyof UserDeviceData) => {
    if (sortColumn !== column) {
      toggleSort(column)
    } else {
      sortDesc = !sortDesc
      sortDevices()
    }
  }

  const changeDevicesPerPage = (n: number): void => {
    devicesPerPage.value = n
    filteredDevices.value = userDeviceDatas.value ? userDeviceDatas.value.slice(0, devicesPerPage.value) : []
    isShowFilter.value = false
  }
  const devicesPerPageComputed: ComputedRef<number> = computed(() => devicesPerPage.value)

  const filterDevices = () => {
  if (!searchTerm.value) {
    console.log("Search term is empty, returning initial set of devices.")
    filteredDevices.value = userDeviceDatas.value || []
    return
  }

  const searchTermLC = searchTerm.value.toLowerCase()
  console.log("Filtering devices with search term:", searchTermLC)

  filteredDevices.value = (userDeviceDatas.value || []).filter(device => {
    console.log("Evaluating device:", device)

    const matches = 
      device.device_id.toString().includes(searchTermLC) ||
      device.device_name.toLowerCase().includes(searchTermLC) ||
      device.division_name.toLowerCase().includes(searchTermLC) ||
      (device.last_latitude !== null && device.last_latitude.toString().includes(searchTermLC)) ||
      (device.last_longitude !== null && device.last_longitude.toString().includes(searchTermLC))

    console.log("Matches:", matches)
    return matches
  })

  console.log("Filtered devices:", filteredDevices.value)
}

  const changePage = (page: number) => {
    currentPage.value = page
    const startIndex = (page - 1) * devicesPerPage.value
    filteredDevices.value = userDeviceDatas.value ? userDeviceDatas.value.slice(startIndex, startIndex + devicesPerPage.value) : []
  }

  const setDevicePosition = async (deviceID: number) => {
    const deviceDataResult: UserDeviceData[] = userDeviceDatas.value?.filter(device => device.device_id === deviceID) || []
    if (map !== null && deviceDataResult.length > 0) {
      deleteMarkers()
      // Sort table by 'last_created' property in descending order
      deviceDataResult.sort((a, b) => new Date(b.last_report_date).getTime() - new Date(a.last_report_date).getTime())
      // Take last position
      const latestPosition = deviceDataResult[0]
      // Display last position
      createAndDisplayDevicesPositions([latestPosition], map)

      const myLatLng = {
        device_latitude: latestPosition.last_latitude,
        device_longitude: latestPosition.last_longitude
      }
      zoomAndCenterMap(map, myLatLng, 16)
    }
  }

  onMounted(async () => {
    if(userStore.getUserInfo.userID){
      userDeviceDatas.value = await userDataStore.fetchUserDevices(userStore.getUserInfo.userID)
    }
    map = useMap?.getMap
  })
</script>
<template>
  <div class="mt-10 px-5 text-2xl text-center overflow-y-auto max-h-screen ">
    <div class="flex justify-end px-4 items-center">
      <div
        @click="closeTable"
        :class="{'dark text-white': isDark}"
        class="p-3 bg-black/5 cursor-pointer rounded-full"
      >
        <IconClose/>
      </div>
    </div>
    <div 
      v-if="userDeviceDatas"
      class="container"
    >
      <div 
        class="relative sm:rounded-lg"
        :class="{'dark': isDark}"
      >
        <div class="flex relative flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <EntriesPerPage 
            :devicesPerPage="devicesPerPage" 
            :isDark="isDark" 
            @update:devicesPerPage="changeDevicesPerPage"
          />
          <SearchBar 
            :searchTerm="searchTerm" 
            :isDark="isDark" 
            @update:searchTerm="filterDevices"
          />
        </div>
      </div>
      <table
        v-if="userDeviceDatas.length > 0"
        :class="{'dark': isDark}"
        class="w-full text-sm text-left rtl:text-right text-gray-500  rounded-lg  mt-10"
      >
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
        <tbody class="relative">
          <tr
            :class="{
              'dark text-white hover:bg-gray-800': isDark,
              'border border-gray-200 bg-gray-100': index % 2 !== 0 && !isDark,
              'bg-[#1a1919] border-gray-200': index % 2 === 0 && isDark,
              'hover:bg-gray-300': !isDark
            }"
            v-for="(device, index) in userDeviceDatas" 
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
      </table>
      <div v-else class="absolute flex justify-center items-center w-full">
        <span :class="{'text-white': isDark}">No data found</span>
      </div>
      <div>
        <Pagination 
          :currentPage="currentPage" 
          :totalItems="userDeviceDatas?.length || 0" 
          :itemsPerPage="devicesPerPageComputed"
          :isDark="isDark"
          @changePage="changePage"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>

</style>