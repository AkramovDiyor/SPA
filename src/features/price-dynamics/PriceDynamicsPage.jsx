import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Stack, Tabs, Text, Paper } from '@mantine/core';
import { IconTrendingUp, IconCalculator } from '@tabler/icons-react';
import { useSpaObject } from '@/hooks/useSpaObject';

import PageHeader from '@/components/ui/PageHeader';
import PriceDynamicsChart from './PriceDynamicsChart';
import ServiceCostSimulator from './ServiceCostSimulator';

export default function PriceDynamicsPage() {
  const { spaObject } = useSpaObject();
  const [activeTab, setActiveTab] = useState('dynamics');

  return (
    <Stack gap="lg">
      <PageHeader
        title="Цены и экономика"
        subtitle={`Объект: ${spaObject} · Анализ закупочных цен и маржинальности услуг`}
      />

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="dynamics" leftSection={<IconTrendingUp size={16} />}>
            Динамика цен
          </Tabs.Tab>
          <Tabs.Tab value="simulator" leftSection={<IconCalculator size={16} />}>
            Симулятор "Что если"
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="dynamics" pt="md">
          <PriceDynamicsChart />
        </Tabs.Panel>

        <Tabs.Panel value="simulator" pt="md">
          <ServiceCostSimulator />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}