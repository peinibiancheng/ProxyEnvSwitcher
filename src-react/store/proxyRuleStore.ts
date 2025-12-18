import { create } from 'zustand'
import { ProxyRule } from '../types'
import { invoke } from '@tauri-apps/api'

interface ProxyRuleState {
  proxyRules: ProxyRule[]
  loading: boolean
  error: string | null
  getProxyRules: () => Promise<void>
  addProxyRule: (rule: Omit<ProxyRule, 'id'>) => Promise<void>
  updateProxyRule: (rule: ProxyRule) => Promise<void>
  deleteProxyRule: (id: string) => Promise<void>
  updateRulePriority: (id: string, priority: number) => Promise<void>
}

export const useProxyRuleStore = create<ProxyRuleState>((set, get) => ({
  proxyRules: [],
  loading: false,
  error: null,

  getProxyRules: async () => {
    set({ loading: true, error: null })
    try {
      const rules = await invoke<ProxyRule[]>('get_proxy_rules')
      set({ proxyRules: rules, loading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to get proxy rules', loading: false })
    }
  },

  addProxyRule: async (rule) => {
    set({ loading: true, error: null })
    try {
      const newRule = await invoke<ProxyRule>('add_proxy_rule', {
        rule: {
          ...rule,
          id: crypto.randomUUID()
        }
      })
      set(state => ({
        proxyRules: [...state.proxyRules, newRule],
        loading: false
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add proxy rule', loading: false })
    }
  },

  updateProxyRule: async (rule) => {
    set({ loading: true, error: null })
    try {
      const updatedRule = await invoke<ProxyRule>('update_proxy_rule', { rule })
      set(state => ({
        proxyRules: state.proxyRules.map(r => r.id === rule.id ? updatedRule : r),
        loading: false
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update proxy rule', loading: false })
    }
  },

  deleteProxyRule: async (id) => {
    set({ loading: true, error: null })
    try {
      await invoke('delete_proxy_rule', { id })
      set(state => ({
        proxyRules: state.proxyRules.filter(r => r.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete proxy rule', loading: false })
    }
  },

  updateRulePriority: async (id, priority) => {
    const rule = get().proxyRules.find(r => r.id === id)
    if (rule) {
      await get().updateProxyRule({ ...rule, priority })
    }
  }
}))