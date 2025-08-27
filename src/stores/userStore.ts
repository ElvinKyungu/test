// stores/userStore.ts
import { defineStore } from 'pinia';
import { getAllUserDatas } from '../services/userService'
import type { UserDeviceData } from '../types/type'
interface UserState {
  devices: UserDeviceData[]
  error: string | null
}

export const useUserDataStore = defineStore('userStore', {
  state: (): UserState => ({
    devices: [],
    error: null,
  }),
  actions: {
    async fetchUserDevices(userID: string) {
      try {
        const data = await getAllUserDatas(userID)
        this.devices = data
        return this.devices
      } catch (error: any) {
        this.error = error.message;
      }
    }
  },
})
