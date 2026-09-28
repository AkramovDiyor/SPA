import { SimpleGrid } from '@mantine/core';
import KpiCard from '@/components/ui/KpiCard';
import {
  IconPackage,
  IconAlertTriangle,
  IconShoppingCart,
  IconCurrencyDollar,
  IconClock,
} from '@tabler/icons-react';
import { formatMoney, formatNumber } from '@/lib/formatters';

const ICON_MAP = {
  sku_count: IconPackage,
  stock_value: IconCurrencyDollar,
  positions_below_reorder_point: IconAlertTriangle,
  expiring_batches: IconClock,
  open_orders_qty: IconShoppingCart,
};

const COLOR_MAP = {
  sku_count: 'blue',
  stock_value: 'violet',
  positions_below_reorder_point: 'orange',
  expiring_batches: 'red',
  open_orders_qty: 'green',
};

export default function KpiGrid({ items, loading }) {
  const safeItems = Array.isArray(items) ? items : [];

  if (loading) {
    return (
      <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 5 }} spacing="md">
        {Array.from({ length: 5 }).map((_, i) => (
          <KpiCard key={i} title="—" value="—" loading />
        ))}
      </SimpleGrid>
    );
  }

  if (safeItems.length === 0) {
    return null;
  }

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 5 }} spacing="md">
      {safeItems.map((item, index) => {
        const itemKey = item.key || `kpi-${index}`;
        const Icon = ICON_MAP[itemKey] || IconPackage;
        const color = COLOR_MAP[itemKey] || 'blue';

        let displayValue = item.value;
        if (typeof item.value === 'number') {
          displayValue =
            item.unit === 'RUB'
              ? formatMoney(item.value)
              : formatNumber(item.value);
        }

        return (
          <KpiCard
            key={itemKey}
            title={item.label || 'Метрика'}
            value={displayValue}
            unit={item.unit && item.unit !== 'RUB' ? item.unit : undefined}
            trend={item.trend}
            trendLabel={item.trendLabel}
            icon={Icon}
            color={color}
          />
        );
      })}
    </SimpleGrid>
  );
}