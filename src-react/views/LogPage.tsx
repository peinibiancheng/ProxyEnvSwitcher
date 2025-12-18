import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Space, Select, Input, Tag, message, Modal, Popconfirm } from 'antd'
import { DeleteOutlined, ExportOutlined, FilterOutlined, SearchOutlined, ClearOutlined, DownloadOutlined } from '@ant-design/icons'
import { useLogStore } from '../store/logStore'
import { LogEntry } from '../types'

const { Option } = Select
const { Search } = Input

const LogPage: React.FC = () => {
  const {
    logs,
    logLevel,
    addLog,
    clearLogs,
    setLogLevel
  } = useLogStore()

  const [searchText, setSearchText] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [exporting, setExporting] = useState(false)

  // 模拟日志数据
  useEffect(() => {
    const logTypes: LogEntry['level'][] = ['debug', 'info', 'warn', 'error']
    const logMessages = [
      '代理服务器已启动',
      '成功连接到代理服务器',
      '代理规则已更新',
      '检测到连接错误',
      '代理配置已保存',
      '开始处理请求',
      '请求处理完成',
      '发现无效规则',
      '代理服务器断开连接',
      '正在重新连接到代理服务器'
    ]

    // 初始化模拟日志
    for (let i = 0; i < 50; i++) {
      const randomLevel = logTypes[Math.floor(Math.random() * logTypes.length)]
      const randomMessage = logMessages[Math.floor(Math.random() * logMessages.length)]
      const timestamp = new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString()

      addLog({
        level: randomLevel,
        message: randomMessage,
        details: `详细信息: ${i + 1}`
      })
    }

    // 定时添加新日志
    const interval = setInterval(() => {
      const randomLevel = logTypes[Math.floor(Math.random() * logTypes.length)]
      const randomMessage = logMessages[Math.floor(Math.random() * logMessages.length)]
      
      addLog({
        level: randomLevel,
        message: randomMessage,
        details: `详细信息: ${Date.now()}`
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [addLog])

  // 过滤和搜索日志
  useEffect(() => {
    let result = logs
    
    // 按级别过滤
    if (filterLevel !== 'all') {
      result = result.filter(log => log.level === filterLevel)
    }
    
    // 按文本搜索
    if (searchText) {
      const text = searchText.toLowerCase()
      result = result.filter(log => 
        log.message.toLowerCase().includes(text) || 
        (log.details && log.details.toLowerCase().includes(text))
      )
    }
    
    setFilteredLogs(result)
  }, [logs, filterLevel, searchText])

  const handleClearLogs = () => {
    Modal.confirm({
      title: '确定要清空所有日志吗？',
      content: '清空后将无法恢复所有日志记录',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        clearLogs()
        message.success('日志已清空')
      }
    })
  }

  const handleExportLogs = () => {
    setExporting(true)
    try {
      // 模拟导出过程
      setTimeout(() => {
        const logData = JSON.stringify(filteredLogs, null, 2)
        const blob = new Blob([logData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `proxy-logs-${new Date().toISOString().slice(0, 10)}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        message.success('日志导出成功')
        setExporting(false)
      }, 1000)
    } catch (error) {
      message.error('日志导出失败')
      setExporting(false)
    }
  }

  const handleLogLevelChange = (level: string) => {
    setFilterLevel(level)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const handleClearSearch = () => {
    setSearchText('')
  }

  const getLogLevelTag = (level: LogEntry['level']) => {
    switch (level) {
      case 'debug':
        return <Tag color="blue">DEBUG</Tag>
      case 'info':
        return <Tag color="green">INFO</Tag>
      case 'warn':
        return <Tag color="orange">WARN</Tag>
      case 'error':
        return <Tag color="red">ERROR</Tag>
      default:
        return <Tag color="default">UNKNOWN</Tag>
    }
  }

  // 使用useMemo优化columns配置
  const columns = React.useMemo(() => [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 200,
      render: (timestamp: string) => new Date(timestamp).toLocaleString()
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: LogEntry['level']) => getLogLevelTag(level)
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: {
        showTitle: false,
      },
      render: (message: string, record: LogEntry) => (
        <Space>
          <span>{message}</span>
          {record.details && (
            <a
              onClick={() => {
                Modal.info({
                  title: '详细信息',
                  content: record.details
                })
              }}
            >
              查看详情
            </a>
          )}
        </Space>
      )
    },
    {
      title: '详细信息',
      dataIndex: 'details',
      key: 'details',
      width: 200,
      ellipsis: true,
      render: (details?: string) => details || '-'
    }
  ], [])

  return (
    <Card
      title="日志记录"
      extra={
        <Space size="middle">
          <Select
            value={filterLevel}
            onChange={handleLogLevelChange}
            placeholder="过滤日志级别"
            style={{ width: 150 }}
            prefix={<FilterOutlined />}
          >
            <Option value="all">全部</Option>
            <Option value="debug">DEBUG</Option>
            <Option value="info">INFO</Option>
            <Option value="warn">WARN</Option>
            <Option value="error">ERROR</Option>
          </Select>
          <Button
            type="primary"
            onClick={handleExportLogs}
            loading={exporting}
            icon={<ExportOutlined />}
          >
            导出日志
          </Button>
          <Popconfirm
            title="确定要清空所有日志吗？"
            onConfirm={handleClearLogs}
            okText="确定"
            okType="danger"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />}>
              清空日志
            </Button>
          </Popconfirm>
        </Space>
      }
    >
      <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 16 }}>
        <Search
          placeholder="搜索日志消息"
          allowClear
          enterButton={<SearchOutlined />}
          size="middle"
          onSearch={handleSearch}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          suffix={
            searchText ? (
              <ClearOutlined onClick={handleClearSearch} style={{ cursor: 'pointer' }} />
            ) : null
          }
        />
      </Space>

      <Table
        columns={columns}
        dataSource={filteredLogs}
        rowKey="id"
        pagination={{
          pageSize: 15,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
        scroll={{ x: 1200 }}
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4}>
                <Space>
                  <span>日志级别设置：</span>
                  <Select
                    value={logLevel}
                    onChange={setLogLevel}
                    style={{ width: 120 }}
                    size="small"
                  >
                    <Option value="debug">DEBUG</Option>
                    <Option value="info">INFO</Option>
                    <Option value="warn">WARN</Option>
                    <Option value="error">ERROR</Option>
                  </Select>
                  <Button
                    type="dashed"
                    size="small"
                    onClick={() => {
                      addLog({
                        level: 'info',
                        message: '手动添加日志测试',
                        details: '这是一条手动添加的测试日志'
                      })
                      message.success('日志已添加')
                    }}
                  >
                    添加测试日志
                  </Button>
                </Space>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  )
}

export default LogPage