import React, { useEffect, useState } from 'react'
import { Button, Card, Table, Form, Input, Select, Switch, Space, message, Modal } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CancelOutlined } from '@ant-design/icons'
import { useProxyConfigStore } from '../store/proxyConfigStore'
import { ProxyConfig } from '../types'

const { Option } = Select
const { Item } = Form

const ProxyConfigPage: React.FC = () => {
  const {
    proxyConfigs,
    loading,
    error,
    getProxyConfigs,
    addProxyConfig,
    updateProxyConfig,
    deleteProxyConfig,
    enableProxyConfig,
    disableProxyConfig
  } = useProxyConfigStore()

  const [form] = Form.useForm<Omit<ProxyConfig, 'id'>>()
  const [visible, setVisible] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    getProxyConfigs()
  }, [getProxyConfigs])

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

  const handleEdit = (record: ProxyConfig) => {
    setEditingId(record.id)
    form.setFieldsValue({
      name: record.name,
      protocol: record.protocol,
      host: record.host,
      port: record.port,
      username: record.username,
      password: record.password,
      enabled: record.enabled
    })
    setVisible(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确定要删除该代理配置吗？',
      content: '删除后将无法恢复',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await deleteProxyConfig(id)
        message.success('代理配置已删除')
      }
    })
  }

  const handleSubmit = async () => {
    try {
      setConfirmLoading(true)
      const values = await form.validateFields()
      
      if (editingId) {
        await updateProxyConfig({
          ...values,
          id: editingId
        })
        message.success('代理配置已更新')
      } else {
        await addProxyConfig(values)
        message.success('代理配置已添加')
      }
      
      setVisible(false)
      setConfirmLoading(false)
    } catch (error) {
      setConfirmLoading(false)
    }
  }

  const handleEnableChange = async (id: string, enabled: boolean) => {
    if (enabled) {
      await enableProxyConfig(id)
      message.success('代理已启用')
    } else {
      await disableProxyConfig(id)
      message.success('代理已禁用')
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
      title: '协议',
      dataIndex: 'protocol',
      key: 'protocol',
      width: 100,
      render: (protocol: string) => protocol.toUpperCase()
    },
    {
      title: '主机',
      dataIndex: 'host',
      key: 'host',
      width: 150
    },
    {
      title: '端口',
      dataIndex: 'port',
      key: 'port',
      width: 80
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 150
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled: boolean, record: ProxyConfig) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleEnableChange(record.id, checked)}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: ProxyConfig) => (
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

  return (
    <Card title="代理配置管理" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加配置</Button>}>
      <Table
        columns={columns}
        dataSource={proxyConfigs}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
      />

      <Modal
        title={editingId ? '编辑代理配置' : '添加代理配置'}
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
            protocol: 'http',
            enabled: false
          }}
        >
          <Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入代理名称' }]}
          >
            <Input placeholder="请输入代理名称" />
          </Item>

          <Item
            name="protocol"
            label="协议"
            rules={[{ required: true, message: '请选择协议' }]}
          >
            <Select placeholder="请选择协议">
              <Option value="http">HTTP</Option>
              <Option value="https">HTTPS</Option>
              <Option value="socks5">SOCKS5</Option>
            </Select>
          </Item>

          <Item
            name="host"
            label="主机"
            rules={[{ required: true, message: '请输入主机地址' }]}
          >
            <Input placeholder="请输入主机地址" />
          </Item>

          <Item
            name="port"
            label="端口"
            rules={[{ required: true, message: '请输入端口号' }, { type: 'number', min: 1, max: 65535 }]}
          >
            <Input type="number" placeholder="请输入端口号" />
          </Item>

          <Item name="username" label="用户名">
            <Input placeholder="请输入用户名（可选）" />
          </Item>

          <Item name="password" label="密码">
            <Input.Password placeholder="请输入密码（可选）" />
          </Item>

          <Item
            name="enabled"
            label="启用状态"
            valuePropName="checked"
          >
            <Switch />
          </Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default ProxyConfigPage