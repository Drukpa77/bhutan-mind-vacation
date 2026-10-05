import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageStyle from '@/components/PageStyle';
import Destination from '@/views/Destination';
import { byId, destinations, destinationVariant } from '@/content';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => destinations.filter(d => d.id !== 'punakha').map(d => ({ slug: d.id }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const d = byId[slug];
  return { title: `${d?.name ?? 'Destination'} — Bhutan Mind Vacation`, description: d?.line };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  if (!byId[slug]) notFound();
  const v = destinationVariant(slug);
  const bg = v === 'still' ? '#f5f1e8' : v === 'editorial' ? '#ece4d4' : '#0f0e0b';
  return (
    <>
      <PageStyle bg={bg} />
      <Destination id={slug} />
    </>
  );
}
