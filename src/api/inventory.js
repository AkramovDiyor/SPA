import api from './client';


export const fetchStock = (params) => api.get('/api/stock', { params });


export const fetchProducts = (params) => api.get('/api/products', { params });

export const fetchProduct = (sku) => api.get(`/api/products/${sku}`);


export const fetchBatches = (params) => api.get('/api/batches', { params });

export const fetchMovements = (params) => api.get('/api/movements', { params });

export const fetchMeta = () => api.get('/api/meta');