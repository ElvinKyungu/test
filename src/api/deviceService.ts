import { supabase } from './supabaseClient'
import type { Device } from '../types'

export async function getDevices(deviceIds: number[]): Promise<Device[]> {
  if (!deviceIds?.length) return []
  const { data, error } = await supabase.from('devices').select('*').in('id', deviceIds)
  if (error) throw error
  return data as Device[]
}
