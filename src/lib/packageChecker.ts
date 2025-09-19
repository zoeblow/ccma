import { execSync } from 'child_process';
import { I18n } from './lang/index.js';

export class PackageChecker {
  private static readonly REQUIRED_PACKAGE = '@anthropic-ai/claude-code';

  static checkClaudeCodeInstalled(): boolean {
    try {
      // Check if @anthropic-ai/claude-code is installed globally
      const result = execSync('npm list -g @anthropic-ai/claude-code --depth=0', {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return result.includes(this.REQUIRED_PACKAGE);
    } catch (error) {
      return false;
    }
  }

  static displayInstallationMessage(i18n: I18n): void {
    console.error('');
    console.error(i18n.t('errors.packageNotFound.title'));
    console.error('');
    console.error(i18n.t('errors.packageNotFound.message'));
    console.error('');
    console.error(i18n.t('errors.packageNotFound.installCommand'));
    console.error('  npm install -g @anthropic-ai/claude-code');
    console.error('');
    console.error(i18n.t('errors.packageNotFound.moreInfo'));
    console.error('  https://docs.anthropic.com/en/docs/claude-code/setup');
    console.error('');
  }

  static validateOrExit(i18n: I18n): void {
    if (!this.checkClaudeCodeInstalled()) {
      this.displayInstallationMessage(i18n);
      process.exit(1);
    }
  }
}