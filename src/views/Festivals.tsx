'use client';
import { useEffect, useRef, useState, type MouseEvent as RMouseEvent } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Photo from '@/components/Photo';
import TLink from '@/components/TLink';
import { byId, festivals, img, journeyHref, journeysThrough, monthNames, months, type Festival } from '@/content';
import { useModal } from '@/lib/hooks';
import s from './Festivals.module.css';

const SEASON = ['WINTER', 'WINTER', 'SPRING', 'SPRING', 'SPRING', 'MONSOON', 'MONSOON', 'MONSOON', 'AUTUMN', 'AUTUMN', 'AUTUMN', 'WINTER'];
const has = (m: number) => festivals.some(f => f.month === m);
const emptyText = (m: number) => m === 0 ? 'Cold, clear and quiet in the valleys.' : m >= 5 && m <= 7 ? 'Green monsoon months, fewer festivals.' : 'No major tshechu — the valleys are yours.';

export default function Festivals() {
  const [open, setOpen] = useState<string | null>(null);
  const [month, setMonth] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const tkRef = useRef<HTMLDivElement>(null), opener = useRef<HTMLElement | null>(null);
  useModal(!!open, tkRef, opener, () => setOpen(null));

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
      <main id="main" tabIndex={-1} className={s.main}>
        <header className={s.hero} data-screen-label="Festivals intro">
          <Photo src={img('parotsechu', 1)} alt="Black Hat dance at Paro Tshechu" className={s.heroImg} priority />
          <div className={s.heroShade} />
          <div className={s.heroRow}>
            <h1 className={s.h1}>The year<br /><em>in masks</em></h1>
            <p className={s.lead}>Tshechus honour Guru Rinpoche with sacred mask dances that whole valleys come to watch. Most follow the lunar calendar, so dates move each year; we confirm them as soon as they’re published.</p>
          </div>
        </header>

        <nav className={s.rail} data-screen-label="Month rail" aria-label="Jump to month">
          {months.map((m, i) => (
            <button key={m} type="button" onClick={() => scrollTo(i)} className={s.railBtn} aria-current={i === month ? 'true' : undefined}
              aria-label={`${monthNames[i]}${has(i) ? '' : ', no festivals'}`}
              style={{ color: i === month ? '#e3a23a' : has(i) ? '#f5f1e8' : 'rgba(245,241,232,.55)', borderBottomColor: i === month ? '#e3a23a' : 'transparent' }}>
              {m}<span className={s.railDot} aria-hidden="true" style={{ opacity: has(i) ? 1 : 0 }} />
            </button>
          ))}
        </nav>

        <section className={s.cal} data-screen-label="Calendar" aria-label="Festival calendar">
          <div className={s.calHead} aria-hidden="true"><span><span className={s.hintPointer}>DRAG OR SCROLL SIDEWAYS</span><span className={s.hintTouch}>SWIPE SIDEWAYS</span></span><span>{festivals.length} FESTIVALS</span></div>
          <div ref={track} onScroll={onTrack} onMouseDown={dragStart} data-cursor="DRAG" className={s.track} tabIndex={0} role="region" aria-label="Months, scroll horizontally">
            {monthNames.map((name, m) => {
              const fs = festivals.filter(x => x.month === m);
              return (
                <div key={name} className={s.col}>
                  <h2 className={s.colName} style={{ color: m === month ? '#e3a23a' : '#f5f1e8' }}>{name}</h2>
                  <div className={s.colSeason}>{SEASON[m]}</div>
                  <div className={s.colList}>
                    {fs.map((x, i) => (
                      <button key={x.id} type="button" onClick={e => { opener.current = e.currentTarget; setOpen(x.id); }} data-cursor="OPEN" className={s.card} aria-haspopup="dialog">
                        <div className={s.cardImgBox} style={{ aspectRatio: i % 2 ? '1/1' : '4/5' }}><Photo src={x.img} alt="" className={s.cardImg} sizes="(max-width: 599px) 80vw, 400px" /></div>
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

      <div ref={tkRef} className={s.tk} data-screen-label="Festival takeover" role="dialog" aria-modal="true" aria-labelledby="tk-title" inert={!open}
        style={{ clipPath: open ? 'inset(0 0 0 0)' : 'inset(50% 0 50% 0)', pointerEvents: open ? 'auto' : 'none', visibility: open ? 'visible' : 'hidden', transitionProperty: 'clip-path, visibility', transitionDelay: open ? '0s, 0s' : '0s, .9s' }}>
        <div className={s.tkHero}>
          <Photo src={f.img} alt={f.name} className={s.tkImg} style={{ transform: `scale(${open ? 1 : 1.15})` }} />
          <div className={s.tkShade} />
          <button type="button" onClick={() => setOpen(null)} data-cursor="CLOSE" className={s.close} aria-label="Close festival">CLOSE <span aria-hidden="true">×</span></button>
          <div className={s.tkTitleBox}>
            <div className={s.tkWhen}>{f.when}</div>
            <h2 id="tk-title" className={s.tkH2}>{f.name}</h2>
          </div>
        </div>
        <div className={s.tkGrid}>
          <div><div className={s.k}>THE STORY</div><p className={s.tkStory}>{f.text}</p></div>
          <div className={s.tkMid}>
            <div><div className={s.k}>WHERE</div><TLink href={pl.page} className={s.tkPlace}>{pl.name} <span aria-hidden="true">→</span></TLink></div>
            <div><div className={s.k}>WHEN</div><div className={s.tkDate}>{dateNote}</div></div>
          </div>
          <div className={s.tkJ}>
            <div className={s.k}>JOURNEYS THAT PASS THROUGH</div>
            {journeysThrough(f.place).slice(0, 4).map(j => (
              <TLink key={j.id} href={journeyHref(j)} className={s.tkJRow}>{j.title}<span className={s.tkJDays} aria-label={`${j.days} days`}>{j.days}D</span></TLink>
            ))}
            <TLink href={`/build-your-journey?d=${f.place}`} data-cursor="BEGIN" className={s.tkBuild}>BUILD A JOURNEY AROUND THIS FESTIVAL <span className={s.mono} aria-hidden="true">→</span></TLink>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
