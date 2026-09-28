export const SPA_OBJECTS = ['MS-01', 'MS-02'];

export const SEVERITY = {
  critical: { color: 'red', label: 'Критично' },
  high: { color: 'orange', label: 'Высокий' },
  warning: { color: 'yellow', label: 'Внимание' },
  medium: { color: 'yellow', label: 'Средний' },
  low: { color: 'blue', label: 'Низкий' },
  info: { color: 'gray', label: 'Инфо' },
};

export const ALERT_TYPES = [
  { value: 'deficit_risk', label: 'Риск дефицита' },
  { value: 'low_stock', label: 'Низкий остаток' },
  { value: 'overstock', label: 'Излишек' },
  { value: 'no_movement', label: 'Нет движения' },
  { value: 'expiring_batch', label: 'Истекающая партия' },
  { value: 'consumption_spike', label: 'Рост потребления' },
  { value: 'price_growth', label: 'Рост цены' },
];

export const ALERT_TYPE_ICONS = {
  deficit_risk: 'AlertTriangle',
  low_stock: 'AlertCircle',
  overstock: 'Package',
  no_movement: 'Clock',
  expiring_batch: 'Calendar',
  consumption_spike: 'TrendingUp',
  price_growth: 'CurrencyDollar',
};