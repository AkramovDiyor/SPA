import { Stack, Text, ThemeIcon } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';

export default function EmptyState({ title = 'Нет данных', description }) {
  return (
    <Stack align="center" gap="xs" py="xl">
      <ThemeIcon size={48} radius="xl" variant="light" color="gray">
        <IconInbox size={28} />
      </ThemeIcon>
      <Text fw={600}>{title}</Text>
      {description && (
        <Text size="sm" c="dimmed" ta="center">
          {description}
        </Text>
      )}
    </Stack>
  );
}