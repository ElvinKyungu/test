export interface DeviceData {
  id: number
  latitude: number
  longitude: number
  temperature: number
  battery_level: number
  battery_status: string
  device_id: number
  last_created: Date
}

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  company_id: string|null
  role: string
  avatar: string 
}

export interface ListDevices{
  device_id: number
  device_name: string
  division_name: string
  latitude: string | null
  longitude: string | null
  company_name: string
  last_created: Date
}

export interface BeforeSearch{
  id: number
  title: string
  division_name: string
  latitude: string | null
  longitude: string | null
  company_name: string
  device_eui: string
  last_created: Date
}

export interface SearchResponse {
  device_id: number
  device_title: string
  company_name: string
  division_name: string
}

export interface UserDeviceData {
  id: number;
  device_id: number;
  device_eui: string;
  device_name: string;
  company_id: number;
  company_name: string;
  division_id: number;
  division_name: string;
  last_battery_level: number;
  last_battery_status: string;
  last_latitude: number;
  last_longitude: number;
  last_report_date: Date; 
  last_temperature: number;
  user_email: string;
  user_id: string;
  user_role: string;
}

export interface SupabaseError {
  message: string
}
export interface SuccessResponse<T> {
  data: T
}
