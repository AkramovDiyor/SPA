import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import {
  Stack,
  NavLink,
  Text,
  Box,
  ThemeIcon,
} from '@mantine/core';
import {
  IconDashboard,
  IconPackage,
  IconAlertTriangle,
  IconCalculator,
  IconShoppingCart,
  IconTrendingUp,
  IconCurrencyDollar,
  IconMessageCircle,
} from '@tabler/icons-react';
import { routes } from '@/routes/routes';

const iconMap = {
  Dashboard: IconDashboard,
  Package: IconPackage,
  AlertTriangle: IconAlertTriangle,
  Calculator: IconCalculator,
  ShoppingCart: IconShoppingCart,
  TrendingUp: IconTrendingUp,
  CurrencyDollar: IconCurrencyDollar,
  MessageCircle: IconMessageCircle,
};

export default function Sidebar({ onCloseMobile }) {
  const location = useLocation();
  const visibleRoutes = routes.filter((r) => !r.hidden);

  return (
    <Stack gap={4} mt="xs">
      <Box px="xs" py="xs">
        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
          Навигация
        </Text>
      </Box>
      {visibleRoutes.map((r) => {
        const Icon = iconMap[r.icon];
        const active =
          location.pathname === r.path ||
          (r.path !== '/' && location.pathname.startsWith(r.path));
        return (
          <NavLink
            key={r.path}
            component={RouterLink}
            to={r.path}
            label={r.label}
            active={active}
            onClick={onCloseMobile}
            leftSection={
              Icon ? (
                <ThemeIcon variant="subtle" size="md">
                  <Icon size={18} />
                </ThemeIcon>
              ) : null
            }
          />
        );
      })}
    </Stack>
  );
}