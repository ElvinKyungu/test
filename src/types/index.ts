import type { Role, AccessMode } from './permissions.ts'

export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: Role
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface Client {
  id: string
  company_name: string
  contact_email?: string
  contact_phone?: string
  adress?: string
  is_active: boolean
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface EndCustomer {
  id: string
  client_id: string
  company_name: string
  contact_email?: string
  contact_phone?: string
  adress?: string
  is_active: boolean
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface Project {
  id: string
  end_customer_id: string
  project_name: string
  description?: string
  start_date?: string
  end_date?: string
  is_active: boolean
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface Asset {
  id: string
  device_id: number | null
  client_id: string
  name: string
  type: string
  description?: string
  serial_number?: string
  sku?: string
  current_project_id: string | null
  is_active: boolean
  notes?: string
  purchase_date?: string
  warranty_expiry?: string
  created_at?: string
  updated_at?: string
}

export interface Device {
  id: number
  company_id?: number | null
  division_id?: number | null
  created_at?: string
  title?: string | null
  body?: string | null
  device_eui?: string | null
  ble_firmware?: string | null
  status?: string | null
  search_vector?: unknown
  notes?: string | null
  firmware_version?: string | null
  device_profile_id?: string | null
  cfg_tracking_mode?: string | null
  cfg_transmit_strat?: string | null
  cfg_geoloc_sensor_profile?: string | null
  cfg_lora_live_period?: string | null
  cfg_oneshot_geoloc_method?: string | null
  cfg_periodic_position_interval?: string | null
  cfg_tracking_ul_period?: string | null
  cfg_device_profile?: number | null
}

export interface DeviceData {
  id: number
  device_id: number
  latitude?: number | null
  longitude?: number | null
  temperature?: number | null
  battery_level?: number | null
  battery_status?: string | null
  elevation?: number | null
  created_at: string
}

export interface UserAccess {
  user_id: string
  scope: 'client' | 'end_customer' | 'project'
  ref_id: string
  access_mode: AccessMode
}


export interface SupabaseError {
  message: string
}
export interface SuccessResponse<T> {
  data: T
}
