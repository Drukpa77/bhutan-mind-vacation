import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageStyle from '@/components/PageStyle';
import About from '@/views/About';
import { ABOUT_SUB_ROUTES } from '@/content';

type Params = { params: Promise<{ section: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(ABOUT_SUB_ROUTES).map(section => ({ section }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section } = await params;
  return { title: `${ABOUT_SUB_ROUTES[section]?.title ?? 'About'} — Bhutan Mind Vacation` };
}

export default async function Page({ params }: Params) {
  const { section } = await params;
  const sub = ABOUT_SUB_ROUTES[section];
  if (!sub) notFound();
  return (
    <>
      <PageStyle bg="#ece4d4" hover="#8f2b1f" />
      <About anchor={sub.anchor} />
    </>
  );
}
