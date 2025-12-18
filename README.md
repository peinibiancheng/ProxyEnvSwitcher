# ProxyEnvSwitcher

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-Windows-blue.svg)](https://github.com/peinibiancheng/ProxyEnvSwitcher)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/peinibiancheng/ProxyEnvSwitcher/pulls)

## 📖 Description / 项目简介

**ProxyEnvSwitcher** is a lightweight proxy management tool designed to simplify proxy configuration on Windows (with Mac support planned). It provides one-click proxy switching, automated profile management, and customizable rules—perfect for developers who work across different network environments. No command-line expertise required; the intuitive UI makes setup effortless.

**ProxyEnvSwitcher** 是一款轻量级代理管理工具，现支持 Windows 平台（Mac 支持即将推出）。它提供一键切换代理、自动化配置文件管理以及自定义规则功能，非常适合在不同网络环境中工作的开发者。无需掌握命令行知识，直观的用户界面让配置变得简单高效。

---

## ✨ Features / 主要特性

### One-Click Proxy Switching / 一键切换代理
Instantly switch between different proxy configurations without manual editing of system settings.

无需手动修改系统设置，即可在不同代理配置之间即时切换。

### Automated Profile Management / 自动化配置文件
Save multiple proxy profiles and switch between them effortlessly. Perfect for developers who work from different locations or need to switch between corporate and home networks.

保存多个代理配置文件，轻松切换。非常适合在不同地点工作或需要在公司网络和家庭网络之间切换的开发者。

### Custom Rules / 自定义规则
Define custom rules for when to enable or disable proxies based on your network conditions or application requirements.

根据网络条件或应用程序需求，定义何时启用或禁用代理的自定义规则。

### User-Friendly Interface / 友好的用户界面
An intuitive graphical interface that doesn't require command-line knowledge, making proxy management accessible to everyone.

直观的图形界面，无需命令行知识，让每个人都能轻松管理代理。

### Lightweight & Fast / 轻量且快速
Minimal resource usage with quick response times, ensuring it doesn't slow down your system.

最小化资源占用，快速响应，确保不会拖慢您的系统。

---

## 🚀 Installation / 安装

### Windows

#### Download the Latest Release / 下载最新版本
1. Go to the [Releases](https://github.com/peinibiancheng/ProxyEnvSwitcher/releases) page
2. Download the latest `.exe` installer for Windows
3. Run the installer and follow the on-screen instructions

1. 访问 [Releases](https://github.com/peinibiancheng/ProxyEnvSwitcher/releases) 页面
2. 下载最新的 Windows `.exe` 安装程序
3. 运行安装程序并按照屏幕提示操作

#### Build from Source / 从源码构建

**Prerequisites / 系统要求**

1. **Node.js**: Version 18.0 or higher / 版本 18.0 或更高版本
2. **pnpm**: Recommended package manager / 推荐的包管理器
   ```bash
   npm install -g pnpm
   ```
3. **Rust**: Version 1.70.0 or higher with rustup / 版本 1.70.0 或更高版本，包含 rustup
   ```bash
   # Install Rust / 安装 Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # On Windows, use the installer from rustup.rs
   # 在 Windows 上，请使用 rustup.rs 的安装程序
   ```

**Development Setup / 开发环境设置**

```bash
# Clone the repository / 克隆仓库
git clone https://github.com/peinibiancheng/ProxyEnvSwitcher.git
cd ProxyEnvSwitcher

# Install dependencies / 安装依赖
pnpm install

# Start development server / 启动开发服务器
pnpm tauri dev
```

**Available Scripts / 可用脚本**

```bash
# Development / 开发
pnpm tauri dev          # Start the app in development mode / 以开发模式启动应用
pnpm dev                # Start only the frontend dev server / 仅启动前端开发服务器

# Building / 构建
pnpm tauri build        # Build the application for production / 构建生产版本应用
pnpm build              # Build only the frontend / 仅构建前端

# Code Quality / 代码质量
pnpm lint               # Run ESLint / 运行 ESLint
pnpm preview            # Preview the built frontend / 预览构建的前端

# Tauri CLI / Tauri 命令行
pnpm tauri <command>    # Run any Tauri CLI command / 运行任何 Tauri CLI 命令
```

**Development Workflow / 开发工作流**

1. **Start Development / 启动开发**:
   ```bash
   pnpm tauri dev
   ```
   This will start both the frontend development server and the Tauri backend, opening the application in a new window.
   
   这将启动前端开发服务器和 Tauri 后端，并在新窗口中打开应用程序。

2. **Hot Reload / 热重载**:
   - Frontend changes automatically reload / 前端更改自动重载
   - Rust backend changes require manual restart / Rust 后端更改需要手动重启

3. **Building for Production / 构建生产版本**:
   ```bash
   pnpm tauri build
   ```
   The built application will be in `src-tauri/target/release/bundle/` directory.
   
   构建的应用程序将在 `src-tauri/target/release/bundle/` 目录中。

**Troubleshooting / 故障排除**

- **Common Issues / 常见问题**:
  - If you encounter permission errors on Windows, run as Administrator / 如果在 Windows 上遇到权限错误，请以管理员身份运行
  - Make sure all dependencies are installed with `pnpm install` / 确保使用 `pnpm install` 安装所有依赖
  - For Rust-related errors, ensure your Rust toolchain is up to date / 对于 Rust 相关错误，请确保您的 Rust 工具链是最新的

- **Getting Help / 获取帮助**:
  - Check the [Issues](https://github.com/peinibiancheng/ProxyEnvSwitcher/issues) page
  - Start a [Discussion](https://github.com/peinibiancheng/ProxyEnvSwitcher/discussions)

### macOS (Coming Soon) / macOS（即将推出）
Mac support is currently under development and will be available in a future release.

Mac 支持目前正在开发中，将在未来版本中提供。

---

## 📚 Usage / 使用指南

### Getting Started / 快速开始

#### 1. Launch the Application / 启动应用程序
After installation, launch ProxyEnvSwitcher from your Start menu or desktop shortcut.

安装完成后，从开始菜单或桌面快捷方式启动 ProxyEnvSwitcher。

#### 2. Create a Proxy Profile / 创建代理配置文件
- Click on "New Profile" / "新建配置文件"
- Enter a profile name (e.g., "Office Proxy", "Home Network") / 输入配置文件名称（例如："办公室代理"、"家庭网络"）
- Configure the proxy settings:
  - Proxy server address / 代理服务器地址
  - Port / 端口
  - Authentication (if required) / 认证信息（如需要）
  - Bypass list (domains that should not use proxy) / 绕过列表（不使用代理的域名）

配置代理设置：
  - 代理服务器地址
  - 端口号
  - 认证信息（如果需要）
  - 绕过列表（不需要使用代理的域名）

#### 3. Switch Between Profiles / 在配置文件间切换
Simply select a profile from the dropdown menu and click "Apply" to activate it. The proxy settings will be updated system-wide instantly.

只需从下拉菜单中选择一个配置文件，然后点击"应用"即可激活。代理设置将立即在系统范围内更新。

#### 4. Disable Proxy / 禁用代理
Click the "Disable Proxy" button to quickly disable all proxy settings and use direct internet connection.

点击"禁用代理"按钮可快速禁用所有代理设置，使用直连网络。

---

## ⚙️ Configuration / 配置说明

### Proxy Settings / 代理设置

ProxyEnvSwitcher supports the following proxy configurations:

ProxyEnvSwitcher 支持以下代理配置：

- **HTTP Proxy** / **HTTP 代理**: Standard web traffic proxy
- **HTTPS Proxy** / **HTTPS 代理**: Secure web traffic proxy
- **SOCKS Proxy** / **SOCKS 代理**: SOCKS4/SOCKS5 proxy support
- **FTP Proxy** / **FTP 代理**: FTP traffic proxy

### Bypass List / 绕过列表

You can specify domains or IP addresses that should bypass the proxy and connect directly:

您可以指定应绕过代理并直接连接的域名或 IP 地址：

- Use semicolons (`;`) to separate multiple entries / 使用分号 (`;`) 分隔多个条目
- Wildcards (`*`) are supported / 支持通配符 (`*`)
- Example / 示例: `localhost;127.0.0.1;*.local;192.168.*`

### Auto-Switch Rules / 自动切换规则

Configure rules to automatically switch proxies based on:

根据以下条件配置自动切换代理的规则：

- Network SSID / 网络 SSID
- IP address range / IP 地址范围
- Time of day / 时间段
- Custom scripts / 自定义脚本

---

## 🛠️ Technical Details / 技术细节

### System Requirements / 系统要求

**Windows**:
- Windows 10 or later / Windows 10 或更高版本
- Administrator privileges for system-wide proxy changes / 需要管理员权限以更改系统级代理

**macOS** (Coming Soon / 即将推出):
- macOS 10.15 (Catalina) or later / macOS 10.15 (Catalina) 或更高版本

### Supported Proxy Protocols / 支持的代理协议

- HTTP / HTTPS
- SOCKS4 / SOCKS5
- PAC (Proxy Auto-Configuration) / PAC（代理自动配置）

---

## 🤝 Contributing / 贡献指南

We welcome contributions from the community! Here's how you can help:

我们欢迎社区贡献！您可以通过以下方式提供帮助：

### How to Contribute / 如何贡献

1. Fork the repository / Fork 此仓库
2. Create a feature branch (`git checkout -b feature/AmazingFeature`) / 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`) / 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`) / 推送到分支 (`git push origin feature/AmazingFeature`)
5. Open a Pull Request / 开启 Pull Request

### Areas We Need Help / 我们需要帮助的领域

- **Testing**: Help test on different Windows versions / 在不同 Windows 版本上进行测试
- **macOS Development**: Assist with macOS port / 协助开发 macOS 版本
- **Documentation**: Improve documentation and add translations / 改进文档并添加翻译
- **Bug Reports**: Report any issues you encounter / 报告您遇到的任何问题
- **Feature Requests**: Suggest new features / 建议新功能

### Code of Conduct / 行为准则

Please be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive community.

请在所有互动中保持尊重和建设性态度。我们致力于维护一个友好包容的社区。

---

## 🗺️ Roadmap / 发展路线图

### Version 1.0 (Current Focus) / 版本 1.0（当前重点）
- [x] Basic proxy switching functionality / 基本代理切换功能
- [x] Profile management / 配置文件管理
- [ ] Windows system tray integration / Windows 系统托盘集成
- [ ] Auto-start with Windows / Windows 开机自启动
- [ ] Import/Export profiles / 导入/导出配置文件

### Version 1.5 (Planned) / 版本 1.5（计划中）
- [ ] macOS support / macOS 支持
- [ ] Auto-switch based on network SSID / 基于网络 SSID 自动切换
- [ ] PAC file support / PAC 文件支持
- [ ] Network diagnostics tools / 网络诊断工具
- [ ] Dark mode / 深色模式

### Version 2.0 (Future) / 版本 2.0（未来）
- [ ] Linux support / Linux 支持
- [ ] Cloud sync for profiles / 配置文件云同步
- [ ] Advanced rule engine / 高级规则引擎
- [ ] API for third-party integration / 第三方集成 API
- [ ] Browser extension support / 浏览器扩展支持

---

## ❓ FAQ / 常见问题

### Q: Does ProxyEnvSwitcher require administrator privileges? / ProxyEnvSwitcher 需要管理员权限吗？
**A**: Yes, administrator privileges are required to modify system-wide proxy settings on Windows. / 是的，在 Windows 上修改系统级代理设置需要管理员权限。

### Q: Can I use this with VPN software? / 我可以与 VPN 软件一起使用吗？
**A**: Yes, ProxyEnvSwitcher works alongside VPN software. However, be aware that VPN and proxy settings may interact in complex ways. / 可以，ProxyEnvSwitcher 可以与 VPN 软件配合使用。但请注意，VPN 和代理设置可能以复杂的方式相互作用。

### Q: Will this work with all applications? / 这适用于所有应用程序吗？
**A**: Most applications that respect system proxy settings will work. Some applications have their own proxy settings that may need to be configured separately. / 大多数遵循系统代理设置的应用程序都可以工作。某些应用程序有自己的代理设置，可能需要单独配置。

### Q: Is my proxy authentication data stored securely? / 我的代理认证数据是否安全存储？
**A**: Yes, all sensitive data including passwords are encrypted using Windows Data Protection API (DPAPI) and stored locally on your machine. / 是的，所有敏感数据包括密码都使用 Windows 数据保护 API (DPAPI) 加密，并存储在您的本地计算机上。

### Q: When will macOS support be available? / macOS 支持何时可用？
**A**: macOS support is currently in the planning phase. Follow our repository for updates. / macOS 支持目前处于规划阶段。请关注我们的仓库以获取更新。

### Q: Can I run multiple proxy profiles simultaneously? / 我可以同时运行多个代理配置文件吗？
**A**: No, only one proxy profile can be active at a time as it modifies the system-wide proxy settings. / 不可以，一次只能激活一个代理配置文件，因为它会修改系统级代理设置。

---

## 📄 License / 许可证

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

本项目采用 MIT 许可证 - 详情请参见 [LICENSE](LICENSE) 文件。

---

## 🙏 Acknowledgments / 致谢

- Thanks to all contributors who have helped improve this project / 感谢所有帮助改进此项目的贡献者
- Inspired by the need for simple proxy management in development workflows / 灵感来源于开发工作流程中对简单代理管理的需求
- Community feedback and suggestions are always appreciated / 我们始终欢迎社区反馈和建议

---

## 📞 Contact & Support / 联系与支持

- **Issues**: [GitHub Issues](https://github.com/peinibiancheng/ProxyEnvSwitcher/issues)
- **Discussions**: [GitHub Discussions](https://github.com/peinibiancheng/ProxyEnvSwitcher/discussions)
- **Pull Requests**: [GitHub Pull Requests](https://github.com/peinibiancheng/ProxyEnvSwitcher/pulls)

For bug reports, please include:
- Your operating system and version / 您的操作系统及版本
- Steps to reproduce the issue / 复现问题的步骤
- Expected vs actual behavior / 期望行为与实际行为
- Screenshots if applicable / 屏幕截图（如适用）

报告错误时，请包含：
- 您的操作系统及版本
- 复现问题的步骤
- 期望行为与实际行为
- 屏幕截图（如适用）

---

## 🌟 Star History / 星标历史

If you find this project useful, please consider giving it a star! ⭐

如果您觉得这个项目有用，请考虑给它一个星标！⭐

---

**Made with ❤️ by [peinibiancheng](https://github.com/peinibiancheng)**

**由 [peinibiancheng](https://github.com/peinibiancheng) 用 ❤️ 制作**
