import { Paper, Text, Stack, Group, Code, List, ThemeIcon, Divider } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { formatDate } from '@/lib/formatters';

export default function ExplanationBlock({ explanation }) {
  if (!explanation || typeof explanation !== 'object' || Array.isArray(explanation)) {
    return null;
  }

  const { data_used, period, formulas, assumptions, as_of } = explanation;

  return (
    <Paper 
      withBorder 
      p={{ base: 'sm', sm: 'md' }}
      radius="md" 
      bg="blue.0" 
      mt="xl"
    >
      <Group gap="xs" mb={{ base: 'sm', sm: 'md' }}>
        <ThemeIcon variant="light" color="blue" size={{ base: 'sm', sm: 'md' }}>
          <IconInfoCircle size={20} />
        </ThemeIcon>
        <Text 
          size={{ base: 'sm', sm: 'md' }} 
          fw={700} 
          c="blue.9"
          lineClamp={2}
        >
          Обоснование расчёта
        </Text>
      </Group>

      <Stack gap="lg">
        {period && <InfoRow label="Период расчёта" value={period} />}
        {as_of && <InfoRow label="Актуально на" value={formatDate(as_of)} />}
        
        {data_used && data_used.length > 0 && (
          <InfoList label="Использованные данные" items={data_used} />
        )}
        
        {formulas && formulas.length > 0 && (
          <InfoList 
            label="Формулы" 
            items={formulas} 
            render={(item) => (
              <Code block style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {item}
              </Code>
            )} 
          />
        )}
        
        {assumptions && assumptions.length > 0 && (
          <InfoList 
            label="Допущения" 
            items={assumptions} 
            color="orange"
          />
        )}
      </Stack>
    </Paper>
  );
}

function InfoRow({ label, value }) {
  return (
    <Stack gap={2}>
      <Text size="xs" fw={700} c="blue.8" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
        {label}
      </Text>
      <Text size="sm" fw={500} c="gray.9" style={{ wordBreak: 'break-word', lineHeight: 1.4 }}>
        {value}
      </Text>
    </Stack>
  );
}

function InfoList({ label, items, render, color = 'blue' }) {
  return (
    <Stack gap={6}>
      <Text size="xs" fw={700} c="blue.8" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
        {label}
      </Text>
      <List 
        size="sm" 
        spacing="xs" 
        icon={
          <ThemeIcon color={color} size={16} radius="xl" variant="light">
            <IconInfoCircle size={12} />
          </ThemeIcon>
        }
      >
        {items.map((item, idx) => (
          <List.Item 
            key={idx} 
            styles={{ 
              itemWrapper: { wordBreak: 'break-word', lineHeight: 1.4 } 
            }}
          >
            {render ? render(item) : <Text size="sm" c="gray.9">{item}</Text>}
          </List.Item>
        ))}
      </List>
    </Stack>
  );
}