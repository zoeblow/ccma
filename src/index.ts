#!/usr/bin/env node

import { Command } from 'commander';
import { ConfigManager } from './lib/config.js';
import { I18n } from './lib/lang/index.js';
import { PackageChecker } from './lib/packageChecker.js';
import { CompletionProvider } from './lib/completion.js';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Set UTF-8 encoding for Windows to handle Chinese characters properly
if (os.platform() === 'win32') {
  if (process.env.CHCP !== '65001') {
    try {
      require('child_process').execSync('chcp 65001', { stdio: 'ignore' });
    } catch (error) {
      // Ignore error if chcp command fails
    }
  }
  // Set console output encoding
  if (process.stdout.isTTY) {
    process.stdout.write('\x1b%G'); // Enable UTF-8
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const program = new Command();
const configManager = new ConfigManager();
const i18n = new I18n(configManager);
const completionProvider = new CompletionProvider(configManager);

// Check if Claude Code package is installed before proceeding
PackageChecker.validateOrExit(i18n);

// Get config names for choices (will be updated dynamically)
function getConfigChoices(): string[] {
  try {
    return configManager.getConfigNames();
  } catch (error) {
    return [];
  }
}

program
  .name('ccma')
  .description(i18n.t('program.description'))
  .version(packageJson.version, '-V, --version', 'display version number')
  .option('-v, --version', 'display version number', () => {
    console.log(packageJson.version);
    process.exit(0);
  });

program
  .command('add <name> <url> <token> [model]')
  .description(i18n.t('commands.add.description'))
  .action((name: string, url: string, token: string, model?: string) => {
    try {
      configManager.addConfig(name, url, token, model);
      console.log(i18n.t('commands.add.success', { name }));
    } catch (error) {
      console.error(i18n.t('commands.add.error', { error: String(error) }));
      process.exit(1);
    }
  });

program
  .command('del <name>')
  .alias('delete')
  .description(i18n.t('commands.del.description'))
  .action((name: string) => {
    try {
      const success = configManager.deleteConfig(name);
      if (success) {
        console.log(i18n.t('commands.del.success', { name }));
      } else {
        console.error(i18n.t('commands.del.notFound', { name }));
        process.exit(1);
      }
    } catch (error) {
      console.error(i18n.t('commands.del.error', { error: String(error) }));
      process.exit(1);
    }
  });

program
  .command('use [name]')
  .description(i18n.t('commands.use.description'))
  .action((name?: string) => {
    try {
      if (!name) {
        const { configs } = configManager.listConfigs();
        if (configs.length === 0) {
          console.log(i18n.t('commands.use.noConfigs'));
          return;
        }

        console.log(i18n.t('commands.use.available'));
        configs.forEach((config, index) => {
          console.log(`  ${index + 1}. ${config.name}`);
        });

        process.exit(0);
        return;
      }

      const success = configManager.useConfig(name);
      if (success) {
        const config = configManager.getCurrentConfig();
        console.log(i18n.t('commands.use.success', { name }));
        if (config) {
          configManager.displayEnvironmentInstructions(config, i18n);
        }
      } else {
        console.error(i18n.t('commands.use.notFound', { name }));
        process.exit(1);
      }
    } catch (error) {
      console.error(i18n.t('commands.use.error', { error: String(error) }));
      process.exit(1);
    }
  });

program
  .command('list')
  .alias('ls')
  .description(i18n.t('commands.list.description'))
  .action(() => {
    try {
      const { configs, current } = configManager.listConfigs();

      if (configs.length === 0) {
        console.log(i18n.t('commands.list.noConfigs'));
        return;
      }

      console.log(i18n.t('commands.list.available'));
      console.log('');
      configs.forEach(config => {
        const marker = config.name === current ? '* ' : '  ';
        const status = config.name === current ? i18n.t('commands.list.current') : '';
        console.log(`${marker}${config.name}${status}`);
        const formattedToken = configManager.formatToken(config.token);
        if (config.model) {
          console.log(i18n.t('urlTokenAndModel', { url: config.url, token: formattedToken, model: config.model }));
        } else {
          console.log(i18n.t('urlAndToken', { url: config.url, token: formattedToken }));
        }
        console.log('');
      });
    } catch (error) {
      console.error(i18n.t('commands.list.error', { error: String(error) }));
      process.exit(1);
    }
  });

program
  .command('current')
  .description(i18n.t('commands.current.description'))
  .action(() => {
    try {
      const config = configManager.getCurrentConfig();
      if (config) {
        console.log(i18n.t('commands.current.active', { name: config.name }));
        const formattedToken = configManager.formatToken(config.token);
        if (config.model) {
          console.log(i18n.t('urlTokenAndModel', { url: config.url, token: formattedToken, model: config.model }));
        } else {
          console.log(i18n.t('urlAndToken', { url: config.url, token: formattedToken }));
        }
        console.log('');
        configManager.displayEnvironmentInstructions(config, i18n);
      } else {
        console.log(i18n.t('commands.current.none'));
        console.log(i18n.t('commands.current.useHint'));
      }
    } catch (error) {
      console.error(i18n.t('commands.current.error', { error: String(error) }));
      process.exit(1);
    }
  });

program
  .command('clear')
  .description(i18n.t('commands.clear.description'))
  .action(() => {
    try {
      configManager.clearConfigs();
      console.log(i18n.t('commands.clear.success'));
    } catch (error) {
      console.error(i18n.t('commands.clear.error', { error: String(error) }));
      process.exit(1);
    }
  });

program
  .command('lang [language]')
  .description(i18n.t('commands.lang.description'))
  .action((language?: string) => {
    try {
      if (!language) {
        const currentLang = i18n.getCurrentLanguage();
        console.log(i18n.t('commands.lang.current', { lang: currentLang }));
        return;
      }

      if (language !== 'zh' && language !== 'en') {
        console.error(i18n.t('commands.lang.invalid'));
        process.exit(1);
      }

      i18n.setLanguage(language as 'zh' | 'en');
      console.log(i18n.t('commands.lang.success', { lang: language }));
    } catch (error) {
      console.error(i18n.t('commands.lang.error', { error: String(error) }));
      process.exit(1);
    }
  });

program
  .command('completion [command]')
  .description(i18n.t('commands.completion.description'))
  .action((command?: string) => {
    try {
      if (command === 'del' || command === 'use') {
        // Show available config names for these commands
        const configNames = getConfigChoices();
        if (configNames.length === 0) {
          console.log(i18n.t('commands.completion.noConfigs'));
        } else {
          console.log(i18n.t('commands.completion.availableConfigs'));
          configNames.forEach(name => {
            console.log(`  ${name}`);
          });
        }
        return;
      }

      // General completion setup instructions
      console.log(i18n.t('commands.completion.instructions'));
      console.log('');
      console.log(i18n.t('commands.completion.usage'));
      console.log('  ccma completion del    # ' + i18n.t('commands.completion.showDelConfigs'));
      console.log('  ccma completion use    # ' + i18n.t('commands.completion.showUseConfigs'));
      console.log('');
      console.log(i18n.t('commands.completion.note'));
    } catch (error) {
      console.error(i18n.t('commands.completion.error', { error: String(error) }));
      process.exit(1);
    }
  });

program.parse();