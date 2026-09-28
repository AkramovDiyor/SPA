import { Paper, Group, Stack, Text, ThemeIcon, Box } from '@mantine/core';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconMinus,
} from '@tabler/icons-react';

export default function KpiCard({
  title,
  value,
  unit,
  trend,
  trendLabel,
  icon: Icon,
  color = 'blue',
  loading = false,
}) {
  const trendNum = Number(trend);
  const hasTrend = !Number.isNaN(trendNum) && trend !== null && trend !== undefined;

  let TrendIcon = IconMinus;
  let trendColor = 'gray';
  if (hasTrend && trendNum > 0) {
    TrendIcon = IconArrowUpRight;
    trendColor = 'green';
  } else if (hasTrend && trendNum < 0) {
    TrendIcon = IconArrowDownRight;
    trendColor = 'red';
  }

  const trendText = hasTrend
    ? `${trendNum > 0 ? '+' : ''}${trendNum.toFixed(1)}%`
    : null;

  return (
    <Paper withBorder p="md" radius="md" h="100%">
      <Group justify="space-between" align="flex-start" mb="xs">
        <Text size="sm" c="dimmed" fw={500}>
          {title}
        </Text>
        {Icon && (
          <ThemeIcon variant="light" color={color} size="md" radius="md">
            <Icon size={18} />
          </ThemeIcon>
        )}
      </Group>

      <Group gap="xs" align="baseline" mb={4}>
        <Text
          size="xl"
          fw={700}
          className={loading ? 'animate-pulse' : ''}
        >
          {loading ? '—' : value ?? '—'}
        </Text>
        {unit && !loading && (
          <Text size="sm" c="dimmed">
            {unit}
          </Text>
        )}
      </Group>

      {hasTrend && !loading && (
        <Group gap={4} align="center">
          <Box
            className={`flex items-center text-${trendColor}-600`}
            style={{ color: `var(--mantine-color-${trendColor}-6)` }}
          >
            <TrendIcon size={14} />
            <Text size="xs" fw={600} ml={2}>
              {trendText}
            </Text>
          </Box>
          {trendLabel && (
            <Text size="xs" c="dimmed">
              {trendLabel}
            </Text>
          )}
        </Group>
      )}
    </Paper>
  );
}