import {
  Stack,
  Paper,
  Group,
  Text,
  Grid,
  Alert,
  ThemeIcon,
} from '@mantine/core';
import {
  IconPackage,
  IconTrendingUp,
  IconCalendar,
  IconAlertTriangle,
  IconInfoCircle,
  IconCheck,
} from '@tabler/icons-react';
import { formatMoney, formatNumber, formatDate } from '@/lib/formatters';
import ExplanationBlock from '@/components/ui/ExplanationBlock';

export default function ForecastResult({ data }) {
  if (!data) return null;

  const {
    sku,
    name,
    forecast_demand,
    current_stock,
    incoming_qty,
    expected_stock_without_purchase,
    safety_stock,
    reorder_point,
    recommended_purchase_qty,
    estimated_cost,
    recommended_order_date,
    explanation,
    warnings,
  } = data;

  return (
    <Stack gap="lg">
      <Paper withBorder p="md" radius="md" bg="gray.0">
        <Group gap="xs" mb="xs">
          <ThemeIcon variant="light" color="green" size="lg">
            <IconCheck size={20} />
          </ThemeIcon>
          <Text size="lg" fw={700}>
            Результат расчёта
          </Text>
        </Group>
        <Text size="sm" c="dimmed">
          {sku} — {name}
        </Text>
      </Paper>

      {warnings && warnings.length > 0 && (
        <Stack gap="sm">
          {warnings.map((warning, idx) => {
            const color =
              warning.level === 'error'
                ? 'red'
                : warning.level === 'warning'
                ? 'orange'
                : 'blue';
            const Icon =
              warning.level === 'error'
                ? IconAlertTriangle
                : IconInfoCircle;

            return (
              <Alert
                key={idx}
                icon={<Icon size={16} />}
                color={color}
                variant="light"
                title={warning.title || 'Предупреждение'}
              >
                <Text size="sm">{warning.message}</Text>
              </Alert>
            );
          })}
        </Stack>
      )}

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <MetricCard
            icon={IconTrendingUp}
            color="blue"
            label="Прогнозный спрос"
            value={formatNumber(forecast_demand, 2)}
            subtitle="на горизонт планирования"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <MetricCard
            icon={IconPackage}
            color="violet"
            label="Текущий остаток"
            value={formatNumber(current_stock, 2)}
            subtitle={
              incoming_qty > 0
                ? `+ ${formatNumber(incoming_qty, 2)} в пути`
                : 'Поставок в пути нет'
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <MetricCard
            icon={IconPackage}
            color="orange"
            label="Ожидаемый остаток"
            value={formatNumber(expected_stock_without_purchase, 2)}
            subtitle="без учёта новой закупки"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <MetricCard
            icon={IconPackage}
            color="gray"
            label="Страховой запас"
            value={formatNumber(safety_stock, 2)}
            subtitle={`Точка заказа: ${formatNumber(reorder_point, 2)}`}
          />
        </Grid.Col>
      </Grid>

      <Paper withBorder p="md" radius="md" bg="green.0">
        <Stack gap="sm">
          <Group gap="xs">
            <ThemeIcon variant="filled" color="green" size="lg">
              <IconCheck size={20} />
            </ThemeIcon>
            <Text size="lg" fw={700} c="green.9">
              Рекомендация к закупке
            </Text>
          </Group>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Stack gap={4}>
                <Text size="sm" c="dimmed">
                  Рекомендуемый объём:
                </Text>
                <Text size="xl" fw={700} c="green.9">
                  {formatNumber(recommended_purchase_qty, 2)}
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Stack gap={4}>
                <Text size="sm" c="dimmed">
                  Ориентировочная стоимость:
                </Text>
                <Text size="xl" fw={700} c="green.9">
                  {formatMoney(estimated_cost)}
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>

          {recommended_order_date && (
            <Group gap="xs" mt="xs">
              <IconCalendar size={16} />
              <Text size="sm">
                Рекомендуемая дата заказа:{' '}
                <Text span fw={600}>
                  {formatDate(recommended_order_date)}
                </Text>
              </Text>
            </Group>
          )}
        </Stack>
      </Paper>

      {explanation && <ExplanationBlock explanation={explanation} />}
    </Stack>
  );
}

function MetricCard({ icon: Icon, color, label, value, subtitle }) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group gap="xs" mb="xs">
        <ThemeIcon variant="light" color={color} size="md">
          <Icon size={18} />
        </ThemeIcon>
        <Text size="sm" fw={600}>
          {label}
        </Text>
      </Group>
      <Text size="xl" fw={700}>
        {value}
      </Text>
      {subtitle && (
        <Text size="xs" c="dimmed" mt={4}>
          {subtitle}
        </Text>
      )}
    </Paper>
  );
}