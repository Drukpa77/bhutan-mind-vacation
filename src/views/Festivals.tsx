'use client';
import { useEffect, useRef, useState, type MouseEvent as RMouseEvent } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Photo from '@/components/Photo';
import TLink from '@/components/TLink';
import { byId, festivals, img, journeyHref, journeysThrough, monthNames, months, type Festival } from '@/content';
import { useKey } from '@/lib/hooks';
import s from './Festivals.module.css';

const SEASON = ['WINTER', 'WINTER', 'SPRING', 'SPRING', 'SPRING', 'MONSOON', 'MONSOON', 'MONSOON', 'AUTUMN', 'AUTUMN', 'AUTUMN', 'WINTER'];
const has = (m: number) => festivals.some(f => f.month === m);
const emptyText = (m: number) => m === 0 ? 'Cold, clear and quiet in the valleys.' : m >= 5 && m <= 7 ? 'Green monsoon months, fewer festivals.' : 'No major tshechu — the valleys are yours.';

export default function Festivals() {
  const [open, setOpen] = useState<string | null>(null);
  const [month, setMonth] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  useKey('Escape', () => setOpen(null));

  useEffect(() => {
    const t = track.current; if (!t) return;
    const onWheel = (e: WheelEvent) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && e.shiftKey) { t.scrollLeft += e.deltaY; e.preventDefault(); } };
    t.addEventListener('wheel', onWheel, { passive: false });
    return () => t.removeEventListener('wheel', onWheel);
  }, []);

  const scrollTo = (i: number) => {
    const t = track.current; if (!t) return;
    const col = t.children[i] as HTMLElement | undefined;
    if (col) t.scrollTo({ left: col.offsetLeft - t.offsetLeft - 40, behavior: 'smooth' });
    setMonth(i);
  };

  const onTrack = () => {
    const t = track.current; if (!t) return;
    let m = 0;
    Array.from(t.children).forEach((k, i) => { if ((k as HTMLElement).offsetLeft - t.offsetLeft - 60 <= t.scrollLeft) m = i; });
    setMonth(m);
  };

  const dragStart = (e: RMouseEvent) => {
    const t = track.current; if (!t || e.button !== 0) return;
    const x0 = e.clientX, s0 = t.scrollLeft; let moved = false;
    t.style.scrollSnapType = 'none'; t.style.cursor = 'grabbing';
    const mv = (ev: MouseEvent) => { const dx = ev.clientX - x0; if (Math.abs(dx) > 4) moved = true; t.scrollLeft = s0 - dx; };
    const up = () => {
      window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up);
      t.style.scrollSnapType = 'x proximity'; t.style.cursor = 'grab';
      if (moved) {
        const stop = (c: Event) => { c.stopPropagation(); c.preventDefault(); window.removeEventListener('click', stop, true); };
        window.addEventListener('click', stop, true);
        setTimeout(() => window.removeEventListener('click', stop, true), 50);
      }
    };
    window.addEventListener('mousemove', mv); window.addEventListener('mouseup', up);
  };

  const f: Festival = festivals.find(x => x.id === open) || festivals[1];
  const pl = byId[f.place];
  const dateNote = f.date ? `${f.date}, as published for 2026. Dates for later years follow the lunar calendar.` : `Usually ${f.when.replace(' · lunar', '')}. Exact dates follow the Bhutanese lunar calendar and are confirmed annually.`;

  return (
    <>
      <Nav />
      <main className={s.main}>
        <header className={s.hero} data-screen-label="Festivals intro">
          <Photo src={img('parotsechu', 1)} alt="Black Hat dance at Paro Tshechu" className={s.heroImg} priority />
          <div className={s.heroShade} />
          <div className={s.heroRow}>
            <h1 className={s.h1}>The year<br /><em>in masks</em></h1>
            <p className={s.lead}>Tshechus honour Guru Rinpoche with sacred mask dances that whole valleys come to watch. Most follow the lunar calendar, so dates move each year; we confirm them as soon as they’re published.</p>
          </div>
        </header>

        <div className={s.rail} data-screen-label="Month rail">
          {months.map((m, i) => (
            <button key={m} onClick={() => scrollTo(i)} className={s.railBtn} aria-current={i === month}
              style={{ color: i === month ? '#e3a23a' : has(i) ? '#f5f1e8' : 'rgba(245,241,232,.4)', borderBottomColor: i === month ? '#e3a23a' : 'transparent' }}>
              {m}<span className={s.railDot} style={{ opacity: has(i) ? 1 : 0 }} />
            </button>
          ))}
        </div>

        <section className={s.cal} data-screen-label="Calendar">
          <div className={s.calHead}><span>DRAG OR SCROLL SIDEWAYS</span><span>{festivals.length} FESTIVALS</span></div>
          <div ref={track} onScroll={onTrack} onMouseDown={dragStart} data-cursor="DRAG" className={s.track}>
            {monthNames.map((name, m) => {
              const fs = festivals.filter(x => x.month === m);
              return (
                <div key={name} className={s.col}>
                  <div className={s.colName} style={{ color: m === month ? '#e3a23a' : '#f5f1e8' }}>{name}</div>
                  <div className={s.colSeason}>{SEASON[m]}</div>
                  <div className={s.colList}>
                    {fs.map((x, i) => (
                      <button key={x.id} onClick={() => setOpen(x.id)} data-cursor="OPEN" className={s.card}>
                        <div className={s.cardImgBox} style={{ aspectRatio: i % 2 ? '1/1' : '4/5' }}><Photo src={x.img} alt={x.name} className={s.cardImg} sizes="400px" /></div>
                        <div className={s.cardWhen}>{x.when}</div>
                        <div className={s.cardName}>{x.name}</div>
                        <div className={s.cardPlace}>{byId[x.place].name.toUpperCase()}</div>
                      </button>
                    ))}
                    {fs.length === 0 && <div className={s.empty}>{emptyText(m)}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <div className={s.tk} data-screen-label="Festival takeover" role="dialog" aria-modal="true" aria-hidden={!open} aria-label={f.name}
        style={{ clipPath: open ? 'inset(0 0 0 0)' : 'inset(50% 0 50% 0)', pointerEvents: open ? 'auto' : 'none' }}>
        <div className={s.tkHero}>
          <Photo src={f.img} alt={f.name} className={s.tkImg} style={{ transform: `scale(${open ? 1 : 1.15})` }} />
          <div className={s.tkShade} />
          <button onClick={() => setOpen(null)} data-cursor="CLOSE" className={s.close} tabIndex={open ? 0 : -1}>CLOSE ×</button>
          <div className={s.tkTitleBox}>
            <div className={s.tkWhen}>{f.when}</div>
            <h2 className={s.tkH2}>{f.name}</h2>
          </div>
        </div>
        <div className={s.tkGrid}>
          <div><div className={s.k}>THE STORY</div><p className={s.tkStory}>{f.text}</p></div>
          <div className={s.tkMid}>
            <div><div className={s.k}>WHERE</div><TLink href={pl.page} className={s.tkPlace} tabIndex={open ? 0 : -1}>{pl.name} →</TLink></div>
            <div><div className={s.k}>WHEN</div><div className={s.tkDate}>{dateNote}</div></div>
          </div>
          <div className={s.tkJ}>
            <div className={s.k}>JOURNEYS THAT PASS THROUGH</div>
            {journeysThrough(f.place).slice(0, 4).map(j => (
              <TLink key={j.id} href={journeyHref(j)} className={s.tkJRow} tabIndex={open ? 0 : -1}>{j.title}<span className={s.tkJDays}>{j.days}D</span></TLink>
            ))}
            <TLink href={`/build-your-journey?d=${f.place}`} data-cursor="BEGIN" className={s.tkBuild} tabIndex={open ? 0 : -1}>BUILD A JOURNEY AROUND THIS FESTIVAL <span className={s.mono}>→</span></TLink>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
