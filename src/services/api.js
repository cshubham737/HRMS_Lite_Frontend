import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee API calls
export const employeeAPI = {
  getAll: () => api.get('/api/employees'),
  getById: (id) => api.get(`/api/employees/${id}`),
  create: (data) => api.post('/api/employees', data),
  delete: (id) => api.delete(`/api/employees/${id}`),
};

// Attendance API calls
export const attendanceAPI = {
  getAll: (params) => api.get('/api/attendance', { params }),
  getSummary: (employeeId) => api.get(`/api/attendance/summary/${employeeId}`),
  mark: (data) => api.post('/api/attendance', data),
  delete: (id) => api.delete(`/api/attendance/${id}`),
};

// Dashboard API calls
export const dashboardAPI = {
  getSummary: () => api.get('/api/dashboard'),
};

export default api;
