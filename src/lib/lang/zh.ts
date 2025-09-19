export const zh = {
  // Commands descriptions
  program: {
    description: "Claude Code 管理器 - 管理多个 Claude Code 配置",
  },
  commands: {
    add: {
      description: "添加一个新配置",
      success: "✅ 配置 '{name}' 添加成功",
      error: "❌ 添加配置时出错: {error}",
    },
    del: {
      description: "删除一个配置",
      success: "✅ 配置 '{name}' 删除成功",
      notFound: "❌ 配置 '{name}' 不存在",
      error: "❌ 删除配置时出错: {error}",
    },
    use: {
      description: "切换到一个配置（如果未提供名称则显示交互式选择）",
      success: "✅ 已切换到配置 '{name}'",
      notFound: "❌ 配置 '{name}' 不存在",
      error: "❌ 切换配置时出错: {error}",
      noConfigs:
        "⚠️  没有可用的配置。使用以下命令添加一个: ccma add <name> <url> <token>",
      available: "📋 可用的配置:",
    },
    list: {
      description: "列出所有配置",
      error: "❌ 列出配置时出错: {error}",
      noConfigs:
        "⚠️  未找到配置。使用以下命令添加一个: ccma add <name> <url> <token>",
      available: "📋 可用的配置:",
      current: " 🌟 (当前)",
    },
    current: {
      description: "显示当前活动的配置",
      error: "❌ 获取当前配置时出错: {error}",
      active: "🌟 当前配置: {name}",
      none: "⚠️  当前没有活动的配置",
      useHint: "💡 使用: ccma use <name> 来激活一个配置",
    },
    clear: {
      description: "清空所有配置",
      success: "✅ 所有配置已清空",
      error: "❌ 清空配置时出错: {error}",
    },
    lang: {
      description: "设置语言 (zh|en)",
      success: "✅ 语言已设置为: {lang}",
      error: "❌ 设置语言时出错: {error}",
      invalid: "❌ 无效的语言选项。支持的语言: zh, en",
      current: "🌐 当前语言: {lang}",
    },
    completion: {
      description: "显示可用配置名称以帮助命令补全",
      instructions: "💡 命令补全助手",
      usage: "用法:",
      showDelConfigs: "显示可删除的配置名称",
      showUseConfigs: "显示可使用的配置名称",
      availableConfigs: "📋 可用的配置名称:",
      noConfigs: "⚠️  当前没有保存的配置",
      note: "💡 提示: 您可以复制上面的配置名称来快速输入命令",
      error: "❌ 获取配置信息时出错: {error}",
    },
  },

  // Environment variables
  env: {
    setInFile: "🔧 环境变量已设置在 .claude/settings.local.json 中",
    manualInstructions: "📝 如需在当前终端临时使用，请运行:",
    globalInstructions: "🌍 如需全局使用，请设置系统环境变量 (需要重启终端):",
    powershell: "💙 PowerShell:",
    cmd: "⚫ 命令提示符:",
    bash: "🐧 bash/zsh:",
    globalPowershell: "💙 PowerShell (全局):",
    globalCmd: "⚫ 命令提示符 (全局):",
    globalBash: "🐧 bash/zsh (全局):"
  },

  // Common
  url: "🔗 URL: {url}",
  token: "🔑 令牌: {token}",
  urlAndToken: "    🔗 {url} | 🔑 {token}",
  urlTokenAndModel: "    🔗 {url} | 🔑 {token} | 🤖 {model}",

  // Errors
  errors: {
    packageNotFound: {
      title: "❌ 未找到 Claude Code",
      message: "CCMA 需要官方的 @anthropic-ai/claude-code 包才能正常工作。",
      installCommand: "📦 请先安装官方包:",
      moreInfo: "📚 更多信息请访问:",
    }
  }
};
