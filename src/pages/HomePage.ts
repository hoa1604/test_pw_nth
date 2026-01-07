import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../config/config';

export class HomePage extends BasePage {
  // Locators
  private readonly locators = {
    navigation: {
      home: 'a.navbar-brand',
      contact: "a[data-target='#exampleModal']",
      aboutUs: "a[data-target='#videoModal']",
      cart: '#cartur',
      login: '#login2',
      signup: '#signin2',
      logout: '#logout2',
    },
    products: {
      productCard: '.card.h-100',
      productTitle: 'a.hrefch',
      productPrice: '.card-block h5',
      productImage: 'img.card-img-top',
      categoryFilter: 'a.list-group-item',
      nextButton: '#next2',
      prevButton: '#prev2',
    },
  };

  constructor(page: Page) {
    super(page, '/');
  }

  // Navigation elements
  get homeLink() {
    return this.page.locator(this.locators.navigation.home);
  }
  get cartLink() {
    return this.page.locator(this.locators.navigation.cart);
  }
  get loginLink() {
    return this.page.locator(this.locators.navigation.login);
  }
  get logoutLink() {
    return this.page.locator(this.locators.navigation.logout);
  }

  // Product elements
  get productCards() {
    return this.page.locator(this.locators.products.productCard);
  }
  get productTitles() {
    return this.page.locator(this.locators.products.productTitle);
  }
  get productPrices() {
    return this.page.locator(this.locators.products.productPrice);
  }
  get categoryFilters() {
    return this.page.locator(this.locators.products.categoryFilter);
  }
  get nextButton() {
    return this.page.locator(this.locators.products.nextButton);
  }
  get prevButton() {
    return this.page.locator(this.locators.products.prevButton);
  }

  /**
   * Navigate to home page
   */
  async navigateToHome(): Promise<void> {
    await this.goto();
    await this.waitForPageLoad();
  }

  /**
   * Click on login link
   */
  async clickLogin(): Promise<void> {
    await this.loginLink.click();
    await this.page.waitForSelector('#logInModal', { state: 'visible' });
  }

  /**
   * Click on cart link
   */
  async clickCart(): Promise<void> {
    await this.cartLink.click();
    await this.waitForNavigation();
  }

  /**
   * Get all product titles
   */
  async getProductTitles(): Promise<string[]> {
    await this.productTitles.first().waitFor({ state: 'visible' });
    return await this.productTitles.allTextContents();
  }

  /**
   * Get all product prices
   */
  async getProductPrices(): Promise<string[]> {
    await this.productPrices.first().waitFor({ state: 'visible' });
    return await this.productPrices.allTextContents();
  }

  /**
   * Filter products by category
   */
  async filterByCategory(category: string): Promise<void> {
    const categoryFilter = this.page.locator(this.locators.products.categoryFilter, {
      hasText: category,
    });
    await categoryFilter.click();

    // Wait for products to reload after category change
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
      console.log('Network did not become idle, continuing...');
    });
    await this.waitForProductsToLoad();
  }

  /**
   * Click on a specific product by name
   */
  async clickProduct(productName: string): Promise<void> {
    const productCard = this.page.locator(this.locators.products.productCard).filter({
      has: this.page.locator(this.locators.products.productTitle, { hasText: productName }),
    });
    await productCard.click();
    await this.waitForNavigation();
  }

  /**
   * Search for products (demo implementation - may not work on actual site)
   */
  async searchProducts(searchTerm: string): Promise<string[]> {
    const titles = await this.getProductTitles();
    return titles.filter(title => title.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  /**
   * Navigate to next page of products
   */
  async goToNextPage(): Promise<void> {
    if (await this.nextButton.isEnabled()) {
      await this.nextButton.click();
      // Wait for products to reload
      await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
        console.log('Network did not become idle, continuing...');
      });
      await this.waitForProductsToLoad();
    }
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    return await this.logoutLink.isVisible();
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    if (await this.isLoggedIn()) {
      await this.logoutLink.click();
      // Wait for logout link to disappear and login link to appear
      await this.loginLink.waitFor({ state: 'visible', timeout: config.timeout.expect });
    }
  }

  /**
   * Get product count on current page
   */
  async getProductCount(): Promise<number> {
    await this.productCards.first().waitFor({ state: 'visible' });
    return await this.productCards.count();
  }

  /**
   * Verify home page is loaded
   */
  async verifyHomePageLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/STORE/);
    await expect(this.homeLink).toBeVisible();
    await expect(this.productCards.first()).toBeVisible();
  }

  /**
   * Wait for products to load
   */
  async waitForProductsToLoad(): Promise<void> {
    await this.productCards.first().waitFor({ state: 'visible', timeout: config.timeout.action });
    // Wait for network to stabilize
    await this.page.waitForLoadState('domcontentloaded');
  }
}
