import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../config/config';

export class CartPage extends BasePage {
  // Locators
  private readonly locators = {
    cart: {
      table: '#tbodyid',
      cartItems: '#tbodyid tr',
      productTitle: 'td:nth-child(2)',
      productPrice: 'td:nth-child(3)',
      deleteButton: 'td:nth-child(4) a',
      totalPrice: '#totalp',
      placeOrderButton: "button[data-target='#orderModal']",
    },
    orderModal: {
      modal: '#orderModal',
      name: '#name',
      country: '#country',
      city: '#city',
      creditCard: '#card',
      month: '#month',
      year: '#year',
      purchaseButton: "button[onclick='purchaseOrder()']",
      closeButton: '#orderModal .close',
    },
    navigation: {
      continueShoppingButton: 'button.btn.btn-success',
    },
  };

  constructor(page: Page) {
    super(page, '/cart.html');
  }

  // Cart elements
  get cartTable() {
    return this.page.locator(this.locators.cart.table);
  }
  get cartItems() {
    return this.page.locator(this.locators.cart.cartItems);
  }
  get totalPrice() {
    return this.page.locator(this.locators.cart.totalPrice);
  }
  get placeOrderButton() {
    return this.page.locator(this.locators.cart.placeOrderButton);
  }

  // Order modal elements
  get orderModal() {
    return this.page.locator(this.locators.orderModal.modal);
  }
  get nameInput() {
    return this.page.locator(this.locators.orderModal.name);
  }
  get countryInput() {
    return this.page.locator(this.locators.orderModal.country);
  }
  get cityInput() {
    return this.page.locator(this.locators.orderModal.city);
  }
  get creditCardInput() {
    return this.page.locator(this.locators.orderModal.creditCard);
  }
  get monthInput() {
    return this.page.locator(this.locators.orderModal.month);
  }
  get yearInput() {
    return this.page.locator(this.locators.orderModal.year);
  }
  get purchaseButton() {
    return this.page.locator(this.locators.orderModal.purchaseButton);
  }
  get closeButton() {
    return this.page.locator(this.locators.orderModal.closeButton);
  }

  /**
   * Navigate to cart page
   */
  async navigateToCart(): Promise<void> {
    await this.goto();
    await this.waitForPageLoad();
  }

  /**
   * Get all products in cart
   */
  async getCartProducts(): Promise<Array<{ title: string; price: string }>> {
    await this.cartItems
      .first()
      .waitFor({ state: 'visible', timeout: config.timeout.expect })
      .catch(() => {});
    const itemCount = await this.cartItems.count();
    const products = [];

    for (let i = 0; i < itemCount; i++) {
      const item = this.cartItems.nth(i);
      const title = (await item.locator(this.locators.cart.productTitle).textContent()) || '';
      const price = (await item.locator(this.locators.cart.productPrice).textContent()) || '';
      products.push({ title, price });
    }

    return products;
  }

  /**
   * Remove product from cart by index
   */
  async removeProductByIndex(index: number): Promise<void> {
    const item = this.cartItems.nth(index);
    await item.locator(this.locators.cart.deleteButton).click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {}); // Wait for removal
  }

  /**
   * Get total price
   */
  async getTotalPrice(): Promise<string> {
    await this.totalPrice.waitFor({ state: 'visible' });
    return (await this.totalPrice.textContent()) || '';
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    try {
      await this.cartItems.first().waitFor({ state: 'visible', timeout: config.timeout.expect });
      return await this.cartItems.count();
    } catch {
      return 0; // Cart is empty
    }
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    return (await this.getCartItemCount()) === 0;
  }

  /**
   * Click place order button
   */
  async clickPlaceOrder(): Promise<void> {
    await this.placeOrderButton.click();
    await this.orderModal.waitFor({ state: 'visible' });
  }

  /**
   * Verify cart page is loaded
   */
  async verifyCartPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.placeOrderButton).toBeVisible();
  }
}
