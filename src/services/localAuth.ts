import type { User, ApiUserRegistration, UserLogin } from '../types';

const STORAGE_KEYS = {
  USERS: 'coffee_house_users',
  CURRENT_USER: 'coffee_house_user',
  AUTH_TOKEN: 'authToken',
} as const;

interface StoredUser extends User {
  password: string; // Store hashed/encoded password
}

export class LocalAuthService {
  // Simple encoding (in production, use proper hashing)
  private static encodePassword(password: string): string {
    return btoa(password); // Base64 encoding for demo
  }

  private static generateToken(): string {
    return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getAllUsers(): StoredUser[] {
    const usersData = localStorage.getItem(STORAGE_KEYS.USERS);
    if (usersData) {
      try {
        return JSON.parse(usersData) as StoredUser[];
      } catch (error) {
        console.error('Error parsing users data:', error);
      }
    }
    return [];
  }

  private static saveAllUsers(users: StoredUser[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // Register a new user
  static async register(userData: ApiUserRegistration): Promise<{
    error?: string;
    data?: User & { token?: string };
    message?: string;
  }> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300));

    const users = this.getAllUsers();

    // Check if user already exists
    if (users.find(u => u.login === userData.login)) {
      return {
        error: 'User with this login already exists',
      };
    }

    // Create new user
    const newUser: StoredUser = {
      id: users.length + 1,
      login: userData.login,
      password: this.encodePassword(userData.password),
      city: userData.city,
      street: userData.street,
      houseNumber: userData.houseNumber,
      paymentMethod: userData.paymentMethod,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveAllUsers(users);

    // Create user object without password
    const { password, ...userWithoutPassword } = newUser;
    const token = this.generateToken();

    // Save current user and token
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

    return {
      data: {
        ...userWithoutPassword,
        token,
      },
      message: 'Registration successful',
    };
  }

  // Login user
  static async login(credentials: UserLogin): Promise<{
    error?: string;
    data?: User & { token?: string };
    message?: string;
  }> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300));

    const users = this.getAllUsers();
    const encodedPassword = this.encodePassword(credentials.password);

    const user = users.find(
      u => u.login === credentials.login && u.password === encodedPassword
    );

    if (!user) {
      return {
        error: 'Incorrect login or password',
      };
    }

    // Create user object without password
    const { password, ...userWithoutPassword } = user;
    const token = this.generateToken();

    // Save current user and token
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

    return {
      data: {
        ...userWithoutPassword,
        token,
      },
      message: 'Login successful',
    };
  }

  // Logout user
  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Check if user is logged in
  static isLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) !== null &&
           localStorage.getItem(STORAGE_KEYS.CURRENT_USER) !== null;
  }

  // Get current user
  static getCurrentUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (userData) {
      try {
        return JSON.parse(userData) as User;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return null;
  }
}






