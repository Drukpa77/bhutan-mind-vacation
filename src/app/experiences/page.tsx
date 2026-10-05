import type { Metadata } from 'next';
import PageStyle from '@/components/PageStyle';
import Journeys from '@/views/Journeys';

export const metadata: Metadata = { title: 'Experiences — Bhutan Mind Vacation' };

/** The Journeys page, opened at its experiences strip. */
export default function Page() {
  return (
    <>
      <PageStyle bg="#0f0e0b" />
      <Journeys scrollToExperiences />
    </>
  );
}
