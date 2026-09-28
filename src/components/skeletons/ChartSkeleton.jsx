import { Skeleton } from '@mantine/core';

export default function ChartSkeleton({ height = 260 }) {
  return <Skeleton height={height} radius="md" />;
}