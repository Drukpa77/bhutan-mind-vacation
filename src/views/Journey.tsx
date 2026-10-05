'use client';
import { useRef } from 'react';
import BhutanMap from '@/components/BhutanMap';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Photo from '@/components/Photo';
import TLink from '@/components/TLink';
import { byId, contact, fmt, journeys, shortU, type ItineraryDay, type Journey as JourneyT } from '@/content';
import { useViewport } from '@/lib/hooks';
import s from './Journey.module.css';

/** Journeys without a written itinerary get one stop per unique place. */
function withItinerary(j: JourneyT): JourneyT & { itinerary: ItineraryDay[]; generated: boolean } {
  if (j.itinerary) return { ...j, itinerary: j.itinerary, generated: false };
  const uniq = j.route.filter((r, i) => j.route.indexOf(r) === i);
  return { ...j, generated: true, itinerary: uniq.map((id, i) => { const d = byId[id]; return { day: i + 1, dest: id, title: d.kind, text: d.line + ' Day-by-day plan tailored on request.', img: d.img || j.img }; }) };
}

function ElevProfile({ j, prog, cur }: { j: JourneyT; prog: number; cur: number }) {
  const pts = j.route.map(id => byId[id]);
  const W = 1200, H = 260, mn = 0, mx = Math.max(4200, ...pts.map(p => p.alt + 400));
  const xy = pts.map((d, i) => [40 + i / (pts.length - 1) * (W - 80), H - 30 - (d.alt - mn) / (mx - mn) * (H - 70)]);
  const n = Math.floor(prog), t = prog - n; const vis = xy.slice(0, n + 1);
  if (n < xy.length - 1) vis.push([xy[n][0] + (xy[n + 1][0] - xy[n][0]) * t, xy[n][1] + (xy[n + 1][1] - xy[n][1]) * t]);
  const line = (a: number[][]) => a.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
  const area = vis.length > 1 ? line(vis) + `L${vis[vis.length - 1][0]} ${H - 30}L${vis[0][0]} ${H - 30}Z` : '';
  const mono = { fontFamily: 'var(--mono)' };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', overflow: 'visible' }} role="img"
      aria-label={'Elevation profile: ' + pts.map(p => `${p.name} ${fmt(p.alt)} m`).join(', ')}>
      {[1000, 2000, 3000, 4000].filter(v => v < mx).map(v => {
        const y = H - 30 - v / mx * (H - 70);
        return <g key={'g' + v}><line x1={40} x2={W - 40} y1={y} y2={y} stroke="rgba(245,241,232,.08)" /><text x={0} y={y + 3} fill="rgba(245,241,232,.45)" fontSize={10} style={mono}>{v + 'm'}</text></g>;
      })}
      <path d={area} fill="rgba(227,162,58,.1)" />
      <path d={line(xy)} fill="none" stroke="rgba(245,241,232,.22)" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
      <path d={line(vis)} fill="none" stroke="#e3a23a" strokeWidth={2} vectorEffect="non-scaling-stroke" />
      {xy.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r={i === cur ? 6 : 3.5} fill={i <= prog + 0.01 ? '#e3a23a' : '#0f0e0b'} stroke="#e3a23a" strokeWidth={1.2} />
          <text x={p[0]} y={p[1] - 14} fill="#f5f1e8" fillOpacity={i <= prog + 0.01 ? 0.95 : 0.35} fontSize={10.5} style={mono} textAnchor="middle" letterSpacing={1.2}>{shortU(pts[i])}</text>
          <text x={p[0]} y={H - 8} fill="rgba(245,241,232,.55)" fontSize={10} style={mono} textAnchor="middle">{fmt(pts[i].alt)}</text>
        </g>
      ))}
    </svg>
  );
}

export default function Journey({ id }: { id: string }) {
  const j = withItinerary(journeys.find(x => x.id === id) || journeys[0]);
  const { y, vh, w } = useViewport();
  const elevRef = useRef<HTMLElement>(null);
  const dayRefs = useRef<(HTMLElement | null)[]>([]);

  // Active day: the last article whose top has passed 55% of the viewport; frac = how far through it we are.
  let active = 0, frac = 0;
  dayRefs.current.forEach((el, i) => {
    if (!el) return; const b = el.getBoundingClientRect();
    if (b.top < vh * 0.55) { active = i; frac = Math.max(0, Math.min(1, (vh * 0.55 - b.top) / b.height)); }
  });

  let r = 0; const dayRoute = j.itinerary.map(d => { while (r < j.route.length - 1 && j.route[r] !== d.dest) r++; return r; });
  const a = Math.min(active, j.itinerary.length - 1);
  const next = Math.min(a + 1, j.itinerary.length - 1);
  const mapProg = dayRoute[a] + (dayRoute[next] - dayRoute[a]) * Math.min(1, frac * 1.4);
  const narrow = w < 900;
  const regions = [...new Set(j.route.map(x => byId[x].region))];
  const alts = j.route.map(x => byId[x].alt);
  const ep = (() => { const el = elevRef.current; if (!el) return 0; const b = el.getBoundingClientRect(); return Math.max(0, Math.min(1, (vh - b.top) / (vh * 0.8))); })();
  const uniqRoute = j.route.filter((x, i) => j.route.indexOf(x) === i);
  const facts = [{ k: 'DURATION', v: j.days + ' days' }, { k: 'PACE', v: j.pace }, { k: 'BEST SEASON', v: j.season }, { k: 'REGIONS', v: regions.join(' · ') }, { k: 'HIGHEST POINT', v: '~' + fmt(Math.max(...alts)) + ' m' }];

  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className={s.main}>
        <header className={s.hero}>
          <Photo src={j.img} alt={j.title} className={s.heroImg} priority style={{ transform: `scale(${(1 + Math.min(y, 800) / 4000).toFixed(3)})` }} />
          <div className={s.heroShade} />
          <div className={s.heroText}>
            <div className={s.eyebrow}>JOURNEY {j.no}</div>
            <h1 className={s.h1}>{j.title}</h1>
            <div className={s.heroMeta}>
              <span className={s.heroDays}>{j.days} <span className={s.heroDaysU}>DAYS</span></span>
              <span className={s.heroRoute}>{uniqRoute.map(x => shortU(byId[x])).join(' → ')}</span>
            </div>
          </div>
        </header>

        <section className={s.facts} aria-label="Overview">
          {facts.map(f => (
            <div key={f.k} className={s.fact}><div className={s.factK}>{f.k}</div><div className={s.factV}>{f.v}</div></div>
          ))}
        </section>

        <section ref={elevRef} className={s.elevSec} aria-label="Elevation">
          <div className={s.elevHead}>
            <h2 className={s.h2}>The shape of the <em>journey</em></h2>
            <span className={s.source}>ELEVATIONS APPROXIMATE · SOURCE: WIKIPEDIA PLACE DATA</span>
          </div>
          <div className={s.elev}><ElevProfile j={j} prog={ep * (j.route.length - 1)} cur={dayRoute[a]} /></div>
        </section>

        <section className={s.itin} aria-label="Itinerary">
          <div className={s.mapCol} aria-hidden="true">
            <BhutanMap route={j.route} markers={[...new Set(j.route)]} flights={j.flight} progress={mapProg} activeId={j.itinerary[a].dest} focus="" zoom={1.7} labels={narrow ? 'active' : 'all'} />
            <div className={s.counter}><span className={s.counterNo}>{String(a + 1).padStart(2, '0')}</span> / {j.days} DAYS</div>
            <div className={s.bar}><div className={s.barFill} style={{ width: ((a + 1) / j.itinerary.length * 100) + '%' }} /></div>
          </div>
          <div>
            {j.itinerary.map((d, i) => {
              const dd = byId[d.dest];
              return (
                <article key={i} ref={el => { dayRefs.current[i] = el; }} className={s.day} style={{ opacity: i === a ? 1 : 0.45 }}>
                  <div>
                    <div className={s.dayK} aria-hidden="true">DAY</div>
                    <div className={s.dayNo}><span className="bmv-sr">Day </span>{String(j.generated ? i + 1 : d.day).padStart(2, '0')}</div>
                    <div className={s.dayMeta}>{dd.name.toUpperCase()}<br />{fmt(dd.alt)} M · {dd.lat.toFixed(3)}° N {dd.lon.toFixed(3)}° E</div>
                    <h3 className={s.dayTitle}>{d.title}</h3>
                    <p className={s.dayText}>{d.text}</p>
                  </div>
                  <div className={s.dayImgBox} style={{ aspectRatio: i % 3 === 1 ? '3/4' : '4/5' }}>
                    <Photo src={d.img} alt={dd.name} className={s.dayImg} sizes="(max-width: 900px) 100vw, 30vw" style={{ transform: `scale(${i === a ? 1 : 1.08})` }} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={s.cta} aria-label="Journey CTA">
          <div className={s.ctaEyebrow}>SAMPLE ITINERARY · EVERY JOURNEY IS PRIVATE &amp; TAILORED</div>
          <h2 className={s.ctaH2}>Make it <em>yours.</em></h2>
          <p className={s.ctaP}>Change the pace, add a festival, swap a valley. Your trip is quoted with Bhutan’s Sustainable Development Fee shown clearly, never hidden.</p>
          <div className={s.ctaRow}>
            <TLink href={`/build-your-journey?from=${j.id}`} data-cursor="BEGIN" className={s.adapt}>ADAPT THIS JOURNEY <span className={s.mono}>→</span></TLink>
            <a href={`mailto:${contact.email}?subject=Journey%20enquiry`} className={s.ask}>ASK A BHUTAN EXPERT</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
