import axios from 'axios';
import { getSpaObject } from './spa-object';

const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const location = getSpaObject();
  if (location) {
    config.params = {
      ...(config.params || {}),
      location,
    };
  }
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeError(error);
    return Promise.reject(normalized);
  }
);

function normalizeError(error) {
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return makeApiError({ code: 'TIMEOUT', message: 'Сервер не отвечает.', status: null });
    }
    if (axios.isCancel(error)) {
      return makeApiError({ code: 'CANCELLED', message: 'Запрос отменён.', status: null, silent: true });
    }
    return makeApiError({ code: 'NETWORK', message: 'Нет подключения к серверу.', status: null });
  }

  const { status, data } = error.response;
  const serverMessage = data?.detail || data?.message || error.message;

  return makeApiError({
    code: status >= 500 ? `SERVER_${status}` : `CLIENT_${status}`,
    message: status >= 500 ? 'Ошибка сервера. Попробуйте позже.' : serverMessage,
    status,
    details: data,
  });
}

function makeApiError({ code, message, status, details, silent = false }) {
  const err = new Error(message);
  err.code = code;
  err.status = status;
  err.details = details;
  err.silent = silent;
  return err;
}

export const api = {
  get: (url, config) => apiClient.get(url, config).then((r) => r.data),
  post: (url, body, config) => apiClient.post(url, body, config).then((r) => r.data),
  put: (url, body, config) => apiClient.put(url, body, config).then((r) => r.data),
  patch: (url, body, config) => apiClient.patch(url, body, config).then((r) => r.data),
  delete: (url, config) => apiClient.delete(url, config).then((r) => r.data),
};

export default api;