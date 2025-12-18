import { create } from 'zustand'
import { ProxyConfig } from '../types'
import { invoke } from '@tauri-apps/api'

interface ProxyConfigState {
  proxyConfigs: ProxyConfig[]
  loading: boolean
  error: string | null
  getProxyConfigs: () => Promise<void>
  addProxyConfig: (config: Omit<ProxyConfig, 'id'>) => Promise<void>
  updateProxyConfig: (config: ProxyConfig) => Promise<void>
  deleteProxyConfig: (id: string) => Promise<void>
  enableProxyConfig: (id: string) => Promise<void>
  disableProxyConfig: (id: string) => Promise<void>
}

export const useProxyConfigStore = create<ProxyConfigState>((set, get) => ({
  proxyConfigs: [],
  loading: false,
  error: null,

  getProxyConfigs: async () => {
    set({ loading: true, error: null })
    try {
      const configs = await invoke<ProxyConfig[]>('get_proxy_configs')
      set({ proxyConfigs: configs, loading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to get proxy configs', loading: false })
    }
  },

  addProxyConfig: async (config) => {
    set({ loading: true, error: null })
    try {
      const newConfig = await invoke<ProxyConfig>('add_proxy_config', {
        config: {
          ...config,
          id: crypto.randomUUID()
        }
      })
      set(state => ({
        proxyConfigs: [...state.proxyConfigs, newConfig],
        loading: false
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add proxy config', loading: false })
    }
  },

  updateProxyConfig: async (config) => {
    set({ loading: true, error: null })
    try {
      const updatedConfig = await invoke<ProxyConfig>('update_proxy_config', { config })
      set(state => ({
        proxyConfigs: state.proxyConfigs.map(c => c.id === config.id ? updatedConfig : c),
        loading: false
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update proxy config', loading: false })
    }
  },

  deleteProxyConfig: async (id) => {
    set({ loading: true, error: null })
    try {
      await invoke('delete_proxy_config', { id })
      set(state => ({
        proxyConfigs: state.proxyConfigs.filter(c => c.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete proxy config', loading: false })
    }
  },

  enableProxyConfig: async (id) => {
    const config = get().proxyConfigs.find(c => c.id === id)
    if (config) {
      await get().updateProxyConfig({ ...config, enabled: true })
    }
  },

  disableProxyConfig: async (id) => {
    const config = get().proxyConfigs.find(c => c.id === id)
    if (config) {
      await get().updateProxyConfig({ ...config, enabled: false })
    }
  }
}))