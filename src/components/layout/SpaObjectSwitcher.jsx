import { Group, Text, SegmentedControl, Menu, Button } from '@mantine/core';
import { IconChevronDown, IconBuilding } from '@tabler/icons-react';
import { useSpaObject } from '@/hooks/useSpaObject';

const OBJECTS = [
  { value: 'MS-01', label: 'MS-01', fullName: 'Mountain Spa (Красная Поляна)' },
  { value: 'MS-02', label: 'MS-02', fullName: 'Sea Spa (Сочи)' },
];

export default function SpaObjectSwitcher() {
  const { spaObject, changeSpaObject } = useSpaObject();

  const handleChange = (value) => {
    changeSpaObject(value);
  };

  const currentObject = OBJECTS.find((o) => o.value === spaObject);

  return (
    <>
      <SegmentedControl
        visibleFrom="sm"
        data={OBJECTS.map((o) => ({ value: o.value, label: o.value }))}
        value={spaObject}
        onChange={handleChange}
        size="sm"
        styles={{ 
          root: { backgroundColor: 'var(--mantine-color-gray-1)' },
          label: { fontWeight: 600 }
        }}
      />

      <Menu shadow="md" width={240} hiddenFrom="sm" position="bottom-end">
        <Menu.Target>
          <Button 
            variant="subtle" 
            size="xs" 
            rightSection={<IconChevronDown size={14} />}
            styles={{ 
              root: { 
                padding: '4px 8px',
                height: 'auto',
                minHeight: '28px'
              } 
            }}
          >
            <Text size="xs" fw={700} c="blue">
              {currentObject?.label}
            </Text>
          </Button>
        </Menu.Target>
        
        <Menu.Dropdown>
          <Menu.Label>Выберите спа-объект</Menu.Label>
          {OBJECTS.map((obj) => (
            <Menu.Item
              key={obj.value}
              leftSection={<IconBuilding size={16} />}
              onClick={() => handleChange(obj.value)}
              bg={spaObject === obj.value ? 'var(--mantine-color-blue-0)' : undefined}
              c={spaObject === obj.value ? 'var(--mantine-color-blue-9)' : undefined}
              fw={spaObject === obj.value ? 600 : 400}
              description={obj.fullName}
            >
              {obj.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </>
  );
}