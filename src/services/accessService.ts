import { supabase } from './../api/supabaseClient'
import type { UserAccess } from '../types'

export async function getUserAccesses(userId: string): Promise<UserAccess[]> {
  const results: UserAccess[] = []

  const clientRes = await supabase
    .from('user_client_access')
    .select('user_id, client_id, is_active, notes')
    .eq('user_id', userId)
    .eq('is_active', true)

  if (clientRes.error) throw clientRes.error
  for (const row of clientRes.data ?? []) {
    results.push({ user_id: userId, scope: 'client', ref_id: row.client_id, access_mode: 'RW' })
  }

  const ecRes = await supabase
    .from('user_end_customer_access')
    .select('user_id, end_customer_id, is_active')
    .eq('user_id', userId)
    .eq('is_active', true)

  if (ecRes.error) throw ecRes.error
  for (const row of ecRes.data ?? []) {
    results.push({ user_id: userId, scope: 'end_customer', ref_id: row.end_customer_id, access_mode: 'RW' })
  }

  const projRes = await supabase
    .from('user_project_access')
    .select('user_id, project_id, is_active')
    .eq('user_id', userId)
    .eq('is_active', true)

  if (projRes.error) throw projRes.error
  for (const row of projRes.data ?? []) {
    results.push({ user_id: userId, scope: 'project', ref_id: row.project_id, access_mode: 'RW' })
  }

  return results
}
