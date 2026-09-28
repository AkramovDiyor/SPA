import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Stack,
  Paper,
  Group,
  Select,
  Button,
  Text,
  Grid,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { queryKeys } from '@/lib/queryKeys';
import { fetchPriceDynamics, fetchSuppliers } from '@/api/price-dynamics';
import { fetchProducts } from '@/api/inventory';
import { formatMoney, formatDate } from '@/lib/formatters';
import EmptyState from '@/components/ui/EmptyState';

export default function PriceDynamicsChart() {
  const isSm = useMediaQuery('(min-width: 36em)'); 
  const isLg = useMediaQuery('(min-width: 62em)'); 
  const isXl = useMediaQuery('(min-width: 88em)');

  const chartHeight = isXl ? 400 : isLg ? 340 : isSm ? 300 : 240;

  const form = useForm({
    initialValues: { sku: '', supplier_id: '' },
    validate: {
      sku: (value) => (!value ? 'Выберите товар' : null),
      supplier_id: (value) => (!value ? 'Выберите поставщика' : null),
    },
  });

  const { data: products } = useQuery({
    queryKey: ['products-select'],
    queryFn: fetchProducts,
  });

  const { data: suppliers } = useQuery({
    queryKey: queryKeys.suppliers(),
    queryFn: () =>
      fetchSuppliers().then((res) =>
        Array.isArray(res) ? res : res.items || [],
      ),
  });

  const productOptions = (
    Array.isArray(products) ? products : products?.items || []
  ).map((p) => ({
    value: p.sku,
    label: `${p.sku} — ${p.name}`,
  }));

  const supplierOptions = (suppliers || []).map((s) => ({
    value: s.supplier_id || s.id,
    label: s.name,
  }));

  const { data, isFetching, refetch } = useQuery({
    queryKey: queryKeys.priceDynamics(form.values),
    queryFn: () => fetchPriceDynamics(form.values),
    enabled: false,
  });

  const handleSubmit = (values) => {
    refetch({ queryKey: queryKeys.priceDynamics(values) });
  };

  const chartData = (data?.purchases || []).map((p) => ({
    date: p.date,
    price: p.unit_price,
    invoice_no: p.invoice_no,
  }));

  const deltaPositive = data && data.delta_pct > 0;

  return (
    <Stack gap={{ base: 'md', sm: 'lg' }} maw={1400} mx="auto" w="100%">
      <Paper withBorder p={{ base: 'sm', sm: 'md', md: 'lg' }} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md" align="flex-end">
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <Select
                label="Товар (SKU)"
                placeholder="Выберите товар..."
                data={productOptions}
                searchable
                {...form.getInputProps('sku')}
                required
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <Select
                label="Поставщик"
                placeholder="Выберите поставщика..."
                data={supplierOptions}
                searchable
                {...form.getInputProps('supplier_id')}
                required
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 12, lg: 4 }}>
              <Button
                type="submit"
                leftSection={<IconSearch size={16} />}
                loading={isFetching}
                size="md"
                fullWidth
              >
                Показать динамику
              </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Paper>

      {isFetching ? (
        <Paper p={{ base: 'lg', sm: 'xl' }} ta="center" bg="gray.0" radius="md">
          <Text c="dimmed" size="sm">
            Загрузка данных...
          </Text>
        </Paper>
      ) : chartData.length > 0 ? (
        <Paper withBorder p={{ base: 'sm', sm: 'md', md: 'lg' }} radius="md">
          <Group
            justify="space-between"
            align="flex-start"
            gap="xs"
            mb={{ base: 'sm', sm: 'md' }}
            wrap="wrap"
          >
            <Text
              fw={600}
              size={{ base: 'sm', sm: 'md' }}
            >
              История закупочных цен
            </Text>
            {data && (
              <Text
                size="sm"
                fw={600}
                c={deltaPositive ? 'red' : 'green'}
              >
                Изменение: {deltaPositive ? '+' : ''}
                {data.delta_pct}% ({data.delta_rub} ₽)
              </Text>
            )}
          </Group>

          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(val) => formatDate(val).slice(0, 5)}
                tick={{ fontSize: 11 }}
                minTickGap={20}
              />
              <YAxis
                tickFormatter={(val) => `${val} ₽`}
                tick={{ fontSize: 11 }}
                width={60}
              />
              <Tooltip
                cursor={{ stroke: '#228be6', strokeWidth: 1, strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    return (
                      <Paper
                        p="xs"
                        withBorder
                        shadow="sm"
                        radius="sm"
                        style={{ maxWidth: 220 }}
                      >
                        <Text size="xs" fw={600}>
                          {formatDate(dataPoint.date)}
                        </Text>
                        <Text size="sm">{formatMoney(dataPoint.price)}</Text>
                        <Text size="xs" c="dimmed" lineClamp={2}>
                          Накладная: {dataPoint.invoice_no}
                        </Text>
                      </Paper>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#228be6"
                strokeWidth={2}
                dot={{ r: isSm ? 4 : 3 }}
                activeDot={{ r: isSm ? 6 : 5 }}
                name="Цена за ед."
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      ) : (
        <Paper
          p={{ base: 'lg', sm: 'xl' }}
          ta="center"
          bg="gray.0"
          radius="md"
        >
          <Box mih={isSm ? 220 : 160} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EmptyState
              title="Нет данных для отображения"
              description="Выберите товар и поставщика, затем нажмите «Показать динамику»"
            />
          </Box>
        </Paper>
      )}
    </Stack>
  );
}