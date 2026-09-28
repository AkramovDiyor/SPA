// Конфиг маршрутов. Lazy-load экранов — чтобы бандл не раздувался.
import { lazy } from 'react';

const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const InventoryPage = lazy(() => import('@/features/inventory/InventoryPage'));
const ItemCardPage = lazy(() => import('@/features/inventory/ItemCard'));
const AlertsPage = lazy(() => import('@/features/alerts/AlertsPage'));
const ForecastPage = lazy(() => import('@/features/forecast/ForecastPage'));
const ReorderPage = lazy(() => import('@/features/reorder/ReorderPage'));
const PurchasePlanPage = lazy(() =>
  import('@/features/purchase-plan/PurchasePlanPage'),
);
const PriceDynamicsPage = lazy(() =>
  import('@/features/price-dynamics/PriceDynamicsPage'),
);
const ChatPage = lazy(() => import('@/features/chat/ChatPage'));

export const routes = [
  { path: '/', label: 'Дашборд', icon: 'Dashboard', element: <DashboardPage /> },
  { path: '/inventory', label: 'Остатки', icon: 'Package', element: <InventoryPage /> },
  { path: '/inventory/:id', label: 'Карточка позиции', icon: 'Package', element: <ItemCardPage />, hidden: true },
  { path: '/alerts', label: 'Предупреждения', icon: 'AlertTriangle', element: <AlertsPage /> },
  { path: '/forecast', label: 'Расчёт закупки', icon: 'Calculator', element: <ForecastPage /> },
  { path: '/reorder', label: 'Что заказать', icon: 'ShoppingCart', element: <ReorderPage /> },
  { path: '/purchase-plan', label: 'План и бюджет', icon: 'TrendingUp', element: <PurchasePlanPage /> },
  { path: '/prices', label: 'Цены и экономика', icon: 'CurrencyDollar', element: <PriceDynamicsPage /> },
  { path: '/chat', label: 'Чат с ИИ', icon: 'MessageCircle', element: <ChatPage /> },
];