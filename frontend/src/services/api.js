import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token automatically to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sweetcrumb_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  addAddress: (data) => api.post('/auth/address', data),
  updateAddress: (id, data) => api.put(`/auth/address/${id}`, data),
  deleteAddress: (id) => api.delete(`/auth/address/${id}`)
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getSuggestions: (q) => api.get('/products/suggestions', { params: { q } }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  updateStock: (id, data) => api.patch(`/products/${id}/stock`, data)
};

export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  cancel: (id) => api.post(`/orders/${id}/cancel`)
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

export const couponsAPI = {
  validate: (data) => api.post('/coupons/validate', data),
  getAll: () => api.get('/coupons'),
  create: (data) => api.post('/coupons', data),
  delete: (id) => api.delete(`/coupons/${id}`)
};

export const bannersAPI = {
  getAll: () => api.get('/banners'),
  create: (data) => api.post('/banners', data),
  update: (id, data) => api.put(`/banners/${id}`, data),
  delete: (id) => api.delete(`/banners/${id}`)
};

export const reviewsAPI = {
  getAll: (params) => api.get('/reviews', { params }),
  create: (data) => api.post('/reviews', data),
  updateStatus: (id, status) => api.patch(`/reviews/${id}/status`, { status }),
  delete: (id) => api.delete(`/reviews/${id}`)
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getCustomers: () => api.get('/admin/customers'),
  toggleCustomerStatus: (id, status) => api.put(`/admin/customers/${id}/status`, { status }),
  deleteCustomer: (id) => api.delete(`/admin/customers/${id}`)
};

export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export default api;
