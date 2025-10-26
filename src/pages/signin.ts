import { LocalAuthService } from '../services/localAuth';
import { StorageService } from '../utils/storage';
import { ValidationService } from '../utils/validation';
import { showNotification } from '../utils/ui';
import type { UserLogin } from '../types';

class SignInPage {
  private form: HTMLFormElement | null;
  private loginInput: HTMLInputElement | null;
  private passwordInput: HTMLInputElement | null;
  private submitBtn: HTMLButtonElement | null;
  private submitError: HTMLElement | null;

  private isLoginValid: boolean = false;
  private isPasswordValid: boolean = false;

  constructor() {
    this.form = document.getElementById('signinForm') as HTMLFormElement;
    this.loginInput = document.getElementById('login') as HTMLInputElement;
    this.passwordInput = document.getElementById('password') as HTMLInputElement;
    this.submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
    this.submitError = document.getElementById('submitError');

    this.init();
  }

  private init(): void {
    if (!this.form || !this.loginInput || !this.passwordInput) return;

    // Check if user is already logged in
    if (StorageService.isUserLoggedIn()) {
      window.location.href = 'menu.html';
      return;
    }

    this.initBurgerMenu();
    this.initFormValidation();
    this.initFormSubmit();
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

  private initFormValidation(): void {
    // Login validation
    this.loginInput?.addEventListener('blur', () => {
      this.validateLogin();
    });

    this.loginInput?.addEventListener('focus', () => {
      this.clearFieldError('login');
    });

    this.loginInput?.addEventListener('input', () => {
      this.validateLogin();
      this.updateSubmitButton();
    });

    // Password validation
    this.passwordInput?.addEventListener('blur', () => {
      this.validatePassword();
    });

    this.passwordInput?.addEventListener('focus', () => {
      this.clearFieldError('password');
    });

    this.passwordInput?.addEventListener('input', () => {
      this.validatePassword();
      this.updateSubmitButton();
    });
  }

  private validateLogin(): void {
    if (!this.loginInput) return;

    const login = this.loginInput.value;
    const result = ValidationService.validateLogin(login);

    this.isLoginValid = result.isValid;

    if (!result.isValid && login.length > 0) {
      this.showFieldError('login', result.error || '');
    } else {
      this.clearFieldError('login');
    }
  }

  private validatePassword(): void {
    if (!this.passwordInput) return;

    const password = this.passwordInput.value;
    const result = ValidationService.validatePassword(password);

    this.isPasswordValid = result.isValid;

    if (!result.isValid && password.length > 0) {
      this.showFieldError('password', result.error || '');
    } else {
      this.clearFieldError('password');
    }
  }

  private showFieldError(fieldName: string, errorMessage: string): void {
    const input = document.getElementById(fieldName) as HTMLInputElement;
    const errorSpan = document.getElementById(`${fieldName}Error`) as HTMLElement;
    const errorIcon = input?.parentElement?.querySelector('.error-icon') as HTMLElement;

    if (input) {
      input.classList.add('input-error');
    }

    if (errorSpan) {
      errorSpan.textContent = errorMessage;
      errorSpan.style.display = 'block';
    }

    if (errorIcon) {
      errorIcon.style.display = 'block';
    }
  }

  private clearFieldError(fieldName: string): void {
    const input = document.getElementById(fieldName) as HTMLInputElement;
    const errorSpan = document.getElementById(`${fieldName}Error`) as HTMLElement;
    const errorIcon = input?.parentElement?.querySelector('.error-icon') as HTMLElement;

    if (input) {
      input.classList.remove('input-error');
    }

    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.style.display = 'none';
    }

    if (errorIcon) {
      errorIcon.style.display = 'none';
    }
  }

  private updateSubmitButton(): void {
    if (!this.submitBtn) return;

    const hasLoginValue = (this.loginInput?.value || '').length > 0;
    const hasPasswordValue = (this.passwordInput?.value || '').length > 0;

    if (hasLoginValue && hasPasswordValue && this.isLoginValid && this.isPasswordValid) {
      this.submitBtn.disabled = false;
    } else {
      this.submitBtn.disabled = true;
    }
  }

  private initFormSubmit(): void {
    this.form?.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      await this.handleSubmit();
    });
  }

  private async handleSubmit(): Promise<void> {
    if (!this.loginInput || !this.passwordInput || !this.submitBtn) return;

    const credentials: UserLogin = {
      login: this.loginInput.value,
      password: this.passwordInput.value,
    };

    // Show loading state
    this.submitBtn.disabled = true;
    this.submitBtn.textContent = 'Signing in...';

    if (this.submitError) {
      this.submitError.textContent = '';
      this.submitError.style.display = 'none';
    }

    try {
      const response = await LocalAuthService.login(credentials);

      if (!response.error && response.data) {
        // User is already saved to localStorage by LocalAuthService
        showNotification('Login successful!', 'success');
        
        // Redirect to menu page
        setTimeout(() => {
          window.location.href = 'menu.html';
        }, 500);
      } else {
        // Show error
        if (this.submitError) {
          this.submitError.textContent = response.error || 'Incorrect login or password';
          this.submitError.style.display = 'block';
        }
        this.submitBtn.disabled = false;
        this.submitBtn.textContent = 'Sign In';
      }
    } catch (error) {
      if (this.submitError) {
        this.submitError.textContent = 'An error occurred. Please try again.';
        this.submitError.style.display = 'block';
      }
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = 'Sign In';
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new SignInPage();
});



