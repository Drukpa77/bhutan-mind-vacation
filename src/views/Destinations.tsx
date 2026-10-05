'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import BhutanMap from '@/components/BhutanMap';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Photo from '@/components/Photo';
import TLink from '@/components/TLink';
import { brand, byId, DESTINATION_ORDER, fmt, pad2 } from '@/content';
import { useNoHover } from '@/lib/hooks';
import s from './Destinations.module.css';

export default function Destinations({ initial = 'punakha' }: { initial?: string }) {
  const [active, setActive] = useState(byId[initial] ? initial : 'punakha');
  const router = useRouter();
  const touch = useNoHover();
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const c = byId[active];

  // No hover on touch screens: the row crossing the middle of the screen drives the photo instead.
  useEffect(() => {
    if (!touch) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { const id = (e.target as HTMLElement).dataset.id; if (id) setActive(id); }
    }), { rootMargin: '-55% 0px -40% 0px' });
    rowRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, [touch]);

  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className={s.main} data-screen-label="Destinations atlas">
        <div className={s.mapCol}>
          <div className={s.titleBox}>
            <div className={s.eyebrow}>AN ATLAS OF BHUTAN</div>
            <h1 className={s.h1}>Destinations</h1>
          </div>
          <BhutanMap markers={DESTINATION_ORDER} activeId={active} onHover={id => id && setActive(id)} onSelect={id => router.push(byId[id].page)} labels="all"
            style={{ position: 'absolute', inset: '76px 0 0 0' }} />
          <div className={s.coords} aria-hidden="true">{c.name.toUpperCase()} · {c.lat.toFixed(4)}° N · {c.lon.toFixed(4)}° E</div>
        </div>
        <div className={s.listCol}>
          <div className={s.photoBox}>
            {DESTINATION_ORDER.map(id => {
              const d = byId[id], on = id === active;
              return <Photo key={id} src={d.img || brand.undiscovered} alt={on ? d.name : ''} className={s.photo} vt={on ? 'dest-' + id : 'none'} sizes="(max-width: 899px) 100vw, 45vw"
                style={{ opacity: on ? 1 : 0, transform: `scale(${on ? 1 : 1.08})` }} />;
            })}
            <div className={s.photoShade} />
            <div className={s.caption} aria-live="polite">
              <span className={s.captionLine}>{c.line}</span>
              <span className={s.captionKind}>{c.kind.toUpperCase()}</span>
            </div>
          </div>
          <nav className={s.list} aria-label="Destinations">
            {DESTINATION_ORDER.map((id, i) => {
              const d = byId[id], on = id === active;
              return (
                <TLink key={id} href={d.page} ref={el => { rowRefs.current[i] = el; }} data-id={id} onMouseEnter={() => setActive(id)} onFocus={() => setActive(id)} data-cursor="ENTER" className={s.row} style={{ color: on ? '#e3a23a' : '#f5f1e8' }}>
                  <span className={s.rowNo} aria-hidden="true">{pad2(i + 1)}</span>
                  <span className={s.rowName} style={{ fontStyle: on ? 'italic' : 'normal', transform: `translateX(${on ? '12px' : '0'})` }}>{d.name}</span>
                  <span className={s.rowMeta}>{fmt(d.alt)} M<br />{d.region.toUpperCase()}</span>
                </TLink>
              );
            })}
            <TLink href="/interactive-map" className={s.mapLink}>OPEN THE FULL INTERACTIVE MAP <span className={s.mono} aria-hidden="true">→</span></TLink>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}
