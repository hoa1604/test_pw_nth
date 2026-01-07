import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserCredentials } from '../types';
import { config } from '../config/config';

export class LoginPage extends BasePage {
  // Locators
  private readonly locators = {
    loginModal: {
      modal: '#logInModal',
      username: '#loginusername',
      password: '#loginpassword',
      loginButton: "button[onclick='logIn()']",
      closeButton: '#logInModal .close',
    },
    navigation: {
      logout: '#logout2',
    },
  };

  constructor(page: Page) {
    super(page);
  }

  // Login modal elements
  get loginModal() {
    return this.page.locator(this.locators.loginModal.modal);
  }
  get usernameInput() {
    return this.page.locator(this.locators.loginModal.username);
  }
  get passwordInput() {
    return this.page.locator(this.locators.loginModal.password);
  }
  get loginButton() {
    return this.page.locator(this.locators.loginModal.loginButton);
  }
  get closeButton() {
    return this.page.locator(this.locators.loginModal.closeButton);
  }

  /**
   * Perform login with credentials
   */
  async login(credentials: UserCredentials): Promise<void> {
    await this.loginModal.waitFor({ state: 'visible' });

    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);

    // Handle dialog that appears after login attempt
    this.page.once('dialog', async dialog => {
      const message = dialog.message();
      if (message.includes('Wrong password') || message.includes('User does not exist')) {
        await dialog.accept();
        throw new Error(`Login failed: ${message}`);
      }
      await dialog.accept();
    });

    await this.loginButton.click();

    // Wait for modal to close (indicates successful login) or error to appear
    try {
      await this.loginModal.waitFor({ state: 'hidden', timeout: config.timeout.expect });
    } catch {
      // Modal still visible - login may have failed
      console.log('Login modal still visible after login attempt');
    }
  }

  /**
   * Perform successful login
   */
  async loginSuccessfully(credentials: UserCredentials): Promise<void> {
    await this.login(credentials);

    // Verify login was successful by checking if logout link is visible
    await expect(this.page.locator(this.locators.navigation.logout)).toBeVisible({
      timeout: config.timeout.action,
    });
  }

  /**
   * Attempt login with invalid credentials
   */
  async loginWithInvalidCredentials(credentials: UserCredentials): Promise<string> {
    await this.loginModal.waitFor({ state: 'visible' });

    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);

    let errorMessage = '';

    const dialogHandler = this.page
      .waitForEvent('dialog', { timeout: config.timeout.expect })
      .then(async dialog => {
        errorMessage = dialog.message();
        await dialog.accept();
      })
      .catch(() => console.log('No error dialog appeared within timeout'));

    await this.loginButton.click();
    await dialogHandler;

    return errorMessage;
  }

  /**
   * Verify login modal is visible
   */
  async verifyLoginModalVisible(): Promise<void> {
    await expect(this.loginModal).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
}
