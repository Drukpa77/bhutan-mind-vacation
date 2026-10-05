import type { Metadata } from 'next';
import PageStyle from '@/components/PageStyle';
import Stories from '@/views/Stories';

export const metadata: Metadata = { title: 'Stories from the Kingdom — Bhutan Mind Vacation' };

export default function Page() {
  return (
    <>
      <PageStyle bg="#f5f1e8" hover="#8f2b1f" />
      <Stories />
    </>
  );
}
