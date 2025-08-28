import { supabase } from './supabaseClient'
import type { EndCustomer } from '../types'

export async function getEndCustomers(filterByClientIds?: string[], filterIds?: string[]): Promise<EndCustomer[]> {
  let q = supabase.from('end_customers').select('*').eq('is_active', true)
  if (filterIds && filterIds.length) q = q.in('id', filterIds)
  else if (filterByClientIds && filterByClientIds.length) q = q.in('client_id', filterByClientIds)

  const { data, error } = await q
  if (error) throw error
  return data as EndCustomer[]
}
