import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Stack,
  Paper,
  Group,
  Text,
  Badge,
  Button,
  Grid,
  Table,
  Box,
  ThemeIcon,
  Loader,
  Center,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconPackage,
  IconClock,
  IconHistory,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useSpaObject } from '@/hooks/useSpaObject';
import { queryKeys } from '@/lib/queryKeys';
import { fetchProduct, fetchStock, fetchBatches, fetchMovements } from '@/api/inventory';
import { formatMoney, formatNumber, formatDate } from '@/lib/formatters';

import PageHeader from '@/components/ui/PageHeader';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import TableSkeleton from '@/components/skeletons/TableSkeleton';

export default function ItemCard() {
  const { id: sku } = useParams();
  const { spaObject } = useSpaObject();

  const { data: product, isLoading: productLoading, isError: productError } = useQuery({
    queryKey: queryKeys.inventoryItem(sku),
    queryFn: () => fetchProduct(sku),
    enabled: !!sku,
  });

  const { data: stockData, isLoading: stockLoading } = useQuery({
    queryKey: [...queryKeys.inventoryItem(sku), 'stock'],
    queryFn: () => fetchStock({ sku }),
    enabled: !!sku,
  });
  const stockInfo = Array.isArray(stockData) ? stockData[0] : null;

  const { data: batchesData, isLoading: batchesLoading } = useQuery({
    queryKey: [...queryKeys.inventoryItem(sku), 'batches'],
    queryFn: () => fetchBatches({ sku }),
    enabled: !!sku,
  });
  const batches = Array.isArray(batchesData)
    ? batchesData
    : batchesData?.items || [];

  const { data: movementsData, isLoading: movementsLoading } = useQuery({
    queryKey: [...queryKeys.inventoryItem(sku), 'movements'],
    queryFn: () => fetchMovements({ sku, limit: 50 }),
    enabled: !!sku,
  });
  const movements = movementsData?.items || [];

  if (productError) {
    return (
      <ErrorState
        title="Не удалось загрузить карточку товара"
        message="Проверьте корректность SKU или подключение к серверу"
      />
    );
  }

  if (productLoading) {
    return (
      <Center h="50vh">
        <Loader size="lg" />
      </Center>
    );
  }

  const isBelowMin = stockInfo && stockInfo.qty < stockInfo.min_stock;

  return (
    <Stack gap="lg">
      <Group>
        <Button
          component={Link}
          to="/inventory"
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
        >
          К остаткам
        </Button>
      </Group>

      <PageHeader
        title={product?.name || sku}
        subtitle={`SKU: ${sku} · ${product?.category || '—'} · Объект: ${spaObject}`}
        actions={
          stockInfo && (
            <Badge
              size="lg"
              color={isBelowMin ? 'red' : 'green'}
              variant="filled"
            >
              {isBelowMin ? 'Ниже минимума' : 'В норме'}
            </Badge>
          )
        }
      />

      <Grid gutter="md">
        {/* Левая колонка: Остатки */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Group gap="xs" mb="sm">
              <ThemeIcon variant="light" color="blue" size="md">
                <IconPackage size={18} />
              </ThemeIcon>
              <Text fw={600}>Остатки на объекте</Text>
            </Group>
            {stockLoading ? (
              <TableSkeleton rows={4} />
            ) : stockInfo ? (
              <Stack gap="xs">
                <InfoRow label="Текущий остаток" value={`${formatNumber(stockInfo.qty, 2)} ${stockInfo.unit}`} highlight />
                <InfoRow label="Минимальный остаток" value={`${formatNumber(stockInfo.min_stock, 2)} ${stockInfo.unit}`} />
                <InfoRow label="Дней запаса" value={stockInfo.days_of_cover != null ? `${stockInfo.days_of_cover.toFixed(0)} дн.` : '—'} />
                <InfoRow label="Стоимость остатков" value={formatMoney(stockInfo.stock_value)} />
                <InfoRow label="Место хранения" value={stockInfo.storage || '—'} />
              </Stack>
            ) : (
              <EmptyState title="Нет данных об остатках" />
            )}
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Group gap="xs" mb="sm">
              <ThemeIcon variant="light" color="violet" size="md">
                <IconInfoCircle size={18} />
              </ThemeIcon>
              <Text fw={600}>Параметры товара</Text>
            </Group>
            <Stack gap="xs">
              <InfoRow label="Категория" value={product?.category} />
              <InfoRow label="Единица измерения" value={product?.unit} />
              <InfoRow label="Текущая цена за ед." value={formatMoney(product?.current_price)} />
              <InfoRow label="Срок поставки" value={product?.lead_time_days ? `${product.lead_time_days} дн.` : '—'} />
              <InfoRow label="Мин. партия заказа" value={product?.min_order_qty ? `${formatNumber(product.min_order_qty)} ${product?.unit}` : '—'} />
              <InfoRow label="Срок годности (общий)" value={product?.shelf_life_days ? `${product.shelf_life_days} дн.` : '—'} />
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      <Paper withBorder radius="md" p="md">
        <Group gap="xs" mb="sm">
          <ThemeIcon variant="light" color="orange" size="md">
            <IconClock size={18} />
          </ThemeIcon>
          <Text fw={600}>Партии и сроки годности</Text>
        </Group>

        {batchesLoading ? (
          <TableSkeleton rows={4} />
        ) : batches.length === 0 ? (
          <EmptyState title="Нет активных партий на складе" />
        ) : (
          <Box style={{ overflowX: 'auto' }}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Партия</Table.Th>
                  <Table.Th ta="right">Количество</Table.Th>
                  <Table.Th>Срок годности</Table.Th>
                  <Table.Th ta="right">Дней до истечения</Table.Th>
                  <Table.Th>Статус</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {batches.map((batch) => {
                  const expiryDate = batch.expires_at;
                  const daysLeft = batch.days_to_expiry ?? 999;
                  
                  const statusColor = daysLeft <= 7 ? 'red' : daysLeft <= 30 ? 'orange' : 'green';
                  const statusLabel = daysLeft <= 7 ? 'Критично' : daysLeft <= 30 ? 'Внимание' : 'Норма';

                  return (
                    <Table.Tr key={batch.batch_id}>
                      <Table.Td>
                        <Text size="sm" ff="monospace">
                          {batch.batch_id}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text size="sm" fw={500}>
                          {formatNumber(batch.qty, 2)} {batch.unit}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {expiryDate ? formatDate(expiryDate) : 'Не указан'}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text size="sm" fw={500} c={statusColor}>
                          {daysLeft !== 999 ? daysLeft : '—'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge size="sm" color={statusColor} variant="light">
                          {statusLabel}
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

      <Paper withBorder radius="md" p="md">
        <Group gap="xs" mb="sm">
          <ThemeIcon variant="light" color="green" size="md">
            <IconHistory size={18} />
          </ThemeIcon>
          <Text fw={600}>Движение товара (последние 50 операций)</Text>
        </Group>
        {movementsLoading ? (
          <TableSkeleton rows={6} />
        ) : movements.length === 0 ? (
          <EmptyState title="Нет операций движения" />
        ) : (
          <Box style={{ overflowX: 'auto' }}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Дата</Table.Th>
                  <Table.Th>Тип операции</Table.Th>
                  <Table.Th ta="right">Количество</Table.Th>
                  <Table.Th>Партия</Table.Th>
                  <Table.Th>Документ</Table.Th>
                  <Table.Th>Комментарий</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {movements.map((mov) => {
                  const isIncoming = mov.type === 'receipt' || mov.type === 'return';
                  const isWriteoff = mov.type === 'writeoff';
                  
                  let typeColor = 'gray';
                  let typeLabel = mov.type;
                  let qtyPrefix = '';

                  if (mov.type === 'receipt') { typeColor = 'green'; typeLabel = 'Приход'; qtyPrefix = '+'; }
                  else if (mov.type === 'consume') { typeColor = 'orange'; typeLabel = 'Расход'; qtyPrefix = '−'; }
                  else if (mov.type === 'writeoff') { typeColor = 'red'; typeLabel = 'Списание'; qtyPrefix = '−'; }
                  else if (mov.type === 'return') { typeColor = 'blue'; typeLabel = 'Возврат'; qtyPrefix = '+'; }
                  else if (mov.type === 'correction') { typeColor = 'violet'; typeLabel = 'Корректировка'; qtyPrefix = ''; }

                  return (
                    <Table.Tr key={mov.movement_id}>
                      <Table.Td>
                        <Text size="sm">{formatDate(mov.date)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge size="sm" color={typeColor} variant="light">
                          {typeLabel}
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text size="sm" fw={600} c={typeColor}>
                          {qtyPrefix}{formatNumber(mov.qty, 2)} {mov.unit}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" ff="monospace" c="dimmed">
                          {mov.batch_id || '—'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {mov.doc_no || '—'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed" lineClamp={1}>
                          {mov.comment || '—'}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Box>
        )}
      </Paper>
    </Stack>
  );
}

function InfoRow({ label, value, highlight = false }) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <Text size="sm" c="dimmed">
        {label}:
      </Text>
      <Text size="sm" fw={highlight ? 700 : 500} c={highlight ? 'blue' : undefined}>
        {value || '—'}
      </Text>
    </Group>
  );
}