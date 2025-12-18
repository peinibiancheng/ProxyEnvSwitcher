// 代理配置类型
export interface ProxyConfig {
  id: string;
  name: string;
  protocol: 'http' | 'https' | 'socks5';
  host: string;
  port: number;
  username?: string;
  password?: string;
  enabled: boolean;
}

// 代理规则类型
export interface ProxyRule {
  id: string;
  name: string;
  rule_type: 'domain' | 'ip' | 'cidr';
  value: string;
  action: 'allow' | 'deny';
  priority: number;
}

// 连接状态类型
export interface ConnectionStatus {
  id: string;
  proxy_id: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  latency: number;
  bytes_sent: number;
  bytes_received: number;
  last_activity: string;
}

// 日志类型
export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  details?: string;
}

// 应用配置类型
export interface AppConfig {
  theme: 'light' | 'dark';
  language: string;
  auto_start: boolean;
  log_level: 'debug' | 'info' | 'warn' | 'error';
}