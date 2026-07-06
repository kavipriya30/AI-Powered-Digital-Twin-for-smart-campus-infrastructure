import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Buildings API
export const buildingsAPI = {
  getAll: (params) => api.get('/buildings', { params }),
  getOne: (id) => api.get(`/buildings/${id}`),
  create: (data) => api.post('/buildings', data),
  update: (id, data) => api.put(`/buildings/${id}`, data),
  delete: (id) => api.delete(`/buildings/${id}`),
  getOverview: () => api.get('/buildings/overview'),
  getModel: (id) => api.get(`/buildings/${id}/model`)
};

// Sensors API
export const sensorsAPI = {
  getAll: (params) => api.get('/sensors', { params }),
  getOne: (id) => api.get(`/sensors/${id}`),
  create: (data) => api.post('/sensors', data),
  update: (id, data) => api.put(`/sensors/${id}`, data),
  delete: (id) => api.delete(`/sensors/${id}`),
  updateReading: (id, value) => api.put(`/sensors/${id}/readings`, { value }),
  getHistory: (id, params) => api.get(`/sensors/${id}/history`, { params }),
  getByBuilding: (buildingId) => api.get(`/sensors/building/${buildingId}`)
};

// Energy API
export const energyAPI = {
  getLogs: (params) => api.get('/energy', { params }),
  getSummary: (params) => api.get('/energy/summary', { params }),
  getByBuilding: (id, params) => api.get(`/energy/building/${id}`, { params }),
  getRealtime: () => api.get('/energy/realtime'),
  getOptimization: () => api.get('/energy/optimization'),
  getTrends: (params) => api.get('/energy/trends', { params }),
  create: (data) => api.post('/energy', data)
};

// Alerts API
export const alertsAPI = {
  getAll: (params) => api.get('/alerts', { params }),
  getOne: (id) => api.get(`/alerts/${id}`),
  create: (data) => api.post('/alerts', data),
  update: (id, data) => api.put(`/alerts/${id}`, data),
  delete: (id) => api.delete(`/alerts/${id}`),
  acknowledge: (id) => api.put(`/alerts/${id}/acknowledge`),
  resolve: (id, data) => api.put(`/alerts/${id}/resolve`, data),
  getStats: (params) => api.get('/alerts/stats', { params }),
  getActive: () => api.get('/alerts/active'),
  markAsRead: (id) => api.put(`/alerts/${id}/read`)
};

// Predictions API
export const predictionsAPI = {
  getAll: (params) => api.get('/predictions', { params }),
  getOne: (id) => api.get(`/predictions/${id}`),
  getStats: (params) => api.get('/predictions/stats', { params }),
  getMaintenance: () => api.get('/predictions/maintenance'),
  getEnergy: () => api.get('/predictions/energy'),
  getAnomalies: () => api.get('/predictions/anomalies'),
  getRiskAssessment: () => api.get('/predictions/risk-assessment'),
  generate: (data) => api.post('/predictions/generate', data),
  updateStatus: (id, data) => api.put(`/predictions/${id}/status`, data)
};
