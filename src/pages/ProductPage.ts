import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  // Locators
  private readonly locators = {
    productDetail: {
      title: "h2.name",
      price: "h3.price-container",
      addToCart: "a.btn.btn-success.btn-lg",
      description: "#more-information p",
      image: ".item.active img",
    },
  };

  constructor(page: Page) {
    super(page);
  }

  // Product detail elements
  get productTitle() { return this.page.locator(this.locators.productDetail.title); }
  get productPrice() { return this.page.locator(this.locators.productDetail.price); }
  get addToCartButton() { return this.page.locator(this.locators.productDetail.addToCart); }
  get productDescription() { return this.page.locator(this.locators.productDetail.description); }
  get productImage() { return this.page.locator(this.locators.productDetail.image); }

  /**
   * Get product title
   */
  async getProductTitle(): Promise<string> {
    await this.productTitle.waitFor({ state: 'visible' });
    return await this.productTitle.textContent() || '';
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<string> {
    await this.productPrice.waitFor({ state: 'visible' });
    const priceText = await this.productPrice.textContent() || '';
    return priceText.replace('*includes tax', '').trim();
  }

  /**
   * Get product description
   */
  async getProductDescription(): Promise<string> {
    await this.productDescription.waitFor({ state: 'visible' });
    return await this.productDescription.textContent() || '';
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
    await this.page.waitForTimeout(2000);
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
  async getProductInfo(): Promise<{title: string, price: string, description: string}> {
    return {
      title: await this.getProductTitle(),
      price: await this.getProductPrice(),
      description: await this.getProductDescription(),
    };
  }

  /**
   * Check if add to cart button is enabled
   */
  async isAddToCartEnabled(): Promise<boolean> {
    return await this.addToCartButton.isEnabled();
  }

  /**
   * Check if product image is loaded
   */
  async isProductImageLoaded(): Promise<boolean> {
    await this.productImage.waitFor({ state: 'visible' });
    const src = await this.productImage.getAttribute('src');
    return src !== null && src !== '';
  }

  /**
   * Navigate back to home page
   */
  async navigateBackToHome(): Promise<void> {
    await this.page.goBack();
    await this.waitForNavigation();
  }
}