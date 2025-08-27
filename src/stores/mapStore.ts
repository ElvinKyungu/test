// store.ts
import { defineStore } from 'pinia'

export const useMapStore = defineStore('mapStore', {
  state: () => ({
    map: null as google.maps.Map | null,
  }),
  actions: {
    setMap(map: google.maps.Map): void {
      this.map = map
    },
  },
  getters: {
    getMap(): google.maps.Map | null {
      return this.map
    },
    isMapReady(): boolean {
      return this.map !== null
    },
  },
})