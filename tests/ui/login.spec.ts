import { testWithSetup as test, expect } from '../../src/fixtures/test.fixture';
import { testData } from '../../src/config/data';

/**
 * AUTOMATION IMPLEMENTATION DEMO
 * Comprehensive test suite for DemoBlaze login functionality
 * Covers both typical scenarios and edge cases
 */
test.describe('DemoBlaze Login Automation Demo', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigateToHome();
    await homePage.verifyHomePageLoaded();
  });

  test.afterEach(async ({ homePage }) => {
    // Cleanup: Logout if user is logged in
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

  // ============================================
  // HAPPY PATH SCENARIOS
  // ============================================

  test('DEMO: Should successfully login with valid credentials @smoke @ui', async ({ 
    homePage, 
    loginPage 
  }) => {
    console.log('DEMO TEST: User Login Flow with Valid Credentials');
    
    console.log('Step 1: Verify home page is loaded correctly');
    await expect(homePage.homeLink).toBeVisible();
    await expect(homePage.loginLink).toBeVisible();
    
    console.log('Step 2: Open login modal');
    await homePage.clickLogin();
    
    console.log('Step 3: Verify login modal is displayed correctly');
    await loginPage.verifyLoginModalVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    
    console.log('Step 4: Enter valid credentials and submit');
    console.log(`Using credentials: ${testData.users.valid.username}`);
    await loginPage.loginSuccessfully(testData.users.valid);
    
    console.log('Step 5: Verify successful login');
    expect(await homePage.isLoggedIn()).toBe(true);
    await expect(homePage.logoutLink).toBeVisible();
    await expect(homePage.loginLink).not.toBeVisible();
    
    console.log('Step 6: Take screenshot for verification');
    await homePage.takeScreenshot('successful-login-demo');
    console.log('Login test completed successfully!');
  });

  // ============================================
  // EDGE CASES AND ERROR SCENARIOS
  // ============================================

  test('DEMO: Should handle invalid username gracefully @regression @ui', async ({
    homePage,
    loginPage
  }) => {
    console.log('DEMO TEST: Login with Invalid Username');
    
    await homePage.clickLogin();
    await loginPage.verifyLoginModalVisible();
    
    console.log('Testing with non-existent username');
    const errorMessage = await loginPage.loginWithInvalidCredentials({
      username: 'nonexistentuser12345',
      password: testData.users.valid.password
    });
    
    console.log(`Error message received: "${errorMessage}"`);
    expect(errorMessage).toContain('User does not exist');
    
    // Verify user is not logged in
    expect(await homePage.isLoggedIn()).toBe(false);
    console.log('Invalid username handled correctly!');
  });

  test('DEMO: Should handle invalid password gracefully @regression @ui', async ({
    homePage,
    loginPage
  }) => {
    console.log('DEMO TEST: Login with Invalid Password');
    
    await homePage.clickLogin();
    await loginPage.verifyLoginModalVisible();
    
    console.log('Testing with wrong password');
    const errorMessage = await loginPage.loginWithInvalidCredentials({
      username: testData.users.valid.username,
      password: 'wrongpassword123'
    });
    
    console.log(`Error message received: "${errorMessage}"`);
    expect(errorMessage).toContain('Wrong password');
    
    // Verify user is not logged in
    expect(await homePage.isLoggedIn()).toBe(false);
    console.log('Invalid password handled correctly!');
  });

  test('DEMO: Should handle empty credentials gracefully @regression @ui', async ({
    homePage,
    loginPage
  }) => {
    console.log('DEMO TEST: Login with Empty Credentials');
    
    await homePage.clickLogin();
    await loginPage.verifyLoginModalVisible();
    
    console.log('Testing with empty username and password');
    await loginPage.usernameInput.fill('');
    await loginPage.passwordInput.fill('');
    
    // Try to click login button
    await loginPage.loginButton.click();
    
    // Verify modal is still visible (login failed)
    await expect(loginPage.loginModal).toBeVisible();
    expect(await homePage.isLoggedIn()).toBe(false);
    console.log('Empty credentials handled correctly!');
  });

  test('DEMO: Should validate modal close functionality @ui', async ({
    homePage,
    loginPage
  }) => {
    console.log('DEMO TEST: Login Modal Close Functionality');
    
    await homePage.clickLogin();
    await loginPage.verifyLoginModalVisible();
    
    console.log('Closing modal using close button');
    await loginPage.closeButton.click();
    
    // Verify modal is closed
    await expect(loginPage.loginModal).not.toBeVisible();
    expect(await homePage.isLoggedIn()).toBe(false);
    console.log('Modal close functionality works correctly!');
  });
});