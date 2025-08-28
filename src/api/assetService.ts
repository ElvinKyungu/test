import { supabase } from './supabaseClient'
import type { Asset } from '../types'

export async function getAssets(filterByProjectIds?: string[], filterByClientIds?: string[]): Promise<Asset[]> {
  let q = supabase.from('assets').select('*').eq('is_active', true)

  if (filterByProjectIds && filterByProjectIds.length) q = q.in('current_project_id', filterByProjectIds)
  else if (filterByClientIds && filterByClientIds.length) q = q.in('client_id', filterByClientIds)

  const { data, error } = await q
  if (error) throw error
  return data as Asset[]
}
