import { Skeleton, Stack } from '@mantine/core';

export default function TableSkeleton({ rows = 6 }) {
  return (
    <Stack gap="xs">
      <Skeleton height={36} />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={28} />
      ))}
    </Stack>
  );
}