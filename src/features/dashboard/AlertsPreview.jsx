import { Link } from 'react-router-dom';
import {
  Paper,
  Group,
  Stack,
  Text,
  Badge,
  Button,
  Box,
  ThemeIcon,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconChevronRight,
} from '@tabler/icons-react';
import { SEVERITY } from '@/lib/constants';
import EmptyState from '@/components/ui/EmptyState';

export default function AlertsPreview({ items, loading }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <Paper withBorder radius="md" p="md">
      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          <ThemeIcon variant="light" color="orange" size="md">
            <IconAlertTriangle size={18} />
          </ThemeIcon>
          <Text fw={600}>Предупреждения</Text>
        </Group>
        <Button
          component={Link}
          to="/alerts"
          variant="subtle"
          size="xs"
          rightSection={<IconChevronRight size={14} />}
        >
          Все
        </Button>
      </Group>

      {loading ? (
        <Stack gap="xs">
          {Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </Stack>
      ) : safeItems.length === 0 ? (
        <EmptyState
          title="Нет активных предупреждений"
          description="Все показатели в норме"
        />
      ) : (
        <Stack gap="xs">
          {safeItems.slice(0, 5).map((alert) => {
            const sev = SEVERITY[alert.severity] || SEVERITY.info;
            return (
              <Group
                key={alert.alert_id}
                justify="space-between"
                align="flex-start"
                wrap="nowrap"
                gap="sm"
                className="border-b border-gray-100 pb-2 last:border-0"
              >
                <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                  <Group gap="xs" wrap="nowrap">
                    <Badge size="xs" color={sev.color} variant="light">
                      {sev.label}
                    </Badge>
                    <Text size="sm" fw={500} lineClamp={1}>
                      {alert.title}
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed" lineClamp={2}>
                    {alert.name} — {alert.message}
                  </Text>
                  {alert.recommendation && (
                    <Text size="xs" c="blue" lineClamp={1}>
                      💡 {alert.recommendation}
                    </Text>
                  )}
                </Stack>
              </Group>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}