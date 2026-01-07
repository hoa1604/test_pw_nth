import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { config } from './src/config/config';

// Load environment variables
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // No retry - run once only
  retries: 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : config.parallel.workers,
  
  // Global timeout for each test
  timeout: config.timeout.test,
  
  // Global timeout for expect assertions
  expect: {
    timeout: config.timeout.expect,
  },
  
  // Reporter configuration
  reporter: [
    ['html', { open: 'always' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list']
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: config.baseUrl,
    
    // Browser settings
    headless: config.browser.headless,
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Global test timeout
    actionTimeout: config.timeout.action,
    
    // Navigation timeout
    navigationTimeout: config.timeout.navigation,
  },

  // Configure projects for major browsers
  projects: [
    // Default Desktop Browser
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: config.browser.viewport
      },
    },
    
    // Comment out other browsers to run only Chrome
    // {
    //   name: 'firefox',
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1920, height: 1080 }
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //     viewport: { width: 1920, height: 1080 }
    //   },
    // },
    
    // // Mobile Browsers
    // {
    //   name: 'mobile-chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'mobile-safari',
    //   use: { ...devices['iPhone 12'] },
    // },
    
    // // Tablet
    // {
    //   name: 'tablet',
    //   use: { ...devices['iPad Pro'] },
    // },
    
    // // API Testing Project - comment out to run only UI tests
    // {
    //   name: 'api',
    //   testDir: './tests/api',
    //   use: {
    //     baseURL: process.env.API_BASE_URL || 'https://demoblaze.com/',
    //   },
    // },
  ],

  // Global setup and teardown - now handled in fixtures
  // globalSetup: './utils/global-setup.ts',
  // globalTeardown: './utils/global-teardown.ts',

  // Output directory for test artifacts
  outputDir: './test-results',
});