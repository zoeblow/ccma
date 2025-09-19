import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface ClaudeConfig {
  name: string;
  url: string;
  token: string;
  model?: string;
}

export interface ConfigData {
  configs: { [key: string]: ClaudeConfig };
  current?: string;
  language?: 'zh' | 'en';
}

export class ConfigManager {
  private configDir: string;
  private configFile: string;

  constructor() {
    this.configDir = path.join(os.homedir(), '.ccma');
    this.configFile = path.join(this.configDir, 'config.json');
    this.ensureConfigDir();
  }

  private ensureConfigDir(): void {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  private readConfig(): ConfigData {
    if (!fs.existsSync(this.configFile)) {
      return { configs: {}, language: 'zh' };
    }

    try {
      const content = fs.readFileSync(this.configFile, 'utf8');
      const data = JSON.parse(content);
      if (!data.language) {
        data.language = 'zh';
      }
      return data;
    } catch (error) {
      console.error('Error reading config file:', error);
      return { configs: {}, language: 'zh' };
    }
  }

  private writeConfig(data: ConfigData): void {
    try {
      fs.writeFileSync(this.configFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing config file:', error);
      throw error;
    }
  }

  addConfig(name: string, url: string, token: string, model?: string): void {
    const data = this.readConfig();
    const config: ClaudeConfig = { name, url, token };
    if (model) {
      config.model = model;
    }
    data.configs[name] = config;
    this.writeConfig(data);
  }

  deleteConfig(name: string): boolean {
    const data = this.readConfig();
    if (!data.configs[name]) {
      return false;
    }

    delete data.configs[name];

    if (data.current === name) {
      data.current = undefined;
    }

    this.writeConfig(data);
    return true;
  }

  useConfig(name: string): boolean {
    const data = this.readConfig();
    if (!data.configs[name]) {
      return false;
    }

    data.current = name;
    this.writeConfig(data);
    this.setEnvironmentVariables(data.configs[name]);
    return true;
  }

  getCurrentConfig(): ClaudeConfig | null {
    const data = this.readConfig();
    if (!data.current || !data.configs[data.current]) {
      return null;
    }
    return data.configs[data.current];
  }

  listConfigs(): { configs: ClaudeConfig[]; current?: string } {
    const data = this.readConfig();
    const configs = Object.values(data.configs);
    return { configs, current: data.current };
  }

  getConfigNames(): string[] {
    const data = this.readConfig();
    return Object.keys(data.configs);
  }

  clearConfigs(): void {
    const data = this.readConfig();
    this.writeConfig({ configs: {}, language: data.language });
  }

  setLanguage(language: 'zh' | 'en'): void {
    const data = this.readConfig();
    data.language = language;
    this.writeConfig(data);
  }

  getLanguage(): 'zh' | 'en' {
    const data = this.readConfig();
    return data.language || 'zh';
  }

  formatToken(token: string): string {
    if (token.length <= 20) {
      return token;
    }
    const prefix = token.substring(0, 10);
    const suffix = token.substring(token.length - 10);
    return `${prefix}...${suffix}`;
  }

  private setEnvironmentVariables(config: ClaudeConfig): void {
    const localClaudeDir = path.join(process.cwd(), '.claude');
    const localSettingsFile = path.join(localClaudeDir, 'settings.local.json');

    if (!fs.existsSync(localClaudeDir)) {
      fs.mkdirSync(localClaudeDir, { recursive: true });
    }

    // Read existing settings or create new structure
    let settings: any = {
      env: {},
      permissions: {
        allow: [],
        deny: []
      }
    };

    if (fs.existsSync(localSettingsFile)) {
      try {
        const existingContent = fs.readFileSync(localSettingsFile, 'utf8');
        const existingSettings = JSON.parse(existingContent);
        // Preserve existing structure and merge
        const newEnv = {
          ...existingSettings.env,
          ANTHROPIC_BASE_URL: config.url,
          ANTHROPIC_AUTH_TOKEN: config.token
        };

        // Handle ANTHROPIC_MODEL - add if model exists, remove if it doesn't
        if (config.model) {
          newEnv.ANTHROPIC_MODEL = config.model;
        } else {
          delete newEnv.ANTHROPIC_MODEL;
        }

        settings = {
          ...existingSettings,
          env: newEnv
        };
      } catch (error) {
        console.error('Error reading existing settings, creating new file:', error);
        settings.env = {
          ANTHROPIC_BASE_URL: config.url,
          ANTHROPIC_AUTH_TOKEN: config.token
        };
        if (config.model) {
          settings.env.ANTHROPIC_MODEL = config.model;
        }
      }
    } else {
      settings.env = {
        ANTHROPIC_BASE_URL: config.url,
        ANTHROPIC_AUTH_TOKEN: config.token
      };
      if (config.model) {
        settings.env.ANTHROPIC_MODEL = config.model;
      }
    }

    try {
      fs.writeFileSync(localSettingsFile, JSON.stringify(settings, null, 2));
    } catch (error) {
      console.error('Error writing local settings:', error);
      throw error;
    }
  }

  displayEnvironmentInstructions(config: ClaudeConfig, i18n?: any): void {
    const isWindows = os.platform() === 'win32';
    const formattedToken = this.formatToken(config.token);

    // Set UTF-8 encoding for Windows to avoid Chinese character issues
    if (isWindows && process.stdout.isTTY) {
      process.stdout.write('\x1b]0;ccma\x07'); // Set window title
    }

    if (i18n) {
      console.log(`\n${i18n.t('env.setInFile')}`);
      console.log(`\n${i18n.t('env.manualInstructions')}`);

      if (isWindows) {
        console.log(`\n${i18n.t('env.powershell')}`);
        console.log(`$env:ANTHROPIC_BASE_URL="${config.url}"`);
        console.log(`$env:ANTHROPIC_AUTH_TOKEN="${formattedToken}"`);
        if (config.model) {
          console.log(`$env:ANTHROPIC_MODEL="${config.model}"`);
        }

        console.log(`\n${i18n.t('env.cmd')}`);
        console.log(`set ANTHROPIC_BASE_URL=${config.url}`);
        console.log(`set ANTHROPIC_AUTH_TOKEN=${formattedToken}`);
        if (config.model) {
          console.log(`set ANTHROPIC_MODEL=${config.model}`);
        }
      } else {
        console.log(`\n${i18n.t('env.bash')}`);
        console.log(`export ANTHROPIC_BASE_URL="${config.url}"`);
        console.log(`export ANTHROPIC_AUTH_TOKEN="${formattedToken}"`);
        if (config.model) {
          console.log(`export ANTHROPIC_MODEL="${config.model}"`);
        }
      }

      // Global environment variable instructions
      console.log(`\n${i18n.t('env.globalInstructions')}`);

      if (isWindows) {
        console.log(`\n${i18n.t('env.globalPowershell')}`);
        console.log(`[Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "${config.url}", "User")`);
        console.log(`[Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", "${formattedToken}", "User")`);
        if (config.model) {
          console.log(`[Environment]::SetEnvironmentVariable("ANTHROPIC_MODEL", "${config.model}", "User")`);
        }

        console.log(`\n${i18n.t('env.globalCmd')}`);
        console.log(`setx ANTHROPIC_BASE_URL "${config.url}"`);
        console.log(`setx ANTHROPIC_AUTH_TOKEN "${formattedToken}"`);
        if (config.model) {
          console.log(`setx ANTHROPIC_MODEL "${config.model}"`);
        }
      } else {
        console.log(`\n${i18n.t('env.globalBash')}`);
        console.log(`echo 'export ANTHROPIC_BASE_URL="${config.url}"' >> ~/.bashrc`);
        console.log(`echo 'export ANTHROPIC_AUTH_TOKEN="${formattedToken}"' >> ~/.bashrc`);
        if (config.model) {
          console.log(`echo 'export ANTHROPIC_MODEL="${config.model}"' >> ~/.bashrc`);
        }
        console.log(`echo 'export ANTHROPIC_BASE_URL="${config.url}"' >> ~/.zshrc`);
        console.log(`echo 'export ANTHROPIC_AUTH_TOKEN="${formattedToken}"' >> ~/.zshrc`);
        if (config.model) {
          console.log(`echo 'export ANTHROPIC_MODEL="${config.model}"' >> ~/.zshrc`);
        }
      }
    } else {
      // Fallback to Chinese (default)
      console.log('\n🔧 环境变量已设置在 .claude/settings.local.json 中');
      console.log('\n📝 如需在当前终端临时使用，请运行:');

      if (isWindows) {
        console.log('\n💙 PowerShell:');
        console.log(`$env:ANTHROPIC_BASE_URL="${config.url}"`);
        console.log(`$env:ANTHROPIC_AUTH_TOKEN="${formattedToken}"`);
        if (config.model) {
          console.log(`$env:ANTHROPIC_MODEL="${config.model}"`);
        }

        console.log('\n⚫ 命令提示符:');
        console.log(`set ANTHROPIC_BASE_URL=${config.url}`);
        console.log(`set ANTHROPIC_AUTH_TOKEN=${formattedToken}`);
        if (config.model) {
          console.log(`set ANTHROPIC_MODEL=${config.model}`);
        }
      } else {
        console.log('\n🐧 bash/zsh:');
        console.log(`export ANTHROPIC_BASE_URL="${config.url}"`);
        console.log(`export ANTHROPIC_AUTH_TOKEN="${formattedToken}"`);
        if (config.model) {
          console.log(`export ANTHROPIC_MODEL="${config.model}"`);
        }
      }

      console.log('\n🌍 如需全局使用，请设置系统环境变量 (需要重启终端):');

      if (isWindows) {
        console.log('\n💙 PowerShell (全局):');
        console.log(`setx ANTHROPIC_BASE_URL "${config.url}"`);
        console.log(`setx ANTHROPIC_AUTH_TOKEN "${formattedToken}"`);
        if (config.model) {
          console.log(`setx ANTHROPIC_MODEL "${config.model}"`);
        }
      } else {
        console.log('\n🐧 bash/zsh (全局):');
        console.log(`echo 'export ANTHROPIC_BASE_URL="${config.url}"' >> ~/.bashrc`);
        console.log(`echo 'export ANTHROPIC_AUTH_TOKEN="${formattedToken}"' >> ~/.bashrc`);
        if (config.model) {
          console.log(`echo 'export ANTHROPIC_MODEL="${config.model}"' >> ~/.bashrc`);
        }
      }
    }
  }
}