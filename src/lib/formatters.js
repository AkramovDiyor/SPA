const moneyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'percent',
  maximumFractionDigits: 1,
});

export const formatMoney = (v) =>
  v == null || Number.isNaN(Number(v)) ? '—' : moneyFormatter.format(v);

export const formatNumber = (v, digits = 0) =>
  v == null || Number.isNaN(Number(v))
    ? '—'
    : numberFormatter.format(Number(v).toFixed ? Number(v) : v);

export const formatPercent = (v) =>
  v == null || Number.isNaN(Number(v)) ? '—' : percentFormatter.format(v);

export const formatDate = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString('ru-RU');
};