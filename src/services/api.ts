import type {
  Product,
  FavoriteProduct,
  ApiProduct,
  AuthResponse,
  UserLogin,
  ApiUserRegistration,
  OrderResponse,
  ApiOrderRequest,
  ApiResponse,
  User
} from '../types';

const API_BASE_URL = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com';

// Image mapping for products
const productImages: Record<number, string> = {
  1: 'assets/coffee-1.jpg',
  2: 'assets/coffee-2.jpg',
  3: 'assets/coffee-3.jpg',
  4: 'assets/coffee-4.jpg',
  5: 'assets/coffee-5.jpg',
  6: 'assets/coffee-6.jpg',
  7: 'assets/coffee-7.jpg',
  8: 'assets/coffee-8.jpg',
  9: 'assets/tea-1.png',
  10: 'assets/tea-2.png',
  11: 'assets/tea-3.png',
  12: 'assets/tea-4.png',
  13: 'assets/dessert-1.png',
  14: 'assets/dessert-2.png',
  15: 'assets/dessert-3.png',
  16: 'assets/dessert-4.png',
  17: 'assets/dessert-5.png',
  18: 'assets/dessert-6.png',
  19: 'assets/dessert-7.png',
  20: 'assets/dessert-8.png',
};

class ApiService {
  private async fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const data = await response.json();

      // API returns {data, message, error} structure
      if (data.error || !response.ok) {
        return {
          error: data.error || `HTTP error! status: ${response.status}`,
          message: data.message,
        };
      }

      // Return the entire response object which contains {data, message}
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  private convertApiProduct(apiProduct: ApiProduct): Product {
    // Determine correct category based on product ID
    const getCategoryByProductId = (id: number): string => {
      if (id >= 1 && id <= 8) return 'coffee';
      if (id >= 9 && id <= 12) return 'tea';
      if (id >= 13 && id <= 20) return 'dessert';
      return apiProduct.category; // Fallback to API category for unknown IDs
    };

    const price = parseFloat(apiProduct.price);

    // Parse discountPrice if provided, otherwise calculate a default discount
    let discountPrice: number | undefined;
    if (apiProduct.discountPrice) {
      const parsedDiscountPrice = parseFloat(apiProduct.discountPrice);
      discountPrice = !isNaN(parsedDiscountPrice) ? parsedDiscountPrice : undefined;
    }
    
    // If no discountPrice from API, calculate one (subtract $0.25 for consistency)
    if (!discountPrice && !isNaN(price)) {
      discountPrice = parseFloat((price - 0.25).toFixed(2));
    }

    return {
      id: apiProduct.id,
      name: apiProduct.name,
      description: apiProduct.description,
      price: price,
      discountPrice: discountPrice,
      category: getCategoryByProductId(apiProduct.id),
      image: productImages[apiProduct.id] || 'assets/coffee-1.jpg',
    };
  }

  // Get favorite products for homepage slider
  async getFavoriteProducts(): Promise<ApiResponse<FavoriteProduct[]>> {
    const response = await this.fetchWithErrorHandling<ApiProduct[]>(
      `${API_BASE_URL}/products/favorites`
    );

    if (response.error || !response.data) {
      return {
        error: response.error || 'No data received',
        message: response.message,
      };
    }

    // Use slider-specific images for homepage carousel
    const sliderImages: Record<number, string> = {
      1: 'assets/coffee-slider-1.png',
      2: 'assets/coffee-slider-2.png',
      3: 'assets/coffee-slider-3.png',
    };

    try {
      // Filter to only products with IDs 1-20 (matching our assets), take first 3
      const validProducts = response.data
        .filter(product => product.id >= 1 && product.id <= 20)
        .slice(0, 3);

      const favorites: FavoriteProduct[] = validProducts.map((apiProduct, index) => {
        const price = parseFloat(apiProduct.price);
        
        // Parse discountPrice if provided, otherwise calculate a default discount
        let discountPrice: number | undefined;
        if (apiProduct.discountPrice) {
          const parsedDiscountPrice = parseFloat(apiProduct.discountPrice);
          discountPrice = !isNaN(parsedDiscountPrice) ? parsedDiscountPrice : undefined;
        }
        
        // If no discountPrice from API, calculate one (subtract $0.25 for consistency)
        if (!discountPrice && !isNaN(price)) {
          discountPrice = parseFloat((price - 0.25).toFixed(2));
        }
        
        return {
          id: apiProduct.id,
          name: apiProduct.name,
          description: apiProduct.description,
          price: price,
          discountPrice: discountPrice,
          category: apiProduct.category,
          // Use slider images in order, fallback to product image
          image: sliderImages[index + 1] || productImages[apiProduct.id] || 'assets/coffee-slider-1.png',
        };
      });

      return {
        data: favorites,
        message: response.message,
      };
    } catch (error) {
      console.error('Error mapping favorites:', error);
      return {
        error: 'Failed to process product data',
      };
    }
  }

  // Get all products (no category filter in API)
  async getProducts(): Promise<ApiResponse<Product[]>> {
    const response = await this.fetchWithErrorHandling<ApiProduct[]>(
      `${API_BASE_URL}/products`
    );

    if (response.error || !response.data) {
      return {
        error: response.error,
        message: response.message,
      };
    }

    const products = response.data.map((apiProduct) => this.convertApiProduct(apiProduct));

    return {
      data: products,
      message: response.message,
    };
  }

  // Get products by category (client-side filtering)
  async getProductsByCategory(category: string): Promise<ApiResponse<Product[]>> {
    const response = await this.getProducts();

    if (response.error || !response.data) {
      return response;
    }

    const getCategoryByProductId = (id: number): string => {
      if (id >= 1 && id <= 8) return 'coffee';
      if (id >= 9 && id <= 12) return 'tea';
      if (id >= 13 && id <= 20) return 'dessert';
      return '';
    };

    // Filter products by ID range matching the requested category
    const filtered = response.data.filter((product) => {
      const correctCategory = getCategoryByProductId(product.id);
      return correctCategory === category.toLowerCase();
    });

    return {
      data: filtered,
      message: response.message,
    };
  }

  // Get product details by ID
  async getProductById(id: number): Promise<ApiResponse<Product>> {
    const response = await this.fetchWithErrorHandling<ApiProduct>(
      `${API_BASE_URL}/products/${id}`
    );

    if (response.error || !response.data) {
      return {
        error: response.error,
        message: response.message,
      };
    }

    const product = this.convertApiProduct(response.data);

    return {
      data: product,
      message: response.message,
    };
  }

  // User authentication
  async login(credentials: UserLogin): Promise<AuthResponse> {
    const response = await this.fetchWithErrorHandling<User & { token?: string }>(
      `${API_BASE_URL}/auth/login`,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    return response as AuthResponse;
  }

  // User registration
  async register(userData: ApiUserRegistration): Promise<AuthResponse> {
    const response = await this.fetchWithErrorHandling<User & { token?: string }>(
      `${API_BASE_URL}/auth/register`,
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );

    return response as AuthResponse;
  }

  // Get user profile
  async getProfile(): Promise<ApiResponse<User>> {
    const token = localStorage.getItem('authToken');
    
    return this.fetchWithErrorHandling<User>(
      `${API_BASE_URL}/auth/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // Place order (confirm)
  async placeOrder(order: ApiOrderRequest): Promise<OrderResponse> {
    const token = localStorage.getItem('authToken');
    
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await this.fetchWithErrorHandling<Record<string, unknown>>(
      `${API_BASE_URL}/orders/confirm`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(order),
      }
    );

    return response as OrderResponse;
  }
}

export const apiService = new ApiService();



