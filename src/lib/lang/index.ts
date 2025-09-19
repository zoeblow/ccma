import { zh } from './zh.js';
import { en } from './en.js';
import { ConfigManager } from '../config.js';

export type Language = 'zh' | 'en';

export class I18n {
  private configManager: ConfigManager;
  private messages: any;

  constructor(configManager: ConfigManager) {
    this.configManager = configManager;
    this.loadMessages();
  }

  private loadMessages(): void {
    const language = this.configManager.getLanguage();
    this.messages = language === 'zh' ? zh : en;
  }

  t(key: string, params?: { [key: string]: string }): string {
    const keys = key.split('.');
    let value = this.messages;

    for (const k of keys) {
      value = value[k];
      if (!value) {
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] || match;
      });
    }

    return value;
  }

  setLanguage(language: Language): void {
    this.configManager.setLanguage(language);
    this.loadMessages();
  }

  getCurrentLanguage(): Language {
    return this.configManager.getLanguage();
  }
}