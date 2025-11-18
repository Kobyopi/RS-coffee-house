import { apiService } from '../services/api';
import { StorageService } from '../utils/storage';
import { showNotification, updateCartCounter } from '../utils/ui';
import { initLogout, initTheme, initThemeToggle, updateCartVisibility } from '../common';
import type { ApiOrderRequest, ApiOrderItem, CartItem } from '../types';

class CartPage {
  private cartItemsContainer: HTMLElement | null;
  private cartSummaryContainer: HTMLElement | null;

  constructor() {
    this.cartItemsContainer = document.getElementById('cartItems');
    this.cartSummaryContainer = document.getElementById('cartSummary');
    this.init();
  }

  private init(): void {
    this.initBurgerMenu();
    this.renderCart();
    updateCartVisibility();
  }

  private initBurgerMenu(): void {
    const burgerIcon = document.querySelector('.burger-icon') as HTMLElement;
    const burgerMenu = document.querySelector('.burger-menu') as HTMLElement;
    const burgerLinks = document.querySelectorAll('.burger-link');

    if (burgerIcon) {
      burgerIcon.addEventListener('click', () => {
        burgerIcon.classList.toggle('active');
        burgerMenu.classList.toggle('active');
        document.body.classList.toggle('burger-open');
      });
    }

    if (burgerLinks) {
      burgerLinks.forEach((link) => {
        link.addEventListener('click', () => {
          burgerIcon.classList.remove('active');
          burgerMenu.classList.remove('active');
          document.body.classList.remove('burger-open');
        });
      });
    }
  }

  private renderCart(): void {
    const cart = StorageService.getCart();
    const isLoggedIn = StorageService.isUserLoggedIn();
    const user = StorageService.getUser();

    if (!this.cartItemsContainer || !this.cartSummaryContainer) return;

    if (cart.items.length === 0) {
      this.renderEmptyCart();
      return;
    }

    // Render cart items
    this.cartItemsContainer.innerHTML = '';
    cart.items.forEach((item, index) => {
      const cartItem = this.createCartItemElement(item, index);
      this.cartItemsContainer!.appendChild(cartItem);
    });

    // Render cart summary at the bottom
    this.cartSummaryContainer.innerHTML = '';

    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'cart-summary-content';

    // Calculate total price
    let totalPrice = cart.totalPrice;
    if (isLoggedIn && cart.totalDiscount > 0) {
      totalPrice = cart.totalPrice - cart.totalDiscount;
    }

    // Auth/Order section with total, address, and payment
    if (!isLoggedIn) {
      summaryDiv.innerHTML = `
        <div class="cart-total-row">
          <span class="cart-total-label">Total:</span>
          <span class="cart-total-value">${isLoggedIn && cart.totalDiscount > 0 ? `<span class="price-original">$${cart.totalPrice.toFixed(2)}</span> ` : ''}$${totalPrice.toFixed(2)}</span>
        </div>
        <div class="cart-auth-section">
          <p class="cart-auth-message">Please sign in to complete your order</p>
          <div class="cart-auth-buttons">
            <a href="signin.html" class="btn cart-auth-btn">Sign In</a>
            <a href="registration.html" class="btn cart-auth-btn cart-auth-btn-secondary">Register</a>
          </div>
        </div>
      `;
    } else {
      summaryDiv.innerHTML = `
        <div class="cart-total-row">
          <span class="cart-total-label">Total:</span>
          <span class="cart-total-value">${cart.totalDiscount > 0 ? `<span class="price-original">$${cart.totalPrice.toFixed(2)}</span> ` : ''}$${totalPrice.toFixed(2)}</span>
        </div>
        <div class="cart-info-row">
          <span class="cart-info-label">Address:</span>
          <span class="cart-info-value">${user!.city}, ${user!.street}, ${user!.houseNumber}</span>
        </div>
        <div class="cart-info-row">
          <span class="cart-info-label">Pay by:</span>
          <span class="cart-info-value">${user!.paymentMethod === 'cash' ? 'Cash' : 'Card'}</span>
        </div>
        <button class="btn cart-confirm-btn" id="confirmOrderBtn">Confirm</button>
      `;

      // Add event listener for confirm order button
      setTimeout(() => {
        const confirmBtn = document.getElementById('confirmOrderBtn');
        if (confirmBtn) {
          confirmBtn.addEventListener('click', () => this.confirmOrder());
        }
      }, 0);
    }

    this.cartSummaryContainer.appendChild(summaryDiv);
  }

  private createCartItemElement(item: CartItem, index: number): HTMLElement {
    const isLoggedIn = StorageService.isUserLoggedIn();
    
    let itemPrice = item.price + item.sizePrice;
    // Additives are now just strings, assume each is $0.50
    const additivesPrice = item.additives.length * 0.5;
    itemPrice += additivesPrice;

    let finalPrice = itemPrice;
    if (isLoggedIn && item.discountPrice !== undefined) {
      finalPrice = item.discountPrice + item.sizePrice + additivesPrice;
    }

    const cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cart-item';

    // Format size with correct unit
    const sizeUnit = item.category === 'dessert' ? 'g' : 'ml';
    const sizeValue = item.size === 'S' ? (item.category === 'dessert' ? '50' : '200') :
                      item.size === 'M' ? (item.category === 'dessert' ? '100' : '300') :
                      (item.category === 'dessert' ? '200' : '400');
    
    const additivesText = item.additives.length > 0 
      ? `, ${item.additives.join(', ')}`
      : '';

    const priceHTML = isLoggedIn && item.discountPrice !== undefined
      ? `<span class="price-original">$${itemPrice.toFixed(2)}</span> <span class="price-discounted">$${finalPrice.toFixed(2)}</span>`
      : `$${itemPrice.toFixed(2)}`;

    cartItemDiv.innerHTML = `
      <button class="cart-item-remove" data-index="${index}" aria-label="Remove item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <img src="${item.image}" alt="${item.productName}" class="cart-item-img">
      <div class="cart-item-info">
        <h3 class="cart-item-name">${item.productName}</h3>
        <p class="cart-item-details">${sizeValue}${sizeUnit}${additivesText}</p>
      </div>
      <p class="cart-item-price">${priceHTML}</p>
    `;

    const removeBtn = cartItemDiv.querySelector('.cart-item-remove');
    removeBtn?.addEventListener('click', () => this.removeItem(index));

    return cartItemDiv;
  }

  private renderEmptyCart(): void {
    if (!this.cartItemsContainer || !this.cartSummaryContainer) return;

    this.cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path d="M37.5 8.333L29.167 29.167M29.167 29.167H12.5M29.167 29.167L25 91.667H75L70.833 29.167M70.833 29.167H87.5M70.833 29.167L62.5 8.333M41.667 45.833V70.833M58.333 45.833V70.833" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 class="cart-empty-title">Your cart is empty</h2>
        <p class="cart-empty-text">Add some delicious items to your cart!</p>
        <a href="menu.html" class="btn cart-empty-btn">Browse Menu</a>
      </div>
    `;

    this.cartSummaryContainer.innerHTML = '';
  }

  private removeItem(index: number): void {
    StorageService.removeFromCart(index);
    this.renderCart();
    updateCartCounter(StorageService.getCartItemCount());
    showNotification('Item removed from cart', 'success');
  }

  private async confirmOrder(): Promise<void> {
    const cart = StorageService.getCart();
    
    if (cart.items.length === 0) return;

    const confirmBtn = document.getElementById('confirmOrderBtn') as HTMLButtonElement;
    if (!confirmBtn) return;

    // Show loading state
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `
      <div class="loader-spinner loader-spinner-small"></div>
      Processing...
    `;

    // Group items by product ID, size, and additives for quantity calculation
    const itemsMap = new Map<string, ApiOrderItem>();
    
    cart.items.forEach((item) => {
      const key = `${item.productId}-${item.size}-${item.additives.sort().join(',')}`;
      const existing = itemsMap.get(key);
      
      if (existing) {
        existing.quantity += 1;
      } else {
        itemsMap.set(key, {
          productId: item.productId,
          size: item.size.toLowerCase(),
          additives: item.additives,
          quantity: 1,
        });
      }
    });

    const order: ApiOrderRequest = {
      items: Array.from(itemsMap.values()),
      totalPrice: cart.totalPrice - cart.totalDiscount,
    };

    try {
      const response = await apiService.placeOrder(order);

      if (!response.error) {
        // Clear cart
        StorageService.clearCart();
        
        // Show success message
        if (this.cartItemsContainer) {
          this.cartItemsContainer.innerHTML = `
            <div class="cart-success">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" stroke="#4CAF50" stroke-width="4"/>
                <path d="M30 50L45 65L70 35" stroke="#4CAF50" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h2 class="cart-success-title">Thank you for your order!</h2>
              <p class="cart-success-text">Our manager will contact you shortly.</p>
              <a href="menu.html" class="btn cart-success-btn">Continue Shopping</a>
            </div>
          `;
        }

        if (this.cartSummaryContainer) {
          this.cartSummaryContainer.innerHTML = '';
        }

        updateCartCounter(0);
      } else {
        showNotification(response.error || 'Something went wrong. Please, try again', 'error');
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Order';
      }
    } catch (error) {
      showNotification('Something went wrong. Please, try again', 'error');
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Confirm Order';
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  new CartPage();
  initLogout();
  initThemeToggle();
});

