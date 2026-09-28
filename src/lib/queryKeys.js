import { getSpaObject } from '@/api/spa-object';


const withObject = (key) => {
  const location = getSpaObject() || 'MS-01';
  return [location, ...key];
};

export const queryKeys = {
  meta: () => ['meta'],
  services: () => ['services'],
  suppliers: () => ['suppliers'],
  chatExamples: () => ['chat-examples'],

  dashboard: () => withObject(['dashboard']),
  inventory: (filters) => withObject(['inventory', filters]),
  inventoryItem: (sku) => withObject(['inventory', 'item', sku]),
  alerts: (filters) => withObject(['alerts', filters]),
  forecast: (params) => withObject(['forecast', params]),
  reorder: (params) => withObject(['reorder', params]),
  purchasePlan: (params) => withObject(['purchase-plan', params]),
  budget: (params) => withObject(['budget', params]),
  priceDynamics: (params) => withObject(['price-dynamics', params]),
  serviceCost: (params) => withObject(['service-cost', params]),
};


export const queryDefaults = {
  queries: {
    retry: 1,
    staleTime: 30_000, 
    refetchOnWindowFocus: false,
  },
};