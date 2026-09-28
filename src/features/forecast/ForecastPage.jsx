import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Stack, Paper, Text, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useSpaObject } from '@/hooks/useSpaObject';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { calculateForecast, fetchProductsForSelect } from '@/api/forecast';

import PageHeader from '@/components/ui/PageHeader';
import ForecastForm from './ForecastForm';
import ForecastResult from './ForecastResult';

export default function ForecastPage() {
  const { spaObject } = useSpaObject();
  const { handleError } = useErrorHandler();

  const [forecastData, setForecastData] = useState(null);

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products-select'],
    queryFn: fetchProductsForSelect,
    staleTime: 5 * 60 * 1000,
  });

  const products = Array.isArray(productsData)
    ? productsData
    : productsData?.items || [];

  const mutation = useMutation({
    mutationFn: calculateForecast,
    onSuccess: (data) => {
      setForecastData(data);
    },
    onError: (error) => {
      handleError(error, { title: 'Ошибка расчёта' });
    },
  });

  const handleSubmit = (values) => {
    mutation.mutate({
      sku: values.sku,
      horizon_months: values.horizon_months,
      safety_stock_days: values.safety_stock_days || undefined,
      budget_limit: values.budget_limit || undefined,
    });
  };

  return (
    <Stack gap="lg">
      <PageHeader
        title="Расчёт закупки"
        subtitle={`Объект: ${spaObject} · Прогноз потребности и рекомендуемый объём`}
      />

      <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
        <Text size="sm">
          Укажите товар и горизонт планирования. Система рассчитает прогнозный расход, 
          текущий остаток, рекомендуемый объём закупки и ориентировочную стоимость.
        </Text>
      </Alert>

      <ForecastForm
        products={products}
        productsLoading={productsLoading}
        onSubmit={handleSubmit}
        loading={mutation.isPending}
      />

      {mutation.isError && (
        <Alert color="red" title="Ошибка расчёта">
          {mutation.error?.message || 'Не удалось выполнить расчёт'}
        </Alert>
      )}

      {forecastData && !mutation.isPending && (
        <ForecastResult data={forecastData} />
      )}
    </Stack>
  );
}