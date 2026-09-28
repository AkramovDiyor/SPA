import { AppShell as MantineAppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Sidebar from './Sidebar';
import SpaObjectSwitcher from './SpaObjectSwitcher';

export default function AppShell({ children }) {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'md',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
          </Group>
          
          <SpaObjectSwitcher />
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar p="xs">
        <Sidebar onCloseMobile={close} />
      </MantineAppShell.Navbar>

      <MantineAppShell.Main className="pb-4">
        <div className="w-full max-w-[1600px] mx-auto px-2 md:px-4">
          {children}
        </div>
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}