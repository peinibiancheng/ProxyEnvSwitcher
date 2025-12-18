import { create } from 'zustand'
import { ConnectionStatus } from '../types'

interface ConnectionStatusState {
  connections: ConnectionStatus[]
  refreshConnections: () => void
  updateConnection: (connection: ConnectionStatus) => void
  removeConnection: (id: string) => void
}

export const useConnectionStatusStore = create<ConnectionStatusState>((set) => ({
  connections: [],

  refreshConnections: () => {
    // 模拟刷新连接状态
    set(state => ({
      connections: state.connections.map(conn => ({
        ...conn,
        latency: Math.floor(Math.random() * 200) + 10,
        bytes_sent: conn.bytes_sent + Math.floor(Math.random() * 10000),
        bytes_received: conn.bytes_received + Math.floor(Math.random() * 10000),
        last_activity: new Date().toISOString()
      }))
    }))
  },

  updateConnection: (connection) => {
    set(state => ({
      connections: state.connections.some(conn => conn.id === connection.id)
        ? state.connections.map(conn => conn.id === connection.id ? connection : conn)
        : [...state.connections, connection]
    }))
  },

  removeConnection: (id) => {
    set(state => ({
      connections: state.connections.filter(conn => conn.id !== id)
    }))
  }
}))