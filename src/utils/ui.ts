// Loader utilities
export function showLoader(container: HTMLElement): HTMLElement {
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.innerHTML = `
    <div class="loader-spinner"></div>
  `;
  container.appendChild(loader);
  return loader;
}

export function hideLoader(loader: HTMLElement): void {
  loader.remove();
}

// Notification utilities
export function showNotification(message: string, type: 'success' | 'error' = 'error'): void {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Close notification">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(notification);

  // Close button
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn?.addEventListener('click', () => {
    notification.remove();
  });

  // Auto-hide after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Tooltip utilities
export function createTooltip(text: string): HTMLElement {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = text;
  return tooltip;
}

export function showTooltip(element: HTMLElement, text: string): void {
  const tooltip = createTooltip(text);
  element.appendChild(tooltip);
  
  // Position tooltip
  const rect = element.getBoundingClientRect();
  tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
  tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
}

export function hideTooltip(element: HTMLElement): void {
  const tooltip = element.querySelector('.tooltip');
  if (tooltip) {
    tooltip.remove();
  }
}

// Overlay utilities
export function showOverlay(): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);
  return overlay;
}

export function hideOverlay(overlay: HTMLElement): void {
  overlay.remove();
}

// Cart counter utilities
export function updateCartCounter(count: number): void {
  let cartCounter = document.querySelector('.cart-counter') as HTMLElement;
  
  if (count > 0) {
    if (!cartCounter) {
      const cartLink = document.querySelector('.cart-link');
      if (cartLink) {
        cartCounter = document.createElement('span');
        cartCounter.className = 'cart-counter';
        cartLink.appendChild(cartCounter);
      }
    }
    if (cartCounter) {
      cartCounter.textContent = count.toString();
      cartCounter.style.display = 'flex';
    }
  } else if (cartCounter) {
    cartCounter.style.display = 'none';
  }
}

// Favorites counter utilities
export function updateFavoritesCounter(count: number): void {
  let favoritesCounter = document.querySelector('.favorites-counter') as HTMLElement;
  
  if (count > 0) {
    if (!favoritesCounter) {
      const favoritesBtn = document.querySelector('.favorites-btn');
      if (favoritesBtn) {
        favoritesCounter = document.createElement('span');
        favoritesCounter.className = 'favorites-counter';
        favoritesBtn.appendChild(favoritesCounter);
      }
    }
    if (favoritesCounter) {
      favoritesCounter.textContent = count.toString();
      favoritesCounter.style.display = 'flex';
    }
  } else if (favoritesCounter) {
    favoritesCounter.style.display = 'none';
  }
}

// Update favorite icon state
export function updateFavoriteIcon(icon: HTMLElement, isFavorite: boolean): void {
  if (isFavorite) {
    icon.classList.add('active');
    icon.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    `;
  } else {
    icon.classList.remove('active');
    icon.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
}

// Theme utilities
export function applyTheme(theme: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', theme);
}

export function updateThemeToggleIcon(button: HTMLElement, theme: 'light' | 'dark'): void {
  if (theme === 'dark') {
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
    button.setAttribute('aria-label', 'Switch to light mode');
    button.setAttribute('title', 'Switch to light mode');
  } else {
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    button.setAttribute('aria-label', 'Switch to dark mode');
    button.setAttribute('title', 'Switch to dark mode');
  }
}



