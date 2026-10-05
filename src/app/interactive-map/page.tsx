import type { Metadata } from 'next';
import PageStyle from '@/components/PageStyle';
import MapPage from '@/views/MapPage';
import { isMapMode } from '@/content';

export const metadata: Metadata = { title: 'Interactive Map — Bhutan Mind Vacation' };

export default async function Page({ searchParams }: { searchParams: Promise<{ mode?: string; d?: string }> }) {
  const q = await searchParams;
  return (
    <>
      <PageStyle bg="#0f0e0b" lockScroll />
      <MapPage key={`${q.mode ?? ''}-${q.d ?? ''}`} initialMode={isMapMode(q.mode) ? q.mode : 'destinations'} initialSel={q.d ?? null} />
    </>
  );
}
