import api from './client';


export const fetchPriceDynamics = (params) => api.get('/api/price-dynamics', { params });

export const fetchServices = () => api.get('/api/services');

export const fetchSuppliers = () => api.get('/api/suppliers');

export const simulateServiceCost = (payload) => api.post('/api/service-cost/simulate', payload);