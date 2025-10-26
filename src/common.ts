// Common functionality shared across pages
import { StorageService } from './utils/storage';
import { updateCartCounter } from './utils/ui';

// Initialize burger menu
export function initBurgerMenu(): void {
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

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      burgerIcon.classList.remove('active');
      burgerMenu.classList.remove('active');
      document.body.classList.remove('burger-open');
    }
  });
}

// Update cart visibility and counter
export function updateCartVisibility(): void {
  const cartLink = document.querySelector('.cart-link') as HTMLElement;
  const logoutBtn = document.querySelector('.logout-btn') as HTMLElement;
  const isLoggedIn = StorageService.isUserLoggedIn();
  const cartCount = StorageService.getCartItemCount();

  if (cartLink) {
    if (isLoggedIn || cartCount > 0) {
      cartLink.style.display = 'flex';
    } else {
      cartLink.style.display = 'none';
    }
  }

  if (logoutBtn) {
    if (isLoggedIn) {
      logoutBtn.style.display = 'flex';
    } else {
      logoutBtn.style.display = 'none';
    }
  }

  updateCartCounter(cartCount);
}

// Initialize logout functionality
export function initLogout(): void {
  const logoutBtn = document.querySelector('.logout-btn') as HTMLElement;
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      StorageService.logout();
      updateCartVisibility();
      window.location.href = 'index.html';
    });
  }
}



