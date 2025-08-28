// services/assetsService.ts
import { supabase } from '../api/supabaseClient'
import type { 
  Asset, 
  Device, 
  DeviceData, 
  AssetWithDevices, 
  DeviceWithLatestData 
} from '../types'
import { useUserStore } from '../stores/store'

export class AssetsService {
  
  /**
   * Récupère tous les assets et devices selon les permissions de l'utilisateur
   */
  static async getUserAssetsWithDevices(): Promise<AssetWithDevices[]> {
    const userStore = useUserStore()
    const permissions = userStore.getUserPermissions
    const role = userStore.role

    try {
      let query = supabase
        .from('assets')
        .select(`
          *,
          project:projects(
            *,
            end_customer:end_customers(
              *,
              client:clients(*)
            )
          ),
          devices(
            *,
            latest_data:device_data(*)
          )
        `)
        .eq('is_active', true)

      // Appliquer les filtres selon le rôle
      if (role === 'client_admin' && userStore.client_id) {
        query = query.eq('project.end_customer.client_id', userStore.client_id)
      } else if (role === 'end_customer_admin' && userStore.end_customer_id) {
        query = query.eq('project.end_customer_id', userStore.end_customer_id)
      } else if (role === 'project_user' && userStore.project_id) {
        query = query.eq('project_id', userStore.project_id)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      // Traiter les données pour obtenir les dernières données de chaque device
      const processedAssets = await Promise.all(
        (data || []).map(async (asset) => {
          const devicesWithLatestData = await Promise.all(
            (asset.devices || []).map(async (device: Device) => {
              const latestData = await this.getLatestDeviceData(device.id)
              return {
                ...device,
                latest_data: latestData
              }
            })
          )

          return {
            ...asset,
            devices: devicesWithLatestData
          }
        })
      )

      return processedAssets
    } catch (error) {
      console.error('Erreur lors de la récupération des assets:', error)
      throw error
    }
  }

  /**
   * Récupère les dernières données d'un device
   */
  static async getLatestDeviceData(deviceId: string): Promise<DeviceData | null> {
    try {
      const { data, error } = await supabase
        .from('device_data')
        .select('*')
        .eq('device_id', deviceId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error
      }

      return data || null
    } catch (error) {
      console.error('Erreur lors de la récupération des données du device:', error)
      return null
    }
  }

  /**
   * Récupère tous les devices avec leurs dernières données selon les permissions
   */
  static async getUserDevicesWithLatestData(): Promise<DeviceWithLatestData[]> {
    const userStore = useUserStore()
    const role = userStore.role

    try {
      let query = supabase
        .from('devices')
        .select(`
          *,
          asset:assets(
            *,
            project:projects(
              *,
              end_customer:end_customers(
                *,
                client:clients(*)
              )
            )
          )
        `)
        .eq('is_active', true)

      // Appliquer les filtres selon le rôle
      if (role === 'client_admin' && userStore.client_id) {
        query = query.eq('asset.project.end_customer.client_id', userStore.client_id)
      } else if (role === 'end_customer_admin' && userStore.end_customer_id) {
        query = query.eq('asset.project.end_customer_id', userStore.end_customer_id)
      } else if (role === 'project_user' && userStore.project_id) {
        query = query.eq('asset.project_id', userStore.project_id)
      }

      const { data: devices, error } = await query

      if (error) {
        throw error
      }

      // Enrichir chaque device avec ses dernières données
      const devicesWithLatestData = await Promise.all(
        (devices || []).map(async (device) => {
          const latestData = await this.getLatestDeviceData(device.id)
          return {
            ...device,
            latest_data: latestData
          }
        })
      )

      return devicesWithLatestData
    } catch (error) {
      console.error('Erreur lors de la récupération des devices:', error)
      throw error
    }
  }

  /**
   * Récupère les données historiques d'un device pour une période donnée
   */
  static async getDeviceHistoryData(
    deviceId: string, 
    startDate: string, 
    endDate: string
  ): Promise<DeviceData[]> {
    try {
      const { data, error } = await supabase
        .from('device_data')
        .select('*')
        .eq('device_id', deviceId)
        .gte('timestamp', startDate)
        .lte('timestamp', endDate)
        .order('timestamp', { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error)
      throw error
    }
  }

  /**
   * Récupère un asset spécifique avec ses devices
   */
  static async getAssetWithDevices(assetId: string): Promise<AssetWithDevices | null> {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          project:projects(
            *,
            end_customer:end_customers(
              *,
              client:clients(*)
            )
          ),
          devices(*)
        `)
        .eq('id', assetId)
        .eq('is_active', true)
        .single()

      if (error) {
        throw error
      }

      // Enrichir les devices avec leurs dernières données
      const devicesWithLatestData = await Promise.all(
        (data.devices || []).map(async (device: Device) => {
          const latestData = await this.getLatestDeviceData(device.id)
          return {
            ...device,
            latest_data: latestData
          }
        })
      )

      return {
        ...data,
        devices: devicesWithLatestData
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'asset:', error)
      throw error
    }
  }

  /**
   * Recherche d'assets/devices par nom
   */
  static async searchAssetsAndDevices(searchTerm: string): Promise<{
    assets: Asset[],
    devices: Device[]
  }> {
    const userStore = useUserStore()
    const role = userStore.role

    try {
      // Recherche dans les assets
      let assetsQuery = supabase
        .from('assets')
        .select(`
          *,
          project:projects(
            *,
            end_customer:end_customers(
              *,
              client:clients(*)
            )
          )
        `)
        .ilike('name', `%${searchTerm}%`)
        .eq('is_active', true)

      // Recherche dans les devices
      let devicesQuery = supabase
        .from('devices')
        .select(`
          *,
          asset:assets(
            *,
            project:projects(
              *,
              end_customer:end_customers(
                *,
                client:clients(*)
              )
            )
          )
        `)
        .or(`name.ilike.%${searchTerm}%,device_eui.ilike.%${searchTerm}%`)
        .eq('is_active', true)

      // Appliquer les filtres selon le rôle
      if (role === 'client_admin' && userStore.client_id) {
        assetsQuery = assetsQuery.eq('project.end_customer.client_id', userStore.client_id)
        devicesQuery = devicesQuery.eq('asset.project.end_customer.client_id', userStore.client_id)
      } else if (role === 'end_customer_admin' && userStore.end_customer_id) {
        assetsQuery = assetsQuery.eq('project.end_customer_id', userStore.end_customer_id)
        devicesQuery = devicesQuery.eq('asset.project.end_customer_id', userStore.end_customer_id)
      } else if (role === 'project_user' && userStore.project_id) {
        assetsQuery = assetsQuery.eq('project_id', userStore.project_id)
        devicesQuery = devicesQuery.eq('asset.project_id', userStore.project_id)
      }

      const [assetsResult, devicesResult] = await Promise.all([
        assetsQuery,
        devicesQuery
      ])

      if (assetsResult.error) throw assetsResult.error
      if (devicesResult.error) throw devicesResult.error

      return {
        assets: assetsResult.data || [],
        devices: devicesResult.data || []
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      throw error
    }
  }
}