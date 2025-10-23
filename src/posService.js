import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with authentication
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const posService = {
  // Create a new sales transaction
  createTransaction: async (transactionData) => {
    const response = await apiClient.post('/pos/transactions/', transactionData);
    return response.data;
  },

  // Get all transactions
  getTransactions: async (params = {}) => {
    const response = await apiClient.get('/pos/transactions/', { params });
    return response.data;
  },

  // Get single transaction
  getTransaction: async (id) => {
    const response = await apiClient.get(`/pos/transactions/${id}/`);
    return response.data;
  },

  // Void a transaction
  voidTransaction: async (id, reason) => {
    const response = await apiClient.post(`/pos/transactions/${id}/void/`, { reason });
    return response.data;
  },

  // Cart operations
  getCart: async () => {
    const response = await apiClient.get('/pos/cart/');
    return response.data;
  },

  addToCart: async (productId, quantity) => {
    const response = await apiClient.post('/pos/cart/add/', {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await apiClient.patch(`/pos/cart/items/${itemId}/`, { quantity });
    return response.data;
  },

  removeCartItem: async (itemId) => {
    const response = await apiClient.delete(`/pos/cart/items/${itemId}/`);
    return response.data;
  },

  clearCart: async () => {
    const response = await apiClient.delete('/pos/cart/');
    return response.data;
  },

  checkout: async (checkoutData) => {
    const response = await apiClient.post('/pos/checkout/', checkoutData);
    return response.data;
  },

  // Reports
  getSalesReport: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await apiClient.get('/pos/reports/', { params });
    return response.data;
  },

  getDailySales: async () => {
    const response = await apiClient.get('/pos/reports/daily/');
    return response.data;
  },

  getStaffSales: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await apiClient.get('/pos/reports/staff/', { params });
    return response.data;
  },
};

export default posService;