// store.ts
import { defineStore } from 'pinia'
import user_profil from '../assets/user_profil.jpg'
interface UserState {
  userID: string | null
  first_name: string | null
  last_name: string | null
  token: string | null
  email: string | null
  avatar: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userID: null,
    first_name: null,
    last_name: null,
    token: null,
    email: null,
    avatar: user_profil
  }),
  actions: {
    setUserData(
      { userID, first_name, last_name, token, email, avatar }: 
      { 
        userID: string, 
        first_name: string, 
        last_name: string, 
        token: string, 
        email:string, 
        avatar: string 
      }
    ): void {
      this.userID = userID
      this.first_name = first_name
      this.last_name = last_name
      this.token = token
      this.email = email
      this.avatar = avatar
      localStorage.setItem('user', JSON.stringify(
        { userID, first_name, last_name, token, email, avatar }
      ))
    },
    clearUserData(): void {
      this.userID = null
      this.first_name = null
      this.last_name = null
      this.token = null
      this.email = null
      this.avatar = null
      localStorage.removeItem('user')
    },
    restoreUserData(): void {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const { userID, first_name, last_name, token, email, avatar } = JSON.parse(storedUser)
        this.userID = userID
        this.first_name = first_name
        this.last_name = last_name
        this.token = token
        this.email = email
        this.avatar = avatar
      }
    },
  },
  getters: {
    getUserInfo(): { 
      userID: string | null; 
      last_name: string | null;
      first_name: string | null;
      token: string | null, 
      email: string | null,
      avatar: string | null
    } {
      return {
        userID: this.userID,
        last_name: this.last_name,
        first_name: this.first_name,
        token: this.token,
        email: this.email,
        avatar: this.avatar
      }
    },
  },
})