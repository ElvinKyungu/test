import { supabase } from './supabaseClient'
import type { DeviceData } from '../types'

export async function getLatestDeviceData(deviceIds: number[]): Promise<DeviceData[]> {
  if (!deviceIds?.length) return []
  // Dernier point par device : on peut soit utiliser RPC, soit un tri + distinct on (si dispo)
  // Ici version simple (ramène tout; tu peux optimiser plus tard via vue matérialisée ou RPC)
  const { data, error } = await supabase
    .from('devices_data')
    .select('*')
    .in('device_id', deviceIds)
    .order('created_at', { ascending: false })
    .limit(1000) // garde une limite
  if (error) throw error
  return data as DeviceData[]
}
