// Common functionality shared across pages
import { StorageService } from './utils/storage';
import { updateCartCounter, updateFavoritesCounter, applyTheme, updateThemeToggleIcon } from './utils/ui';

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
  const favoritesBtn = document.querySelector('.favorites-btn') as HTMLElement;
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

  if (favoritesBtn) {
    if (isLoggedIn) {
      favoritesBtn.style.display = 'flex';
      // Update favorites counter
      const favoritesCount = StorageService.getFavoritesCount();
      updateFavoritesCounter(favoritesCount);
    } else {
      favoritesBtn.style.display = 'none';
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

// Initialize theme
export function initTheme(): void {
  const savedTheme = StorageService.getTheme();
  applyTheme(savedTheme);
  
  const themeToggle = document.querySelector('.theme-toggle') as HTMLElement;
  if (themeToggle) {
    updateThemeToggleIcon(themeToggle, savedTheme);
  }
}

// Initialize theme toggle button
export function initThemeToggle(): void {
  const themeToggle = document.querySelector('.theme-toggle') as HTMLElement;
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const newTheme = StorageService.toggleTheme();
      applyTheme(newTheme);
      updateThemeToggleIcon(themeToggle, newTheme);
    });
  }
}



