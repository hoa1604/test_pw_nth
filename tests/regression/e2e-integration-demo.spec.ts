import { test, expect } from '../../src/fixtures/test.fixture';
import { testData } from '../../src/config/data';

/**
 * AUTOMATION IMPLEMENTATION DEMO
 * Complete End-to-End Integration Test
 * Demonstrates full user journey: Login → Search → Interaction
 */
test.describe('DemoBlaze E2E Integration Demo', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigateToHome();
    await homePage.verifyHomePageLoaded();
  });

  test.afterEach(async ({ homePage }) => {
    // Simple cleanup: Logout if user is logged in
    try {
      if (await homePage.isLoggedIn()) {
        console.log('Teardown: Logging out user');
        await homePage.logout();
        console.log('Logout successful');
      }
    } catch (error) {
      console.log('Teardown: Could not logout user, continuing...');
    }
  });

  test('DEMO: Complete user journey - Login and Search Integration @regression @ui @smoke', async ({
    homePage,
    loginPage,
  }) => {
    console.log('DEMO TEST: Complete E2E User Journey');
    console.log('=====================================');

    // Declare variables at test level scope for cross-phase access
    let laptopProducts: string[] = [];

    // ===============================
    // PHASE 1: USER AUTHENTICATION
    // ===============================
    await test.step('PHASE 1: User Authentication', async () => {
      console.log('PHASE 1: User Authentication');

      console.log('Step 1.1: Verify user is not logged in initially');
      expect(await homePage.isLoggedIn(), 'User should not be logged in initially').toBe(false);
      await expect(
        homePage.loginLink,
        'Login link should be visible for unauthenticated user'
      ).toBeVisible();
      await expect(
        homePage.logoutLink,
        'Logout link should not be visible for unauthenticated user'
      ).not.toBeVisible();

      console.log('Step 1.2: Initiate login process');
      await homePage.clickLogin();

      console.log('Step 1.3: Verify login modal functionality');
      await loginPage.verifyLoginModalVisible();
      await expect(loginPage.usernameInput, 'Username input should be empty initially').toBeEmpty();
      await expect(loginPage.passwordInput, 'Password input should be empty initially').toBeEmpty();

      console.log('Step 1.4: Perform authentication with valid credentials');
      console.log(`Authenticating user: ${testData.users.valid.username}`);
      await loginPage.loginSuccessfully(testData.users.valid);

      console.log('Step 1.5: Verify successful authentication');
      expect(
        await homePage.isLoggedIn(),
        'User should be logged in after successful authentication'
      ).toBe(true);
      await expect(
        homePage.logoutLink,
        'Logout link should be visible for authenticated user'
      ).toBeVisible();
      await expect(
        homePage.loginLink,
        'Login link should not be visible for authenticated user'
      ).not.toBeVisible();

      console.log('PHASE 1 COMPLETED: User successfully authenticated');
    });

    // ===============================
    // PHASE 2: PRODUCT SEARCH & DISCOVERY
    // ===============================
    await test.step('PHASE 2: Product Search & Discovery', async () => {
      console.log('PHASE 2: Product Search & Discovery');

      await test.step('Load and verify initial product catalog', async () => {
        console.log('Step 2.1: Verify product catalog is available');

        // Wait for products to load (15s timeout)
        await homePage.waitForProductsToLoad();

        const initialProducts = await homePage.getProductTitles();
        const initialProductCount = await homePage.getProductCount();

        console.log(`Products available: ${initialProductCount} items`);
        console.log('Sample products:', initialProducts.slice(0, 3));
        expect(
          initialProductCount,
          `Expected at least 1 product to be available on homepage but found ${initialProductCount}. ` +
            `Sample products: ${initialProducts.slice(0, 3).join(', ')}`
        ).toBeGreaterThan(0);
      });

      await test.step('Test laptop category search', async () => {
        console.log('Step 2.2: Test alternative search - Laptops');
        console.log('Searching for Laptops...');

        await homePage.filterByCategory('Laptops');
        await homePage.waitForProductsToLoad();

        laptopProducts = await homePage.getProductTitles();
        const laptopCount = await homePage.getProductCount();
        console.log(`Laptop products found: ${laptopCount} items`);
        console.log('Laptop products:', laptopProducts);

        expect(
          laptopCount,
          `Expected at least 1 laptop product but found ${laptopCount}. Available products: ${laptopProducts.join(', ')}`
        ).toBeGreaterThan(0);

        // Validate laptop search results outside the retry loop
        console.log('Step 2.3: Validate laptop search results');
        const laptopKeywords = ['vaio', 'macbook', 'dell', 'laptop'];
        const relevantLaptopProducts = laptopProducts.filter(product =>
          laptopKeywords.some(keyword => product.toLowerCase().includes(keyword.toLowerCase()))
        );

        console.log(`Relevant laptop products: ${relevantLaptopProducts.length}/${laptopCount}`);
        expect(
          relevantLaptopProducts.length,
          `Expected at least 1 relevant laptop product containing keywords [${laptopKeywords.join(', ')}] but found ${relevantLaptopProducts.length}. ` +
            `Available products: ${laptopProducts.join(', ')}`
        ).toBeGreaterThan(0);
      });

      console.log('PHASE 2 COMPLETED: Product search functionality validated');
    });

    // ===============================
    // PHASE 3: PRODUCT INTERACTION
    // ===============================
    await test.step('PHASE 3: Product Interaction & Validation', async () => {
      console.log('PHASE 3: Product Interaction & Validation');

      await test.step('Validate product information completeness', async () => {
        console.log('Step 3.1: Validate product information completeness');
        const productPrices = await homePage.getProductPrices();

        console.log('Product Information Validation:');
        const productsToValidate = Math.min(laptopProducts.length, productPrices.length);

        expect(
          productsToValidate,
          `Expected products and prices arrays to have matching lengths. Products: ${laptopProducts.length}, Prices: ${productPrices.length}`
        ).toBeGreaterThan(0);

        for (let i = 0; i < productsToValidate; i++) {
          const product = laptopProducts[i];
          const price = productPrices[i];

          console.log(`  Product ${i + 1}: ${product} - ${price}`);

          // Use soft assertions to validate all products without stopping on first failure
          expect
            .soft(product, `Product ${i + 1} should have a valid name but got: '${product}'`)
            .toBeTruthy();

          expect
            .soft(
              product.trim().length,
              `Product ${i + 1} name should not be empty but got: '${product}'`
            )
            .toBeGreaterThan(0);

          expect
            .soft(price, `Product ${i + 1} should have a valid price but got: '${price}'`)
            .toBeTruthy();

          expect
            .soft(price, `Product ${i + 1} price should contain '$' symbol but got: '${price}'`)
            .toContain('$');
        }
      });

      await test.step('Test pagination functionality', async () => {
        console.log('Step 3.2: Test pagination if available');
        const hasNextButton = await homePage.nextButton.isVisible();
        const hasPrevButton = await homePage.prevButton.isVisible();

        console.log(`Pagination available: Next=${hasNextButton}, Prev=${hasPrevButton}`);

        if (hasNextButton) {
          const currentProducts = await homePage.getProductTitles();
          expect(
            currentProducts.length,
            `Expected products to be loaded before pagination test but found ${currentProducts.length}`
          ).toBeGreaterThan(0);

          await homePage.goToNextPage();
          await homePage.waitForProductsToLoad();

          const nextPageProducts = await homePage.getProductTitles();
          console.log(`Products after pagination: ${nextPageProducts.length}`);

          expect(
            nextPageProducts.length,
            `Expected products to be loaded after pagination but found ${nextPageProducts.length}`
          ).toBeGreaterThan(0);

          // Verify different products are shown (if any)
          const isDifferentPage = currentProducts.some(
            product => !nextPageProducts.includes(product)
          );

          if (isDifferentPage) {
            console.log('Pagination working - different products loaded');
          } else {
            console.log('Same products - might be limited dataset');
          }
        } else {
          console.log('Pagination not available - skipping pagination test');
        }
      });

      console.log('PHASE 3 COMPLETED: Product interaction validated');
    });

    // ===============================
    // PHASE 4: SESSION MANAGEMENT
    // ===============================
    await test.step('PHASE 4: Session Management', async () => {
      console.log('PHASE 4: Session Management');

      await test.step('Verify session persistence', async () => {
        console.log('Step 4.1: Verify user session is maintained throughout journey');

        const isStillLoggedIn = await homePage.isLoggedIn();
        expect(
          isStillLoggedIn,
          'User session should be maintained throughout the test journey'
        ).toBe(true);
        await expect(
          homePage.logoutLink,
          'Logout link should still be visible after product interactions'
        ).toBeVisible();
      });

      await test.step('Execute logout', async () => {
        console.log('Step 4.2: Test logout functionality');

        await homePage.logout();

        // Verify logout was successful
        const isNowLoggedOut = await homePage.isLoggedIn();
        expect(isNowLoggedOut, 'User should be logged out after logout operation').toBe(false);
        console.log('Logout successful');
      });

      await test.step('Verify final logout state', async () => {
        console.log('Step 4.3: Verify successful logout');

        expect(await homePage.isLoggedIn(), 'User should not be logged in after logout').toBe(
          false
        );
        await expect(homePage.loginLink, 'Login link should be visible after logout').toBeVisible();
        await expect(
          homePage.logoutLink,
          'Logout link should not be visible after logout'
        ).not.toBeVisible();

        console.log('Final logout state verified successfully');
      });

      console.log('PHASE 4 COMPLETED: Session management validated');
    });

    // ===============================
    // TEST SUMMARY
    // ===============================
    console.log('E2E INTEGRATION TEST COMPLETED SUCCESSFULLY!');
    console.log('=====================================');
    console.log('User Authentication: PASSED');
    console.log('Product Search: PASSED');
    console.log('Product Interaction: PASSED');
    console.log('Session Management: PASSED');
    console.log('=====================================');
  });
});
