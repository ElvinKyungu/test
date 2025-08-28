<script setup lang="ts">
  import { onMounted, ref, computed, ComputedRef } from 'vue'
  import { useDark } from '@vueuse/core'
  import Pagination from './table/Pagination.vue'
  import IconClose from './icons/IconClose.vue'
  import SearchBar from './table/SearchBars.vue'
  import TableHeader from './table/TableHeader.vue'
  import TableBody from './table/TableBody.vue'
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
  const pagedDevices = ref<UserDeviceData[]>([])
  const currentPage = ref<number>(1)
  const devicesPerPage = ref<number>(10)
  const emit = defineEmits(['closeTableDevices'])
  let sortColumn: keyof UserDeviceData = 'device_name'
  let sortDesc = false
  const isShowFilter = ref(false)

  const closeTable = () => {
    emit('closeTableDevices')
  }

  const applyPagination = () => {
    if (!userDeviceDatas.value) return
    
    // Étape 1: Filtrer les données
    let filtered = [...userDeviceDatas.value]
    
    if (searchTerm.value) {
      const searchTermLC = searchTerm.value.toLowerCase()
      filtered = filtered.filter(device => 
        device.device_id.toString().includes(searchTermLC) ||
        device.device_name.toLowerCase().includes(searchTermLC) ||
        device.division_name.toLowerCase().includes(searchTermLC) ||
        (device.last_latitude !== null && device.last_latitude.toString().includes(searchTermLC)) ||
        (device.last_longitude !== null && device.last_longitude.toString().includes(searchTermLC))
      )
    }
    // Étape 2: Trier les données
    filtered.sort((a, b) => {
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

    if (sortDesc) filtered.reverse()
    
    // Étape 3: Mettre à jour les données filtrées complètes
    filteredDevices.value = filtered
    
    // Étape 4: Appliquer la pagination
    const startIndex = (currentPage.value - 1) * devicesPerPage.value
    const paginatedData = filtered.slice(startIndex, startIndex + devicesPerPage.value)
    
    // Mettre à jour pagedDevices
    pagedDevices.value = paginatedData
  }

  const sortDevices = () => {
    applyPagination()
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
    currentPage.value = 1 // Retour à la première page
    applyPagination()
    isShowFilter.value = false
  }
  
  const devicesPerPageComputed: ComputedRef<number> = computed(() => devicesPerPage.value)

  const filterDevices = () => {
    currentPage.value = 1 // Réinitialiser la page à 1 quand on filtre
    applyPagination()
  }

  const changePage = (page: number) => {
    currentPage.value = page
    applyPagination()
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
      // Initialiser filteredDevices avec toutes les données
      filteredDevices.value = [...(userDeviceDatas.value || [])]
      // Appliquer la pagination initiale
      applyPagination()
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
        class="w-full text-sm text-left rtl:text-right text-gray-500 rounded-lg mt-10"
      >
        <TableHeader 
          :sortColumn="sortColumn"
          :sortDesc="sortDesc"
          :isDark="isDark"
          @sortBy="sortBy"
          @toggleSort="toggleSort"
        />
        <TableBody
          :devices="pagedDevices"
          :isDark="isDark"
          @setDevicePosition="setDevicePosition"
        />
      </table>
      <div v-else class="absolute flex justify-center items-center w-full">
        <span :class="{'text-white': isDark}">No data found</span>
      </div>
      <div>
        <Pagination 
          :currentPage="currentPage" 
          :totalItems="filteredDevices?.length || 0" 
          :itemsPerPage="devicesPerPageComputed"
          :isDark="isDark"
          @changePage="changePage"
        />
      </div>
    </div>
  </div>
</template>