// src/services/assetViewService.ts
import { supabase } from '../api/supabaseClient'
import type { AssetViewData } from '../types/assetView'

export class AssetViewService {
  /**
   * Récupère toutes les données de la vue Supabase
   */
  static async getAssetViewData(): Promise<AssetViewData[]> {
    try {
      const { data, error } = await supabase
        .from('asset_monitoring_list') // Remplacez par le nom de votre vue
        .select('*')

      if (error) {
        console.error('Erreur lors de la récupération des données:', error)
        throw error
      }

      return data as AssetViewData[]
    } catch (error) {
      console.error('Erreur dans getAssetViewData:', error)
      throw error
    }
  }

  /**
   * Recherche dans les données
   */
  static async searchAssetViewData(searchTerm: string): Promise<AssetViewData[]> {
    try {
      if (!searchTerm.trim()) {
        return await this.getAssetViewData()
      }

      const { data, error } = await supabase
        .from('asset_monitoring_list') // Remplacez par le nom de votre vue
        .select('*')
        .or(
          `asset_name.ilike.%${searchTerm}%,asset_type.ilike.%${searchTerm}%,current_project.ilike.%${searchTerm}%`
        )

      if (error) {
        console.error('Erreur lors de la recherche:', error)
        throw error
      }

      return data as AssetViewData[]
    } catch (error) {
      console.error('Erreur dans searchAssetViewData:', error)
      throw error
    }
  }
}
