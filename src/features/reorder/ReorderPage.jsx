import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Stack, Paper, Group, Select, Text, NumberInput } from '@mantine/core';
import { useSpaObject } from '@/hooks/useSpaObject';
import { queryKeys } from '@/lib/queryKeys';
import { fetchReorderList } from '@/api/reorder';

import PageHeader from '@/components/ui/PageHeader';
import ErrorState from '@/components/ui/ErrorState';
import ReorderTable from './ReorderTable';

export default function ReorderPage() {
  const { spaObject } = useSpaObject();
  const [horizonDays, setHorizonDays] = useState(14);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.reorder({ horizon_days: horizonDays }),
    queryFn: () => fetchReorderList({ horizon_days: horizonDays }),
  });

  return (
    <Stack gap="lg">
      <PageHeader
        title="Что заказать"
        subtitle={`Объект: ${spaObject} · Список товаров для закупки в ближайший период`}
      />

      <Paper withBorder p="md" radius="md">
        <Group align="flex-end" grow>
          <NumberInput
            label="Горизонт планирования (дней)"
            value={horizonDays}
            onChange={(val) => setHorizonDays(val || 14)}
            min={1}
            max={90}
            required
          />
        </Group>
      </Paper>

      {isError && !isLoading && (
        <ErrorState
          title="Не удалось загрузить список закупок"
          message={error?.message}
          onRetry={refetch}
        />
      )}

      <ReorderTable data={data} loading={isLoading} />
    </Stack>
  );
}