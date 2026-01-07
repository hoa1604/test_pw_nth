import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class TestHelper {
  /**
   * Generate random string
   */
  static generateRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email
   */
  static generateRandomEmail(): string {
    return `test${this.generateRandomString(5)}@example.com`;
  }

  /**
   * Generate random username
   */
  static generateRandomUsername(): string {
    return `user${this.generateRandomString(6)}`;
  }

  /**
   * Wait for specific time
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Format currency
   */
  static formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  /**
   * Parse price string to number
   */
  static parsePrice(priceString: string): number {
    const cleanPrice = priceString.replace(/[$,\s]/g, '');
    return parseFloat(cleanPrice) || 0;
  }

  /**
   * Create directory if it doesn't exist
   */
  static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Get current timestamp
   */
  static getCurrentTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeTimestampedScreenshot(page: Page, name: string): Promise<string> {
    const timestamp = this.getCurrentTimestamp();
    const screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots');
    this.ensureDirectoryExists(screenshotDir);
    
    const filename = `${name}-${timestamp}.png`;
    const fullPath = path.join(screenshotDir, filename);
    
    await page.screenshot({ path: fullPath, fullPage: true });
    return fullPath;
  }

  /**
   * Save test data to file
   */
  static saveTestData(data: any, filename: string): void {
    const dataDir = path.join(process.cwd(), 'test-results', 'data');
    this.ensureDirectoryExists(dataDir);
    
    const timestamp = this.getCurrentTimestamp();
    const fullPath = path.join(dataDir, `${filename}-${timestamp}.json`);
    
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
  }

  /**
   * Load test data from file
   */
  static loadTestData(filename: string): any {
    const filePath = path.join(process.cwd(), 'test-data', `${filename}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    return null;
  }

  /**
   * Generate test report summary
   */
  static generateTestSummary(results: any[]): any {
    const summary = {
      total: results.length,
      passed: results.filter(r => r.status === 'passed').length,
      failed: results.filter(r => r.status === 'failed').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      duration: results.reduce((total, r) => total + (r.duration || 0), 0),
    };
    
    summary['passRate'] = summary.total > 0 ? (summary.passed / summary.total * 100).toFixed(2) + '%' : '0%';
    
    return summary;
  }

  /**
   * Retry operation with exponential backoff
   */
  static async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await this.wait(delay);
      }
    }
    
    throw lastError!;
  }

  /**
   * Wait for condition to be true
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 10000,
    interval: number = 500
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await this.wait(interval);
    }
    
    throw new Error(`Condition was not met within ${timeout}ms`);
  }

  /**
   * Get browser info
   */
  static getBrowserInfo(page: Page): Promise<any> {
    return page.evaluate(() => ({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
    }));
  }

  /**
   * Clear browser storage
   */
  static async clearBrowserStorage(page: Page): Promise<void> {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Set browser storage item
   */
  static async setStorageItem(page: Page, key: string, value: string, storage: 'local' | 'session' = 'local'): Promise<void> {
    await page.evaluate(
      ({ key, value, storage }) => {
        if (storage === 'local') {
          localStorage.setItem(key, value);
        } else {
          sessionStorage.setItem(key, value);
        }
      },
      { key, value, storage }
    );
  }

  /**
   * Get browser storage item
   */
  static async getStorageItem(page: Page, key: string, storage: 'local' | 'session' = 'local'): Promise<string | null> {
    return page.evaluate(
      ({ key, storage }) => {
        if (storage === 'local') {
          return localStorage.getItem(key);
        } else {
          return sessionStorage.getItem(key);
        }
      },
      { key, storage }
    );
  }

  /**
   * Simulate network conditions
   */
  static async simulateSlowNetwork(page: Page): Promise<void> {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
      uploadThroughput: 750 * 1024 / 8, // 750 kbps
      latency: 40, // 40ms
    });
  }

  /**
   * Disable network
   */
  static async disableNetwork(page: Page): Promise<void> {
    await page.context().setOffline(true);
  }

  /**
   * Enable network
   */
  static async enableNetwork(page: Page): Promise<void> {
    await page.context().setOffline(false);
  }
}