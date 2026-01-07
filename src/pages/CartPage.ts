import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  // Locators
  private readonly locators = {
    cart: {
      table: "#tbodyid",
      cartItems: "#tbodyid tr",
      productTitle: "td:nth-child(2)",
      productPrice: "td:nth-child(3)",
      deleteButton: "td:nth-child(4) a",
      totalPrice: "#totalp",
      placeOrderButton: "button[data-target='#orderModal']",
    },
    orderModal: {
      modal: "#orderModal",
      name: "#name",
      country: "#country", 
      city: "#city",
      creditCard: "#card",
      month: "#month",
      year: "#year",
      purchaseButton: "button[onclick='purchaseOrder()']",
      closeButton: "#orderModal .close",
    },
    navigation: {
      continueShoppingButton: "button.btn.btn-success",
    },
  };

  constructor(page: Page) {
    super(page, '/cart.html');
  }

  // Cart elements
  get cartTable() { return this.page.locator(this.locators.cart.table); }
  get cartItems() { return this.page.locator(this.locators.cart.cartItems); }
  get totalPrice() { return this.page.locator(this.locators.cart.totalPrice); }
  get placeOrderButton() { return this.page.locator(this.locators.cart.placeOrderButton); }

  // Order modal elements
  get orderModal() { return this.page.locator(this.locators.orderModal.modal); }
  get nameInput() { return this.page.locator(this.locators.orderModal.name); }
  get countryInput() { return this.page.locator(this.locators.orderModal.country); }
  get cityInput() { return this.page.locator(this.locators.orderModal.city); }
  get creditCardInput() { return this.page.locator(this.locators.orderModal.creditCard); }
  get monthInput() { return this.page.locator(this.locators.orderModal.month); }
  get yearInput() { return this.page.locator(this.locators.orderModal.year); }
  get purchaseButton() { return this.page.locator(this.locators.orderModal.purchaseButton); }
  get closeButton() { return this.page.locator(this.locators.orderModal.closeButton); }

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
  async getCartProducts(): Promise<Array<{title: string, price: string}>> {
    await this.cartItems.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    const itemCount = await this.cartItems.count();
    const products = [];

    for (let i = 0; i < itemCount; i++) {
      const item = this.cartItems.nth(i);
      const title = await item.locator(this.locators.cart.productTitle).textContent() || '';
      const price = await item.locator(this.locators.cart.productPrice).textContent() || '';
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
    await this.page.waitForTimeout(1000); // Wait for removal
  }

  /**
   * Remove product from cart by name
   */
  async removeProductByName(productName: string): Promise<void> {
    const item = this.cartItems.filter({ 
      has: this.page.locator(this.locators.cart.productTitle, { hasText: productName }) 
    });
    await item.locator(this.locators.cart.deleteButton).click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get total price
   */
  async getTotalPrice(): Promise<string> {
    await this.totalPrice.waitFor({ state: 'visible' });
    return await this.totalPrice.textContent() || '';
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    try {
      await this.cartItems.first().waitFor({ state: 'visible', timeout: 3000 });
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
   * Fill order form and purchase
   */
  async fillOrderFormAndPurchase(orderDetails: {
    name: string;
    country: string;
    city: string;
    creditCard: string;
    month: string;
    year: string;
  }): Promise<void> {
    await this.orderModal.waitFor({ state: 'visible' });
    
    await this.nameInput.fill(orderDetails.name);
    await this.countryInput.fill(orderDetails.country);
    await this.cityInput.fill(orderDetails.city);
    await this.creditCardInput.fill(orderDetails.creditCard);
    await this.monthInput.fill(orderDetails.month);
    await this.yearInput.fill(orderDetails.year);
    
    await this.purchaseButton.click();
    
    // Wait for success alert
    await this.page.waitForFunction(() => {
      return window.confirm || window.alert;
    });
  }

  /**
   * Clear all items from cart
   */
  async clearCart(): Promise<void> {
    const itemCount = await this.getCartItemCount();
    
    for (let i = itemCount - 1; i >= 0; i--) {
      await this.removeProductByIndex(0); // Always remove first item
    }
  }

  /**
   * Verify cart page is loaded
   */
  async verifyCartPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.placeOrderButton).toBeVisible();
  }

  /**
   * Get product details by name
   */
  async getProductDetailsByName(productName: string): Promise<{title: string, price: string} | null> {
    const item = this.cartItems.filter({ 
      has: this.page.locator(this.locators.cart.productTitle, { hasText: productName }) 
    });
    
    if (await item.count() === 0) {
      return null;
    }
    
    const title = await item.locator(this.locators.cart.productTitle).textContent() || '';
    const price = await item.locator(this.locators.cart.productPrice).textContent() || '';
    
    return { title, price };
  }
}