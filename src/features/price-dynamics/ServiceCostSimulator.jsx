import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    Stack,
    Paper,
    Group,
    Select,
    NumberInput,
    Button,
    Grid,
    Text,
    ThemeIcon,
    Alert,
    Table,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCalculator, IconAlertTriangle, IconPackage } from '@tabler/icons-react';

import { queryKeys } from '@/lib/queryKeys';
import { fetchServices, simulateServiceCost } from '@/api/price-dynamics';
import { formatMoney, formatPercent, formatNumber } from '@/lib/formatters';
import ExplanationBlock from '@/components/ui/ExplanationBlock';
import EmptyState from '@/components/ui/EmptyState';

export default function ServiceCostSimulator() {
    const form = useForm({
        initialValues: {
            service_id: '',
            price_change_pct: 10,
        },
        validate: {
            service_id: (value) => (!value ? 'Выберите услугу' : null),
        },
    });

    const { data: servicesData } = useQuery({
        queryKey: queryKeys.services(),
        queryFn: fetchServices,
    });

    const services = Array.isArray(servicesData) ? servicesData : servicesData?.items || [];
    const serviceOptions = services.map(s => ({
        value: s.service_id || s.id,
        label: s.name,
    }));

    const mutation = useMutation({
        mutationFn: simulateServiceCost,
    });

    const handleSubmit = (values) => {
        const payload = {
            service_id: values.service_id,
            price_changes: [
                {
                    sku: "OIL-001",
                    percent: values.price_change_pct || 0,
                }
            ]
        };

        mutation.mutate(payload);
    };

    const result = mutation.data;
    const pct = form.values.price_change_pct || 0;

    return (
        <Stack gap="md">
            <Paper withBorder p="md" radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Group grow align="flex-end">
                        <Select
                            label="SPA-услуга"
                            placeholder="Выберите услугу..."
                            data={serviceOptions}
                            searchable
                            {...form.getInputProps('service_id')}
                            required
                        />
                        <NumberInput
                            label="Изменение закупочных цен (%)"
                            description="Применяется к ключевым материалам (для демо: OIL-001)"
                            placeholder="10"
                            min={-50}
                            max={100}
                            step={1}
                            {...form.getInputProps('price_change_pct')}
                            required
                        />
                        <Button
                            type="submit"
                            leftSection={<IconCalculator size={16} />}
                            loading={mutation.isPending}
                            size="md"
                            mt="lg"
                        >
                            Рассчитать сценарий
                        </Button>
                    </Group>
                </form>
            </Paper>

            {mutation.isError && (
                <Alert icon={<IconAlertTriangle size={16} />} color="red" variant="light">
                    <Text size="sm" fw={600}>Ошибка расчёта:</Text>
                    <Text size="xs" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {JSON.stringify(mutation.error?.details || mutation.error?.message, null, 2)}
                    </Text>
                </Alert>
            )}

            {result && !mutation.isPending && (
                <Stack gap="lg">
                    {result.warnings && result.warnings.length > 0 && (
                        <Stack gap="xs">
                            {result.warnings.map((w, idx) => (
                                <Alert
                                    key={idx}
                                    icon={<IconAlertTriangle size={16} />}
                                    color={w.level === 'error' ? 'red' : 'orange'}
                                    variant="light"
                                >
                                    <Text size="sm">{w.message}</Text>
                                </Alert>
                            ))}
                        </Stack>
                    )}

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <ComparisonCard
                                title="Текущие показатели (База)"
                                cost={result.base_total_cost}
                                margin={result.base_margin_pct}
                                marginRub={result.base_margin_rub}
                                color="blue"
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <ComparisonCard
                                title={`Сценарий: цена ${pct > 0 ? '+' : ''}${pct}%`}
                                cost={result.current_total_cost}
                                margin={result.current_margin_pct}
                                marginRub={result.current_margin_rub}
                                color={result.current_margin_pct < result.base_margin_pct ? 'red' : 'green'}
                                isSimulated
                            />
                        </Grid.Col>
                    </Grid>

                    {result.materials && result.materials.length > 0 && (
                        <Paper withBorder p="md" radius="md">
                            <Group gap="xs" mb="md">
                                <ThemeIcon variant="light" color="violet" size="md">
                                    <IconPackage size={18} />
                                </ThemeIcon>
                                <Text fw={600}>Детализация себестоимости материалов</Text>
                            </Group>
                            <Table striped highlightOnHover>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Материал</Table.Th>
                                        <Table.Th ta="right">Норматив</Table.Th>
                                        <Table.Th ta="right">Цена (база)</Table.Th>
                                        <Table.Th ta="right">Цена (сценарий)</Table.Th>
                                        <Table.Th ta="right">Изменение стоимости</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {result.materials.map((mat) => {
                                        const hasChange = Math.abs(mat.delta_rub) > 0.01;
                                        return (
                                            <Table.Tr 
                                                key={mat.sku}
                                                style={hasChange ? { backgroundColor: 'var(--mantine-color-red-0)' } : undefined}
                                            >
                                                <Table.Td>
                                                    <Text size="sm" fw={500}>{mat.name}</Text>
                                                    <Text size="xs" c="dimmed">{mat.sku}</Text>
                                                </Table.Td>
                                                <Table.Td ta="right">
                                                    <Text size="sm">{formatNumber(mat.qty, 3)} {mat.unit}</Text>
                                                </Table.Td>
                                                <Table.Td ta="right">
                                                    <Text size="sm">{formatMoney(mat.base_price)}</Text>
                                                </Table.Td>
                                                <Table.Td ta="right">
                                                    <Text 
                                                        size="sm" 
                                                        fw={hasChange ? 700 : undefined} 
                                                        c={hasChange ? (mat.delta_rub > 0 ? 'red' : 'green') : undefined}
                                                    >
                                                        {formatMoney(mat.current_price)}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td ta="right">
                                                    {hasChange ? (
                                                        <Text 
                                                            size="sm" 
                                                            fw={700} 
                                                            c={mat.delta_rub > 0 ? 'red' : 'green'}
                                                        >
                                                            {mat.delta_rub > 0 ? '+' : ''}{formatMoney(mat.delta_rub)}
                                                        </Text>
                                                    ) : (
                                                        <Text size="sm" c="dimmed">—</Text>
                                                    )}
                                                </Table.Td>
                                            </Table.Tr>
                                        );
                                    })}
                                </Table.Tbody>
                            </Table>
                            <Group justify="space-between" mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
                                <Text size="sm" c="dimmed">Работа специалиста + Накладные расходы:</Text>
                                <Text size="sm" fw={600}>{formatMoney(result.labor_cost + result.overhead_cost)}</Text>
                            </Group>
                        </Paper>
                    )}

                    {result.explanation && <ExplanationBlock explanation={result.explanation} />}
                </Stack>
            )}

            {!result && !mutation.isPending && (
                <Paper p="xl" ta="center" bg="gray.0" radius="md">
                    <EmptyState
                        title="Симулятор готов к работе"
                        description="Выберите услугу и процент изменения цен, чтобы увидеть влияние на маржинальность"
                    />
                </Paper>
            )}
        </Stack>
    );
}

function ComparisonCard({ title, cost, margin, marginRub, color, isSimulated }) {
    return (
        <Paper withBorder p="md" radius="md" bg={isSimulated ? `${color}.0` : undefined}>
            <Text size="sm" fw={600} c="dimmed" mb="md">{title}</Text>
            <Stack gap="md">
                <div>
                    <Text size="xs" c="dimmed">Полная себестоимость</Text>
                    <Text size="xl" fw={700} c={color}>{formatMoney(cost)}</Text>
                </div>
                <div>
                    <Text size="xs" c="dimmed">Маржинальность</Text>
                    <Text size="xl" fw={700} c={color}>{formatPercent(margin)}</Text>
                    <Text size="xs" c="dimmed">({formatMoney(marginRub)} на услугу)</Text>
                </div>
            </Stack>
        </Paper>
    );
}