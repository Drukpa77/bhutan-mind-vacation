'use client';
import { useEffect, useRef, useState } from 'react';
import { useTransitionRouter } from 'next-view-transitions';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Photo from '@/components/Photo';
import TLink from '@/components/TLink';
import { byId, experiences, img, journeyHref, journeys, shortU, type Feeling, type Journey, type JourneyCategory } from '@/content';
import { prefersReducedMotion } from '@/lib/hooks';
import s from './Journeys.module.css';

import { FEELINGS, CATS } from '@/content';
const DUR: [string, number, number][] = [['5–7 DAYS', 5, 7], ['8–10 DAYS', 8, 10], ['11–14 DAYS', 11, 14], ['15+ DAYS', 15, 99]];
const EXP_CAT: Record<string, JourneyCategory> = { trekking: 'Trekking', spiritual: 'Spiritual', festivals: 'Festivals', culture: 'Culture', wellness: 'Wellness', luxury: 'Luxury' };

interface Filters { feel: Feeling[]; dur: number | null; cat: JourneyCategory | null }

const routeU = (j: Journey) => j.route.map(id => shortU(byId[id])).join(' → ');

export default function Journeys({ initialCat = null, initialFeel = null, scrollToExperiences = false }: { initialCat?: JourneyCategory | null; initialFeel?: Feeling | null; scrollToExperiences?: boolean }) {
  const router = useTransitionRouter();
  const [feel, setFeel] = useState<Feeling[]>(initialFeel ? [initialFeel] : []);
  const [dur, setDur] = useState<number | null>(null);
  const [cat, setCat] = useState<JourneyCategory | null>(initialCat);
  const [hovE, setHovE] = useState(-1);
  const vrefs = useRef<(HTMLVideoElement | null)[]>([]);
  const expRef = useRef<HTMLElement>(null);

  useEffect(() => { if (scrollToExperiences) expRef.current?.scrollIntoView({ behavior: 'instant' as ScrollBehavior }); }, [scrollToExperiences]);

  const match = (j: Journey, o: Partial<Filters> = {}) => {
    const f = o.feel ?? feel, d = o.dur !== undefined ? o.dur : dur, c = o.cat !== undefined ? o.cat : cat;
    if (f.length && !f.some(x => j.feel.includes(x))) return false;
    if (d != null) { const r = DUR[d]; if (j.days < r[1] || j.days > r[2]) return false; }
    if (c && !j.cat.includes(c)) return false;
    return true;
  };
  const res = journeys.filter(j => match(j));
  const filtered = feel.length > 0 || dur != null || !!cat;
  const toggleFeel = (f: Feeling) => setFeel(cur => cur.includes(f) ? cur.filter(x => x !== f) : [...cur, f]);

  const feature = res.slice(0, 1), pair = res.slice(1, 3), horiz = res.slice(3, 4), large = res.slice(4, 5), rest = res.slice(5);

  return (
    <>
      <Nav />
      <main className={s.main}>
        <header className={s.hero}>
          <Photo src={img('dochula', 2)} alt="Dochula pass" className={s.heroImg} priority sizes="58vw" />
          <div className={s.heroShade} />
          <div className={s.rel}>
            <div className={s.eyebrow}>JOURNEYS · {journeys.length} ROUTES</div>
            <h1 className={s.h1}>Journeys through<br /><em>the Thunder Dragon</em><br />Kingdom</h1>
          </div>
        </header>

        <section className={s.feelSec} aria-label="Discover by feeling">
          <div className={s.feelHead}>
            <div className={s.label}>DISCOVER BY FEELING</div>
            <button onClick={() => { setFeel([]); setDur(null); setCat(null); }} className={s.clear} style={{ color: filtered ? '#e3a23a' : 'rgba(245,241,232,.35)' }}>CLEAR ALL ×</button>
          </div>
          <div className={s.feelings}>
            {FEELINGS.map(f => {
              const on = feel.includes(f);
              const c = journeys.filter(j => match(j, { feel: [f] })).length;
              return (
                <button key={f} onClick={() => toggleFeel(f)} className={s.feel} aria-pressed={on}
                  style={{ '--c': on ? '#e3a23a' : (feel.length ? 'rgba(245,241,232,.35)' : 'rgba(245,241,232,.82)'), fontStyle: on ? 'italic' : 'normal' } as React.CSSProperties}>
                  {f}<sup className={s.count}>{c}</sup>
                </button>
              );
            })}
          </div>
        </section>

        <section className={s.needSec} aria-label="Discover by need">
          <div>
            <div className={s.needLabel}>HOW LONG</div>
            <div className={s.seg}>
              {DUR.map((d, i) => (
                <button key={d[0]} onClick={() => setDur(dur === i ? null : i)} className={s.segBtn} aria-pressed={dur === i}
                  style={{ background: dur === i ? '#f5f1e8' : 'transparent', color: dur === i ? '#14130f' : '#f5f1e8' }}>{d[0]}</button>
              ))}
            </div>
          </div>
          <div>
            <div className={s.needLabel}>WHAT KIND</div>
            <div className={s.seg}>
              {CATS.map(c => (
                <button key={c} onClick={() => setCat(cat === c ? null : c)} className={s.segBtn} aria-pressed={cat === c}
                  style={{ background: cat === c ? '#f5f1e8' : 'transparent', color: cat === c ? '#14130f' : '#f5f1e8' }}>{c.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </section>

        <section className={s.results} aria-label="Results">
          <div className={s.resultLabel}>{res.length + (res.length === 1 ? ' JOURNEY' : ' JOURNEYS') + (filtered ? ' MATCH' : ' · ALL') + ' · SAMPLE ITINERARIES'}</div>
          {res.length === 0 && (
            <div className={s.none}>Nothing matches — yet.<br /><TLink href="/build-your-journey" className={s.noneLink}>Let us write this one for you →</TLink></div>
          )}
          {feature.map(j => (
            <TLink key={j.id} href={journeyHref(j)} data-cursor="VIEW" className={s.feature}>
              <Photo src={j.img} alt={j.title} className={s.featureImg} />
              <div className={s.featureShade} />
              <div className={s.featureText}>
                <div><div className={s.featureKicker}>JOURNEY {j.no} · {j.feel.join(' · ').toUpperCase()}</div><div className={s.featureTitle}>{j.title}</div></div>
                <div className={s.featureMeta}><div className={s.featureDays}>{j.days}<span className={s.daysU}> DAYS</span></div>{routeU(j)}</div>
              </div>
            </TLink>
          ))}
          <div className={s.pairGrid}>
            {pair.map((j, k) => {
              const i = k + 1;
              return (
                <TLink key={j.id} href={journeyHref(j)} data-cursor="VIEW" className={s.pair} style={{ marginTop: i % 2 ? '120px' : '0' }}>
                  <div className={s.pairImgBox} style={{ aspectRatio: i % 2 ? '4/5' : '5/4' }}><Photo src={j.img} alt={j.title} className={s.pairImg} sizes="50vw" /></div>
                  <div className={s.pairMeta}><span>JOURNEY {j.no}</span><span>{j.days} DAYS</span></div>
                  <div className={s.pairTitle}>{j.title}</div>
                  <p className={s.pairLine}>{j.line}</p>
                </TLink>
              );
            })}
          </div>
          {horiz.map(j => (
            <TLink key={j.id} href={journeyHref(j)} data-cursor="VIEW" className={s.horiz}>
              <div className={s.horizText}>
                <div className={s.horizKicker}>JOURNEY {j.no} · {j.season}</div>
                <div className={s.horizTitle}>{j.title}</div>
                <div className={s.horizRoute}>{routeU(j)}</div>
              </div>
              <div className={s.horizImgBox}><Photo src={j.img} alt={j.title} className={s.horizImg} sizes="66vw" /></div>
            </TLink>
          ))}
          {large.map(j => (
            <TLink key={j.id} href={journeyHref(j)} data-cursor="VIEW" className={s.large}>
              <Photo src={j.img} alt={j.title} className={s.largeImg} />
              <div className={s.largeShade} />
              <div className={s.largeText}>
                <div className={s.largeMeta}>{j.days} DAYS · {j.pace.toUpperCase()}</div>
                <div className={s.largeTitle}>{j.title}</div>
              </div>
            </TLink>
          ))}
          <div className={s.restGrid}>
            {rest.map(j => (
              <TLink key={j.id} href={journeyHref(j)} data-cursor="VIEW" className={s.restRow}>
                <Photo src={j.img} alt={j.title} className={s.restImg} sizes="96px" />
                <div><div className={s.restDays}>{j.days} DAYS</div><div className={s.restTitle}>{j.title}</div></div>
              </TLink>
            ))}
          </div>
        </section>

        <section id="experiences" ref={expRef} className={s.exp} aria-label="Experiences index">
          <div className={s.expHead}>
            <h2 className={s.expH2}>Or begin with<br /><em>an experience</em></h2>
            <div className={s.expHint}>DRAG / SCROLL →</div>
          </div>
          <div className={s.strip}>
            {experiences.map((e, i) => {
              const on = hovE === i;
              const enter = () => {
                setHovE(i);
                const v = vrefs.current[i];
                if (v && e.video && !prefersReducedMotion()) { if (!v.getAttribute('src')) v.src = e.video; v.muted = true; v.play().catch(() => {}); }
              };
              const leave = () => { setHovE(-1); vrefs.current[i]?.pause(); };
              const click = () => {
                if (e.id === 'festivals') { router.push('/festivals'); return; }
                setCat(EXP_CAT[e.id] || null); setFeel([]); setDur(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              };
              return (
                <button key={e.id} onClick={click} onMouseEnter={enter} onMouseLeave={leave} data-cursor="FILTER" className={s.card}>
                  <Photo src={e.img} alt={e.name} className={s.cardImg} sizes="360px" style={{ filter: `brightness(${on ? 0.85 : 0.6})`, transform: `scale(${on ? 1 : 1.06})` }} />
                  {e.video && <video ref={el => { vrefs.current[i] = el; }} muted loop playsInline preload="none" className={s.cardVideo} style={{ opacity: on ? 1 : 0 }} />}
                  <div className={s.cardShade} />
                  <div className={s.cardText}>
                    <div className={s.cardKicker}>{String(i + 1).padStart(2, '0')} · {e.name.toUpperCase()}</div>
                    <div className={s.cardVerb}>{e.verb}</div>
                    <div className={s.cardP}>{e.text}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
