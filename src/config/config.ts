import { TestConfig } from '../types';

export const config: TestConfig = {
  baseUrl: process.env.BASE_URL || 'https://demoblaze.com/',
  apiBaseUrl: process.env.API_BASE_URL || 'https://demoblaze.com/',
  timeout: {
    test: parseInt(process.env.TEST_TIMEOUT!) || 30000,
    expect: parseInt(process.env.EXPECT_TIMEOUT!) || 5000,
    navigation: parseInt(process.env.NAVIGATION_TIMEOUT!) || 15000,
    action: parseInt(process.env.ACTION_TIMEOUT!) || 10000,
  },
  browser: {
    headless: process.env.HEADLESS !== 'false', // Default: headless=true, set HEADLESS=false to show browser
    slowMo: parseInt(process.env.SLOW_MO!) || 0,
    viewport: {
      width: parseInt(process.env.BROWSER_VIEWPORT_WIDTH!) || 1920,
      height: parseInt(process.env.BROWSER_VIEWPORT_HEIGHT!) || 1080,
    },
  },
  parallel: {
    workers: parseInt(process.env.WORKERS!) || 4,
    retries: parseInt(process.env.RETRIES!) || 2,
  },
};