import api from './client';

export const sendChatMessage = (message) => api.post('/api/chat', { message });

export const getChatExamples = () => api.get('/api/chat/examples');