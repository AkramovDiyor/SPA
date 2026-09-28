import { Paper, Stack, Group, Select, NumberInput, Button, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCalculator } from '@tabler/icons-react';

export default function ForecastForm({ products, productsLoading, onSubmit, loading }) {
  const form = useForm({
    initialValues: {
      sku: '',
      horizon_months: 3,
      safety_stock_days: 14,
      budget_limit: null,
    },
    validate: {
      sku: (value) => (!value ? 'Выберите товар' : null),
      horizon_months: (value) =>
        value < 1 || value > 24 ? 'Горизонт от 1 до 24 месяцев' : null,
    },
  });

  const productOptions = products.map((p) => ({
    value: p.sku,
    label: `${p.sku} — ${p.name}`,
  }));

  return (
    <Paper withBorder p="md" radius="md">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="md">
          <Select
            label="Товар"
            placeholder="Выберите товар..."
            data={productOptions}
            searchable
            nothingFoundMessage="Ничего не найдено"
            {...form.getInputProps('sku')}
            disabled={productsLoading || loading}
            required
          />

          <Group grow>
            <NumberInput
              label="Горизонт планирования (месяцев)"
              placeholder="3"
              min={1}
              max={24}
              {...form.getInputProps('horizon_months')}
              disabled={loading}
              required
            />

            <NumberInput
              label="Страховой запас (дней)"
              placeholder="14"
              min={0}
              max={90}
              {...form.getInputProps('safety_stock_days')}
              disabled={loading}
            />
          </Group>

          <NumberInput
            label="Лимит бюджета (₽, опционально)"
            placeholder="Без ограничений"
            min={0}
            step={10000}
            {...form.getInputProps('budget_limit')}
            disabled={loading}
          />

          <Group justify="flex-end">
            <Button
              type="submit"
              leftSection={<IconCalculator size={16} />}
              loading={loading}
              size="md"
            >
              Рассчитать
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}