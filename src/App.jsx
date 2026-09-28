import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader, Center } from '@mantine/core';

import AppShell from '@/components/layout/AppShell';
import { routes } from '@/routes/routes';

const GlobalLoader = () => (
  <Center h="100vh">
    <Loader size="lg" />
  </Center>
);

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<GlobalLoader />}>
        <Routes>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}