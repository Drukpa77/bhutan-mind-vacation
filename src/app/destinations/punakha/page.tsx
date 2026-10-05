import type { Metadata } from 'next';
import PageStyle from '@/components/PageStyle';
import Punakha from '@/views/Punakha';

export const metadata: Metadata = { title: 'Punakha — Where Two Rivers Meet · Bhutan Mind Vacation' };

export default function Page() {
  return (
    <>
      <PageStyle bg="#0f0e0b" />
      <Punakha />
    </>
  );
}
