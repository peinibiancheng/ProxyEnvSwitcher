import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Space, Tag, Statistic, Row, Col, message, Progress } from 'antd'
import { ReloadOutlined, WarningOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { useConnectionStatusStore } from '../store/connectionStatusStore'
import { ConnectionStatus } from '../types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

const ConnectionStatusPage: React.FC = () => {
  const { connections, refreshConnections, updateConnection, removeConnection } = useConnectionStatusStore()
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState<Array<{ time: string; latency: number }>>([])
  const [refreshing, setRefreshing] = useState(false)

  // 模拟连接状态数据
  useEffect(() => {
    const mockConnections: ConnectionStatus[] = [
      {
        id: '1',
        proxy_id: 'proxy-1',
        status: 'connected',
        latency: 50,
        bytes_sent: 1024000,
        bytes_received: 5120000,
        last_activity: new Date().toISOString()
      },
      {
        id: '2',
        proxy_id: 'proxy-2',
        status: 'disconnected',
        latency: 0,
        bytes_sent: 0,
        bytes_received: 0,
        last_activity: new Date().toISOString()
      },
      {
        id: '3',
        proxy_id: 'proxy-3',
        status: 'connecting',
        latency: 0,
        bytes_sent: 0,
        bytes_received: 0,
        last_activity: new Date().toISOString()
      },
      {
        id: '4',
        proxy_id: 'proxy-4',
        status: 'error',
        latency: 0,
        bytes_sent: 0,
        bytes_received: 0,
        last_activity: new Date().toISOString()
      }
    ]

    mockConnections.forEach(conn => {
      updateConnection(conn)
    })
  }, [updateConnection])

  // 定时刷新连接状态
  useEffect(() => {
    const interval = setInterval(() => {
      refreshConnections()
      updateChartData()
    }, 5000)

    return () => clearInterval(interval)
  }, [refreshConnections])

  // 初始化图表数据
  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: `${new Date(Date.now() - (20 - i) * 5000).toLocaleTimeString()}`,
      latency: Math.floor(Math.random() * 200) + 10
    }))
    setChartData(initialData)
  }, [])

  const updateChartData = () => {
    const newData = {
      time: new Date().toLocaleTimeString(),
      latency: Math.floor(Math.random() * 200) + 10
    }
    setChartData(prev => {
      const updated = [...prev, newData]
      if (updated.length > 20) {
        updated.shift()
      }
      return updated
    })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      setLoading(true)
      // 模拟刷新数据
      await new Promise(resolve => setTimeout(resolve, 1000))
      refreshConnections()
      updateChartData()
      message.success('连接状态已刷新')
    } catch (error) {
      message.error('刷新失败')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const getStatusIcon = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />
      case 'disconnected':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      case 'connecting':
        return <SyncOutlined spin style={{ color: '#1890ff' }} />
      case 'error':
        return <WarningOutlined style={{ color: '#faad14' }} />
      default:
        return null
    }
  }

  const getStatusTag = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'connected':
        return <Tag color="success">已连接</Tag>
      case 'disconnected':
        return <Tag color="error">已断开</Tag>
      case 'connecting':
        return <Tag color="blue">连接中</Tag>
      case 'error':
        return <Tag color="warning">错误</Tag>
      default:
        return null
    }
  }

  const getLatencyLevel = (latency: number) => {
    if (latency < 50) {
      return '优秀'
    } else if (latency < 100) {
      return '良好'
    } else if (latency < 200) {
      return '一般'
    } else {
      return '较差'
    }
  }

  const getLatencyColor = (latency: number) => {
    if (latency < 50) {
      return '#52c41a'
    } else if (latency < 100) {
      return '#faad14'
    } else if (latency < 200) {
      return '#fa8c16'
    } else {
      return '#ff4d4f'
    }
  }

  // 使用useMemo优化columns配置
  const columns = React.useMemo(() => [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '代理ID',
      dataIndex: 'proxy_id',
      key: 'proxy_id',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: ConnectionStatus['status']) => (
        <Space>
          {getStatusIcon(status)}
          {getStatusTag(status)}
        </Space>
      )
    },
    {
      title: '延迟',
      dataIndex: 'latency',
      key: 'latency',
      width: 150,
      render: (latency: number, record: ConnectionStatus) => (
        record.status === 'connected' ? (
          <Space>
            <Statistic
              value={latency}
              suffix="ms"
              valueStyle={{ color: getLatencyColor(latency) }}
              title={getLatencyLevel(latency)}
              size="small"
            />
            <Progress
              percent={Math.min(latency / 200 * 100, 100)}
              strokeColor={getLatencyColor(latency)}
              size="small"
              showInfo={false}
            />
          </Space>
        ) : (
          <Tag color="default">-</Tag>
        )
      )
    },
    {
      title: '上传流量',
      dataIndex: 'bytes_sent',
      key: 'bytes_sent',
      width: 150,
      render: (bytes: number) => (
        <Statistic
          value={bytes / 1024 / 1024}
          suffix="MB"
          precision={2}
          size="small"
        />
      )
    },
    {
      title: '下载流量',
      dataIndex: 'bytes_received',
      key: 'bytes_received',
      width: 150,
      render: (bytes: number) => (
        <Statistic
          value={bytes / 1024 / 1024}
          suffix="MB"
          precision={2}
          size="small"
        />
      )
    },
    {
      title: '最后活动',
      dataIndex: 'last_activity',
      key: 'last_activity',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: ConnectionStatus) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            disabled={record.status === 'connected'}
            onClick={() => {
              updateConnection({
                ...record,
                status: 'connecting'
              })
              // 模拟连接过程
              setTimeout(() => {
                updateConnection({
                  ...record,
                  status: 'connected',
                  latency: Math.floor(Math.random() * 200) + 10
                })
              }, 2000)
            }}
          >
            连接
          </Button>
          <Button
            danger
            size="small"
            disabled={record.status === 'disconnected'}
            onClick={() => {
              updateConnection({
                ...record,
                status: 'disconnected',
                latency: 0
              })
            }}
          >
            断开
          </Button>
        </Space>
      )
    }
  ], [])

  // 计算统计信息，使用useMemo缓存结果
  const { connectedCount, totalCount, errorCount, avgLatency } = React.useMemo(() => {
    const connected = connections.filter(conn => conn.status === 'connected').length
    const total = connections.length
    const errors = connections.filter(conn => conn.status === 'error').length
    const latencySum = connections
      .filter(conn => conn.status === 'connected')
      .reduce((sum, conn) => sum + conn.latency, 0)
    const avg = latencySum / (connected || 1)
    
    return {
      connectedCount: connected,
      totalCount: total,
      errorCount: errors,
      avgLatency: avg
    }
  }, [connections])

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总连接数"
              value={totalCount}
              prefix={<SyncOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已连接"
              value={connectedCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="连接错误"
              value={errorCount}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均延迟"
              value={avgLatency.toFixed(2)}
              suffix="ms"
              prefix={<ReloadOutlined />}
              valueStyle={{ color: getLatencyColor(avgLatency) }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card
            title="延迟趋势"
            extra={
              <Button
                type="primary"
                icon={<ReloadOutlined spin={refreshing} />}
                onClick={handleRefresh}
                loading={refreshing}
              >
                刷新
              </Button>
            }
            style={{ height: 300 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#1890ff"
                  name="延迟 (ms)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="流量统计"
            style={{ height: 300 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={connections.map(conn => ({
                  name: conn.proxy_id,
                  上传: conn.bytes_sent / 1024 / 1024,
                  下载: conn.bytes_received / 1024 / 1024
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="上传" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="下载" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card
        title="连接列表"
        extra={
          <Button
            type="primary"
            icon={<ReloadOutlined spin={refreshing} />}
            onClick={handleRefresh}
            loading={refreshing}
          >
            刷新
          </Button>
        }
        style={{ marginTop: 16 }}
      >
        <Table
          columns={columns}
          dataSource={connections}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>
    </div>
  )
}

export default ConnectionStatusPage