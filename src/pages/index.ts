import { apiService } from '../services/api';
import { showLoader, hideLoader } from '../utils/ui';
import { initLogout, updateCartVisibility } from '../common';
import type { FavoriteProduct } from '../types';

// Burger Menu
function initBurgerMenu(): void {
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

// Carousel functionality
class Carousel {
  private carouselTrack: HTMLElement | null;
  private indicators: NodeListOf<Element>;
  private currentSlide: number = 0;
  private autoPlayInterval: number | null = null;
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private totalSlides: number = 3;

  constructor() {
    this.carouselTrack = document.querySelector('.carousel-track');
    this.indicators = document.querySelectorAll('.indicator');
  }

  private init(): void {
    this.totalSlides = this.indicators.length;
    const carousel = document.querySelector('.carousel');
    const carouselBtnLeft = document.querySelector('.carousel-btn-left');
    const carouselBtnRight = document.querySelector('.carousel-btn-right');

    if (carouselBtnRight) {
      carouselBtnRight.addEventListener('click', () => this.nextSlide());
    }

    if (carouselBtnLeft) {
      carouselBtnLeft.addEventListener('click', () => this.prevSlide());
    }

    this.indicators.forEach((indicator: Element, index: number) => {
      indicator.addEventListener('click', () => {
        this.stopAutoPlay();
        this.currentSlide = index;
        this.updateCarousel();
        this.startAutoPlay();
      });
    });

    if (carousel) {
      carousel.addEventListener('mouseenter', () => {
        const activeIndicator = document.querySelector('.indicator.active');
        if (activeIndicator) {
          activeIndicator.classList.add('paused');
        }
        this.stopAutoPlay();
      });

      carousel.addEventListener('mouseleave', () => {
        const activeIndicator = document.querySelector('.indicator.active');
        if (activeIndicator) {
          activeIndicator.classList.remove('paused');
        }
        this.startAutoPlay();
      });

      carousel.addEventListener('touchstart', (e: Event) => {
        const touchEvent = e as TouchEvent;
        this.touchStartX = touchEvent.changedTouches[0].screenX;
        this.stopAutoPlay();
      });

      carousel.addEventListener('touchend', (e: Event) => {
        const touchEvent = e as TouchEvent;
        this.touchEndX = touchEvent.changedTouches[0].screenX;
        this.handleSwipe();
        this.startAutoPlay();
      });
    }

    if (carousel) {
      this.updateCarousel();
      this.startAutoPlay();
    }
  }

  private updateCarousel(): void {
    if (this.carouselTrack) {
      this.carouselTrack.style.transform = `translateX(-${this.currentSlide * 100}%)`;

      this.indicators.forEach((indicator, index) => {
        indicator.classList.remove('active', 'paused');
        const progress = indicator.querySelector('.indicator-progress') as HTMLElement;

        if (index === this.currentSlide) {
          indicator.classList.add('active');
          progress.style.animation = 'none';
          void progress.offsetHeight; // Trigger reflow
          progress.style.animation = 'progress 5s linear forwards';
        } else {
          progress.style.animation = 'none';
          progress.style.width = '0';
        }
      });
    }
  }

  private nextSlide(): void {
    this.stopAutoPlay();
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateCarousel();
    this.startAutoPlay();
  }

  private prevSlide(): void {
    this.stopAutoPlay();
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateCarousel();
    this.startAutoPlay();
  }

  private startAutoPlay(): void {
    this.stopAutoPlay();
    this.autoPlayInterval = window.setInterval(() => this.nextSlide(), 5000);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval !== null) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  private handleSwipe(): void {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  public async loadFavorites(): Promise<void> {
    const carouselWrapper = document.querySelector('.carousel-wrapper') as HTMLElement;
    if (!carouselWrapper) return;

    // Hide existing carousel content and show loader in its place
    if (this.carouselTrack) {
      this.carouselTrack.style.display = 'none';
    }

    // Show loader in the carousel wrapper (where images will appear)
    const loader = showLoader(carouselWrapper);

    try {
      const response = await apiService.getFavoriteProducts();

      hideLoader(loader);

      if (!response.error && response.data && response.data.length > 0) {
        // Show carousel track again
        if (this.carouselTrack) {
          this.carouselTrack.style.display = 'flex';
        }
        
        this.renderFavorites(response.data);
        // Initialize carousel controls after data is loaded
        this.init();
      } else {
        this.showError();
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      hideLoader(loader);
      this.showError();
    }
  }

  private renderFavorites(products: FavoriteProduct[]): void {
    if (!this.carouselTrack) return;

    // Clear existing static items
    this.carouselTrack.innerHTML = '';

    // Generate carousel items from API data
    products.forEach((product) => {
      const item = document.createElement('div');
      item.className = 'carousel-item';
      
      item.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="carousel-item-img">
        <h3 class="carousel-item-name">${product.name}</h3>
        <p class="carousel-item-description">${product.description}</p>
        <p class="carousel-item-price">$${product.price.toFixed(2)}</p>
      `;
      
      this.carouselTrack!.appendChild(item);
    });

    // Update total slides count
    this.totalSlides = products.length;
  }

  private showError(): void {
    const container = this.carouselTrack?.parentElement;
    if (!container) return;
    
    container.innerHTML = `
      <div class="error-message">
        <p>Something went wrong. Please, refresh the page</p>
      </div>
    `;
  }
}

// Smooth scroll
function initSmoothScroll(): void {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;

      e.preventDefault();

      const targetId = href!.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

// Video handling
function initVideo(): void {
  const video = document.querySelector('.enjoy-video') as HTMLVideoElement;
  if (video) {
    video.addEventListener('error', function (this: HTMLVideoElement) {
      this.style.display = 'none';
      const img = this.nextElementSibling as HTMLElement;
      if (img && img.tagName === 'IMG') {
        img.style.display = 'block';
      }
    });
  }
}


// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  initSmoothScroll();
  initVideo();
  updateCartVisibility();
  initLogout();

  // Load favorites from API
  const carousel = new Carousel();
  carousel.loadFavorites();
});

