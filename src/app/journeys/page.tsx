import type { Metadata } from 'next';
import PageStyle from '@/components/PageStyle';
import Journeys from '@/views/Journeys';
import { CATS, FEELINGS } from '@/content';
import type { Feeling, JourneyCategory } from '@/content';

export const metadata: Metadata = { title: 'Journeys — Bhutan Mind Vacation' };

function parseJourneyFilters(q: { cat?: string; feel?: string }) {
  return {
    initialCat: CATS.includes(q.cat as JourneyCategory) ? (q.cat as JourneyCategory) : null,
    initialFeel: FEELINGS.includes(q.feel as Feeling) ? (q.feel as Feeling) : null
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ cat?: string; feel?: string }> }) {
  const q = await searchParams;
  return (
    <>
      <PageStyle bg="#0f0e0b" />
      <Journeys key={`${q.cat ?? ''}-${q.feel ?? ''}`} {...parseJourneyFilters(q)} />
    </>
  );
}
