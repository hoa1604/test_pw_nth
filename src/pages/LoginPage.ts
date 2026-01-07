import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserCredentials } from '../types';

export class LoginPage extends BasePage {
  // Locators
  private readonly locators = {
    loginModal: {
      modal: "#logInModal",
      username: "#loginusername",
      password: "#loginpassword",
      loginButton: "button[onclick='logIn()']",
      closeButton: "#logInModal .close",
    },
    signupModal: {
      modal: "#signInModal",
      username: "#sign-username",
      password: "#sign-password",
      signupButton: "button[onclick='register()']",
      closeButton: "#signInModal .close",
    },
    navigation: {
      logout: "#logout2",
    },
  };

  constructor(page: Page) {
    super(page);
  }

  // Login modal elements
  get loginModal() { return this.page.locator(this.locators.loginModal.modal); }
  get usernameInput() { return this.page.locator(this.locators.loginModal.username); }
  get passwordInput() { return this.page.locator(this.locators.loginModal.password); }
  get loginButton() { return this.page.locator(this.locators.loginModal.loginButton); }
  get closeButton() { return this.page.locator(this.locators.loginModal.closeButton); }

  // Signup modal elements
  get signupModal() { return this.page.locator(this.locators.signupModal.modal); }
  get signupUsernameInput() { return this.page.locator(this.locators.signupModal.username); }
  get signupPasswordInput() { return this.page.locator(this.locators.signupModal.password); }
  get signupButton() { return this.page.locator(this.locators.signupModal.signupButton); }
  get signupCloseButton() { return this.page.locator(this.locators.signupModal.closeButton); }

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
    
    // Wait for modal to close or for error dialog
    await this.page.waitForTimeout(2000);
  }

  /**
   * Perform successful login
   */
  async loginSuccessfully(credentials: UserCredentials): Promise<void> {
    await this.login(credentials);
    
    // Verify login was successful by checking if logout link is visible
    await expect(this.page.locator(this.locators.navigation.logout)).toBeVisible({ timeout: 10000 });
  }

  /**
   * Attempt login with invalid credentials
   */
  async loginWithInvalidCredentials(credentials: UserCredentials): Promise<string> {
    await this.loginModal.waitFor({ state: 'visible' });
    
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    
    let errorMessage = '';
    this.page.once('dialog', async dialog => {
      errorMessage = dialog.message();
      await dialog.accept();
    });
    
    await this.loginButton.click();
    await this.page.waitForTimeout(2000);
    
    return errorMessage;
  }

  /**
   * Close login modal
   */
  async closeLoginModal(): Promise<void> {
    await this.closeButton.click();
    await this.loginModal.waitFor({ state: 'hidden' });
  }

  /**
   * Register new user
   */
  async signup(credentials: UserCredentials): Promise<void> {
    await this.signupModal.waitFor({ state: 'visible' });
    
    await this.signupUsernameInput.fill(credentials.username);
    await this.signupPasswordInput.fill(credentials.password);
    
    // Handle dialog that appears after signup attempt
    this.page.once('dialog', async dialog => {
      const message = dialog.message();
      await dialog.accept();
      
      if (message.includes('This user already exist')) {
        throw new Error(`Signup failed: ${message}`);
      }
    });
    
    await this.signupButton.click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Perform successful signup
   */
  async signupSuccessfully(credentials: UserCredentials): Promise<void> {
    let dialogMessage = '';
    this.page.once('dialog', async dialog => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });
    
    await this.signup(credentials);
    
    // Verify signup was successful
    if (!dialogMessage.includes('Sign up successful')) {
      throw new Error(`Expected successful signup message, got: ${dialogMessage}`);
    }
  }

  /**
   * Close signup modal
   */
  async closeSignupModal(): Promise<void> {
    await this.signupCloseButton.click();
    await this.signupModal.waitFor({ state: 'hidden' });
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

  /**
   * Verify signup modal is visible
   */
  async verifySignupModalVisible(): Promise<void> {
    await expect(this.signupModal).toBeVisible();
    await expect(this.signupUsernameInput).toBeVisible();
    await expect(this.signupPasswordInput).toBeVisible();
    await expect(this.signupButton).toBeVisible();
  }

  /**
   * Check if login modal is open
   */
  async isLoginModalOpen(): Promise<boolean> {
    return await this.loginModal.isVisible();
  }

  /**
   * Check if signup modal is open
   */
  async isSignupModalOpen(): Promise<boolean> {
    return await this.signupModal.isVisible();
  }

  /**
   * Clear login form
   */
  async clearLoginForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Clear signup form
   */
  async clearSignupForm(): Promise<void> {
    await this.signupUsernameInput.clear();
    await this.signupPasswordInput.clear();
  }

  /**
   * Get current username value
   */
  async getUsernameValue(): Promise<string> {
    return await this.usernameInput.inputValue();
  }

  /**
   * Get current password value (will be empty for security)
   */
  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }
}