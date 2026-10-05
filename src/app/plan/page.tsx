import type { Metadata } from 'next';
import PageStyle from '@/components/PageStyle';
import Plan from '@/views/Plan';

export const metadata: Metadata = { title: 'Plan Your Trip — Bhutan Mind Vacation' };

export default function Page() {
  return (
    <>
      <PageStyle bg="#f5f1e8" hover="#8f2b1f" />
      <Plan />
    </>
  );
}
