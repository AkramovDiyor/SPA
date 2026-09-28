import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Stack, Paper, Group, Select, Text, Badge } from '@mantine/core';
import { useSpaObject } from '@/hooks/useSpaObject';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { queryKeys } from '@/lib/queryKeys';
import { fetchAlerts } from '@/api/alerts';
import { ALERT_TYPES, SEVERITY } from '@/lib/constants';

import PageHeader from '@/components/ui/PageHeader';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import AlertCard from './AlertCard';

export default function AlertsPage() {
  const { spaObject } = useSpaObject();

  const [typeFilter, setTypeFilter] = useState(null);
  const [severityFilter, setSeverityFilter] = useState(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.alerts({ type: typeFilter, severity: severityFilter }),
    queryFn: () =>
      fetchAlerts({
        type: typeFilter || undefined,
        severity: severityFilter || undefined,
      }),
  });

  const alerts = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    return [];
  }, [data]);

  const severityOptions = Object.entries(SEVERITY).map(([key, val]) => ({
    value: key,
    label: val.label,
  }));

  return (
    <Stack gap="lg">
      <PageHeader
        title="Предупреждения"
        subtitle={`Объект: ${spaObject} · ${alerts.length} активных`}
      />

      <Paper withBorder p="md" radius="md">
        <Group grow align="flex-end">
          <Select
            label="Тип предупреждения"
            placeholder="Все типы"
            data={ALERT_TYPES}
            value={typeFilter}
            onChange={setTypeFilter}
            clearable
          />
          <Select
            label="Серьёзность"
            placeholder="Все уровни"
            data={severityOptions}
            value={severityFilter}
            onChange={setSeverityFilter}
            clearable
          />
        </Group>
      </Paper>

      {isError && !isLoading && (
        <ErrorState
          title="Не удалось загрузить предупреждения"
          message={error?.message}
          onRetry={refetch}
        />
      )}

      {isLoading ? (
        <Stack gap="md">
          {Array.from({ length: 3 }).map((_, i) => (
            <Paper key={i} withBorder p="md" radius="md">
              <div className="h-16 bg-gray-100 rounded animate-pulse" />
            </Paper>
          ))}
        </Stack>
      ) : alerts.length === 0 ? (
        <EmptyState
          title="Нет активных предупреждений"
          description="Все показатели в норме"
        />
      ) : (
        <Stack gap="md">
          {alerts.map((alert) => (
            <AlertCard key={alert.alert_id} alert={alert} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}