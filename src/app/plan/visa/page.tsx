import type { Metadata } from 'next';
import PageStyle from '@/components/PageStyle';
import Visa from '@/views/Visa';

export const metadata: Metadata = { title: 'Bhutan Visa & SDF — Bhutan Mind Vacation' };

export default function Page() {
  return (
    <>
      <PageStyle bg="#f5f1e8" hover="#8f2b1f" />
      <Visa />
    </>
  );
}
