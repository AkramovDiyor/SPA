import { notifications } from '@mantine/notifications';

export function useErrorHandler() {
  const handle = (error, options = {}) => {
    if (error?.silent) return; 

    const title = options.title || 'Ошибка';
    const message =
      error?.message || 'Что-то пошло не так. Попробуйте ещё раз.';

    notifications.show({
      color: options.color || 'red',
      title,
      message,
      autoClose: options.autoClose ?? 5000,
    });

    if (import.meta.env.DEV) {
      console.error('[api error]', error);
    }
  };

  return { handleError: handle };
}