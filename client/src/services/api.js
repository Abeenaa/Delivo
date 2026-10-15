// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to get admin token
const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = options.adminAuth ? getAdminToken() : getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log('API Request:', {
    url,
    method: config.method || 'GET',
    hasToken: !!token,
  });

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Log detailed validation errors
      if (data.errors && Array.isArray(data.errors)) {
        console.error('Validation errors:', data.errors);
        const errorMessages = data.errors.map(err => `${err.param}: ${err.msg}`).join(', ');
        throw new Error(`${data.message}: ${errorMessages}`);
      }
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Customer login
  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Customer register
  register: async (name, email, phone, password) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
    });

    if (response.success) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Admin login
  adminLogin: async (email, password) => {
    const response = await apiRequest('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },
};

// Food Items API
export const foodAPI = {
  // Get all food items
  getAll: () => apiRequest('/foods'),

  // Create food item (Admin only)
  create: (foodData) => apiRequest('/foods', {
    method: 'POST',
    body: JSON.stringify(foodData),
    adminAuth: true,
  }),

  // Update food item (Admin only)
  update: (id, foodData) => apiRequest(`/foods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(foodData),
    adminAuth: true,
  }),

  // Delete food item (Admin only)
  delete: (id) => apiRequest(`/foods/${id}`, {
    method: 'DELETE',
    adminAuth: true,
  }),
};

// Orders API
export const orderAPI = {
  // Create order
  create: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  // Get user orders
  getUserOrders: () => apiRequest('/orders'),

  // Get specific order
  getOrder: (id) => apiRequest(`/orders/${id}`),

  // Track specific order
  trackOrder: (id) => apiRequest(`/orders/track/${id}`),
};

// Admin API
export const adminAPI = {
  // Get all orders
  getAllOrders: () => apiRequest('/admin/orders', { adminAuth: true }),

  // Update order status
  updateOrderStatus: (id, status) => apiRequest(`/admin/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
    adminAuth: true,
  }),

  // Get dashboard stats
  getStats: () => apiRequest('/admin/stats', { adminAuth: true }),
};
