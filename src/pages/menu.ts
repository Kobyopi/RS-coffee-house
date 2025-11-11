import { apiService } from '../services/api';
import { StorageService } from '../utils/storage';
import { showLoader, hideLoader, showNotification, updateFavoriteIcon, updateFavoritesCounter } from '../utils/ui';
import { initLogout, updateCartVisibility, initTheme, initThemeToggle } from '../common';
import { productImages } from '../utils/imageImports';
import type { Product, CartItem, FavoriteProduct } from '../types';

// Mock product data (fallback if API fails)
const productsData: Record<string, Product[]> = {
  coffee: [
    {
      id: 1,
      name: 'Irish coffee',
      description: 'Fragnant black coffee with Jameson Irish whiskey and whipped milk',
      price: 7.00,
      discountPrice: 6.75,
      category: 'coffee',
      image: productImages[1]
    },
    {
      id: 2,
      name: 'Kahlua coffee',
      description: 'Classic coffee with milk and Kahlua liqueur under a cap of frothed milk',
      price: 7.00,
      discountPrice: 6.75,
      category: 'coffee',
      image: productImages[2]
    },
    {
      id: 3,
      name: 'Honey raf',
      description: 'Espresso with frothed milk, cream and aromatic honey',
      price: 5.50,
      discountPrice: 5.25,
      category: 'coffee',
      image: productImages[3]
    },
    {
      id: 4,
      name: 'Ice cappuccino',
      description: 'Cappuccino with soft thick foam in summer version with ice',
      price: 5.00,
      discountPrice: 4.75,
      category: 'coffee',
      image: productImages[4]
    },
    {
      id: 5,
      name: 'Espresso',
      description: 'Classic black coffee',
      price: 4.50,
      discountPrice: 4.25,
      category: 'coffee',
      image: productImages[5]
    },
    {
      id: 6,
      name: 'Latte',
      description: 'Espresso coffee with the addition of steamed milk and dense milk foam',
      price: 5.50,
      discountPrice: 5.25,
      category: 'coffee',
      image: productImages[6]
    },
    {
      id: 7,
      name: 'Latte macchiato',
      description: 'Espresso with forthed milk and chocolate',
      price: 5.50,
      discountPrice: 5.25,
      category: 'coffee',
      image: productImages[7]
    },
    {
      id: 8,
      name: 'Coffee with cognac',
      description: 'Fragnant black coffee with cognac and whipped cream',
      price: 6.50,
      discountPrice: 6.25,
      category: 'coffee',
      image: productImages[8]
    }
  ],
  tea: [
    {
      id: 9,
      name: 'Moroccan',
      description: 'Fragnant black tea with the addition of tangerine, cinnamon, honey, lemon and mint',
      price: 4.50,
      discountPrice: 4.25,
      category: 'tea',
      image: productImages[9]
    },
    {
      id: 10,
      name: 'Ginger',
      description: 'Original black tea with fresh ginger, lemon and honey',
      price: 5.00,
      discountPrice: 4.75,
      category: 'tea',
      image: productImages[10]
    },
    {
      id: 11,
      name: 'Cranberry',
      description: 'Invigorating black tea with cranberry and honey',
      price: 5.00,
      discountPrice: 4.75,
      category: 'tea',
      image: productImages[11]
    },
    {
      id: 12,
      name: 'Sea buckthorn',
      description: 'Toning sweet black tea with sea buckthorn, fresh thyme and cinnamon',
      price: 5.50,
      discountPrice: 5.25,
      category: 'tea',
      image: productImages[12]
    }
  ],
  dessert: [
    {
      id: 13,
      name: 'Marble cheesecake',
      description: 'Philadelphia cheese with lemon zest on a light sponge cake and red currant jam',
      price: 3.50,
      discountPrice: 3.25,
      category: 'dessert',
      image: productImages[13]
    },
    {
      id: 14,
      name: 'Red velvet',
      description: 'Layer cake with cream cheese frosting',
      price: 4.00,
      discountPrice: 3.75,
      category: 'dessert',
      image: productImages[14]
    },
    {
      id: 15,
      name: 'Cheesecakes',
      description: 'Soft cottage cheese pancakes with sour cream and fresh berries and sprinkled with powdered sugar',
      price: 4.50,
      discountPrice: 4.25,
      category: 'dessert',
      image: productImages[15]
    },
    {
      id: 16,
      name: 'Creme brulee',
      description: 'Delicate creamy dessert in a caramel basket with wild berries',
      price: 4.00,
      discountPrice: 3.75,
      category: 'dessert',
      image: productImages[16]
    },
    {
      id: 17,
      name: 'Pancakes',
      description: 'Tender pancakes with strawberry jam and fresh strawberries',
      price: 4.50,
      discountPrice: 4.25,
      category: 'dessert',
      image: productImages[17]
    },
    {
      id: 18,
      name: 'Honey cake',
      description: 'Classic honey cake with delicate custard',
      price: 4.50,
      discountPrice: 4.25,
      category: 'dessert',
      image: productImages[18]
    },
    {
      id: 19,
      name: 'Chocolate cake',
      description: 'Cake with hot chocolate filling and nuts with dried apricots',
      price: 5.50,
      discountPrice: 5.25,
      category: 'dessert',
      image: productImages[19]
    },
    {
      id: 20,
      name: 'Black forest',
      description: 'A combination of thin sponge cake with cherry jam and light chocolate mousse',
      price: 6.50,
      discountPrice: 6.25,
      category: 'dessert',
      image: productImages[20]
    }
  ]
};

class MenuPage {
  private currentCategory: string = 'coffee';
  private showingAll: boolean = true;
  private currentProduct: Product | null = null;
  private loadingCategory: string | null = null; // Track which category is currently loading
  private showingFavorites: boolean = false;

  private productsGrid: HTMLElement | null;
  private loadMoreBtn: HTMLElement | null;
  private modal: HTMLElement | null;
  private favoritesBtn: HTMLElement | null;

  constructor() {
    this.productsGrid = document.getElementById('productsGrid');
    this.loadMoreBtn = document.getElementById('loadMoreBtn');
    this.modal = document.getElementById('productModal');
    this.favoritesBtn = document.getElementById('favoritesBtn');
    this.init();
  }

  private init(): void {
    this.initMenuTabs();
    this.initLoadMore();
    this.initModal();
    this.initResize();
    this.initFavorites();
    this.renderProducts('coffee');
    updateCartVisibility();
    this.updateFavoritesCounter();
  }

  private initMenuTabs(): void {
    const menuTabs = document.querySelectorAll('.menu-tab');
    menuTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        menuTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const category = (tab as HTMLElement).dataset.category || 'coffee';
        this.renderProducts(category);
      });
    });
  }

  private initLoadMore(): void {
    if (this.loadMoreBtn) {
      this.loadMoreBtn.addEventListener('click', () => {
        this.loadMoreBtn!.classList.add('loading');

        setTimeout(() => {
          // Re-render all products for current category
          this.renderProducts(this.currentCategory);
        }, 300);
      });
    }
  }

  private initResize(): void {
    window.addEventListener('resize', () => {
      if (this.productsGrid) {
        const isMobile = window.innerWidth <= 768;
        const products = productsData[this.currentCategory];

        if (isMobile && products.length > 4 && this.showingAll) {
          this.renderProducts(this.currentCategory);
        } else if (!isMobile && !this.showingAll) {
          this.renderProducts(this.currentCategory);
        }
      }
    });
  }

  private async renderProducts(category: string): Promise<void> {
    this.currentCategory = category;
    this.loadingCategory = category; // Mark this category as loading
    this.showingFavorites = false; // Reset favorites view
    
    if (!this.productsGrid) return;

    // Restore tabs and title when switching back from favorites
    const menuTabs = document.querySelector('.menu-tabs') as HTMLElement;
    if (menuTabs) menuTabs.style.display = 'flex';
    const menuTitle = document.querySelector('.menu-title') as HTMLElement;
    if (menuTitle) {
      menuTitle.innerHTML = 'Behind each of our cups <br> hides an <span class="highlight">amazing surprise</span>';
    }

    // Clear products grid and show loader in its place
    this.productsGrid.innerHTML = '';
    const loader = showLoader(this.productsGrid);

    try {
      // Fetch from API - get all products then filter by category
      const response = await apiService.getProductsByCategory(category);
      
      // Check if user switched to a different category while loading
      if (this.loadingCategory !== category) {
        hideLoader(loader);
        return; // Ignore this response, user already switched categories
      }
      
      hideLoader(loader);

      let products: Product[];
      if (!response.error && response.data) {
        products = response.data;
      } else {
        // Fallback to mock data if API fails
        products = productsData[category] || [];
      }

      // Double-check category still matches before rendering
      if (this.loadingCategory !== category) {
        return; // User switched categories, don't render
      }

      // Clear loader and render products
      this.productsGrid.innerHTML = '';

      const isMobile = window.innerWidth <= 768;
      const productsToShow = isMobile && products.length > 4 ? products.slice(0, 4) : products;

      // Programmatically generate all product cards
      productsToShow.forEach((product) => {
        const productCard = this.createProductCard(product);
        this.productsGrid!.appendChild(productCard);
      });

      // Clear loading state
      this.loadingCategory = null;

      // Handle Load More button for mobile
      if (this.loadMoreBtn) {
        if (isMobile && products.length > 4 && productsToShow.length === 4) {
          this.loadMoreBtn.innerHTML = `
            Load More
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `;
          this.loadMoreBtn.style.display = 'flex';
          this.loadMoreBtn.classList.remove('loading');
          this.showingAll = false;
        } else {
          this.loadMoreBtn.style.display = 'none';
          this.showingAll = true;
        }
      }
    } catch (error) {
      // Only show error if we're still on this category
      if (this.loadingCategory === category) {
        hideLoader(loader);
        this.loadingCategory = null;
        // Show error message in place of loader
        this.productsGrid.innerHTML = `
          <div class="error-message">
            <p>Something went wrong. Please, refresh the page</p>
          </div>
        `;
      }
    }
  }

  private createProductCard(product: Product, isFavoriteView: boolean = false): HTMLElement {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const isLoggedIn = StorageService.isUserLoggedIn();
    const priceHTML = isLoggedIn && product.discountPrice
      ? `<p class="product-price"><span class="price-original">$${product.price.toFixed(2)}</span> <span class="price-discounted">$${product.discountPrice.toFixed(2)}</span></p>`
      : `<p class="product-price">$${product.price.toFixed(2)}</p>`;

    const isFavorite = StorageService.isFavorite(product.id);
    const heartIcon = isFavorite
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    card.innerHTML = `
      <button class="favorite-icon ${isFavorite ? 'active' : ''}" aria-label="Add to favorites">
        ${heartIcon}
      </button>
      <img src="${product.image}" alt="${product.name}" class="product-img">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        ${priceHTML}
      </div>
      ${isFavoriteView ? '<button class="quick-add-btn btn">Quick Add to Cart</button>' : ''}
    `;

    // Handle favorite icon click
    const favoriteIcon = card.querySelector('.favorite-icon');
    favoriteIcon?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFavorite(product, favoriteIcon as HTMLElement);
    });

    // Handle quick add to cart for favorites view
    if (isFavoriteView) {
      const quickAddBtn = card.querySelector('.quick-add-btn');
      quickAddBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.quickAddToCart(product);
      });
    }

    // Handle card click to open modal
    card.addEventListener('click', (e) => {
      // Don't open modal if clicking on buttons
      if ((e.target as HTMLElement).closest('.favorite-icon, .quick-add-btn')) {
        return;
      }
      this.openModal(product);
    });

    return card;
  }

  private initModal(): void {
    if (!this.modal) return;

    const modalOverlay = this.modal.querySelector('.modal-overlay');
    const modalClose = this.modal.querySelector('.modal-close');
    const modalCloseBtn = this.modal.querySelector('.modal-close-btn');

    modalOverlay?.addEventListener('click', () => this.closeModal());
    modalClose?.addEventListener('click', () => this.closeModal());
    modalCloseBtn?.addEventListener('click', () => this.addToCart());

    // Change the button text
    if (modalCloseBtn) {
      modalCloseBtn.textContent = 'Add to Cart';
    }

    // ESC key
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('modal-active')) {
        this.closeModal();
      }
    });

    // Size buttons
    document.querySelectorAll('.size-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        if (this.currentProduct) {
          this.updateModalPrice(this.currentProduct);
        }
      });

      // Tooltip
      btn.addEventListener('mouseenter', () => {
        this.showSizeTooltip(btn as HTMLElement);
      });

      btn.addEventListener('mouseleave', () => {
        this.hideTooltip(btn as HTMLElement);
      });
    });

    // Additive buttons
    document.querySelectorAll('.additive-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('active');

        if (this.currentProduct) {
          this.updateModalPrice(this.currentProduct);
        }
      });

      // Tooltip
      btn.addEventListener('mouseenter', () => {
        this.showAdditiveTooltip(btn as HTMLElement);
      });

      btn.addEventListener('mouseleave', () => {
        this.hideTooltip(btn as HTMLElement);
      });
    });
  }

  private async openModal(product: Product): Promise<void> {
    if (!this.modal) return;

    // Show overlay with loader
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    const loader = showLoader(overlay);
    document.body.appendChild(overlay);

    try {
      // Fetch product details from API
      const response = await apiService.getProductById(product.id);
      
      hideLoader(loader);
      overlay.remove();

      if (!response.error && response.data) {
        this.currentProduct = response.data;
      } else {
        // Fallback to passed product
        this.currentProduct = product;
      }

      this.showModalContent(this.currentProduct);
    } catch (error) {
      overlay.remove();
      showNotification('Something went wrong. Please, try again', 'error');
    }
  }

  private showModalContent(product: Product): void {
    if (!this.modal) return;

    const modalImg = document.getElementById('modalImg') as HTMLImageElement;
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    modalImg.src = product.image;
    modalImg.alt = product.name;
    if (modalTitle) modalTitle.textContent = product.name;
    if (modalDescription) modalDescription.textContent = product.description;

    const category = product.category;

    // Update sizes based on category
    const sizeButtons = document.querySelectorAll('.size-btn');
    if (category === 'dessert') {
      sizeButtons[0].querySelector('.size-volume')!.textContent = '50 g';
      sizeButtons[1].querySelector('.size-volume')!.textContent = '100 g';
      sizeButtons[2].querySelector('.size-volume')!.textContent = '200 g';
    } else {
      sizeButtons[0].querySelector('.size-volume')!.textContent = '200 ml';
      sizeButtons[1].querySelector('.size-volume')!.textContent = '300 ml';
      sizeButtons[2].querySelector('.size-volume')!.textContent = '400 ml';
    }

    // Update additives based on category
    const additiveButtons = document.querySelectorAll('.additive-btn');
    if (category === 'tea') {
      additiveButtons[0].querySelector('.additive-name')!.textContent = 'Sugar';
      additiveButtons[1].querySelector('.additive-name')!.textContent = 'Lemon';
      additiveButtons[2].querySelector('.additive-name')!.textContent = 'Syrup';
    } else if (category === 'dessert') {
      additiveButtons[0].querySelector('.additive-name')!.textContent = 'Berries';
      additiveButtons[1].querySelector('.additive-name')!.textContent = 'Nuts';
      additiveButtons[2].querySelector('.additive-name')!.textContent = 'Jam';
    } else {
      additiveButtons[0].querySelector('.additive-name')!.textContent = 'Sugar';
      additiveButtons[1].querySelector('.additive-name')!.textContent = 'Cinnamon';
      additiveButtons[2].querySelector('.additive-name')!.textContent = 'Syrup';
    }

    // Reset options
    document.querySelectorAll('.size-btn').forEach((btn) => btn.classList.remove('active'));
    document.querySelector('.size-btn[data-size="S"]')?.classList.add('active');
    document.querySelectorAll('.additive-btn').forEach((btn) => btn.classList.remove('active'));

    this.updateModalPrice(product);

    this.modal.classList.add('modal-active');
    document.body.classList.add('modal-open');
  }

  private closeModal(): void {
    if (this.modal) {
      this.modal.classList.remove('modal-active');
      document.body.classList.remove('modal-open');
      this.currentProduct = null;
    }
  }

  private updateModalPrice(product: Product): void {
    const isLoggedIn = StorageService.isUserLoggedIn();
    
    // Calculate discount ratio once if logged in
    const discountRatio = (isLoggedIn && product.discountPrice) 
      ? product.discountPrice / product.price 
      : 1;
    
    // Use discounted price for base if logged in and discount exists
    let totalPrice = isLoggedIn && product.discountPrice ? product.discountPrice : product.price;

    const activeSize = document.querySelector('.size-btn.active') as HTMLElement;
    if (activeSize) {
      const sizePrice = parseFloat(activeSize.dataset.price || '0');
      // Apply discount ratio and round to avoid floating-point errors
      const discountedSizePrice = Math.round(sizePrice * discountRatio * 100) / 100;
      totalPrice += discountedSizePrice;
    }

    const activeAdditives = document.querySelectorAll('.additive-btn.active');
    activeAdditives.forEach((additive) => {
      const additivePrice = parseFloat((additive as HTMLElement).dataset.price || '0');
      // Apply discount ratio and round to avoid floating-point errors
      const discountedAdditivePrice = Math.round(additivePrice * discountRatio * 100) / 100;
      totalPrice += discountedAdditivePrice;
    });

    const modalTotalPrice = document.getElementById('modalTotalPrice');
    if (modalTotalPrice) {
      // Show both original and discounted price for logged-in users
      if (isLoggedIn && product.discountPrice) {
        // Calculate original price
        let originalPrice = product.price;
        if (activeSize) {
          originalPrice += parseFloat(activeSize.dataset.price || '0');
        }
        activeAdditives.forEach((additive) => {
          originalPrice += parseFloat((additive as HTMLElement).dataset.price || '0');
        });
        
        // Round final total to ensure clean display
        totalPrice = Math.round(totalPrice * 100) / 100;
        
        modalTotalPrice.innerHTML = `<span class="price-original">$${originalPrice.toFixed(2)}</span> $${totalPrice.toFixed(2)}`;
      } else {
        modalTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
      }
    }
  }

  private showSizeTooltip(btn: HTMLElement): void {
    if (!this.currentProduct) return;
    
    const sizePrice = parseFloat(btn.dataset.price || '0');
    const isLoggedIn = StorageService.isUserLoggedIn();
    
    // Calculate total price for this size (base product + size price)
    const totalPrice = this.currentProduct.price + sizePrice;
    
    let tooltipText = `$${totalPrice.toFixed(2)}`;
    
    if (isLoggedIn && this.currentProduct.discountPrice) {
      // Calculate discounted total price with proper rounding
      const discountRatio = this.currentProduct.discountPrice / this.currentProduct.price;
      const discountedSizePrice = Math.round(sizePrice * discountRatio * 100) / 100;
      const discountedTotalPrice = Math.round((this.currentProduct.discountPrice + discountedSizePrice) * 100) / 100;
      
      tooltipText = `<span class="tooltip-original">$${totalPrice.toFixed(2)}</span> $${discountedTotalPrice.toFixed(2)}`;
    }

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerHTML = tooltipText;
    btn.appendChild(tooltip);
  }

  private showAdditiveTooltip(btn: HTMLElement): void {
    const additivePrice = parseFloat(btn.dataset.price || '0');
    const isLoggedIn = StorageService.isUserLoggedIn();
    
    // Show just the additive's own price
    let tooltipText = `$${additivePrice.toFixed(2)}`;
    
    if (isLoggedIn && this.currentProduct?.discountPrice) {
      // Calculate discounted additive price with proper rounding
      const discountRatio = this.currentProduct.discountPrice / this.currentProduct.price;
      const discountedAdditivePrice = Math.round(additivePrice * discountRatio * 100) / 100;
      
      tooltipText = `<span class="tooltip-original">$${additivePrice.toFixed(2)}</span> $${discountedAdditivePrice.toFixed(2)}`;
    }

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerHTML = tooltipText;
    btn.appendChild(tooltip);
  }

  private hideTooltip(element: HTMLElement): void {
    const tooltip = element.querySelector('.tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }

  private addToCart(): void {
    if (!this.currentProduct) return;

    const activeSize = document.querySelector('.size-btn.active') as HTMLElement;
    const activeAdditives = document.querySelectorAll('.additive-btn.active');

    const cartItem: CartItem = {
      productId: this.currentProduct.id,
      productName: this.currentProduct.name,
      price: this.currentProduct.price,
      discountPrice: this.currentProduct.discountPrice,
      size: activeSize.dataset.size || 'S',
      sizePrice: parseFloat(activeSize.dataset.price || '0'),
      additives: Array.from(activeAdditives).map((btn) => 
        btn.querySelector('.additive-name')?.textContent || ''
      ),
      image: this.currentProduct.image,
      category: this.currentProduct.category,
    };

    StorageService.addToCart(cartItem);
    updateCartVisibility();
    showNotification('Product added to cart!', 'success');
    this.closeModal();
  }

  // Favorites methods
  private initFavorites(): void {
    if (this.favoritesBtn) {
      this.favoritesBtn.addEventListener('click', () => {
        this.toggleFavoritesView();
      });
    }
  }

  private toggleFavorite(product: Product, icon: HTMLElement): void {
    const favoriteProduct: FavoriteProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      category: product.category,
      image: product.image,
    };

    const isFavorite = StorageService.toggleFavorite(favoriteProduct);
    updateFavoriteIcon(icon, isFavorite);
    this.updateFavoritesCounter();

    if (isFavorite) {
      showNotification('Added to favorites!', 'success');
    } else {
      showNotification('Removed from favorites', 'success');
      // If we're in favorites view and removed an item, refresh the view
      if (this.showingFavorites) {
        this.renderFavorites();
      }
    }
  }

  private quickAddToCart(product: Product): void {
    const cartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      size: 'S', // Default size
      sizePrice: 0,
      additives: [],
      image: product.image,
      category: product.category,
    };

    StorageService.addToCart(cartItem);
    updateCartVisibility();
    showNotification('Product added to cart!', 'success');
  }

  private updateFavoritesCounter(): void {
    const count = StorageService.getFavoritesCount();
    updateFavoritesCounter(count);
  }

  private toggleFavoritesView(): void {
    this.showingFavorites = !this.showingFavorites;

    if (this.showingFavorites) {
      this.renderFavorites();
      this.favoritesBtn?.classList.add('active');
    } else {
      this.renderProducts(this.currentCategory);
      this.favoritesBtn?.classList.remove('active');
    }
  }

  private renderFavorites(): void {
    if (!this.productsGrid) return;

    const favorites = StorageService.getFavorites();

    // Hide tabs and load more button when showing favorites
    const menuTabs = document.querySelector('.menu-tabs') as HTMLElement;
    if (menuTabs) menuTabs.style.display = 'none';
    if (this.loadMoreBtn) this.loadMoreBtn.style.display = 'none';

    // Update title
    const menuTitle = document.querySelector('.menu-title') as HTMLElement;
    if (menuTitle) {
      menuTitle.innerHTML = 'Your <span class="highlight">Favorite Products</span>';
    }

    this.productsGrid.innerHTML = '';

    if (favorites.length === 0) {
      this.productsGrid.innerHTML = `
        <div class="empty-favorites">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h2>No favorites yet</h2>
          <p>Start adding your favorite products by clicking the heart icon!</p>
        </div>
      `;
    } else {
      favorites.forEach((product) => {
        const productCard = this.createProductCard(product, true);
        this.productsGrid!.appendChild(productCard);
      });
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  new MenuPage();
  initLogout();
  initThemeToggle();
});

