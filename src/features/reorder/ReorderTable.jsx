import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  Group,
  Text,
  Badge,
  Box,
  ActionIcon,
  Tooltip,
  Stack,
  ThemeIcon,
} from '@mantine/core';
import { IconEye, IconCurrencyDollar, IconInfoCircle } from '@tabler/icons-react';
import { formatMoney, formatNumber, formatDate } from '@/lib/formatters';
import EmptyState from '@/components/ui/EmptyState';
import TableSkeleton from '@/components/skeletons/TableSkeleton';
import ExplanationBlock from '@/components/ui/ExplanationBlock';

const PRIORITY_COLORS = {
  critical: 'red',
  high: 'orange',
  normal: 'blue',
  low: 'gray',
};

const PRIORITY_LABELS = {
  critical: 'Критично',
  high: 'Высокий',
  normal: 'Средний',
  low: 'Низкий',
};

export default function ReorderTable({ data, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Paper withBorder p="md" radius="md">
        <TableSkeleton rows={8} />
      </Paper>
    );
  }

  if (!data || !data.items || data.items.length === 0) {
    return (
      <Paper withBorder p="xl" radius="md">
        <EmptyState
          title="Список закупок пуст"
          description="На выбранный горизонт планирования нет товаров, требующих заказа"
        />
      </Paper>
    );
  }

  const { items, total_cost, explanation } = data;

  return (
    <Stack gap="md">
      <Paper withBorder p="md" radius="md" bg="blue.0">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <ThemeIcon variant="light" color="blue" size="lg">
              <IconCurrencyDollar size={20} />
            </ThemeIcon>
            <Text size="lg" fw={600}>
              Итоговая сумма закупок
            </Text>
          </Group>
          <Text size="xl" fw={700} c="blue">
            {formatMoney(total_cost)}
          </Text>
        </Group>
      </Paper>

      <Paper withBorder radius="md">
        <Box style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Приоритет</Table.Th>
                <Table.Th>SKU</Table.Th>
                <Table.Th>Наименование</Table.Th>
                <Table.Th>Категория</Table.Th>
                <Table.Th ta="right">Остаток</Table.Th>
                <Table.Th ta="right">Дней запаса</Table.Th>
                <Table.Th>Дата исчерпания</Table.Th>
                <Table.Th ta="right">Заказать</Table.Th>
                <Table.Th ta="right">Стоимость</Table.Th>
                <Table.Th>Заказать до</Table.Th>
                <Table.Th>Поставщик</Table.Th>
                <Table.Th w={60}></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.map((item) => {
                const priorityColor = PRIORITY_COLORS[item.priority] || 'gray';
                const priorityLabel = PRIORITY_LABELS[item.priority] || item.priority;

                return (
                  <Table.Tr key={item.sku}>
                    <Table.Td>
                      <Badge size="sm" color={priorityColor} variant="light">
                        {priorityLabel}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500} ff="monospace">
                        {item.sku}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={1}>
                        {item.name}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {item.category}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" fw={500}>
                        {formatNumber(item.current_stock, 2)} {item.unit}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" c={item.days_of_cover < 14 ? 'red' : 'dimmed'}>
                        {formatNumber(item.days_of_cover, 1)} дн.
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="red">
                        {formatDate(item.stockout_date)}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" fw={600}>
                        {formatNumber(item.recommended_qty, 2)} {item.unit}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" fw={600}>
                        {formatMoney(item.estimated_cost)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {formatDate(item.order_by_date)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed" lineClamp={1}>
                        {item.supplier_name}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Tooltip label="Открыть карточку">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => navigate(`/inventory/${item.sku}`)}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Box>
      </Paper>

      {explanation && <ExplanationBlock explanation={explanation} />}
    </Stack>
  );
}