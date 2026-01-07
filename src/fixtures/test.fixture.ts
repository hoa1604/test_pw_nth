import { test as base, Page } from '@playwright/test';
import { HomePage, LoginPage, ProductPage } from '../pages';
import { ApiHelper } from '../utils/ApiHelper';
import { TestHelper } from '../utils/TestHelper';
import { testData } from '../config/data';
import * as fs from 'fs';
import * as path from 'path';

// Define custom fixtures
export interface TestFixtures {
  homePage: HomePage;
  loginPage: LoginPage;
  productPage: ProductPage;
  apiHelper: ApiHelper;
  testHelper: TestHelper;
  testReporting: void;
}

// Extend base test with custom fixtures
export const test = base.extend<TestFixtures>({
  // Test reporting fixture - only runs when needed
  testReporting: [
    async ({ page }, use, testInfo) => {
      const testStartTime = new Date().toISOString();
      console.log(`Starting test: ${testInfo.title}`);

      await use();

      // Capture screenshot on test failure for debugging
      if (testInfo.status === 'failed') {
        console.log(`Test failed: ${testInfo.title}`);
        try {
          await testInfo.attach('failure-screenshot', {
            body: await page.screenshot({ fullPage: true }),
            contentType: 'image/png',
          });
          console.log('Screenshot captured for failed test');
        } catch (screenshotError) {
          console.warn('Failed to capture screenshot:', screenshotError);
        }
      }

      // Save test summary
      const testSummary = {
        testName: testInfo.title,
        project: testInfo.project.name,
        status: testInfo.status,
        startTime: testStartTime,
        endTime: new Date().toISOString(),
        duration: testInfo.duration,
        retry: testInfo.retry,
      };

      const testResultsDir = path.join(process.cwd(), 'test-results');
      if (fs.existsSync(testResultsDir)) {
        const summaryFile = path.join(testResultsDir, `${testInfo.testId}-summary.json`);
        fs.writeFileSync(summaryFile, JSON.stringify(testSummary, null, 2));
      }
      console.log(`Test completed: ${testInfo.title}`);
    },
  ],

  // Home page fixture
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  // Login page fixture
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Product page fixture
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },

  // API helper fixture
  apiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request);
    await use(apiHelper);
  },

  // Test helper fixture
  testHelper: async ({ page }, use) => {
    const testHelper = new TestHelper();
    await use(testHelper);
  },
});

// Authenticated user fixture
export const authenticatedTest = test.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page, homePage, loginPage }, use) => {
    console.log('Setting up authenticated user session');

    // Navigate to home page
    await homePage.navigateToHome();

    // Click login
    await homePage.clickLogin();

    // Perform login
    await loginPage.loginSuccessfully(testData.users.valid);

    // Verify login successful
    await homePage.verifyHomePageLoaded();
    console.log('User authenticated successfully');

    await use(page);

    // Cleanup: logout after test
    if (await homePage.isLoggedIn()) {
      await homePage.logout();
      console.log('🚪 User logged out after test');
    }
  },
});

export { expect } from '@playwright/test';
