'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BhutanMap from '@/components/BhutanMap';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Photo from '@/components/Photo';
import TLink from '@/components/TLink';
import { brand, byId, DESTINATION_ORDER, fmt, pad2 } from '@/content';
import { useWidth } from '@/lib/hooks';
import s from './Destinations.module.css';

export default function Destinations({ initial = 'punakha' }: { initial?: string }) {
  const [active, setActive] = useState(byId[initial] ? initial : 'punakha');
  const router = useRouter();
  const narrow = useWidth() < 900;
  const c = byId[active];

  return (
    <>
      <Nav />
      <main className={s.main} data-screen-label="Destinations atlas" style={{ gridTemplateColumns: narrow ? '1fr' : 'minmax(0,1.35fr) minmax(0,1fr)' }}>
        <div className={s.mapCol} style={{ height: narrow ? '60vh' : '100vh' }}>
          <div className={s.titleBox}>
            <div className={s.eyebrow}>AN ATLAS OF BHUTAN</div>
            <h1 className={s.h1}>Destinations</h1>
          </div>
          <BhutanMap markers={DESTINATION_ORDER} activeId={active} onHover={id => id && setActive(id)} onSelect={id => router.push(byId[id].page)} labels="all"
            style={{ position: 'absolute', inset: '76px 0 0 0' }} />
          <div className={s.coords}>{c.name.toUpperCase()} · {c.lat.toFixed(4)}° N · {c.lon.toFixed(4)}° E</div>
        </div>
        <div className={s.listCol}>
          <div className={s.photoBox}>
            {DESTINATION_ORDER.map(id => {
              const d = byId[id], on = id === active;
              return <Photo key={id} src={d.img || brand.undiscovered} alt={d.name} className={s.photo} vt={on ? 'dest-' + id : 'none'} sizes="(max-width: 900px) 100vw, 45vw"
                style={{ opacity: on ? 1 : 0, transform: `scale(${on ? 1 : 1.08})` }} />;
            })}
            <div className={s.photoShade} />
            <div className={s.caption}>
              <span className={s.captionLine}>{c.line}</span>
              <span className={s.captionKind}>{c.kind.toUpperCase()}</span>
            </div>
          </div>
          <div className={s.list}>
            {DESTINATION_ORDER.map((id, i) => {
              const d = byId[id], on = id === active;
              return (
                <TLink key={id} href={d.page} onMouseEnter={() => setActive(id)} onFocus={() => setActive(id)} data-cursor="ENTER" className={s.row} style={{ color: on ? '#e3a23a' : '#f5f1e8' }}>
                  <span className={s.rowNo}>{pad2(i + 1)}</span>
                  <span className={s.rowName} style={{ fontStyle: on ? 'italic' : 'normal', transform: `translateX(${on ? '12px' : '0'})` }}>{d.name}</span>
                  <span className={s.rowMeta}>{fmt(d.alt)} M<br />{d.region.toUpperCase()}</span>
                </TLink>
              );
            })}
            <TLink href="/interactive-map" className={s.mapLink}>OPEN THE FULL INTERACTIVE MAP <span className={s.mono}>→</span></TLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
