import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageStyle from '@/components/PageStyle';
import Plan from '@/views/Plan';
import { planSubRoutes } from '@/content/plan';

type Params = { params: Promise<{ section: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(planSubRoutes).map(section => ({ section }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section } = await params;
  return { title: `${planSubRoutes[section]?.title ?? 'Plan Your Trip'} — Bhutan Mind Vacation` };
}

export default async function Page({ params }: Params) {
  const { section } = await params;
  const sub = planSubRoutes[section];
  if (!sub) notFound();
  return (
    <>
      <PageStyle bg="#f5f1e8" hover="#8f2b1f" />
      <Plan anchor={sub.anchor} />
    </>
  );
}
