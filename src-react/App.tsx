import React, { useState } from 'react'
import { Layout, Menu, Typography, ConfigProvider } from 'antd'
import {
  SettingOutlined,
  BorderOutlined,
  LinkOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons'
import ProxyConfigPage from './views/ProxyConfigPage'
import RuleSettingPage from './views/RuleSettingPage'
import ConnectionStatusPage from './views/ConnectionStatusPage'
import LogPage from './views/LogPage'

const { Header, Sider, Content } = Layout
const { Title } = Typography

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKey, setSelectedKey] = useState('1')

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key)
  }

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <ProxyConfigPage />
      case '2':
        return <RuleSettingPage />
      case '3':
        return <ConnectionStatusPage />
      case '4':
        return <LogPage />
      default:
        return <ProxyConfigPage />
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={200}
        >
          <div className="logo" style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1890ff'
          }}>
            {collapsed ? 'PES' : 'Proxy Env Switcher'}
          </div>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              {
                key: '1',
                icon: <SettingOutlined />,
                label: '代理配置',
              },
              {
                key: '2',
                icon: <BorderOutlined />,
                label: '规则设置',
              },
              {
                key: '3',
                icon: <LinkOutlined />,
                label: '连接状态',
              },
              {
                key: '4',
                icon: <LogoutOutlined />,
                label: '日志记录',
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: '#fff', display: 'flex', alignItems: 'center' }}>
            <div style={{ padding: '0 24px' }} onClick={toggleCollapsed}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <Title level={4} style={{ margin: 0, marginLeft: 16 }}>Proxy Env Switcher</Title>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default App