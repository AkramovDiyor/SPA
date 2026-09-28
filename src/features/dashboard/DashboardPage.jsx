import { useQuery } from '@tanstack/react-query';
import { Stack, Grid } from '@mantine/core';
import { useSpaObject } from '@/hooks/useSpaObject';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { queryKeys } from '@/lib/queryKeys';
import { fetchDashboard } from '@/api/dashboard';

import PageHeader from '@/components/ui/PageHeader';
import ErrorState from '@/components/ui/ErrorState';
import KpiGrid from './KpiGrid';
import AlertsPreview from './AlertsPreview';
import UpcomingOrders from './UpcomingOrders';

export default function DashboardPage() {
  const { spaObject } = useSpaObject();
  const { handleError } = useErrorHandler();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: fetchDashboard,
  });

  const handleRetry = () => refetch();

  const kpiArray = data?.kpi
    ? [
        { key: 'sku_count', label: 'Позиций на складе', value: data.kpi.sku_count, unit: 'шт' },
        { key: 'stock_value', label: 'Стоимость остатков', value: data.kpi.stock_value, unit: 'RUB' },
        { key: 'positions_below_reorder_point', label: 'Ниже точки заказа', value: data.kpi.positions_below_reorder_point, unit: 'шт' },
        { key: 'expiring_batches', label: 'Истекающих партий', value: data.kpi.expiring_batches, unit: 'шт' },
        { key: 'open_orders_qty', label: 'Открытых заказов', value: data.kpi.open_orders_qty, unit: 'шт' },
      ]
    : [];

  return (
    <Stack gap="lg">
      <PageHeader
        title="Дашборд"
        subtitle={`Объект: ${spaObject} · Актуально на ${data?.as_of || '—'}`}
      />

      {isError && !isLoading && (
        <ErrorState
          title="Не удалось загрузить дашборд"
          message={error?.message}
          onRetry={handleRetry}
        />
      )}

      <KpiGrid items={kpiArray} loading={isLoading} />

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <AlertsPreview items={data?.top_alerts} loading={isLoading} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <UpcomingOrders items={data?.next_orders} loading={isLoading} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}