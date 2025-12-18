import React, { useEffect, useState } from 'react'
import { Button, Card, Table, Form, Input, Select, Space, message, Modal, InputNumber, Tooltip } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CancelOutlined, UpOutlined, DownOutlined } from '@ant-design/icons'
import { useProxyRuleStore } from '../store/proxyRuleStore'
import { ProxyRule } from '../types'

const { Option } = Select
const { Item } = Form

const RuleSettingPage: React.FC = () => {
  const {
    proxyRules,
    loading,
    error,
    getProxyRules,
    addProxyRule,
    updateProxyRule,
    deleteProxyRule,
    updateRulePriority
  } = useProxyRuleStore()

  const [form] = Form.useForm<Omit<ProxyRule, 'id'>>()
  const [visible, setVisible] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    getProxyRules()
  }, [getProxyRules])

  useEffect(() => {
    if (error) {
      message.error(error)
    }
  }, [error])

  const handleAdd = () => {
    setEditingId(null)
    form.resetFields()
    setVisible(true)
  }

  const handleEdit = (record: ProxyRule) => {
    setEditingId(record.id)
    form.setFieldsValue({
      name: record.name,
      rule_type: record.rule_type,
      value: record.value,
      action: record.action,
      priority: record.priority
    })
    setVisible(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确定要删除该代理规则吗？',
      content: '删除后将无法恢复',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await deleteProxyRule(id)
        message.success('代理规则已删除')
      }
    })
  }

  const handleSubmit = async () => {
    try {
      setConfirmLoading(true)
      const values = await form.validateFields()
      
      if (editingId) {
        await updateProxyRule({
          ...values,
          id: editingId
        })
        message.success('代理规则已更新')
      } else {
        await addProxyRule(values)
        message.success('代理规则已添加')
      }
      
      setVisible(false)
      setConfirmLoading(false)
    } catch (error) {
      setConfirmLoading(false)
    }
  }

  const handlePriorityUp = (id: string, currentPriority: number) => {
    if (currentPriority > 1) {
      updateRulePriority(id, currentPriority - 1)
    }
  }

  const handlePriorityDown = (id: string, currentPriority: number) => {
    const maxPriority = Math.max(...proxyRules.map(rule => rule.priority), currentPriority)
    if (currentPriority < maxPriority) {
      updateRulePriority(id, currentPriority + 1)
    }
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    {
      title: '规则类型',
      dataIndex: 'rule_type',
      key: 'rule_type',
      width: 100,
      render: (type: string) => {
        switch (type) {
          case 'domain': return '域名'
          case 'ip': return 'IP'
          case 'cidr': return 'CIDR'
          default: return type
        }
      }
    },
    {
      title: '规则值',
      dataIndex: 'value',
      key: 'value',
      width: 200
    },
    {
      title: '动作',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (action: string) => {
        switch (action) {
          case 'allow': return <span style={{ color: '#52c41a' }}>允许</span>
          case 'deny': return <span style={{ color: '#ff4d4f' }}>拒绝</span>
          default: return action
        }
      }
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 150,
      sorter: (a, b) => a.priority - b.priority,
      render: (priority: number, record: ProxyRule) => (
        <Space>
          <Tooltip title="提高优先级">
            <Button
              type="text"
              icon={<UpOutlined />}
              size="small"
              disabled={priority <= 1}
              onClick={() => handlePriorityUp(record.id, priority)}
            />
          </Tooltip>
          <span>{priority}</span>
          <Tooltip title="降低优先级">
            <Button
              type="text"
              icon={<DownOutlined />}
              size="small"
              disabled={priority >= Math.max(...proxyRules.map(rule => rule.priority))}
              onClick={() => handlePriorityDown(record.id, priority)}
            />
          </Tooltip>
        </Space>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: ProxyRule) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ]

  // 按照优先级排序
  const sortedRules = [...proxyRules].sort((a, b) => a.priority - b.priority)

  return (
    <Card title="规则设置" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加规则</Button>}>
      <Table
        columns={columns}
        dataSource={sortedRules}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
      />

      <Modal
        title={editingId ? '编辑代理规则' : '添加代理规则'}
        open={visible}
        onOk={handleSubmit}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="back" onClick={() => setVisible(false)} icon={<CancelOutlined />}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit} loading={confirmLoading} icon={<SaveOutlined />}>
            确定
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            rule_type: 'domain',
            action: 'allow',
            priority: 1
          }}
        >
          <Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input placeholder="请输入规则名称" />
          </Item>

          <Item
            name="rule_type"
            label="规则类型"
            rules={[{ required: true, message: '请选择规则类型' }]}
          >
            <Select placeholder="请选择规则类型">
              <Option value="domain">域名</Option>
              <Option value="ip">IP</Option>
              <Option value="cidr">CIDR</Option>
            </Select>
          </Item>

          <Item
            name="value"
            label="规则值"
            rules={[{ required: true, message: '请输入规则值' }]}
          >
            <Input placeholder="请输入规则值，例如：example.com 或 192.168.1.1 或 192.168.1.0/24" />
          </Item>

          <Item
            name="action"
            label="动作"
            rules={[{ required: true, message: '请选择动作' }]}
          >
            <Select placeholder="请选择动作">
              <Option value="allow">允许</Option>
              <Option value="deny">拒绝</Option>
            </Select>
          </Item>

          <Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请输入优先级' }]}
          >
            <InputNumber
              min={1}
              max={100}
              placeholder="请输入优先级"
              style={{ width: '100%' }}
            />
            <Tooltip title="优先级数值越小，优先级越高">
              <span style={{ marginLeft: 8, color: '#1890ff' }}>优先级说明</span>
            </Tooltip>
          </Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default RuleSettingPage