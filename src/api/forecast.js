import api from './client';

export const calculateForecast = (payload) => api.post('/api/forecast', payload);

export const fetchProductsForSelect = () => api.get('/api/products');