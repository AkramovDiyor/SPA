import { Title, Text, Group, Stack } from '@mantine/core';

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <Group justify="space-between" align="flex-start" mb="lg" wrap="nowrap">
      <Stack gap={2}>
        <Title order={2}>{title}</Title>
        {subtitle && (
          <Text size="sm" c="dimmed">
            {subtitle}
          </Text>
        )}
      </Stack>
      {actions && <Group gap="xs">{actions}</Group>}
    </Group>
  );
}