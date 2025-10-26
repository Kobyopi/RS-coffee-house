import type { Cart, User, CartItem } from '../types';

const STORAGE_KEYS = {
  CART: 'coffee_house_cart',
  USER: 'coffee_house_user',
  AUTH_TOKEN: 'authToken',
} as const;

export class StorageService {
  // Cart operations
  static getCart(): Cart {
    const cartData = localStorage.getItem(STORAGE_KEYS.CART);
    if (cartData) {
      try {
        return JSON.parse(cartData) as Cart;
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    }
    return { items: [], totalPrice: 0, totalDiscount: 0 };
  }

  static saveCart(cart: Cart): void {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }

  static addToCart(item: CartItem): void {
    const cart = this.getCart();
    cart.items.push(item);
    this.updateCartTotals(cart);
    this.saveCart(cart);
  }

  static removeFromCart(index: number): void {
    const cart = this.getCart();
    cart.items.splice(index, 1);
    this.updateCartTotals(cart);
    this.saveCart(cart);
  }

  static clearCart(): void {
    localStorage.removeItem(STORAGE_KEYS.CART);
  }

  static getCartItemCount(): number {
    const cart = this.getCart();
    return cart.items.length;
  }

  private static updateCartTotals(cart: Cart): void {
    let totalPrice = 0;
    let totalDiscount = 0;

    cart.items.forEach((item) => {
      const itemPrice = item.price + item.sizePrice;
      // Additives are now just strings, assume each is $0.50
      const additivesPrice = item.additives.length * 0.5;
      const fullPrice = itemPrice + additivesPrice;

      totalPrice += fullPrice;

      if (item.discountPrice !== undefined) {
        const discountedItemPrice = item.discountPrice + item.sizePrice + additivesPrice;
        totalDiscount += fullPrice - discountedItemPrice;
      }
    });

    cart.totalPrice = totalPrice;
    cart.totalDiscount = totalDiscount;
  }

  // User operations (delegated to localStorage directly)
  static getUser(): User | null {
    const userData = localStorage.getItem('coffee_house_user');
    if (userData) {
      try {
        return JSON.parse(userData) as User;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return null;
  }

  static saveUser(user: User): void {
    localStorage.setItem('coffee_house_user', JSON.stringify(user));
  }

  static clearUser(): void {
    localStorage.removeItem('coffee_house_user');
    localStorage.removeItem('authToken');
  }

  static isUserLoggedIn(): boolean {
    return localStorage.getItem('authToken') !== null && 
           localStorage.getItem('coffee_house_user') !== null;
  }

  static getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  static saveAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  static clearAllAuthData(): void {
    this.clearUser();
    this.clearCart();
  }

  static logout(): void {
    this.clearUser();
  }
}



