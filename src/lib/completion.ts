import { ConfigManager } from './config.js';

export class CompletionProvider {
  private configManager: ConfigManager;

  constructor(configManager: ConfigManager) {
    this.configManager = configManager;
  }

  getConfigNames(): string[] {
    try {
      return this.configManager.getConfigNames();
    } catch (error) {
      // If there's an error reading configs, return empty array
      return [];
    }
  }

  // Completion function for commander-completion
  createConfigNamesCompletion() {
    return (info: any, cb: (err: any, results?: string[]) => void) => {
      try {
        const configNames = this.getConfigNames();
        cb(null, configNames);
      } catch (error) {
        cb(null, []);
      }
    };
  }
}