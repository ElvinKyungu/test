import { defineStore } from 'pinia'
import type { EndCustomer } from '../types'
import { getEndCustomers } from '../api/endCustomerService'

export const useEndCustomerStore = defineStore('endCustomers', {
  state: () => ({ items: [] as EndCustomer[], loading: false }),
  actions: {
    async fetch(filterByClientIds?: string[], filterIds?: string[]) {
      this.loading = true
      this.items = await getEndCustomers(filterByClientIds, filterIds)
      this.loading = false
    }
  }
})
