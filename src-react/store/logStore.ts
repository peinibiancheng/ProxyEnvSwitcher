import { create } from 'zustand'
import { LogEntry } from '../types'

interface LogState {
  logs: LogEntry[]
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void
  clearLogs: () => void
  setLogLevel: (level: 'debug' | 'info' | 'warn' | 'error') => void
}

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  logLevel: 'info',

  addLog: (log) => {
    set(state => ({
      logs: [
        {
          ...log,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString()
        },
        ...state.logs.slice(0, 999) // 只保留最近1000条日志
      ]
    }))
  },

  clearLogs: () => {
    set({ logs: [] })
  },

  setLogLevel: (level) => {
    set({ logLevel: level })
  }
}))