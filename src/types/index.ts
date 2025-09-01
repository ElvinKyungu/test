// src/types/index.ts
import type { Role } from './permissions'

export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: Role
  client_id?: string // Pour client_admin
  end_customer_id?: string // Pour end_customer_admin
  project_id?: string // Pour project_user
  avatar?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface SupabaseError {
  message: string
}

export interface SuccessResponse<T> {
  data: T
}
