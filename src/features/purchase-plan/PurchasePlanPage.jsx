import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Stack,
  Paper,
  Select,
  NumberInput,
  Button,
  Tabs,
  Text,
  Grid,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCalculator, IconCalendar, IconWallet } from '@tabler/icons-react';
import { useSpaObject } from '@/hooks/useSpaObject';
import { queryKeys } from '@/lib/queryKeys';
import { fetchPurchasePlan, fetchBudget } from '@/api/purchase-plan';

import PageHeader from '@/components/ui/PageHeader';
import ErrorState from '@/components/ui/ErrorState';
import BudgetCharts from './BudgetCharts';

const PERIOD_OPTIONS = [
  { value: 'month', label: '1 месяц' },
  { value: 'quarter', label: 'Квартал (3 мес.)' },
  { value: 'half_year', label: 'Полгода (6 мес.)' },
  { value: 'year', label: 'Год (12 мес.)' },
];

export default function PurchasePlanPage() {
  const { spaObject } = useSpaObject();
  const [activeTab, setActiveTab] = useState('plan');

  const form = useForm({
    initialValues: {
      period: 'quarter',
      horizon_months: 3,
      budget_limit: null,
    },
  });

  const isPlan = activeTab === 'plan';
  const queryKey = isPlan
    ? queryKeys.purchasePlan({ ...form.values, type: 'plan' })
    : queryKeys.budget({ ...form.values, type: 'budget' });

  const queryFn = isPlan
    ? () => fetchPurchasePlan(form.values)
    : () => fetchBudget(form.values);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn,
    enabled: false,
  });

  const handleSubmit = (values) => {
    const payload = {
      period: values.period,
      horizon_months: values.horizon_months,
      budget_limit: values.budget_limit || undefined,
    };

    refetch({ queryKey: [spaObject, activeTab, payload] });
  };

  return (
    <Stack gap={{ base: 'md', sm: 'lg' }} maw={1200} mx="auto" w="100%">
      <PageHeader
        title="План и бюджет"
        subtitle={`Объект: ${spaObject} · Прогнозирование закупок и контроль лимитов`}
      />

      <Paper
        withBorder
        p={{ base: 'sm', sm: 'md', md: 'lg' }}
        radius="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md" align="flex-end">
            <Grid.Col span={{ base: 12, sm: 6, lg: 5 }}>
              <Select
                label="Период планирования"
                data={PERIOD_OPTIONS}
                {...form.getInputProps('period')}
                required
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 5 }}>
              <NumberInput
                label="Лимит бюджета (₽, опционально)"
                placeholder="Без ограничений"
                min={0}
                step={10000}
                thousandSeparator=" "
                {...form.getInputProps('budget_limit')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 12, lg: 2 }}>
              <Button
                type="submit"
                leftSection={<IconCalculator size={16} />}
                loading={isLoading}
                size="md"
                fullWidth
              >
                Рассчитать
              </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Paper>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="plan" leftSection={<IconCalendar size={16} />}>
            План закупок
          </Tabs.Tab>
          <Tabs.Tab value="budget" leftSection={<IconWallet size={16} />}>
            Бюджет и декомпозиция
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="plan" pt={{ base: 'md', sm: 'lg' }}>
          {isError && !isLoading && (
            <ErrorState
              title="Ошибка расчёта плана"
              message={error?.message}
              onRetry={refetch}
            />
          )}
          {data && !isLoading && <BudgetCharts data={data} mode="plan" />}
          {!data && !isLoading && (
            <Paper
              p={{ base: 'md', sm: 'xl' }}
              ta="center"
              bg="gray.0"
              radius="md"
            >
              <Text c="dimmed" size="sm">
                Нажмите «Рассчитать», чтобы построить план
              </Text>
            </Paper>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="budget" pt={{ base: 'md', sm: 'lg' }}>
          {isError && !isLoading && (
            <ErrorState
              title="Ошибка расчёта бюджета"
              message={error?.message}
              onRetry={refetch}
            />
          )}
          {data && !isLoading && <BudgetCharts data={data} mode="budget" />}
          {!data && !isLoading && (
            <Paper
              p={{ base: 'md', sm: 'xl' }}
              ta="center"
              bg="gray.0"
              radius="md"
            >
              <Text c="dimmed" size="sm">
                Нажмите «Рассчитать», чтобы проанализировать бюджет
              </Text>
            </Paper>
          )}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}