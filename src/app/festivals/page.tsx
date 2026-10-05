import type { Metadata } from 'next';
import PageStyle from '@/components/PageStyle';
import Festivals from '@/views/Festivals';

export const metadata: Metadata = { title: 'Festivals — The Year in Masks · Bhutan Mind Vacation' };

export default function Page() {
  return (
    <>
      <PageStyle bg="#0f0e0b" />
      <Festivals />
    </>
  );
}
