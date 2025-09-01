// src/stores/assetViewStore.ts
import { defineStore } from 'pinia'
import type { AssetViewData } from '../types/assetView'
import { AssetViewService } from '../services/assetViewService'

export const useAssetViewStore = defineStore('assetView', {
  state: () => ({
    items: [] as AssetViewData[],
    filteredItems: [] as AssetViewData[],
    loading: false,
    error: null as string | null,
    searchTerm: ''
  }),

  getters: {
    totalItems: (state) => state.filteredItems.length,

    // Statistiques simples
    lowBatteryDevices: (state) => {
      return state.items.filter((item) => item.battery_level < 20)
    },

    assetTypes: (state) => {
      const types = new Map<string, number>()
      state.items.forEach((item) => {
        const count = types.get(item.asset_type) || 0
        types.set(item.asset_type, count + 1)
      })
      return Array.from(types.entries()).map(([type, count]) => ({ type, count }))
    }
  },

  actions: {
    /**
     * Récupère toutes les données
     */
    async fetchData() {
      try {
        this.loading = true
        this.error = null

        const data = await AssetViewService.getAssetViewData()

        this.items = data
        this.filteredItems = data

        // Application du filtre de recherche s'il existe
        if (this.searchTerm) {
          this.applySearch(this.searchTerm)
        }

        return data
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
        this.error = error instanceof Error ? error.message : 'Erreur lors du chargement'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Applique une recherche
     */
    async applySearch(searchTerm: string) {
      try {
        this.searchTerm = searchTerm

        if (!searchTerm.trim()) {
          this.filteredItems = [...this.items]
          return
        }

        this.loading = true

        const searchResults = await AssetViewService.searchAssetViewData(searchTerm)
        this.filteredItems = searchResults
      } catch (error) {
        console.error('Erreur lors de la recherche:', error)
        this.error = error instanceof Error ? error.message : 'Erreur lors de la recherche'
      } finally {
        this.loading = false
      }
    },

    /**
     * Efface la recherche
     */
    clearSearch() {
      this.searchTerm = ''
      this.filteredItems = [...this.items]
    },

    /**
     * Recharge les données
     */
    async refresh() {
      return this.fetchData()
    },

    /**
     * Efface toutes les données
     */
    clearData() {
      this.items = []
      this.filteredItems = []
      this.searchTerm = ''
      this.error = null
    }
  }
})
