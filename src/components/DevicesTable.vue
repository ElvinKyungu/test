<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { useDark } from '@vueuse/core'
  import { useAssetViewStore } from '../stores/assetViewStore'
  import type { AssetViewData } from '../types/assetView'
  import Spinner from './Spinner.vue'
  import IconSearch from './icons/IconSearch.vue'
  import IconClose from './icons/IconClose.vue'

  // Props et emits
  const emit = defineEmits(['closeTable'])

  // Store
  const assetStore = useAssetViewStore()

  // État local
  const isDark = useDark()
  const searchTerm = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(20)
  const sortColumn = ref<keyof AssetViewData>('asset_name')
  const sortDirection = ref<'asc' | 'desc'>('asc')

  // Computed
  const isLoading = computed(() => assetStore.loading)
  const error = computed(() => assetStore.error)
  const allItems = computed(() => assetStore.filteredItems)

  // Pagination
  const totalPages = computed(() => Math.ceil(allItems.value.length / itemsPerPage.value))
  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
  const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, allItems.value.length))

  // Données triées et paginées
  const paginatedItems = computed(() => {
    let sorted = [...allItems.value]

    // Tri
    sorted.sort((a, b) => {
      const aValue = a[sortColumn.value]
      const bValue = b[sortColumn.value]

      if (aValue === undefined || aValue === null) return 1
      if (bValue === undefined || bValue === null) return -1

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection.value === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    return sorted.slice(startIndex.value, endIndex.value)
  })

  // Méthodes
  const closeTable = () => {
    emit('closeTable')
  }

  const handleSort = (column: keyof AssetViewData) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortColumn.value = column
      sortDirection.value = 'asc'
    }
  }

  const handleSearch = async () => {
    currentPage.value = 1
    await assetStore.applySearch(searchTerm.value)
  }

  const clearSearch = async () => {
    searchTerm.value = ''
    await assetStore.clearSearch()
  }

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const refresh = async () => {
    await assetStore.refresh()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getBatteryColor = (level: number) => {
    if (level <= 20) return 'text-red-500'
    if (level <= 50) return 'text-orange-500'
    return 'text-green-500'
  }

  const getTemperatureColor = (temp: number) => {
    if (temp < 0) return 'text-blue-500'
    if (temp > 30) return 'text-red-500'
    return 'text-green-500'
  }

  // Lifecycle
  onMounted(async () => {
    try {
      await assetStore.fetchData()
    } catch (error) {
      console.error('Erreur lors du chargement initial:', error)
    }
  })
</script>

<template>
  <div class="h-screen flex flex-col" :class="{ 'bg-gray-900 text-white': isDark, 'bg-white': !isDark }">
    <!-- En-tête -->
    <div
      class="flex justify-between items-center p-4 border-b"
      :class="{ 'border-gray-700': isDark, 'border-gray-200': !isDark }"
    >
      <div>
        <h2 class="text-2xl font-semibold" :class="{ 'text-white': isDark, 'text-gray-900': !isDark }">
          Assets Data
        </h2>
        <p class="text-sm text-gray-500">
          {{ allItems.length }} élément{{ allItems.length > 1 ? 's' : '' }}
          {{ searchTerm ? `(recherche: "${searchTerm}")` : '' }}
        </p>
      </div>

      <div class="flex items-center gap-4">
        <!-- Bouton refresh -->
        <button
          @click="refresh"
          :disabled="isLoading"
          class="px-4 py-2 rounded-lg border transition-colors"
          :class="{
            'border-gray-600 text-white hover:bg-gray-700': isDark,
            'border-gray-300 text-gray-700 hover:bg-gray-50': !isDark,
            'opacity-50 cursor-not-allowed': isLoading
          }"
        >
          {{ isLoading ? 'Actualisation...' : 'Actualiser' }}
        </button>

        <!-- Bouton fermer -->
        <button
          @click="closeTable"
          class="p-2 rounded-full transition-colors"
          :class="{
            'bg-gray-700 text-white hover:bg-gray-600': isDark,
            'bg-gray-200 text-gray-700 hover:bg-gray-300': !isDark
          }"
        >
          <IconClose />
        </button>
      </div>
    </div>

    <!-- Barre de recherche -->
    <div class="p-4 border-b" :class="{ 'border-gray-700': isDark, 'border-gray-200': !isDark }">
      <div class="relative max-w-md">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3">
          <IconSearch :class="{ 'text-gray-400': isDark, 'text-gray-500': !isDark }" />
        </div>
        <input
          v-model="searchTerm"
          @input="handleSearch"
          type="text"
          placeholder="Rechercher..."
          class="w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{
            'bg-gray-800 border-gray-600 text-white placeholder-gray-400': isDark,
            'bg-white border-gray-300 text-gray-900 placeholder-gray-500': !isDark
          }"
        />
        <button
          v-if="searchTerm"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <IconClose class="w-4 h-4" :class="{ 'text-gray-400': isDark, 'text-gray-500': !isDark }" />
        </button>
      </div>
    </div>

    <!-- Contenu -->
    <div class="flex-1 overflow-hidden">
      <!-- Chargement -->
      <div v-if="isLoading" class="flex justify-center items-center h-full">
        <div class="flex items-center gap-3">
          <Spinner />
          <span>Chargement des données...</span>
        </div>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="flex justify-center items-center h-full">
        <div class="text-center">
          <div class="text-red-500 mb-4">
            <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
            <p class="text-lg font-medium">Erreur de chargement</p>
            <p class="text-sm text-gray-500">{{ error }}</p>
          </div>
          <button
            @click="refresh"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>

      <!-- Aucune donnée -->
      <div v-else-if="allItems.length === 0" class="flex justify-center items-center h-full">
        <div class="text-center" :class="{ 'text-gray-400': isDark, 'text-gray-500': !isDark }">
          <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            ></path>
          </svg>
          <p class="text-lg">Aucune donnée disponible</p>
        </div>
      </div>

      <!-- Tableau -->
      <div v-else class="h-full flex flex-col">
        <div class="flex-1 overflow-auto">
          <table class="w-full">
            <thead class="sticky top-0" :class="{ 'bg-gray-800': isDark, 'bg-gray-100': !isDark }">
              <tr>
                <!-- Asset Name -->
                <th
                  @click="handleSort('asset_name')"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                >
                  <div class="flex items-center gap-2">
                    <span>Asset Name</span>
                    <div class="flex flex-col">
                      <svg
                        class="w-3 h-3"
                        :class="{ 'text-blue-500': sortColumn === 'asset_name' && sortDirection === 'asc' }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <svg
                        class="w-3 h-3"
                        :class="{ 'text-blue-500': sortColumn === 'asset_name' && sortDirection === 'desc' }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </th>

                <!-- Asset Type -->
                <th
                  @click="handleSort('asset_type')"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                >
                  <div class="flex items-center gap-2">
                    <span>Type</span>
                    <div class="flex flex-col">
                      <svg
                        class="w-3 h-3"
                        :class="{ 'text-blue-500': sortColumn === 'asset_type' && sortDirection === 'asc' }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <svg
                        class="w-3 h-3"
                        :class="{ 'text-blue-500': sortColumn === 'asset_type' && sortDirection === 'desc' }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </th>

                <!-- Current Project -->
                <th
                  @click="handleSort('current_project')"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                >
                  <div class="flex items-center gap-2">
                    <span>Projet</span>
                    <div class="flex flex-col">
                      <svg
                        class="w-3 h-3"
                        :class="{
                          'text-blue-500': sortColumn === 'current_project' && sortDirection === 'asc'
                        }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <svg
                        class="w-3 h-3"
                        :class="{
                          'text-blue-500': sortColumn === 'current_project' && sortDirection === 'desc'
                        }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </th>

                <!-- Battery Level -->
                <th
                  @click="handleSort('battery_level')"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                >
                  <div class="flex items-center gap-2">
                    <span>Batterie</span>
                    <div class="flex flex-col">
                      <svg
                        class="w-3 h-3"
                        :class="{
                          'text-blue-500': sortColumn === 'battery_level' && sortDirection === 'asc'
                        }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <svg
                        class="w-3 h-3"
                        :class="{
                          'text-blue-500': sortColumn === 'battery_level' && sortDirection === 'desc'
                        }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </th>

                <!-- Temperature -->
                <th
                  @click="handleSort('temperature')"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                >
                  <div class="flex items-center gap-2">
                    <span>Température</span>
                    <div class="flex flex-col">
                      <svg
                        class="w-3 h-3"
                        :class="{ 'text-blue-500': sortColumn === 'temperature' && sortDirection === 'asc' }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <svg
                        class="w-3 h-3"
                        :class="{ 'text-blue-500': sortColumn === 'temperature' && sortDirection === 'desc' }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </th>

                <!-- Last Update -->
                <th
                  @click="handleSort('last_location_update')"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                >
                  <div class="flex items-center gap-2">
                    <span>Dernière MAJ</span>
                    <div class="flex flex-col">
                      <svg
                        class="w-3 h-3"
                        :class="{
                          'text-blue-500': sortColumn === 'last_location_update' && sortDirection === 'asc'
                        }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <svg
                        class="w-3 h-3"
                        :class="{
                          'text-blue-500': sortColumn === 'last_location_update' && sortDirection === 'desc'
                        }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </th>

                <th
                  @click="handleSort('longitude')"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                >
                  <div class="flex items-center gap-2">
                    <span>Longitude</span>
                    <div class="flex flex-col">
                      <svg
                        class="w-3 h-3"
                        :class="{ 'text-blue-500': sortColumn === 'longitude' && sortDirection === 'asc' }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <svg
                        class="w-3 h-3"
                        :class="{ 'text-blue-500': sortColumn === 'longitude' && sortDirection === 'desc' }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </th>

                <th
                  @click="handleSort('latitude')"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                >
                  <div class="flex items-center gap-2">
                    <span>Latitude</span>
                    <div class="flex flex-col">
                      <svg
                        class="w-3 h-3"
                        :class="{ 'text-blue-500': sortColumn === 'latitude' && sortDirection === 'asc' }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <svg
                        class="w-3 h-3"
                        :class="{ 'text-blue-500': sortColumn === 'latitude' && sortDirection === 'desc' }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody class="divide-y" :class="{ 'divide-gray-700': isDark, 'divide-gray-200': !isDark }">
              <tr
                v-for="item in paginatedItems"
                :key="item.asset_id"
                class="transition-colors"
                :class="{
                  'hover:bg-gray-700': isDark,
                  'hover:bg-gray-50': !isDark
                }"
              >
                <!-- Asset Name -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium">{{ item.asset_name }}</div>
                  <div class="text-xs text-gray-500">{{ item.asset_id }}</div>
                </td>

                <!-- Asset Type -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="{
                      'bg-blue-900 text-blue-200': isDark,
                      'bg-blue-100 text-blue-800': !isDark
                    }"
                  >
                    {{ item.asset_type }}
                  </span>
                </td>

                <!-- Current Project -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>{{ item.current_project || 'N/A' }}</div>
                </td>

                <!-- Battery Level -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-2 w-16 bg-gray-200 rounded-full mr-2">
                      <div
                        class="h-2 rounded-full transition-all duration-300"
                        :class="getBatteryColor(item.battery_level)"
                        :style="{ width: `${item.battery_level}%`, backgroundColor: 'currentColor' }"
                      ></div>
                    </div>
                    <span class="text-sm" :class="getBatteryColor(item.battery_level)">
                      {{ item.battery_level.toFixed(1) }}%
                    </span>
                  </div>
                </td>

                <!-- Temperature -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm" :class="getTemperatureColor(item.temperature)">
                    {{ item.temperature.toFixed(1) }}°C
                  </span>
                </td>

                <!-- Last Update -->
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm"
                  :class="{ 'text-gray-400': isDark, 'text-gray-500': !isDark }"
                >
                  {{ formatDate(item.last_location_update) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm"
                  :class="{ 'text-gray-400': isDark, 'text-gray-500': !isDark }"
                >
                  {{ item.longitude }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm"
                  :class="{ 'text-gray-400': isDark, 'text-gray-500': !isDark }"
                >
                  {{ item.latitude }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          class="flex items-center justify-between px-6 py-3 border-t"
          :class="{ 'border-gray-700': isDark, 'border-gray-200': !isDark }"
        >
          <div class="text-sm" :class="{ 'text-gray-400': isDark, 'text-gray-500': !isDark }">
            Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur {{ allItems.length }} résultats
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :class="{
                'border-gray-600 text-white hover:bg-gray-700': isDark,
                'border-gray-300 text-gray-700 hover:bg-gray-50': !isDark
              }"
            >
              Précédent
            </button>

            <span class="text-sm" :class="{ 'text-gray-400': isDark, 'text-gray-500': !isDark }">
              Page {{ currentPage }} sur {{ totalPages }}
            </span>

            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :class="{
                'border-gray-600 text-white hover:bg-gray-700': isDark,
                'border-gray-300 text-gray-700 hover:bg-gray-50': !isDark
              }"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }

  .scroll::-webkit-scrollbar {
    width: 6px;
  }

  .scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .scroll::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }

  .scroll::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.8);
  }
</style>
