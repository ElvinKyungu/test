import { supabase } from './supabaseClient'
import type { Project } from '../types'

export async function getProjects(filterByEndCustomerIds?: string[], filterIds?: string[]): Promise<Project[]> {
  let q = supabase.from('projects').select('*').eq('is_active', true)
  if (filterIds && filterIds.length) q = q.in('id', filterIds)
  else if (filterByEndCustomerIds && filterByEndCustomerIds.length) q = q.in('end_customer_id', filterByEndCustomerIds)

  const { data, error } = await q
  if (error) throw error
  return data as Project[]
}
