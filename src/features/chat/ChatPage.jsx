import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Stack,
  Paper,
  TextInput,
  ActionIcon,
  Group,
  Text,
  ScrollArea,
  Loader,
  Box,
  Button,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSend, IconSparkles } from '@tabler/icons-react';
import { useSpaObject } from '@/hooks/useSpaObject';

import { sendChatMessage, getChatExamples } from '@/api/chat';
import MessageBubble from './MessageBubble';

export default function ChatPage() {
  const { spaObject } = useSpaObject();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);
  const isSm = useMediaQuery('(min-width: 36em)'); 

  const { data: examplesData } = useQuery({
    queryKey: ['chat-examples'],
    queryFn: getChatExamples,
  });

  const examples = Array.isArray(examplesData)
    ? examplesData
    : examplesData?.examples || examplesData?.questions || [];

  const mutation = useMutation({
    mutationFn: sendChatMessage,
    onMutate: (variables) => {
      setMessages((prev) => [...prev, { role: 'user', content: variables }]);
      setInputValue('');
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer || 'Ответ получен',
          table: data.table,
          explanation: data.explanation,
          warnings: data.warnings,
          followUps: data.follow_up,
        },
      ]);
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Извините, произошла ошибка: ${
            error?.message || 'Не удалось получить ответ'
          }`,
        },
      ]);
    },
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, mutation.isPending]);

  const handleSend = (text) => {
    const messageText = typeof text === 'string' ? text : inputValue;
    if (!messageText.trim() || mutation.isPending) return;
    mutation.mutate(messageText);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box maw={1100} mx="auto" w="100%" h="100dvh" p={{ base: 'xs', sm: 'md' }}>
      <Stack gap={{ base: 'xs', sm: 'md' }} h="100%">
        <Group justify="space-between" wrap="nowrap" px={{ base: 4, sm: 8 }}>
          <Text size={isSm ? 'lg' : 'md'} fw={700}>
            Чат с ИИ
          </Text>
          <Text
            size="xs"
            c="dimmed"
            bg="gray.1"
            px="xs"
            py={2}
            radius="sm"
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {spaObject}
          </Text>
        </Group>

        <Paper
          withBorder
          radius="md"
          p="xs"
          style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
          <ScrollArea style={{ flex: 1 }} offsetScrollbars>
            <Stack gap={{ base: 'sm', sm: 'md' }} p={{ base: 'xs', sm: 'sm' }}>
              {messages.length === 0 && (
                <Box ta="center" py={{ base: 'lg', sm: 'xl' }} px="sm">
                  <IconSparkles
                    size={isSm ? 48 : 40}
                    color="var(--mantine-color-blue-6)"
                    style={{ marginBottom: 12 }}
                  />
                  <Text fw={600} size={isSm ? 'md' : 'sm'} mb="xs">
                    Чем могу помочь по складу и закупкам?
                  </Text>
                  <Text size="sm" c="dimmed" mb="md" maw={480} mx="auto">
                    Попробуйте спросить: «Сколько массажного масла нужно закупить на 3 месяца?»
                  </Text>
                  {examples.length > 0 && (
                    <Group gap="xs" justify="center" wrap="wrap">
                      {examples.slice(0, 4).map((ex, idx) => {
                        const questionText =
                          typeof ex === 'string'
                            ? ex
                            : ex.message || ex.question || JSON.stringify(ex);
                        return (
                          <Button
                            key={idx}
                            variant="light"
                            color="gray"
                            size="xs"
                            radius="xl"
                            onClick={() => handleSend(questionText)}
                            style={{ maxWidth: '100%', height: 'auto', whiteSpace: 'normal', paddingBlock: 6 }}
                          >
                            <Text size="xs" lineClamp={2} ta="left">
                              {questionText}
                            </Text>
                          </Button>
                        );
                      })}
                    </Group>
                  )}
                </Box>
              )}

              {messages.map((msg, idx) => (
                <MessageBubble
                  key={idx}
                  role={msg.role}
                  content={msg.content}
                  table={msg.table}
                  explanation={msg.explanation}
                  warnings={msg.warnings}
                  followUps={msg.followUps}
                  onFollowUpClick={handleSend}
                />
              ))}

              {mutation.isPending && (
                <Group gap={{ base: 'xs', sm: 'md' }} align="flex-start" wrap="nowrap">
                  <Box
                    bg="blue.1"
                    c="blue.7"
                    p={isSm ? 6 : 4}
                    style={{ borderRadius: '50%', flexShrink: 0 }}
                  >
                    <IconSparkles size={isSm ? 20 : 18} />
                  </Box>
                  <Paper withBorder p={{ base: 'sm', sm: 'md' }} radius="md" bg="white">
                    <Group gap="xs" wrap="nowrap">
                      <Loader size="xs" color="blue" />
                      <Text size="sm" c="dimmed">
                        Анализирую данные и считаю...
                      </Text>
                    </Group>
                  </Paper>
                </Group>
              )}

              <div ref={messagesEndRef} />
            </Stack>
          </ScrollArea>
        </Paper>

        <Paper withBorder p={{ base: 'xs', sm: 'sm' }} radius="md">
          <Group gap="xs" wrap="nowrap">
            <TextInput
              placeholder={
                isSm
                  ? 'Задайте вопрос о запасах, ценах или закупках...'
                  : 'Ваш вопрос...'
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              disabled={mutation.isPending}
              style={{ flex: 1 }}
              size={isSm ? 'md' : 'sm'}
            />
            <ActionIcon
              color="blue"
              size={isSm ? 'lg' : 'md'}
              radius="md"
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || mutation.isPending}
              loading={mutation.isPending}
              aria-label="Отправить"
            >
              <IconSend size={isSm ? 20 : 18} />
            </ActionIcon>
          </Group>
        </Paper>
      </Stack>
    </Box>
  );
}