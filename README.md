# 🤖 CCMA - Claude Code Manager

> **简体中文** | [English](#english-version)

一个强大的 CLI 工具，用于管理多个 Claude Code 配置和 API 端点。轻松在不同的 Claude Code 环境之间切换！

[![npm version](https://img.shields.io/npm/v/ccma.svg)](https://www.npmjs.com/package/ccma)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js->=16.0.0-green.svg)](https://nodejs.org/)

## ✨ 特性

- 🔧 **多配置管理** - 存储和管理多个 Claude Code 配置
- 🚀 **快速切换** - 一键切换不同的 API 端点和认证令牌
- 🌍 **跨平台支持** - 支持 Windows、macOS 和 Linux
- 💡 **简单易用** - 直观的命令行界面
- 🔒 **安全存储** - 本地安全存储敏感配置信息
- ⚡ **即时生效** - 配置更改立即生效，无需重启

## 📦 安装

### 全局安装 (推荐)

```bash
npm install -g ccma
```

### 使用 yarn

```bash
yarn global add ccma
```

### 验证安装

```bash
ccma --version
```

## 🚀 快速开始

### 1. 添加第一个配置

```bash
# 添加默认的 Claude Code 配置
ccma add default https://api.anthropic.com your-auth-token-here

# 添加自定义端点配置
ccma add custom https://your-custom-endpoint.com your-custom-token

# 添加配置并指定模型
ccma add production https://api.anthropic.com your-token claude-3-5-sonnet
```

### 2. 查看所有配置

```bash
ccma list
# 或者
ccma ls
```

输出示例：
```
📋 Claude Code 配置列表:
  * default 🌟 (当前)
    🔗 https://custom.com | 🔑 sk-tqbkTu8...LhKKJ4Ifcs

  custom
    🔗 https://api.anthropic.com | 🔑 sk-1234567...7890abcdef

  production
    🔗 https://api.anthropic.com | 🔑 sk-1234567...7890abcdef | 🤖 claude-3-5-sonnet
```

### 3. 切换配置

```bash
# 切换到指定配置
ccma use custom

# 查看当前配置
ccma current
```

## 💡 模型参数说明

CCMA 支持在添加配置时指定可选的模型参数。当配置包含模型信息时，CCMA 会自动设置 `ANTHROPIC_MODEL` 环境变量。

### 支持的模型

- `claude-3-haiku` - 最快速、最经济的模型
- `claude-3-sonnet` - 平衡性能与成本的模型
- `claude-3-5-sonnet` - 最新、最强大的模型
- `claude-3-opus` - 最高质量的模型

### 使用示例

```bash
# 添加配置时指定模型
ccma add dev https://api.anthropic.com your-token claude-3-haiku

# 切换配置时，ANTHROPIC_MODEL 环境变量会自动设置
ccma use dev
# 环境变量中将包含：ANTHROPIC_MODEL=claude-3-haiku

# 如果配置没有指定模型，ANTHROPIC_MODEL 变量会被移除
ccma add simple https://api.anthropic.com your-token
ccma use simple
# 环境变量中不会包含 ANTHROPIC_MODEL
```

## 📖 完整命令参考

| 命令 | 描述 | 示例 |
|------|------|------|
| `ccma add <name> <url> <token> [model]` | 添加新配置 | `ccma add prod https://api.anthropic.com sk-xxx claude-3-5-sonnet` |
| `ccma del <name>` | 删除配置 | `ccma del old-config` |
| `ccma use [name]` | 切换配置 | `ccma use production` |
| `ccma list` / `ccma ls` | 列出所有配置 | `ccma ls` |
| `ccma current` | 显示当前配置 | `ccma current` |
| `ccma clear` | 清除所有配置 | `ccma clear` |
| `ccma --version` / `ccma -V` | 显示版本 | `ccma -V` |
| `ccma --help` / `ccma -h` | 显示帮助 | `ccma -h` |

## 🎯 使用场景

### 开发团队协作

```bash
# 开发环境
ccma add dev https://dev-api.anthropic.com dev-token-123 claude-3-haiku

# 测试环境
ccma add test https://test-api.anthropic.com test-token-456 claude-3-sonnet

# 生产环境
ccma add prod https://api.anthropic.com prod-token-789 claude-3-5-sonnet

# 快速切换环境
ccma use dev    # 开发时（使用 haiku 节省成本）
ccma use test   # 测试时（使用 sonnet 平衡性能）
ccma use prod   # 部署时（使用 claude-3-5-sonnet 最佳性能）
```

### 多项目管理

```bash
# 项目 A 配置（使用标准模型）
ccma add project-a https://api.anthropic.com token-a claude-3-sonnet

# 项目 B 配置（使用高级模型）
ccma add project-b https://custom-endpoint.com token-b claude-3-5-sonnet

# 在项目间切换
cd /path/to/project-a && ccma use project-a
cd /path/to/project-b && ccma use project-b
```

### 演示脚本

```bash
#!/bin/bash
# demo.sh - CCMA 演示脚本

echo "🚀 CCMA 演示开始..."

# 添加演示配置
echo "📝 添加演示配置..."
ccma add demo-dev https://dev.anthropic.com demo-dev-token claude-3-haiku
ccma add demo-prod https://api.anthropic.com demo-prod-token claude-3-5-sonnet

# 显示配置列表
echo "📋 当前配置列表:"
ccma list

# 切换到开发环境
echo "🔄 切换到开发环境..."
ccma use demo-dev
echo "✅ 当前配置: $(ccma current)"

# 切换到生产环境
echo "🔄 切换到生产环境..."
ccma use demo-prod
echo "✅ 当前配置: $(ccma current)"

echo "🎉 演示完成!"
```

## ⚙️ 配置文件

CCMA 使用以下优先级来管理配置：

1. **本地配置文件** (最高优先级): `.claude/settings.local.json`
2. **环境变量**: `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_MODEL`
3. **默认配置** (最低优先级)

### 配置文件位置

```bash
# Windows
%USERPROFILE%\.claude\settings.local.json

# macOS/Linux
~/.claude/settings.local.json
```

### 配置文件格式

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.anthropic.com",
    "ANTHROPIC_AUTH_TOKEN": "your-auth-token-here",
    "ANTHROPIC_MODEL": "claude-3-5-sonnet"
  },
  "permissions": {
    "allow": [
    ],
    "deny": []
  }
}
```

## 🛠️ 开发

### 克隆项目

```bash
git clone https://github.com/zoeblow/ccma.git
cd ccma
yarn install
yarn link
```

### 安装依赖

```bash
npm install
```

### 开发命令

```bash
# 开发模式
npm run dev

# 构建项目
npm run build

# 运行测试
npm test

# 代码检查
npm run lint

# 格式化代码
npm run format

# 类型检查
npm run typecheck
```

### 本地测试

```bash
# 链接到全局
npm link

# 测试命令
ccma --help
```

## 🤝 贡献

欢迎贡献代码！请先阅读 [贡献指南](CONTRIBUTING.md)。

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🐛 问题反馈

如果遇到问题或有建议，请在 [GitHub Issues](https://github.com/zoeblow/ccma/issues) 中反馈。

---

## English Version

# 🤖 CCMA - Claude Code Manager

A powerful CLI tool for managing multiple Claude Code configurations and API endpoints. Easily switch between different Claude Code environments!

## ✨ Features

- 🔧 **Multi-Configuration Management** - Store and manage multiple Claude Code configurations
- 🚀 **Quick Switching** - Switch between different API endpoints and auth tokens with one command
- 🌍 **Cross-Platform** - Support for Windows, macOS, and Linux
- 💡 **Easy to Use** - Intuitive command-line interface
- 🔒 **Secure Storage** - Securely store sensitive configuration information locally
- ⚡ **Instant Effect** - Configuration changes take effect immediately

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g ccma
```

### Using yarn

```bash
yarn global add ccma
```

### Verify Installation

```bash
ccma --version
```

## 🚀 Quick Start

### 1. Add Your First Configuration

```bash
# Add default Claude Code configuration
ccma add default https://api.anthropic.com your-auth-token-here

# Add custom endpoint configuration
ccma add custom https://your-custom-endpoint.com your-custom-token

# Add configuration with model specification
ccma add production https://api.anthropic.com your-token claude-3-5-sonnet
```

### 2. View All Configurations

```bash
ccma list
# or
ccma ls
```

### 3. Switch Configuration

```bash
# Switch to specified configuration
ccma use custom

# View current configuration
ccma current
```

## 💡 Model Parameter

CCMA supports specifying an optional model parameter when adding configurations. When a configuration includes model information, CCMA automatically sets the `ANTHROPIC_MODEL` environment variable.

### Supported Models

- `claude-3-haiku` - Fastest and most economical model
- `claude-3-sonnet` - Balanced performance and cost model
- `claude-3-5-sonnet` - Latest and most powerful model
- `claude-3-opus` - Highest quality model

### Usage Examples

```bash
# Add configuration with model specification
ccma add dev https://api.anthropic.com your-token claude-3-haiku

# When switching configurations, ANTHROPIC_MODEL environment variable is automatically set
ccma use dev
# Environment variables will include: ANTHROPIC_MODEL=claude-3-haiku

# If configuration doesn't specify a model, ANTHROPIC_MODEL variable will be removed
ccma add simple https://api.anthropic.com your-token
ccma use simple
# Environment variables will not include ANTHROPIC_MODEL
```

## 📖 Command Reference

| Command | Description | Example |
|---------|-------------|---------|
| `ccma add <name> <url> <token> [model]` | Add new configuration | `ccma add prod https://api.anthropic.com sk-xxx claude-3-5-sonnet` |
| `ccma del <name>` | Delete configuration | `ccma del old-config` |
| `ccma use [name]` | Switch configuration | `ccma use production` |
| `ccma list` / `ccma ls` | List all configurations | `ccma ls` |
| `ccma current` | Show current configuration | `ccma current` |
| `ccma clear` | Clear all configurations | `ccma clear` |
| `ccma --version` / `ccma -V` | Show version | `ccma -V` |
| `ccma --help` / `ccma -h` | Show help | `ccma -h` |

## 🛠️ Development

### Clone the Repository

```bash
git clone https://github.com/zoeblow/ccma.git
cd ccma
```

### Install Dependencies

```bash
npm install
```

### Development Commands

```bash
# Development mode
npm run dev

# Build project
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run typecheck
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues

If you encounter any issues or have suggestions, please report them on [GitHub Issues](https://github.com/zoeblow/ccma/issues).