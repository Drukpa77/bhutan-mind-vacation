import type { Metadata } from 'next';
import PageStyle from '@/components/PageStyle';
import Build from '@/views/Build';
import { byId, journeys } from '@/content';

export const metadata: Metadata = { title: 'Build Your Journey — Bhutan Mind Vacation' };

export default async function Page({ searchParams }: { searchParams: Promise<{ from?: string; d?: string }> }) {
  const { from, d } = await searchParams;
  const j = journeys.find(x => x.id === from);
  return (
    <>
      <PageStyle bg="#0f0e0b" />
      <Build key={`${from ?? ''}-${d ?? ''}`} initialDays={j?.days ?? 10} extra={d && byId[d] ? d : null} />
    </>
  );
}
