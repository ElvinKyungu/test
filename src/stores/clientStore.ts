import { defineStore } from 'pinia'
import type { Client } from '../types'
import { getClients } from './../api/clientService'

export const useClientStore = defineStore('clients', {
  state: () => ({ items: [] as Client[], loading: false }),
  actions: {
    async fetch(filterIds?: string[]) {
      this.loading = true
      this.items = await getClients(filterIds)
      this.loading = false
    }
  }
})
