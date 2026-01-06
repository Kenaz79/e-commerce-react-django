// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api';
//const authUrl = 'http://localhost:8000/auth';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  setUser(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  removeToken() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
      
      // Handle empty responses
      if (response.status === 204) {
        return null;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error.message);
      throw error;
    }
  }

  // ==================== AUTH METHODS ====================
  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      this.setToken(data.token);
      this.setUser(data.user);
    }
    return data;
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      this.setToken(data.token);
      this.setUser(data.user);
    }
    return data;
  }

  async logout() {
    this.removeToken();
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // ==================== PRODUCT METHODS (BUYER) ====================
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const queryString = params.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return this.request(endpoint);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  // ==================== ADMIN PRODUCT METHODS ====================
  async getAllProducts(adminFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(adminFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const queryString = params.toString();
    const endpoint = queryString ? `/admin/products?${queryString}` : '/admin/products';
    return this.request(endpoint);
  }

  async createProduct(productData) {
    // Handle FormData for file uploads
    if (productData instanceof FormData) {
      const url = `${API_BASE_URL}/admin/products`;
      const config = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: productData,
      };
      return fetch(url, config).then(res => res.json());
    }
    
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleProductVisibility(id, visible) {
    return this.request(`/admin/products/${id}/visibility`, {
      method: 'PATCH',
      body: JSON.stringify({ visible }),
    });
  }

  async updateProductStock(id, stock) {
    return this.request(`/admin/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
  }

  // ==================== FEATURED/HERO CONTENT METHODS ====================
  async getFeaturedProducts() {
    return this.request('/content/featured');
  }

  async getHeroContent() {
    return this.request('/content/hero');
  }

  // ==================== ADMIN CONTENT CONTROL METHODS ====================
  async getContentSections() {
    return this.request('/admin/content');
  }

  async getContentSection(id) {
    return this.request(`/admin/content/${id}`);
  }

  async createContentSection(sectionData) {
    return this.request('/admin/content', {
      method: 'POST',
      body: JSON.stringify(sectionData),
    });
  }

  async updateContentSection(id, sectionData) {
    return this.request(`/admin/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sectionData),
    });
  }

  async deleteContentSection(id) {
    return this.request(`/admin/content/${id}`, {
      method: 'DELETE',
    });
  }

  async updateContentOrder(sections) {
    return this.request('/admin/content/order', {
      method: 'PUT',
      body: JSON.stringify({ sections }),
    });
  }

  async toggleContentVisibility(id, visible) {
    return this.request(`/admin/content/${id}/visibility`, {
      method: 'PATCH',
      body: JSON.stringify({ visible }),
    });
  }

  // ==================== PROMOTIONAL CONTENT ====================
  async getPromotionalContent() {
    return this.request('/content/promotional');
  }

  async updatePromotionalContent(contentData) {
    return this.request('/admin/promotional', {
      method: 'PUT',
      body: JSON.stringify(contentData),
    });
  }

  // ==================== CATEGORY METHODS ====================
  async getCategories() {
    return this.request('/categories');
  }

  async getCategoriesForAdmin() {
    return this.request('/admin/categories');
  }

  async createCategory(categoryData) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id) {
    return this.request(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
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
  async getAllOrders(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const queryString = params.toString();
    const endpoint = queryString ? `/admin/orders?${queryString}` : '/admin/orders';
    return this.request(endpoint);
  }

  async updateOrderStatus(orderNumber, status, notes = '') {
    return this.request(`/admin/orders/${orderNumber}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  async assignOrderToDeliverer(orderNumber, delivererId) {
    return this.request(`/admin/orders/${orderNumber}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ delivererId }),
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

  // ==================== USER METHODS ====================
  async getUsers(role = '') {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';
    return this.request(endpoint);
  }

  async updateUserRole(userId, role) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  // ==================== DELIVERER METHODS ====================
  async getDeliverers() {
    return this.request('/deliverers');
  }

  async getDeliverersForAdmin() {
    return this.request('/admin/deliverers');
  }

  async createDeliverer(delivererData) {
    return this.request('/admin/deliverers', {
      method: 'POST',
      body: JSON.stringify(delivererData),
    });
  }

  async updateDelivererStatus(delivererId, online) {
    return this.request(`/admin/deliverers/${delivererId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ online }),
    });
  }

  async deleteDeliverer(delivererId) {
    return this.request(`/admin/deliverers/${delivererId}`, {
      method: 'DELETE',
    });
  }

  // ==================== ANALYTICS METHODS ====================
  async getAnalytics() {
    return this.request('/admin/analytics');
  }

  async getSalesReport(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/admin/analytics/sales?${queryString}` : '/admin/analytics/sales';
    return this.request(endpoint);
  }

  // ==================== PROMO CODE METHODS ====================
  async getPromoCodes() {
    return this.request('/promo-codes');
  }

  async validatePromoCode(code) {
    return this.request(`/promo-codes/validate/${code}`);
  }

  async createPromoCode(promoData) {
    return this.request('/admin/promo-codes', {
      method: 'POST',
      body: JSON.stringify(promoData),
    });
  }

  async updatePromoCode(id, promoData) {
    return this.request(`/admin/promo-codes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promoData),
    });
  }

  async deletePromoCode(id) {
    return this.request(`/admin/promo-codes/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== SETTINGS/CONFIGURATION ====================
  async getAppSettings() {
    return this.request('/admin/settings');
  }

  async updateAppSettings(settings) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // ==================== FILE UPLOAD ====================
  async uploadFile(formData) {
    const url = `${API_BASE_URL}/upload`;
    const config = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    };
    return fetch(url, config).then(res => res.json());
  }

  // ==================== NOTIFICATIONS ====================
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  // ==================== FLASH SALE MANAGEMENT ====================
  async getFlashSales() {
    return this.request('/content/flash-sales');
  }

  async createFlashSale(saleData) {
    return this.request('/admin/flash-sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  }

  async updateFlashSale(id, saleData) {
    return this.request(`/admin/flash-sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(saleData),
    });
  }

  async deleteFlashSale(id) {
    return this.request(`/admin/flash-sales/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== BULK OPERATIONS ====================
  async bulkUpdateProducts(updates) {
    return this.request('/admin/products/bulk', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async bulkUpdateVisibility(productIds, visible) {
    return this.request('/admin/products/bulk/visibility', {
      method: 'PUT',
      body: JSON.stringify({ productIds, visible }),
    });
  }

  // ==================== INVENTORY MANAGEMENT ====================
  async getInventoryReport() {
    return this.request('/admin/inventory');
  }

  async updateInventory(productId, stockChange, reason = '') {
    return this.request(`/admin/inventory/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ stockChange, reason }),
    });
  }
}

export const apiService = new ApiService();

// Helper function for error handling
export const handleApiError = (error, fallbackMessage = 'Something went wrong') => {
  const message = error.message || fallbackMessage;
  console.error('API Error:', error);
  return { success: false, error: message };
};

// Hook for React components
export const useApi = () => {
  const api = apiService;
  
  return {
    ...api,
    // Add any custom methods here
  };
};