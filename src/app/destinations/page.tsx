import type { Metadata } from 'next';
import PageStyle from '@/components/PageStyle';
import Destinations from '@/views/Destinations';

export const metadata: Metadata = { title: 'Destinations — An Atlas of Bhutan' };

export default async function Page({ searchParams }: { searchParams: Promise<{ d?: string }> }) {
  const { d } = await searchParams;
  return (
    <>
      <PageStyle bg="#0f0e0b" />
      <Destinations key={d ?? ''} initial={d} />
    </>
  );
}
