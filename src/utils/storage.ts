import type { Cart, User, CartItem, FavoriteProduct } from '../types';

const STORAGE_KEYS = {
  CART: 'coffee_house_cart',
  USER: 'coffee_house_user',
  AUTH_TOKEN: 'authToken',
  FAVORITES: 'coffee_house_favorites',
  THEME: 'coffee_house_theme',
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

  // Favorites operations
  static getFavorites(): FavoriteProduct[] {
    const favoritesData = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (favoritesData) {
      try {
        return JSON.parse(favoritesData) as FavoriteProduct[];
      } catch (error) {
        console.error('Error parsing favorites data:', error);
      }
    }
    return [];
  }

  static saveFavorites(favorites: FavoriteProduct[]): void {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }

  static addToFavorites(product: FavoriteProduct): void {
    const favorites = this.getFavorites();
    // Check if already in favorites
    if (!favorites.find(fav => fav.id === product.id)) {
      favorites.push(product);
      this.saveFavorites(favorites);
    }
  }

  static removeFromFavorites(productId: number): void {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== productId);
    this.saveFavorites(updatedFavorites);
  }

  static isFavorite(productId: number): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.id === productId);
  }

  static toggleFavorite(product: FavoriteProduct): boolean {
    const isFav = this.isFavorite(product.id);
    if (isFav) {
      this.removeFromFavorites(product.id);
      return false;
    } else {
      this.addToFavorites(product);
      return true;
    }
  }

  static getFavoritesCount(): number {
    return this.getFavorites().length;
  }

  static clearFavorites(): void {
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  }

  // Theme operations
  static getTheme(): 'light' | 'dark' {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return theme === 'dark' ? 'dark' : 'light';
  }

  static setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  static toggleTheme(): 'light' | 'dark' {
    const currentTheme = this.getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  }
}



