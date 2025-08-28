import { supabase } from './supabaseClient'
import type { Client } from '../types'

export async function getClients(filterIds?: string[]): Promise<Client[]> {
  let q = supabase.from('clients').select('*').eq('is_active', true)
  if (filterIds && filterIds.length) q = q.in('id', filterIds)
  const { data, error } = await q
  if (error) throw error
  return data as Client[]
}
