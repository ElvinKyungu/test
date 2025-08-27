// services/userService.ts
import { supabase } from '../api/supabaseClient'
import type { UserDeviceData } from '../types/type'
export const getAllUserDatas = async (userID: string) => {
  try {
    const { data, error } = await supabase
      .from('view_users_devices_detailed')
      .select()
      .eq('user_id', userID)
    console.log('Data retrieved:', data);
    if (error) {
      console.error(error)
      throw new Error('Une erreur est survenue lors de la récupération des appareils');
    }

    return data as UserDeviceData[]
  } catch (error) {
    console.error('Erreur lors de la récupération des appareils:', error)
    throw error
  }
}
