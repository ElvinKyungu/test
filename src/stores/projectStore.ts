import { defineStore } from 'pinia'
import type { Project } from '../types'
import { getProjects } from '../api/projectService'

export const useProjectStore = defineStore('projects', {
  state: () => ({ items: [] as Project[], loading: false }),
  actions: {
    async fetch(filterByEndCustomerIds?: string[], filterIds?: string[]) {
      this.loading = true
      this.items = await getProjects(filterByEndCustomerIds, filterIds)
      this.loading = false
    }
  }
})
