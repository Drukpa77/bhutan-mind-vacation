import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageStyle from '@/components/PageStyle';
import Journey from '@/views/Journey';
import { journeys } from '@/content';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => journeys.map(j => ({ slug: j.id }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const j = journeys.find(x => x.id === slug);
  return { title: `${j?.title ?? 'Journey'} — Bhutan Mind Vacation`, description: j?.line };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  if (!journeys.some(j => j.id === slug)) notFound();
  return (
    <>
      <PageStyle bg="#0f0e0b" />
      <Journey id={slug} />
    </>
  );
}
