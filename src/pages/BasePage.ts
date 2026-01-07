import { Page, Locator, expect } from '@playwright/test';

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
    await this.page.waitForLoadState('load', { timeout: 10000 });
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    });
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout: number = 10000): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    return element;
  }

  /**
   * Wait for element to be hidden
   */
  async waitForElementHidden(selector: string, timeout: number = 10000): Promise<void> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Click element with retry mechanism
   */
  async clickElement(selector: string, options?: { timeout?: number; force?: boolean }): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.click(options);
  }

  /**
   * Fill input field
   */
  async fillInput(selector: string, value: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.fill(value);
  }

  /**
   * Get text content
   */
  async getTextContent(selector: string): Promise<string> {
    const element = await this.waitForElement(selector);
    return await element.textContent() || '';
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: 5000 });
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

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Get all elements matching selector
   */
  async getAllElements(selector: string): Promise<Locator[]> {
    const elements = this.page.locator(selector);
    const count = await elements.count();
    const locators: Locator[] = [];
    for (let i = 0; i < count; i++) {
      locators.push(elements.nth(i));
    }
    return locators;
  }

  /**
   * Wait for text to appear
   */
  async waitForText(text: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForFunction(
      (searchText) => document.body.innerText.includes(searchText),
      text,
      { timeout }
    );
  }

  /**
   * Handle alert/confirm dialogs
   */
  async handleDialog(accept: boolean = true): Promise<void> {
    this.page.on('dialog', async dialog => {
      if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  /**
   * Switch to new tab/window
   */
  async switchToNewTab(): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  /**
   * Close current page
   */
  async closePage(): Promise<void> {
    await this.page.close();
  }
}