# SPA Inventory & Procurement Assistant (MVP)

Веб-приложение для управляющего спа-объектом: анализ остатков, прогнозирование закупок, расчёт бюджета и ИИ-помощник.

## Технологический стек
React 18, Vite, JavaScript, Mantine UI, Tailwind CSS, TanStack React Query, Recharts, Axios.

## Запуск приложения

Убедитесь, что у вас установлен Docker и запущен Mock API (http://localhost:8000).

1. Скопируйте файл окружения:
   ```bash
   cp .env.example .env
   ```

2. Соберите и запустите контейнер:
   ```bash
    docker compose up --build -d
   ```

3. Откройте приложение в браузере:
http://localhost


### Структура проекта

Проект использует упрощённый Feature-Sliced Design:

src/api/ — слой взаимодействия с API (axios + interceptors).

src/features/ — бизнес-логика и страницы (dashboard, inventory, chat и т.д.).

src/components/ — переиспользуемые UI-компоненты и layout.

src/hooks/ — кастомные хуки (useSpaObject, useErrorHandler).

src/lib/ — утилиты, константы, ключи React Query.