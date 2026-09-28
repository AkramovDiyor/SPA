import { Link } from 'react-router-dom';
import {
  Paper,
  Group,
  Stack,
  Text,
  Badge,
  Button,
  ThemeIcon,
  Divider,
  Box,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconAlertCircle,
  IconPackage,
  IconClock,
  IconCalendar,
  IconTrendingUp,
  IconCurrencyDollar,
  IconArrowRight,
} from '@tabler/icons-react';
import { SEVERITY, ALERT_TYPE_ICONS } from '@/lib/constants';
import { formatNumber, formatMoney, formatDate } from '@/lib/formatters';

const ICON_MAP = {
  AlertTriangle: IconAlertTriangle,
  AlertCircle: IconAlertCircle,
  Package: IconPackage,
  Clock: IconClock,
  Calendar: IconCalendar,
  TrendingUp: IconTrendingUp,
  CurrencyDollar: IconCurrencyDollar,
};

export default function AlertCard({ alert }) {
  const sev = SEVERITY[alert.severity] || SEVERITY.info;
  const iconName = ALERT_TYPE_ICONS[alert.type] || 'AlertTriangle';
  const Icon = ICON_MAP[iconName] || IconAlertTriangle;

  return (
    <Paper withBorder radius="md" p="md">
      <Group justify="space-between" align="flex-start" mb="sm" wrap="nowrap">
        <Group gap="sm" align="flex-start" wrap="nowrap" style={{ flex: 1 }}>
          <ThemeIcon variant="light" color={sev.color} size="lg" radius="md">
            <Icon size={20} />
          </ThemeIcon>
          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
            <Group gap="xs" wrap="nowrap">
              <Badge size="sm" color={sev.color} variant="filled">
                {sev.label}
              </Badge>
              <Text size="sm" c="dimmed">
                {alert.alert_id}
              </Text>
            </Group>
            <Text size="lg" fw={600}>
              {alert.title}
            </Text>
            <Text size="sm" c="dimmed">
              {alert.name} ({alert.sku})
            </Text>
          </Stack>
        </Group>
        <Button
          component={Link}
          to={`/inventory/${alert.sku}`}
          variant="light"
          size="xs"
          rightSection={<IconArrowRight size={14} />}
        >
          К товару
        </Button>
      </Group>

      <Paper bg="gray.0" p="sm" radius="sm" mb="sm">
        <Text size="sm">{alert.message}</Text>
      </Paper>

      {alert.metrics && Object.keys(alert.metrics).length > 0 && (
        <>
          <Text size="xs" fw={600} c="dimmed" mb="xs">
            Ключевые показатели:
          </Text>
          <Group gap="xs" mb="sm" wrap="wrap">
            {Object.entries(alert.metrics).map(([key, value]) => {
              let displayValue = value;
              if (typeof value === 'number') {
                if (key.includes('value') || key.includes('price')) {
                  displayValue = formatMoney(value);
                } else if (key.includes('days') || key.includes('cover')) {
                  displayValue = `${value} дн.`;
                } else {
                  displayValue = formatNumber(value, 2);
                }
              }
              return (
                <Badge key={key} variant="outline" size="sm">
                  {formatMetricLabel(key)}: {displayValue}
                </Badge>
              );
            })}
          </Group>
        </>
      )}

      {alert.recommendation && (
        <>
          <Divider my="sm" />
          <Group gap="xs" align="flex-start">
            <ThemeIcon variant="light" color="blue" size="sm" radius="xl">
              <IconArrowRight size={14} />
            </ThemeIcon>
            <Stack gap={2} style={{ flex: 1 }}>
              <Text size="xs" fw={600} c="blue">
                Рекомендация:
              </Text>
              <Text size="sm">{alert.recommendation}</Text>
            </Stack>
          </Group>
        </>
      )}
    </Paper>
  );
}

function formatMetricLabel(key) {
  const map = {
    stock: 'Остаток',
    incoming: 'В пути',
    avg_daily_consumption: 'Расход/день',
    days_of_cover: 'Дней запаса',
    lead_time_days: 'Срок поставки',
    safety_stock: 'Страховой запас',
    reorder_point: 'Точка заказа',
    recommended_qty: 'Реком. объём',
    estimated_cost: 'Ориент. стоимость',
    price_change_pct: 'Изменение цены',
    overstock_days: 'Дней излишка',
    no_movement_days: 'Дней без движения',
    days_to_expiry: 'Дней до истечения',
    batch_qty: 'Объём партии',
  };
  return map[key] || key.replace(/_/g, ' ');
}