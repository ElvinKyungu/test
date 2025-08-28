import { defineStore } from 'pinia'
import type { User } from '../types'
import type { Role } from '../types/permissions'
import { supabase } from '../api/supabaseClient'

export const useUserStore = defineStore('user', {
  state: () => ({
    authReady: false,
    user: null as User | null,
    token: '' as string,
  }),
  getters: {
    role: (s) => s.user?.role as Role | undefined,
    userId: (s) => s.user?.id,
    isLogged: (s) => !!s.user && !!s.token,
  },
  actions: {
    async loadFromAuth() {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      if (!session) { this.authReady = true; return }

      this.token = session.access_token
      const authId = session.user.id
      // Récupère l'entrée correspondante dans la table "users"
      const { data: u, error } = await supabase.from('users').select('*').eq('id', authId).single()
      if (!error && u) this.user = u as User
      this.authReady = true
    },
    setUser(user: User, token: string) {
      this.user = user
      this.token = token
    },
    clear() {
      this.user = null
      this.token = ''
    }
  }
})
