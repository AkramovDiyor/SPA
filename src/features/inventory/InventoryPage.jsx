import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Stack, Paper, Group, Select, TextInput, Switch } from '@mantine/core';
import { useSpaObject } from '@/hooks/useSpaObject';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { queryKeys } from '@/lib/queryKeys';
import { fetchStock, fetchMeta } from '@/api/inventory';

import PageHeader from '@/components/ui/PageHeader';
import ErrorState from '@/components/ui/ErrorState';
import InventoryTable from './InventoryTable';

export default function InventoryPage() {
  const { spaObject } = useSpaObject();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);
  const [belowMin, setBelowMin] = useState(false);

  const { data: meta } = useQuery({
    queryKey: queryKeys.meta(),
    queryFn: fetchMeta,
    staleTime: 5 * 60 * 1000, 
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.inventory({ search, category, below_min: belowMin }),
    queryFn: () =>
      fetchStock({
        search: search || undefined,
        category: category || undefined,
        below_min: belowMin || undefined,
      }),
  });

  const categories = useMemo(
    () => (meta?.categories || []).map((c) => ({ value: c, label: c })),
    [meta?.categories],
  );

  const items = Array.isArray(data) ? data : [];

  return (
    <Stack gap="lg">
      <PageHeader
        title="Остатки на складе"
        subtitle={`Объект: ${spaObject} · ${items.length} позиций`}
      />

      <Paper withBorder p="md" radius="md">
        <Group grow align="flex-end">
          <TextInput
            label="Поиск"
            placeholder="Название или SKU..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <Select
            label="Категория"
            placeholder="Все категории"
            data={categories}
            value={category}
            onChange={setCategory}
            clearable
          />
          <Switch
            label="Только ниже минимума"
            checked={belowMin}
            onChange={(e) => setBelowMin(e.currentTarget.checked)}
            mt="lg"
          />
        </Group>
      </Paper>

      {isError && !isLoading && (
        <ErrorState
          title="Не удалось загрузить остатки"
          message={error?.message}
          onRetry={refetch}
        />
      )}

      <InventoryTable items={items} loading={isLoading} />
    </Stack>
  );
}