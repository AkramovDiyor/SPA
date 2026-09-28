import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  Group,
  Text,
  Badge,
  Pagination,
  Box,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { formatMoney, formatNumber, formatDate } from '@/lib/formatters';
import EmptyState from '@/components/ui/EmptyState';
import TableSkeleton from '@/components/skeletons/TableSkeleton';

const PAGE_SIZE = 15;

export default function InventoryTable({ items, loading }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const safeItems = Array.isArray(items) ? items : [];
  const totalPages = Math.max(1, Math.ceil(safeItems.length / PAGE_SIZE));

  const currentPage = Math.min(page, totalPages);
  const paginatedItems = safeItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  if (loading) {
    return (
      <Paper withBorder p="md" radius="md">
        <TableSkeleton rows={10} />
      </Paper>
    );
  }

  if (safeItems.length === 0) {
    return (
      <Paper withBorder p="xl" radius="md">
        <EmptyState
          title="Остатки не найдены"
          description="Измените фильтры или проверьте подключение к серверу"
        />
      </Paper>
    );
  }

  return (
    <Paper withBorder radius="md">
      <Box style={{ overflowX: 'auto' }}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>SKU</Table.Th>
              <Table.Th>Наименование</Table.Th>
              <Table.Th>Категория</Table.Th>
              <Table.Th ta="right">Остаток</Table.Th>
              <Table.Th ta="right">Мин.</Table.Th>
              <Table.Th ta="right">Дней запаса</Table.Th>
              <Table.Th>Срок годности</Table.Th>
              <Table.Th ta="right">Стоимость</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th w={60}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedItems.map((item) => {
              const isBelowMin = item.qty < item.min_stock;
              const daysOfCover = item.days_of_cover;
              const nearestExpiry = item.nearest_expiry;

              let statusColor = 'green';
              let statusLabel = 'В норме';
              if (isBelowMin) {
                statusColor = 'red';
                statusLabel = 'Ниже минимума';
              } else if (daysOfCover != null && daysOfCover < 14) {
                statusColor = 'orange';
                statusLabel = 'Мало запаса';
              }

              const daysColor =
                daysOfCover == null
                  ? 'dimmed'
                  : daysOfCover < 14
                  ? 'red'
                  : daysOfCover < 30
                  ? 'orange'
                  : 'green';

              return (
                <Table.Tr key={item.sku}>
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
                      {formatNumber(item.qty, 2)} {item.unit}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm" c="dimmed">
                      {formatNumber(item.min_stock, 2)}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm" fw={500} c={daysColor}>
                      {daysOfCover != null ? `${daysOfCover.toFixed(0)} дн.` : '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {nearestExpiry ? formatDate(nearestExpiry) : '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm" fw={500}>
                      {formatMoney(item.stock_value)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge size="sm" color={statusColor} variant="light">
                      {statusLabel}
                    </Badge>
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

      {totalPages > 1 && (
        <Group justify="space-between" p="md" align="center">
          <Text size="sm" c="dimmed">
            Показано {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, safeItems.length)} из {safeItems.length}
          </Text>
          <Pagination
            value={currentPage}
            onChange={setPage}
            total={totalPages}
            siblings={1}
          />
        </Group>
      )}
    </Paper>
  );
}