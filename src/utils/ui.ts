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



