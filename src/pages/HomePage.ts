import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Locators
  private readonly locators = {
    navigation: {
      home: "a.navbar-brand",
      contact: "a[data-target='#exampleModal']",
      aboutUs: "a[data-target='#videoModal']",
      cart: "#cartur",
      login: "#login2",
      signup: "#signin2",
      logout: "#logout2",
    },
    products: {
      productCard: ".card.h-100",
      productTitle: "a.hrefch",
      productPrice: ".card-block h5",
      productImage: "img.card-img-top",
      categoryFilter: "a.list-group-item",
      nextButton: "#next2",
      prevButton: "#prev2",
    },
  };

  constructor(page: Page) {
    super(page, '/');
  }

  // Navigation elements
  get homeLink() { return this.page.locator(this.locators.navigation.home); }
  get contactLink() { return this.page.locator(this.locators.navigation.contact); }
  get aboutUsLink() { return this.page.locator(this.locators.navigation.aboutUs); }
  get cartLink() { return this.page.locator(this.locators.navigation.cart); }
  get loginLink() { return this.page.locator(this.locators.navigation.login); }
  get signupLink() { return this.page.locator(this.locators.navigation.signup); }
  get logoutLink() { return this.page.locator(this.locators.navigation.logout); }

  // Product elements
  get productCards() { return this.page.locator(this.locators.products.productCard); }
  get productTitles() { return this.page.locator(this.locators.products.productTitle); }
  get productPrices() { return this.page.locator(this.locators.products.productPrice); }
  get categoryFilters() { return this.page.locator(this.locators.products.categoryFilter); }
  get nextButton() { return this.page.locator(this.locators.products.nextButton); }
  get prevButton() { return this.page.locator(this.locators.products.prevButton); }

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
    await this.page.waitForSelector("#logInModal", { state: 'visible' });
  }

  /**
   * Click on signup link
   */
  async clickSignup(): Promise<void> {
    await this.signupLink.click();
    await this.page.waitForSelector("#signInModal", { state: 'visible' });
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
    const categoryFilter = this.page.locator(this.locators.products.categoryFilter, { hasText: category });
    await categoryFilter.click();
    await this.page.waitForTimeout(2000); // Wait for products to load
  }

  /**
   * Click on a specific product by name
   */
  async clickProduct(productName: string): Promise<void> {
    const productCard = this.page.locator(this.locators.products.productCard)
      .filter({ has: this.page.locator(this.locators.products.productTitle, { hasText: productName }) });
    await productCard.click();
    await this.waitForNavigation();
  }

  /**
   * Search for products (demo implementation - may not work on actual site)
   */
  async searchProducts(searchTerm: string): Promise<string[]> {
    const titles = await this.getProductTitles();
    return titles.filter(title => 
      title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Navigate to next page of products
   */
  async goToNextPage(): Promise<void> {
    if (await this.nextButton.isEnabled()) {
      await this.nextButton.click();
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * Navigate to previous page of products
   */
  async goToPrevPage(): Promise<void> {
    if (await this.prevButton.isEnabled()) {
      await this.prevButton.click();
      await this.page.waitForTimeout(2000);
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
      await this.page.waitForTimeout(1000);
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
   * Get categories available
   */
  async getAvailableCategories(): Promise<string[]> {
    const categories = await this.categoryFilters.allTextContents();
    return categories.filter(cat => cat.trim() !== '');
  }

  /**
   * Wait for products to load
   */
  async waitForProductsToLoad(): Promise<void> {
    await this.productCards.first().waitFor({ state: 'visible' });
    await this.page.waitForTimeout(1000); // Additional wait for dynamic loading
  }

  /**
   * Click on product by index using CSS
   */
  async clickProductByIndex(index: number): Promise<void> {
    const productSelector = `.card:nth-of-type(${index + 1}) a.hrefch`;
    await this.page.locator(productSelector).click();
    await this.waitForNavigation();
  }

  /**
   * Get product details by CSS position
   */
  async getProductDetailsByIndex(index: number): Promise<{title: string, price: string}> {
    const titleSelector = `.card:nth-of-type(${index + 1}) a.hrefch`;
    const priceSelector = `.card:nth-of-type(${index + 1}) h5`;
    
    const title = await this.page.locator(titleSelector).textContent() || '';
    const price = await this.page.locator(priceSelector).textContent() || '';
    
    return { title, price };
  }

  /**
   * Click on category using CSS text matching
   */
  async clickCategoryByText(categoryText: string): Promise<void> {
    const categorySelector = this.page.locator('a.list-group-item', { hasText: categoryText });
    await categorySelector.click();
    await this.waitForProductsToLoad();
  }

  /**
   * Add product to cart by name using CSS
   */
  async addProductToCartByName(productName: string): Promise<void> {
    const productCard = this.page.locator('.card')
      .filter({ has: this.page.locator('a.hrefch', { hasText: productName }) });
    await productCard.locator('a.hrefch').click();
    await this.waitForNavigation();
  }
}