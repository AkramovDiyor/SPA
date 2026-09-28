import {
  Stack,
  Paper,
  Group,
  Text,
  Grid,
  ThemeIcon,
  Alert,
  Table,
  Progress,
  Box,
  ScrollArea,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconAlertTriangle,
  IconTrendingUp,
  IconInfoCircle,
  IconChartPie,
  IconCategory,
  IconListNumbers,
  IconStack2,
  IconWallet,
} from '@tabler/icons-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatMoney, formatNumber } from '@/lib/formatters';
import ExplanationBlock from '@/components/ui/ExplanationBlock';

const COLORS = ['#228be6', '#40c057', '#fab005', '#fa5252', '#9775fa', '#20c997', '#fd7e14'];

export default function BudgetCharts({ data, mode }) {
  const isSm = useMediaQuery('(min-width: 36em)');   
  const isLg = useMediaQuery('(min-width: 62em)');  
  const isXl = useMediaQuery('(min-width: 88em)');  

  const chartHeight = isXl ? 380 : isLg ? 340 : isSm ? 280 : 220;

  if (!data) return null;

  const {
    total_cost = 0,
    total_positions = 0,
    budget_limit,
    over_limit_by = 0,
    by_month = [],
    by_category = [],
    explanation,
    warnings = [],
  } = data;

  const isOverBudget = typeof over_limit_by === 'number' && over_limit_by > 0;

  return (
    <Stack gap={{ base: 'md', sm: 'lg' }} maw={1400} mx="auto" w="100%">
      <Grid gutter={{ base: 'xs', sm: 'md' }}>
        <Grid.Col span={{ base: 12, xs: 12, sm: 4 }}>
          <MetricCard
            label="Итого стоимость"
            value={formatMoney(total_cost)}
            color="blue"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 12, sm: 4 }}>
          <MetricCard
            icon={<IconStack2 size={18} />}
            label="Позиций в плане"
            value={formatNumber(total_positions)}
            color="violet"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 12, sm: 4 }}>
          <MetricCard
            icon={<IconWallet size={18} />}
            label="Лимит бюджета"
            value={budget_limit ? formatMoney(budget_limit) : 'Не установлен'}
            color={isOverBudget ? 'red' : 'green'}
          />
        </Grid.Col>
      </Grid>

      {isOverBudget && (
        <Alert
          icon={<IconAlertTriangle size={16} />}
          color="red"
          variant="light"
          title="Превышение бюджета"
        >
          <Text size="sm">
            Расчётный бюджет превышает лимит на{' '}
            <Text span fw={700}>{formatMoney(over_limit_by)}</Text>. Рекомендуется
            скорректировать объёмы.
          </Text>
        </Alert>
      )}

      {warnings.length > 0 && (
        <Stack gap="xs">
          {warnings.map((w, idx) => (
            <Alert
              key={idx}
              icon={<IconInfoCircle size={16} />}
              color={w.level === 'error' ? 'red' : 'orange'}
              variant="light"
            >
              <Text size="sm">{w.message}</Text>
            </Alert>
          ))}
        </Stack>
      )}

      <Grid gutter={{ base: 'md', sm: 'lg' }} align="stretch">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Paper
            withBorder
            p={{ base: 'sm', sm: 'md' }}
            radius="md"
            h="100%"
          >
            <Group gap="xs" mb={{ base: 'xs', sm: 'md' }} wrap="nowrap">
              <ThemeIcon variant="light" color="blue" size={{ base: 'sm', sm: 'md' }}>
                <IconTrendingUp size={18} />
              </ThemeIcon>
              <Text fw={600} size={{ base: 'sm', sm: 'md' }}>
                Динамика затрат
              </Text>
            </Group>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart
                data={by_month}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}к`}
                  tick={{ fontSize: 11 }}
                  width={40}
                />
                <Tooltip formatter={(value) => formatMoney(value)} />
                <Bar
                  dataKey="cost"
                  fill="#228be6"
                  radius={[4, 4, 0, 0]}
                  name="Стоимость"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Paper
            withBorder
            p={{ base: 'sm', sm: 'md' }}
            radius="md"
            h="100%"
          >
            <Group gap="xs" mb={{ base: 'xs', sm: 'md' }} wrap="nowrap">
              <ThemeIcon variant="light" color="violet" size={{ base: 'sm', sm: 'md' }}>
                <IconChartPie size={18} />
              </ThemeIcon>
              <Text fw={600} size={{ base: 'sm', sm: 'md' }}>
                Структура
              </Text>
            </Group>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <PieChart>
                <Pie
                  data={by_category}
                  cx="50%"
                  cy="50%"
                  innerRadius={isSm ? 60 : 45}
                  outerRadius={isSm ? 90 : 70}
                  paddingAngle={2}
                  dataKey="cost"
                  nameKey="label"
                >
                  {by_category.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatMoney(value)} />
                <Legend
                  verticalAlign="bottom"
                  height={40}
                  iconSize={10}
                  wrapperStyle={{ fontSize: '11px', lineHeight: '16px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>
      </Grid>

      <Paper withBorder p={{ base: 'sm', sm: 'md' }} radius="md">
        <Group gap="xs" mb={{ base: 'xs', sm: 'md' }} wrap="nowrap">
          <ThemeIcon variant="light" color="orange" size={{ base: 'sm', sm: 'md' }}>
            <IconCategory size={18} />
          </ThemeIcon>
          <Text fw={600} size={{ base: 'sm', sm: 'md' }}>
            Декомпозиция по категориям
          </Text>
        </Group>
        {isSm ? (
          <CategoryTable
            by_category={by_category}
            total_cost={total_cost}
            minWidth={undefined}
          />
        ) : (
          <ScrollArea type="auto" offsetScrollbars>
            <Box pr="sm">
              <CategoryTable
                by_category={by_category}
                total_cost={total_cost}
                minWidth={520}
              />
            </Box>
          </ScrollArea>
        )}
      </Paper>

      {explanation && <ExplanationBlock explanation={explanation} />}
    </Stack>
  );
}

function CategoryTable({ by_category, total_cost, minWidth }) {
  return (
    <Table
      striped
      highlightOnHover
      fz="sm"
      horizontalSpacing="xs"
      verticalSpacing="xs"
      style={minWidth ? { minWidth } : undefined}
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Категория</Table.Th>
          <Table.Th ta="right" visibleFrom="xs">
            Объём
          </Table.Th>
          <Table.Th ta="right">Стоимость</Table.Th>
          <Table.Th w={{ base: 90, sm: 160, md: 220 }}>Доля</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {by_category.map((cat, idx) => {
          const share = total_cost > 0 ? (cat.cost / total_cost) * 100 : 0;
          return (
            <Table.Tr key={cat.key}>
              <Table.Td>
                <Group gap="xs" wrap="nowrap">
                  <Box
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: COLORS[idx % COLORS.length],
                      flexShrink: 0,
                    }}
                  />
                  <Text size="sm" fw={500} lineClamp={2}>
                    {cat.label}
                  </Text>
                </Group>
              </Table.Td>
              <Table.Td ta="right" visibleFrom="xs">
                <Text size="sm">{formatNumber(cat.qty)}</Text>
              </Table.Td>
              <Table.Td ta="right">
                <Text size="sm" fw={600}>
                  {formatMoney(cat.cost)}
                </Text>
              </Table.Td>
              <Table.Td>
                <Group gap="xs" wrap="nowrap">
                  <Progress
                    value={share}
                    size="xs"
                    color={COLORS[idx % COLORS.length]}
                    style={{ flex: 1, minWidth: 30 }}
                  />
                  <Text size="xs" fw={600} w={35} ta="right">
                    {share.toFixed(0)}%
                  </Text>
                </Group>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
}

function MetricCard({ icon, label, value, color }) {
  return (
    <Paper withBorder p={{ base: 'sm', sm: 'md' }} radius="md" h="100%">
      <Group gap="xs" mb="xs" wrap="nowrap">
        <ThemeIcon variant="light" color={color} size={{ base: 'sm', sm: 'md' }}>
          {icon}
        </ThemeIcon>
        <Text size="xs" fw={600} c="dimmed" lineClamp={1}>
          {label}
        </Text>
      </Group>
      <Text
        size={{ base: 'lg', sm: 'xl' }}
        fw={700}
        c={color}
        lineClamp={1}
      >
        {value}
      </Text>
    </Paper>
  );
}