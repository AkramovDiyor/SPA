import { Stack, Text, Button, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function ErrorState({ title, message, onRetry }) {
  return (
    <Stack align="center" gap="sm" py="xl">
      <ThemeIcon size={48} radius="xl" color="red" variant="light">
        <IconAlertTriangle size={28} />
      </ThemeIcon>
      <Text fw={600}>{title || 'Ошибка загрузки'}</Text>
      <Text size="sm" c="dimmed" ta="center" maw={480}>
        {message || 'Не удалось получить данные. Попробуйте ещё раз.'}
      </Text>
      {onRetry && (
        <Button variant="light" onClick={onRetry}>
          Повторить
        </Button>
      )}
    </Stack>
  );
}