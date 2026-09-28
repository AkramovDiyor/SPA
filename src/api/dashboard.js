import api from './client';

export const fetchDashboard = () => api.get('/api/dashboard');