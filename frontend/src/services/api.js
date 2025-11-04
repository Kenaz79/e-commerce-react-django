// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ==================== AUTH METHODS ====================
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // ==================== PRODUCT METHODS ====================
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    return this.request(`/products?${params}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  // ==================== ADMIN PRODUCT METHODS ====================
  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== CATEGORY METHODS ====================
  async getCategories() {
    return this.request('/categories');
  }

  // ==================== ORDER METHODS ====================
  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // ==================== ADMIN ORDER METHODS ====================
  async updateOrderStatus(orderNumber, status) {
    return this.request(`/orders/${orderNumber}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ==================== REVIEW METHODS ====================
  async getProductReviews(productId) {
    return this.request(`/products/${productId}/reviews`);
  }

  async createReview(productId, reviewData) {
    return this.request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // ==================== DELIVERER METHODS (ADMIN) ====================
  async getDeliverers() {
    return this.request('/deliverers');
  }

  async createDeliverer(delivererData) {
    return this.request('/deliverers', {
      method: 'POST',
      body: JSON.stringify(delivererData),
    });
  }

  async updateDelivererStatus(delivererId, online) {
    return this.request(`/deliverers/${delivererId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ online }),
    });
  }

  // ==================== ANALYTICS METHODS (ADMIN) ====================
  async getAnalytics() {
    return this.request('/analytics/overview');
  }

  // ==================== PROMO CODE METHODS ====================
  async validatePromoCode(code) {
    return this.request(`/promo-codes/${code}`);
  }

  // ==================== ADDRESS METHODS ====================
  async getAddresses() {
    return this.request('/addresses');
  }

  async createAddress(addressData) {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  // ==================== SUPPORT TICKET METHODS ====================
  async getTickets() {
    return this.request('/tickets');
  }

  async createTicket(ticketData) {
    return this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }
}

export const apiService = new ApiService();