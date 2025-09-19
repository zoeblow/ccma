export const en = {
  // Commands descriptions
  program: {
    description: 'Claude Code Manager - Manage multiple Claude Code configurations'
  },
  commands: {
    add: {
      description: 'Add a new configuration',
      success: '✅ Configuration \'{name}\' added successfully',
      error: '❌ Error adding configuration: {error}'
    },
    del: {
      description: 'Delete a configuration',
      success: '✅ Configuration \'{name}\' deleted successfully',
      notFound: '❌ Configuration \'{name}\' not found',
      error: '❌ Error deleting configuration: {error}'
    },
    use: {
      description: 'Switch to a configuration (interactive if no name provided)',
      success: '✅ Switched to configuration \'{name}\'',
      notFound: '❌ Configuration \'{name}\' not found',
      error: '❌ Error switching configuration: {error}',
      noConfigs: '⚠️  No configurations available. Add one with: ccma add <name> <url> <token>',
      available: '📋 Available configurations:'
    },
    list: {
      description: 'List all configurations',
      error: '❌ Error listing configurations: {error}',
      noConfigs: '⚠️  No configurations found. Add one with: ccma add <name> <url> <token>',
      available: '📋 Available configurations:',
      current: ' 🌟 (current)'
    },
    current: {
      description: 'Show current active configuration',
      error: '❌ Error getting current configuration: {error}',
      active: '🌟 Current configuration: {name}',
      none: '⚠️  No configuration is currently active',
      useHint: '💡 Use: ccma use <name> to activate a configuration'
    },
    clear: {
      description: 'Clear all configurations',
      success: '✅ All configurations cleared',
      error: '❌ Error clearing configurations: {error}'
    },
    lang: {
      description: 'Set language (zh|en)',
      success: '✅ Language set to: {lang}',
      error: '❌ Error setting language: {error}',
      invalid: '❌ Invalid language option. Supported languages: zh, en',
      current: '🌐 Current language: {lang}'
    },
    completion: {
      description: 'Show available configuration names to help with command completion',
      instructions: '💡 Command Completion Helper',
      usage: 'Usage:',
      showDelConfigs: 'Show configuration names for deletion',
      showUseConfigs: 'Show configuration names for usage',
      availableConfigs: '📋 Available configuration names:',
      noConfigs: '⚠️  No saved configurations found',
      note: '💡 Tip: You can copy the configuration names above for quick command input',
      error: '❌ Error getting configuration information: {error}',
    }
  },

  // Environment variables
  env: {
    setInFile: '🔧 Environment variables have been set in .claude/settings.local.json',
    manualInstructions: '📝 To use in current terminal temporarily, run:',
    globalInstructions: '🌍 For global use, set system environment variables (restart terminal required):',
    powershell: '💙 PowerShell:',
    cmd: '⚫ Command Prompt:',
    bash: '🐧 bash/zsh:',
    globalPowershell: '💙 PowerShell (Global):',
    globalCmd: '⚫ Command Prompt (Global):',
    globalBash: '🐧 bash/zsh (Global):'
  },

  // Common
  url: '🔗 URL: {url}',
  token: '🔑 Token: {token}',
  urlAndToken: '    🔗 {url} | 🔑 {token}',
  urlTokenAndModel: '    🔗 {url} | 🔑 {token} | 🤖 {model}',

  // Errors
  errors: {
    packageNotFound: {
      title: '❌ Claude Code Not Found',
      message: 'CCMA requires the official @anthropic-ai/claude-code package to function properly.',
      installCommand: '📦 Please install the official package first:',
      moreInfo: '📚 For more information visit:',
    }
  }
};