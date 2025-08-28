import { defineStore } from 'pinia'
import type { Asset } from '../types'
import { getAssets } from '../api/assetService'

export const useAssetStore = defineStore('assets', {
  state: () => ({ items: [] as Asset[], loading: false }),
  getters: {
    deviceIds: (s) => s.items.map(a => a.device_id).filter((v): v is number => v !== null),
  },
  actions: {
    async fetch(filterByProjectIds?: string[], filterByClientIds?: string[]) {
      this.loading = true
      this.items = await getAssets(filterByProjectIds, filterByClientIds)
      this.loading = false
    }
  }
})
