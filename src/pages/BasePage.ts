import { Page, Locator, expect } from '@playwright/test';
import { config } from '../config/config';

export class BasePage {
  protected page: Page;
  protected url: string;

  constructor(page: Page, url: string = '') {
    this.page = page;
    this.url = url;
  }

  /**
   * Navigate to the page
   */
  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('load', { timeout: config.timeout.action });
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: config.timeout.expect });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
