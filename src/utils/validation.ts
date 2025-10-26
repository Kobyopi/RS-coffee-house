import type { ValidationResult } from '../types';

export class ValidationService {
  // Login validation
  static validateLogin(login: string): ValidationResult {
    if (login.length < 3) {
      return {
        isValid: false,
        error: 'Login must be at least 3 characters long',
      };
    }

    if (!/^[a-zA-Z]/.test(login)) {
      return {
        isValid: false,
        error: 'Login must start with a letter',
      };
    }

    if (!/^[a-zA-Z]+$/.test(login)) {
      return {
        isValid: false,
        error: 'Login must contain only English letters',
      };
    }

    return { isValid: true };
  }

  // Password validation
  static validatePassword(password: string): ValidationResult {
    if (password.length < 6) {
      return {
        isValid: false,
        error: 'Password must be at least 6 characters long',
      };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return {
        isValid: false,
        error: 'Password must contain at least 1 special character',
      };
    }

    return { isValid: true };
  }

  // Confirm password validation
  static validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
    if (password !== confirmPassword) {
      return {
        isValid: false,
        error: 'Passwords do not match',
      };
    }

    return { isValid: true };
  }

  // House number validation
  static validateHouseNumber(houseNumber: string): ValidationResult {
    const num = parseInt(houseNumber, 10);
    
    if (isNaN(num)) {
      return {
        isValid: false,
        error: 'House number must be a number',
      };
    }

    if (num < 1) {
      return {
        isValid: false,
        error: 'House number must be greater than 0',
      };
    }

    return { isValid: true };
  }

  // Generic required field validation
  static validateRequired(value: string, fieldName: string): ValidationResult {
    if (!value || value.trim() === '') {
      return {
        isValid: false,
        error: `${fieldName} is required`,
      };
    }

    return { isValid: true };
  }
}



