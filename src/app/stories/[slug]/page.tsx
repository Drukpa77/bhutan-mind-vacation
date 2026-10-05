import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageStyle from '@/components/PageStyle';
import Story from '@/views/Story';
import { stories } from '@/content';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => stories.map(s => ({ slug: s.id }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = stories.find(x => x.id === slug);
  return { title: `${s?.title ?? 'Story'} — Stories from the Kingdom`, description: s?.dek };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  if (!stories.some(s => s.id === slug)) notFound();
  return (
    <>
      <PageStyle bg="#f5f1e8" hover="#8f2b1f" />
      <Story id={slug} />
    </>
  );
}
