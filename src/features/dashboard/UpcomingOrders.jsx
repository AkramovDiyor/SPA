import { Link } from 'react-router-dom';
import {
  Paper,
  Group,
  Stack,
  Text,
  Badge,
  Button,
  Table,
  Box,
  ThemeIcon,
} from '@mantine/core';
import {
  IconTruck,
  IconChevronRight,
} from '@tabler/icons-react';
import { formatMoney, formatDate } from '@/lib/formatters';
import EmptyState from '@/components/ui/EmptyState';

const STATUS_COLORS = {
  pending: 'gray',
  confirmed: 'blue',
  shipped: 'violet',
  delivered: 'green',
  delayed: 'red',
};

export default function UpcomingOrders({ items, loading }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <Paper withBorder radius="md" p="md">
      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          <ThemeIcon variant="light" color="green" size="md">
            <IconTruck size={18} />
          </ThemeIcon>
          <Text fw={600}>Ближайшие заказы</Text>
        </Group>
        <Button
          component={Link}
          to="/reorder"
          variant="subtle"
          size="xs"
          rightSection={<IconChevronRight size={14} />}
        >
          Все
        </Button>
      </Group>

      {loading ? (
        <Stack gap="xs">
          {Array.from({ length: 4 }).map((_, i) => (
            <Box key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </Stack>
      ) : safeItems.length === 0 ? (
        <EmptyState
          title="Нет активных заказов"
          description="Ближайших поставок не запланировано"
        />
      ) : (
        <Box style={{ overflowX: 'auto' }}>
          <Table striped withTableBorder={false} highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Заказ</Table.Th>
                <Table.Th>Поставщик</Table.Th>
                <Table.Th>Позиций</Table.Th>
                <Table.Th>Сумма</Table.Th>
                <Table.Th>Ожидается</Table.Th>
                <Table.Th>Статус</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {safeItems.map((order) => {
                const statusColor = STATUS_COLORS[order.status] || 'gray';
                return (
                  <Table.Tr key={order.order_id || order.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {order.order_id || order.id}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {order.supplier_name || order.supplier || '—'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {order.items_count ?? order.items ?? '—'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {formatMoney(order.total_amount ?? order.total)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{formatDate(order.expected_date ?? order.eta)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge size="sm" color={statusColor} variant="light">
                        {order.status_label || order.status || '—'}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Box>
      )}
    </Paper>
  );
}