import type { Metadata } from 'next';
import PageStyle from '@/components/PageStyle';
import About from '@/views/About';

export const metadata: Metadata = { title: 'About — Bhutan Mind Vacation' };

export default function Page() {
  return (
    <>
      <PageStyle bg="#ece4d4" hover="#8f2b1f" />
      <About />
    </>
  );
}
