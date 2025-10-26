// Enums
export enum ProductCategory {
  COFFEE = 'coffee',
  TEA = 'tea',
  DESSERT = 'dessert'
}

export enum ProductSizeEnum {
  S = 'S',
  M = 'M',
  L = 'L'
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card'
}

// API Product Interfaces (from backend)
export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  category: string;
}

// Internal Product Interface (with image)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  image: string;
}

export interface FavoriteProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  image: string;
}

// Cart Interfaces
export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  discountPrice?: number;
  size: string;
  sizePrice: number;
  additives: string[];
  image: string;
  category: string;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalDiscount: number;
}

// User Interfaces (from API)
export interface ApiUserRegistration {
  login: string;
  password: string;
  confirmPassword: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: string;
}

export interface UserLogin {
  login: string;
  password: string;
}

export interface User {
  id: number;
  login: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: string;
  createdAt: string;
}

export interface AuthResponse {
  data?: User & { token?: string };
  message?: string;
  error?: string;
}

// Order Interfaces (from API)
export interface ApiOrderItem {
  productId: number;
  size: string;
  additives: string[];
  quantity: number;
}

export interface ApiOrderRequest {
  items: ApiOrderItem[];
  totalPrice: number;
}

export interface OrderResponse {
  data?: Record<string, unknown>;
  message?: string;
  error?: string;
}

// API Response Interfaces
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// Validation Result
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

