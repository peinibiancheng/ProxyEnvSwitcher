# 基于Tauri+React的桌面端代理管理软件技术方案

## 1. 项目架构设计

### 1.1 整体架构
采用Tauri的分层架构设计，分为：
- **前端层**：基于React的用户界面，负责与用户交互
- **中间层**：Tauri的JavaScript API层，负责前后端通信
- **后端层**：Rust编写的核心逻辑，负责代理功能实现

### 1.2 模块化设计
- 采用功能模块化拆分，各模块低耦合高内聚
- 前端采用组件化设计，支持按需加载
- 后端采用Rust的模块化设计，便于维护和扩展

## 2. 技术选型

### 2.1 核心框架
- **Tauri**：v2.0.0（最新稳定版，支持Windows平台）
- **React**：v18.2.0（支持并发渲染，提升性能）

### 2.2 状态管理
- **Zustand**：轻量级状态管理库，替代Redux，减少样板代码
- **React Query**：用于API数据获取和缓存，优化数据管理

### 2.3 UI组件库
- **Ant Design**：v5.0.0+（支持React 18，组件丰富，文档完善）
- **Ant Design Icons**：提供丰富的图标支持

### 2.4 开发工具
- **Vite**：v5.0.0+（前端构建工具，提供快速的开发体验）
- **TypeScript**：v5.0.0+（类型安全，提升代码质量）
- **ESLint** + **Prettier**：代码规范和格式化

### 2.5 后端技术
- **Rust**：1.88.0（与用户已安装版本匹配，安全、高性能）
- **reqwest**：Rust HTTP客户端库
- **serde**：序列化/反序列化库
- **tokio**：异步运行时

## 3. 开发环境配置

### 3.1 Windows开发环境（用户已安装部分依赖）
- ✅ **Rust**：1.88.0（已安装，无需额外配置）
- ✅ **cargo**：1.88.0（已安装，无需额外配置）
- ✅ **rustup**：1.28.2（已安装，无需额外配置）
- **Node.js**：v18.0.0+（LTS版本，需安装）
- **pnpm**：v8.0.0+（推荐使用，速度更快，需安装）
- **Visual Studio Build Tools**：2022（包含C++构建工具，需安装）
- **Git**：2.30.0+（版本控制，需安装）

### 3.2 环境安装步骤
```bash
# 安装Node.js（从官网下载并安装）
# https://nodejs.org/en/download/

# 安装pnpm
npm install -g pnpm

# 安装Visual Studio Build Tools 2022
# 确保勾选"使用C++的桌面开发"选项
# https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/

# 安装Git（从官网下载并安装）
# https://git-scm.com/download/win
```

### 3.3 项目初始化
```bash
# 使用Tauri CLI创建项目
pnpm create tauri-app@latest ProxyEnvSwitcher -- --template react-ts
cd ProxyEnvSwitcher

# 安装依赖
pnpm install
```

### 3.4 开发配置
- **vite.config.ts**：配置Vite构建选项
- **tauri.config.json**：配置Tauri应用基本信息、窗口设置、权限等
- **src-tauri/Cargo.toml**：配置Rust依赖和构建选项

## 4. 核心功能模块划分

### 4.1 代理配置管理
- **功能描述**：管理不同代理服务器的配置信息
- **主要功能**：
  - 新增/编辑/删除代理配置
  - 支持HTTP/HTTPS/SOCKS5等协议
  - 配置导入/导出功能（支持JSON格式）
  - 代理配置快速切换

### 4.2 规则设置
- **功能描述**：设置代理规则，决定哪些流量走代理
- **主要功能**：
  - 支持域名规则、IP规则、CIDR规则
  - 支持白名单/黑名单模式
  - 规则优先级设置
  - 规则导入/导出功能

### 4.3 连接状态监控
- **功能描述**：实时监控代理连接状态
- **主要功能**：
  - 显示当前活跃的代理连接
  - 实时显示网络延迟
  - 连接状态可视化（图表展示）
  - 异常连接告警

### 4.4 日志记录
- **功能描述**：记录软件运行日志和代理请求日志
- **主要功能**：
  - 日志级别设置（DEBUG/INFO/WARN/ERROR）
  - 日志搜索和过滤
  - 日志导出功能
  - 日志自动清理策略

### 4.5 系统托盘功能
- **功能描述**：提供系统托盘操作入口
- **主要功能**：
  - 快速启用/禁用代理
  - 切换代理配置
  - 显示连接状态
  - 快速打开主界面

## 5. 性能优化策略

### 5.1 前端渲染优化
- 使用React.memo和useMemo优化组件渲染
- 采用虚拟列表处理大量数据（如日志列表）
- 实现按需加载，减少初始加载时间
- 使用CSS-in-JS或CSS Modules避免样式冲突

### 5.2 Tauri通信优化
- 使用Tauri的Event API替代频繁的invoke调用
- 优化数据传输格式，减少序列化开销
- 实现批量数据处理，减少通信次数

### 5.3 资源加载优化
- 优化静态资源大小，使用WebP格式图片
- 实现资源预加载和缓存策略
- 减少第三方依赖，只引入必要的库

## 6. 安全措施

### 6.1 前端安全
- 启用Content Security Policy (CSP)
- 防止XSS攻击，对用户输入进行验证和转义
- 使用HTTPS请求外部资源

### 6.2 后端安全
- Rust的内存安全特性，减少内存相关漏洞
- 实现严格的权限控制
- 对敏感数据进行加密存储
- 定期更新依赖，修复安全漏洞

### 6.3 通信安全
- 使用Tauri的安全通信机制，防止中间人攻击
- 对敏感配置数据进行加密传输

## 7. 构建与打包流程

### 7.1 开发构建
```bash
# 开发模式
pnpm tauri dev

# 构建生产版本
pnpm tauri build
```

### 7.2 打包配置
- **tauri.config.json**：配置应用图标、窗口大小、权限等
- **src-tauri/Cargo.toml**：配置构建目标和依赖
- **GitHub Actions**：实现CI/CD自动构建和发布

### 7.3 安装包格式
- **Windows**：生成MSI安装包和便携版EXE文件
- 支持自动更新功能

## 8. 版本控制策略

### 8.1 Git分支管理
- **main**：主分支，用于发布稳定版本
- **develop**：开发分支，用于集成各功能模块
- **feature/xxx**：功能分支，用于开发新功能
- **bugfix/xxx**：修复分支，用于修复bug

### 8.2 版本号规范
- 采用语义化版本号：MAJOR.MINOR.PATCH
- MAJOR：不兼容的API变更
- MINOR：向下兼容的功能性新增
- PATCH：向下兼容的问题修正

## 9. 开发效率提升方案

### 9.1 开发工具配置
- VS Code + Rust Analyzer：提供Rust代码补全和错误检查
- ESLint + Prettier：自动格式化代码，保持代码风格一致
- Git Hooks：使用husky和lint-staged，在提交前进行代码检查

### 9.2 自动化测试
- **前端测试**：使用Vitest + React Testing Library
- **后端测试**：使用Rust的内置测试框架
- **集成测试**：测试前后端交互

### 9.3 文档管理
- 使用TypeScript类型定义作为文档
- 编写必要的API文档和组件文档
- 使用Storybook展示UI组件

## 10. 项目结构

```
ProxyEnvSwitcher/
├── src/                      # 前端代码
│   ├── components/           # React组件
│   ├── hooks/               # 自定义hooks
│   ├── store/               # 状态管理
│   ├── utils/               # 工具函数
│   ├── views/               # 页面组件
│   ├── App.tsx              # 应用入口组件
│   └── main.tsx             # React渲染入口
├── src-tauri/               # Tauri后端代码
│   ├── src/                 # Rust源代码
│   │   ├── main.rs          # 主入口
│   │   ├── proxy/           # 代理核心逻辑
│   │   ├── config/          # 配置管理
│   │   └── utils/           # 工具函数
│   ├── Cargo.toml           # Rust依赖配置
│   └── tauri.conf.json      # Tauri配置
├── public/                  # 静态资源
├── vite.config.ts           # Vite配置
├── package.json             # 前端依赖配置
└── tsconfig.json            # TypeScript配置
```

## 11. 核心功能实现思路

### 11.1 代理配置管理
- 使用Zustand管理代理配置状态
- 前端通过Tauri API与后端通信，实现配置的增删改查
- 配置数据持久化到本地文件

### 11.2 规则设置
- 采用树形结构展示规则
- 支持拖拽调整规则优先级
- 规则匹配算法优化，提升匹配速度

### 11.3 连接状态监控
- 使用WebSocket实时推送连接状态
- 采用图表库（如Recharts）展示连接状态变化
- 实现连接状态的本地缓存，减少网络请求

### 11.4 日志记录
- 前端实现日志的实时展示和搜索
- 后端使用Rust的日志库记录详细日志
- 支持日志的分级管理和自动清理

## 12. 未来扩展方向

- 支持更多代理协议
- 实现代理性能测试功能
- 支持多语言国际化
- 提供更多高级规则设置
- 支持云同步配置
- 实现插件系统，支持功能扩展

以上方案基于最新的技术栈和行业实践，确保了开发效率和最终应用性能的平衡，同时与用户已有的Rust环境兼容，具有良好的扩展性和可维护性。