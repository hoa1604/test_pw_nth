import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../config/config';

export class ProductPage extends BasePage {
  // Locators
  private readonly locators = {
    productDetail: {
      title: 'h2.name',
      price: 'h3.price-container',
      addToCart: 'a.btn.btn-success.btn-lg',
      description: '#more-information p',
      image: '.item.active img',
    },
  };

  constructor(page: Page) {
    super(page);
  }

  // Product detail elements
  get productTitle() {
    return this.page.locator(this.locators.productDetail.title);
  }
  get productPrice() {
    return this.page.locator(this.locators.productDetail.price);
  }
  get addToCartButton() {
    return this.page.locator(this.locators.productDetail.addToCart);
  }
  get productDescription() {
    return this.page.locator(this.locators.productDetail.description);
  }
  get productImage() {
    return this.page.locator(this.locators.productDetail.image);
  }

  /**
   * Get product title
   */
  async getProductTitle(): Promise<string> {
    await this.productTitle.waitFor({ state: 'visible' });
    return (await this.productTitle.textContent()) || '';
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<string> {
    await this.productPrice.waitFor({ state: 'visible' });
    const priceText = (await this.productPrice.textContent()) || '';
    return priceText.replace('*includes tax', '').trim();
  }

  /**
   * Add product to cart
   */
  async addToCart(): Promise<void> {
    // Handle the confirmation dialog
    this.page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Product added');
      await dialog.accept();
    });

    await this.addToCartButton.click();

    // Wait for dialog to appear and be handled
    await this.page
      .waitForLoadState('networkidle', { timeout: config.timeout.expect })
      .catch(() => {});
  }

  /**
   * Verify product page is loaded
   */
  async verifyProductPageLoaded(): Promise<void> {
    await expect(this.productTitle).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.productImage).toBeVisible();
  }

  /**
   * Get product information
   */
  async getProductInfo(): Promise<{ title: string; price: string }> {
    return {
      title: await this.getProductTitle(),
      price: await this.getProductPrice(),
    };
  }
}
