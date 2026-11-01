const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('authToken');
const getAdminToken = () => localStorage.getItem('adminToken');

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const token = options.adminAuth ? getAdminToken() : getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
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

export const authAPI = {
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

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },
};

export const foodAPI = {
  getAll: () => apiRequest('/foods'),

  create: (foodData) => apiRequest('/foods', {
    method: 'POST',
    body: JSON.stringify(foodData),
    adminAuth: true,
  }),

  update: (id, foodData) => apiRequest(`/foods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(foodData),
    adminAuth: true,
  }),

  delete: (id) => apiRequest(`/foods/${id}`, {
    method: 'DELETE',
    adminAuth: true,
  }),
};

export const orderAPI = {
  create: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  getUserOrders: () => apiRequest('/orders'),
  getOrder: (id) => apiRequest(`/orders/${id}`),
  trackOrder: (id) => apiRequest(`/orders/track/${id}`),
};

export const adminAPI = {
  getAllOrders: () => apiRequest('/admin/orders', { adminAuth: true }),

  updateOrderStatus: (id, status) => apiRequest(`/admin/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
    adminAuth: true,
  }),

  getStats: () => apiRequest('/admin/stats', { adminAuth: true }),
};

export const paymentAPI = {
  initialize: (order_id) =>
    apiRequest('/payment/initialize', {
      method: 'POST',
      body: JSON.stringify({ order_id }),
    }),

  verify: (tx_ref, order_id) =>
    apiRequest(`/payment/verify?tx_ref=${encodeURIComponent(tx_ref)}&order_id=${order_id}`),
};
