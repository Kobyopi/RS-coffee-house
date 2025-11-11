import { LocalAuthService } from '../services/localAuth';
import { StorageService } from '../utils/storage';
import { ValidationService } from '../utils/validation';
import { showNotification } from '../utils/ui';
import { initTheme, initThemeToggle } from '../common';
import type { ApiUserRegistration } from '../types';

// Street data by city
const streetsByCity: Record<string, string[]> = {
  'New York': [
    'Broadway',
    'Fifth Avenue',
    'Park Avenue',
    'Madison Avenue',
    'Lexington Avenue',
    'Third Avenue',
    'Seventh Avenue',
    'Eighth Avenue',
    'Amsterdam Avenue',
    'Columbus Avenue'
  ],
  'Los Angeles': [
    'Sunset Boulevard',
    'Hollywood Boulevard',
    'Wilshire Boulevard',
    'Melrose Avenue',
    'Santa Monica Boulevard',
    'Ventura Boulevard',
    'Sepulveda Boulevard',
    'La Brea Avenue',
    'Fairfax Avenue',
    'Vermont Avenue'
  ],
  'Chicago': [
    'Michigan Avenue',
    'State Street',
    'LaSalle Street',
    'Clark Street',
    'Wabash Avenue',
    'Lake Shore Drive',
    'Halsted Street',
    'Broadway',
    'Ashland Avenue',
    'Western Avenue'
  ]
};

class RegistrationPage {
  private form: HTMLFormElement | null;
  private loginInput: HTMLInputElement | null;
  private passwordInput: HTMLInputElement | null;
  private confirmPasswordInput: HTMLInputElement | null;
  private citySelect: HTMLSelectElement | null;
  private streetSelect: HTMLSelectElement | null;
  private houseNumberInput: HTMLInputElement | null;
  private paymentMethodInputs: NodeListOf<HTMLInputElement> | null;
  private submitBtn: HTMLButtonElement | null;
  private submitError: HTMLElement | null;

  private validationState: Record<string, boolean> = {
    login: false,
    password: false,
    confirmPassword: false,
    city: false,
    street: false,
    houseNumber: false,
    paymentMethod: false,
  };

  constructor() {
    this.form = document.getElementById('registrationForm') as HTMLFormElement;
    this.loginInput = document.getElementById('login') as HTMLInputElement;
    this.passwordInput = document.getElementById('password') as HTMLInputElement;
    this.confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
    this.citySelect = document.getElementById('city') as HTMLSelectElement;
    this.streetSelect = document.getElementById('street') as HTMLSelectElement;
    this.houseNumberInput = document.getElementById('houseNumber') as HTMLInputElement;
    this.paymentMethodInputs = document.querySelectorAll('input[name="paymentMethod"]');
    this.submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
    this.submitError = document.getElementById('submitError');

    this.init();
  }

  private init(): void {
    if (!this.form) return;

    // Check if user is already logged in
    if (StorageService.isUserLoggedIn()) {
      window.location.href = 'menu.html';
      return;
    }

    this.initBurgerMenu();
    this.initFormValidation();
    this.initCityStreetLogic();
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
    // Login
    this.loginInput?.addEventListener('blur', () => this.validateLogin());
    this.loginInput?.addEventListener('focus', () => this.clearFieldError('login'));
    this.loginInput?.addEventListener('input', () => {
      this.validateLogin();
      this.updateSubmitButton();
    });

    // Password
    this.passwordInput?.addEventListener('blur', () => this.validatePassword());
    this.passwordInput?.addEventListener('focus', () => this.clearFieldError('password'));
    this.passwordInput?.addEventListener('input', () => {
      this.validatePassword();
      this.updateSubmitButton();
    });

    // Confirm Password
    this.confirmPasswordInput?.addEventListener('blur', () => this.validateConfirmPassword());
    this.confirmPasswordInput?.addEventListener('focus', () => this.clearFieldError('confirmPassword'));
    this.confirmPasswordInput?.addEventListener('input', () => {
      this.validateConfirmPassword();
      this.updateSubmitButton();
    });

    // City
    this.citySelect?.addEventListener('change', () => {
      this.validateCity();
      this.updateSubmitButton();
    });

    // Street
    this.streetSelect?.addEventListener('change', () => {
      this.validateStreet();
      this.updateSubmitButton();
    });

    // House Number
    this.houseNumberInput?.addEventListener('blur', () => this.validateHouseNumber());
    this.houseNumberInput?.addEventListener('focus', () => this.clearFieldError('houseNumber'));
    this.houseNumberInput?.addEventListener('input', () => {
      this.validateHouseNumber();
      this.updateSubmitButton();
    });

    // Payment Method
    this.paymentMethodInputs?.forEach((input) => {
      input.addEventListener('change', () => {
        this.validatePaymentMethod();
        this.updateSubmitButton();
      });
    });
  }

  private initCityStreetLogic(): void {
    this.citySelect?.addEventListener('change', () => {
      const city = this.citySelect!.value;
      
      if (city && streetsByCity[city]) {
        this.streetSelect!.disabled = false;
        this.streetSelect!.innerHTML = '<option value="">Select a street</option>';
        
        streetsByCity[city].forEach((street) => {
          const option = document.createElement('option');
          option.value = street;
          option.textContent = street;
          this.streetSelect!.appendChild(option);
        });

        this.validationState.street = false;
        this.streetSelect!.value = '';
      } else {
        this.streetSelect!.disabled = true;
        this.streetSelect!.innerHTML = '<option value="">Select a street</option>';
        this.validationState.street = false;
      }

      this.updateSubmitButton();
    });
  }

  private validateLogin(): void {
    if (!this.loginInput) return;

    const login = this.loginInput.value;
    const result = ValidationService.validateLogin(login);

    this.validationState.login = result.isValid;

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

    this.validationState.password = result.isValid;

    if (!result.isValid && password.length > 0) {
      this.showFieldError('password', result.error || '');
    } else {
      this.clearFieldError('password');
    }

    // Also revalidate confirm password if it has a value
    if (this.confirmPasswordInput && this.confirmPasswordInput.value) {
      this.validateConfirmPassword();
    }
  }

  private validateConfirmPassword(): void {
    if (!this.confirmPasswordInput || !this.passwordInput) return;

    const password = this.passwordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;
    const result = ValidationService.validatePasswordMatch(password, confirmPassword);

    this.validationState.confirmPassword = result.isValid;

    if (!result.isValid && confirmPassword.length > 0) {
      this.showFieldError('confirmPassword', result.error || '');
    } else {
      this.clearFieldError('confirmPassword');
    }
  }

  private validateCity(): void {
    if (!this.citySelect) return;

    const city = this.citySelect.value;
    this.validationState.city = city.length > 0;
  }

  private validateStreet(): void {
    if (!this.streetSelect) return;

    const street = this.streetSelect.value;
    this.validationState.street = street.length > 0;
  }

  private validateHouseNumber(): void {
    if (!this.houseNumberInput) return;

    const houseNumber = this.houseNumberInput.value;
    const result = ValidationService.validateHouseNumber(houseNumber);

    this.validationState.houseNumber = result.isValid;

    if (!result.isValid && houseNumber.length > 0) {
      this.showFieldError('houseNumber', result.error || '');
    } else {
      this.clearFieldError('houseNumber');
    }
  }

  private validatePaymentMethod(): void {
    if (!this.paymentMethodInputs) return;

    let isChecked = false;
    this.paymentMethodInputs.forEach((input) => {
      if (input.checked) {
        isChecked = true;
      }
    });

    this.validationState.paymentMethod = isChecked;
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

    const allFieldsValid = Object.values(this.validationState).every((isValid) => isValid === true);

    this.submitBtn.disabled = !allFieldsValid;
  }

  private initFormSubmit(): void {
    this.form?.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      await this.handleSubmit();
    });
  }

  private async handleSubmit(): Promise<void> {
    if (
      !this.loginInput ||
      !this.passwordInput ||
      !this.confirmPasswordInput ||
      !this.citySelect ||
      !this.streetSelect ||
      !this.houseNumberInput ||
      !this.submitBtn
    ) return;

    let selectedPaymentMethod = 'cash';
    this.paymentMethodInputs?.forEach((input) => {
      if (input.checked) {
        selectedPaymentMethod = input.value;
      }
    });

    const userData: ApiUserRegistration = {
      login: this.loginInput.value,
      password: this.passwordInput.value,
      confirmPassword: this.confirmPasswordInput.value,
      city: this.citySelect.value,
      street: this.streetSelect.value,
      houseNumber: parseInt(this.houseNumberInput.value, 10),
      paymentMethod: selectedPaymentMethod,
    };

    // Show loading state
    this.submitBtn.disabled = true;
    this.submitBtn.textContent = 'Registering...';

    if (this.submitError) {
      this.submitError.textContent = '';
      this.submitError.style.display = 'none';
    }

    try {
      const response = await LocalAuthService.register(userData);

      if (!response.error && response.data) {
        // User is already saved to localStorage by LocalAuthService
        showNotification('Registration successful!', 'success');

        // Redirect to menu page
        setTimeout(() => {
          window.location.href = 'menu.html';
        }, 500);
      } else {
        // Show error
        if (this.submitError) {
          this.submitError.textContent = response.error || response.message || 'Registration failed. Please try again.';
          this.submitError.style.display = 'block';
        }
        this.submitBtn.disabled = false;
        this.submitBtn.textContent = 'Register';
      }
    } catch (error) {
      if (this.submitError) {
        this.submitError.textContent = 'An error occurred. Please try again.';
        this.submitError.style.display = 'block';
      }
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = 'Register';
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  new RegistrationPage();
  initThemeToggle();
});



