import api from './client';
import { getSpaObject } from './spa-object';

export const fetchPurchasePlan = (payload) => {
  const body = {
    ...payload,
    location: getSpaObject(),
  };
  return api.post('/api/purchase-plan', body);
};

export const fetchBudget = (payload) => {
  const body = {
    ...payload,
    location: getSpaObject(),
  };
  return api.post('/api/budget', body);
};