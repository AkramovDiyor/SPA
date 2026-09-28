import api from './client';


export const fetchAlerts = (params) => api.get('/api/alerts', { params });