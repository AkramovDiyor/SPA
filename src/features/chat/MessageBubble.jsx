import { Paper, Text, Group, Stack, Button, Table, Box, ScrollArea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconUser, IconSparkles } from '@tabler/icons-react';

const COLORS = { userBg: 'blue.6', userFg: 'white', botBg: 'white', botFg: 'black' };

export default function MessageBubble({
  role,
  content,
  table,
  explanation,
  warnings,
  followUps,
  onFollowUpClick,
}) {
  const isUser = role === 'user';
  const isSm = useMediaQuery('(min-width: 36em)'); 

  const avatarSize = isSm ? 32 : 28;
  const bubbleMaxWidth = isSm ? '78%' : '92%';

  return (
    <Group
      align="flex-start"
      gap={{ base: 'xs', sm: 'md' }}
      justify={isUser ? 'flex-end' : 'flex-start'}
      wrap="nowrap"
    >
      {!isUser && (
        <Box
          bg="blue.1"
          c="blue.7"
          p={avatarSize === 32 ? 6 : 4}
          style={{ borderRadius: '50%', flexShrink: 0 }}
        >
          <IconSparkles size={avatarSize === 32 ? 20 : 18} />
        </Box>
      )}

      <Stack
        gap="xs"
        style={{ maxWidth: bubbleMaxWidth, minWidth: 0, flex: '0 1 auto' }}
      >
        <Paper
          withBorder
          p={{ base: 'sm', sm: 'md' }}
          radius="md"
          bg={isUser ? COLORS.userBg : COLORS.botBg}
          c={isUser ? COLORS.userFg : COLORS.botFg}
        >
          <Text
            size="sm"
            style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, wordBreak: 'break-word' }}
          >
            {content}
          </Text>
        </Paper>

        {table && !isUser && (
          <Paper withBorder p={{ base: 'xs', sm: 'md' }} radius="md" bg="white">
            {table.title && (
              <Text size="sm" fw={600} mb="xs">
                {table.title}
              </Text>
            )}
            <ScrollArea type="auto" offsetScrollbars>
              <Table
                striped
                highlightOnHover
                fz="sm"
                horizontalSpacing={{ base: 'xs', sm: 'sm' }}
                verticalSpacing="xs"
                style={{ minWidth: isSm ? undefined : 360 }}
              >
                <Table.Thead>
                  <Table.Tr>
                    {table.columns?.map((col, i) => (
                      <Table.Th key={i} style={{ whiteSpace: 'nowrap' }}>
                        {col}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {table.rows?.map((row, rowIndex) => (
                    <Table.Tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <Table.Td key={cellIndex} style={{ maxWidth: 220 }}>
                          {cell}
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Paper>
        )}

        {warnings && warnings.length > 0 && !isUser && (
          <Stack gap="xs">
            {warnings.map((w, idx) => (
              <Paper
                key={idx}
                withBorder
                p="xs"
                radius="sm"
                bg="orange.0"
                style={{ borderColor: 'var(--mantine-color-orange-3)' }}
              >
                <Text size="xs" c="orange.9" fw={500}>
                  ⚠️ {w.message || w}
                </Text>
              </Paper>
            ))}
          </Stack>
        )}

        {!isUser && followUps && followUps.length > 0 && (
          <Group gap="xs" wrap="wrap" mt={4}>
            {followUps.map((q, idx) => (
              <Button
                key={idx}
                variant="light"
                color="blue"
                size={isSm ? 'compact-sm' : 'xs'}
                radius="xl"
                onClick={() => onFollowUpClick(q)}
                style={isSm ? undefined : { fontSize: 12 }}
              >
                {q}
              </Button>
            ))}
          </Group>
        )}
      </Stack>

      {isUser && (
        <Box
          bg="gray.2"
          c="gray.7"
          p={avatarSize === 32 ? 6 : 4}
          style={{ borderRadius: '50%', flexShrink: 0 }}
        >
          <IconUser size={avatarSize === 32 ? 20 : 18} />
        </Box>
      )}
    </Group>
  );
}