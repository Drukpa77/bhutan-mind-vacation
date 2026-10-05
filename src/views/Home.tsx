'use client';
import { useEffect, useRef, useState } from 'react';
import { useTransitionRouter } from 'next-view-transitions';
import BhutanMap from '@/components/BhutanMap';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Photo from '@/components/Photo';
import TLink from '@/components/TLink';
import { brand, byId, fmt, img, journeyHref, journeys, media, shortU, type Journey } from '@/content';
import { inViewProgress, prefersReducedMotion, stickyProgress, useViewport } from '@/lib/hooks';
import s from './Home.module.css';

const K_DATA = [
  { k: 'ARRIVAL', t: 'You don’t simply *visit* Bhutan.', img: img('punakha', 1), cap: 'PUNAKHA DZONG · PUNAKHA', alt: 'Punakha Dzong' },
  { k: 'SINCE 1974', t: 'For fifty years it has opened its doors *with care.*', img: img('taktsang', 1), cap: 'PARO TAKTSANG · PARO', alt: 'Paro Taktsang' },
  { k: 'BY CONSTITUTION', t: 'Sixty percent of the land stays *forest, forever.*', img: img('phobjikha', 0), cap: 'PHOBJIKHA VALLEY · WANGDUE PHODRANG', alt: 'Phobjikha valley' },
  { k: 'GROSS NATIONAL HAPPINESS', t: 'Progress here is measured *in happiness.*', img: img('dochula', 0), cap: 'DRUK WANGYAL CHORTENS · DOCHULA', alt: 'Chortens at Dochula' }
];

/** Splits a headline into words, marking *emphasised* runs as italic. */
function parseWords(t: string) {
  let itf = false;
  return t.split(' ').map((w0, j) => {
    let w = w0, it = false;
    if (w.startsWith('*')) { itf = true; w = w.slice(1); }
    if (itf) it = true;
    if (w.endsWith('*')) { w = w.slice(0, -1); itf = false; return { t: w, it: true, j }; }
    return { t: w, it, j };
  });
}

const TEASER = ['paro', 'taktsang', 'haa', 'thimphu', 'punakha', 'phobjikha', 'trongsa', 'bumthang', 'trashigang'];

const CHOICES = [
  { no: '01', verb: 'Go higher', name: 'TREKKING', img: brand.trekking, video: media.riverVideo as string | undefined, href: '/journeys?cat=Trekking', text: 'High passes, yak herders’ camps and Jomolhari base camp.' },
  { no: '02', verb: 'Find stillness', name: 'SPIRITUAL JOURNEYS', img: brand.spiritual, video: undefined, href: '/journeys?cat=Spiritual', text: 'Butter lamps, morning prayers and pilgrim trails.' },
  { no: '03', verb: 'Follow the celebration', name: 'FESTIVALS', img: img('parotsechu', 1), video: undefined, href: '/festivals', text: 'Mask dances that have been performed for centuries.' }
];

const STEPS = [
  { no: '01', q: 'Why Bhutan?', a: 'STILLNESS · ADVENTURE · CULTURE' }, { no: '02', q: 'How long?', a: '5 – 21 DAYS' }, { no: '03', q: 'When?', a: 'FESTIVALS · CRANES · BLOSSOM' },
  { no: '04', q: 'Who’s coming?', a: 'SOLO · COUPLE · FAMILY' }, { no: '05', q: 'Your Bhutan', a: 'A ROUTE ON THE REAL MAP' }
];

const TRUST = [
  { no: '01', title: 'Travellers’ Choice 2024', text: 'Recognised by Tripadvisor from the reviews of our guests.', href: 'https://www.tripadvisor.com.sg/Attraction_Review-g293845-d14803907-Reviews-Bhutan_Mind_Vacation_Tours-Thimphu_Thimphu_District.html', arrow: '↗' },
  { no: '02', title: 'Bhutanese & family-owned', text: 'Owned and operated in Thimphu. Your fees stay in the kingdom.', href: '/about', arrow: '→' },
  { no: '03', title: 'Local guides, licensed', text: 'Every guest travels with a licensed Bhutanese guide who grew up here.', href: '/about', arrow: '→' },
  { no: '04', title: 'High value, low volume', text: 'We follow Bhutan’s tourism policy: socially, culturally and environmentally responsible.', href: '/about', arrow: '→' }
];

function ElevSpark({ j, prog }: { j: Journey; prog: number }) {
  const pts = j.route.map(id => byId[id]); const W = 400, H = 90, mx = 3400, mn = 800;
  const xy = pts.map((d, i) => [i / (pts.length - 1) * (W - 20) + 10, H - 18 - (d.alt - mn) / (mx - mn) * (H - 34)]);
  const n = Math.floor(prog), t = prog - n; const vis = xy.slice(0, n + 1);
  if (n < xy.length - 1) vis.push([xy[n][0] + (xy[n + 1][0] - xy[n][0]) * t, xy[n][1] + (xy[n + 1][1] - xy[n][1]) * t]);
  const line = (a: number[][]) => a.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
  const maxA = Math.max(...pts.map(d => d.alt)), minA = Math.min(...pts.map(d => d.alt));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <path d={line(xy)} fill="none" stroke="rgba(245,241,232,.25)" strokeWidth={1} strokeDasharray="2 3" />
      <path d={line(vis)} fill="none" stroke="#e3a23a" strokeWidth={1.6} />
      {xy.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r={2.4} fill={i <= prog + 0.01 ? '#e3a23a' : '#0f0e0b'} stroke="#e3a23a" strokeWidth={1} />
          {(i === 0 || pts[i].alt === maxA || pts[i].alt === minA) && (
            <text x={p[0]} y={p[1] - 8} fill="rgba(245,241,232,.8)" fontSize={8} style={{ fontFamily: 'var(--mono)' }} textAnchor="middle" letterSpacing={1}>{shortU(pts[i]) + ' ' + fmt(pts[i].alt) + 'M'}</text>
          )}
        </g>
      ))}
      <text x={0} y={H} fill="rgba(245,241,232,.55)" fontSize={8} style={{ fontFamily: 'var(--mono)' }} letterSpacing={1.2}>ELEVATION PROFILE · APPROX.</text>
    </svg>
  );
}

export default function Home() {
  const router = useTransitionRouter();
  const { vh } = useViewport();
  const heroRef = useRef<HTMLElement>(null), vidRef = useRef<HTMLVideoElement>(null), kRef = useRef<HTMLElement>(null);
  const jRef = useRef<HTMLElement>(null), endRef = useRef<HTMLElement>(null), endVidRef = useRef<HTMLVideoElement>(null);
  const vrefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const [ready, setReady] = useState(false);
  const [sound, setSound] = useState(false);
  const [mHover, setMHover] = useState('punakha');
  const [choice, setChoice] = useState(-1);
  const [endIn, setEndIn] = useState(false);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const v = vidRef.current;
    if (v && !reduce) { v.muted = true; v.src = media.heroVideo; v.play().catch(() => {}); }
    const tm = setTimeout(() => setReady(true), 150);
    const io = new IntersectionObserver(es => es.forEach(e => {
      const ev = endVidRef.current;
      if (e.isIntersecting) { setEndIn(true); if (ev && !reduce) { if (!ev.getAttribute('src')) ev.src = media.riverVideo; ev.muted = true; ev.play().catch(() => {}); } }
      else if (ev) ev.pause();
    }), { threshold: 0.35 });
    if (endRef.current) io.observe(endRef.current);
    return () => { clearTimeout(tm); io.disconnect(); };
  }, []);

  // 01 — film
  const hp = stickyProgress(heroRef, vh);
  const letters = 'BHUTAN'.split('').map((ch, i) => {
    const o = i - 2.5;
    return { ch, x: (o * hp * 16).toFixed(2) + 'vw', y: (Math.abs(o) * hp * -6 + hp * -4).toFixed(2) + 'vh', op: ready ? Math.max(0, 1 - hp * 1.25) : 0, delay: (0.6 + i * 0.12) + 's' };
  });
  const metaOp = ready ? Math.max(0, 1 - hp * 2) : 0, tagOp = ready ? Math.max(0, 1 - hp * 2.4) : 0;

  // 02 — you don't simply visit
  const kp = stickyProgress(kRef, vh); const kIdx = Math.min(3, Math.floor(kp * 4));

  // 03 — map teaser
  const md = byId[mHover || 'punakha'];

  // 05 — featured journey
  const j = journeys[0];
  const jv = inViewProgress(jRef, vh);
  const jProg = Math.max(0, Math.min(j.route.length - 1, (jv - 0.25) / 0.45 * (j.route.length - 1)));

  const toggleSound = () => { const v = vidRef.current; const next = !sound; if (v) v.muted = !next; setSound(next); };

  return (
    <>
      <Nav />

      <section ref={heroRef} className={s.hero} aria-label="Film">
        <div className={s.sticky}>
          <video ref={vidRef} className={s.video} playsInline loop muted preload="metadata" poster={media.heroPoster} style={{ transform: `scale(${(1 + hp * 0.12).toFixed(3)})` }} />
          <div className={s.vignette} />
          <div className={s.fill} style={{ opacity: (hp * 0.55).toFixed(3) }} />
          <div className={s.curtain} style={{ opacity: ready ? 0 : 1 }} />
          <div className={s.coords} style={{ opacity: metaOp }}>
            <div>27.5142° N</div><div>90.4336° E</div>
            <div className={s.coordsRule} />
          </div>
          <div className={s.druk} style={{ opacity: metaOp }}>
            <div>DRUK YUL</div><div>LAND OF THE THUNDER DRAGON</div>
          </div>
          <div className={s.wordWrap}>
            <h1 className={s.word} aria-label="Bhutan">
              {letters.map((l, i) => (
                <span key={i} aria-hidden="true" className={s.letter} style={{ transform: `translate(${l.x},${l.y})`, opacity: l.op.toFixed(3), transition: `opacity 1.4s ease ${l.delay}` }}>{l.ch}</span>
              ))}
            </h1>
          </div>
          <div className={s.tagWrap} style={{ opacity: tagOp }}>
            <p className={s.tag}>WHERE PROGRESS IS MEASURED IN HAPPINESS</p>
          </div>
          <div className={s.heroBottom} style={{ opacity: tagOp }}>
            <span>FILM 01 — HIMALAYAN RIVER VALLEY</span>
            <a href="#kingdom" data-cursor="ENTER" className={s.enter}>ENTER THE KINGDOM<span className={s.enterLine} /></a>
            <button onClick={toggleSound} className={s.sound} aria-pressed={sound}>SOUND <span style={{ color: sound ? '#e3a23a' : 'rgba(245,241,232,.75)' }}>{sound ? 'ON' : 'OFF'}</span></button>
          </div>
        </div>
      </section>

      <section id="kingdom" ref={kRef} className={s.kingdom} aria-label="You don’t simply visit">
        <div className={s.sticky}>
          {K_DATA.map((d, i) => {
            const on = i === kIdx;
            return (
              <div key={d.k} className={s.slide} style={{ opacity: on ? 1 : 0 }}>
                <Photo src={d.img} alt={d.alt} className={s.slideImg} priority={i === 0} style={{ transform: `scale(${on ? 1 : 1.08}) translateY(${on ? ((kp * 4 - i - 0.5) * -3).toFixed(2) + '%' : '0%'})` }} />
                <div className={s.slideShade} />
              </div>
            );
          })}
          <div className={s.slideTexts}>
            {K_DATA.map((d, i) => {
              const on = i === kIdx;
              return (
                <div key={d.k} className={s.slideText} aria-hidden={!on}>
                  <div className={s.kicker} style={{ opacity: on ? 1 : 0 }}>{d.k}</div>
                  <h2 className={s.kHead}>
                    {parseWords(d.t).map(w => {
                      const dl = on ? (0.08 * w.j + 0.2) + 's' : '0s';
                      return (
                        <span key={w.j} className={s.kWord} style={{
                          fontStyle: w.it ? 'italic' : 'normal', opacity: on ? 1 : 0,
                          transform: `translateY(${on ? '0' : (i < kIdx ? '-60px' : (40 + (w.j % 3) * 30) + 'px')})`, filter: `blur(${on ? '0px' : '8px'})`,
                          transition: `opacity .9s ease ${dl}, transform 1.1s cubic-bezier(.2,.7,.2,1) ${dl}, filter .9s ease ${dl}`
                        }}>{w.t}</span>
                      );
                    })}
                  </h2>
                </div>
              );
            })}
          </div>
          <div className={s.kCounter}>
            <span>{String(kIdx + 1).padStart(2, '0')}</span>
            <span className={s.kTrack}><span className={s.kBar} style={{ width: ((kIdx + 1) / 4 * 100) + '%' }} /></span>
            <span>04</span>
          </div>
          <div className={s.kCaption}>{K_DATA[kIdx].cap}</div>
        </div>
      </section>

      <section className={s.mapSec} aria-label="Map teaser">
        <div className={s.mapText}>
          <div className={s.eyebrow}>03 — THE SHAPE OF THE KINGDOM</div>
          <h2 className={s.mapHead}>A kingdom<br />between earth<br /><em>and sky.</em></h2>
          <div className={s.facts}>
            <span className={s.factK}>AREA</span><span className={s.factK}>HIGHEST PEAK</span><span className={s.factK}>DZONGKHAGS</span>
            <span className={s.factV}>38,394 km²</span><span className={s.factV}>7,570 m</span><span className={s.factV}>20</span>
          </div>
          <p className={s.mapP}>Shaded from real elevation data. Hover a valley to look inside it — the subtropical south rises to Gangkhar Puensum in barely 170 kilometres.</p>
          <TLink href="/interactive-map" data-cursor="EXPLORE" className={s.mapCta}>ENTER THE INTERACTIVE MAP <span className={s.mono}>→</span></TLink>
        </div>
        <div className={s.mapBox}>
          <BhutanMap markers={TEASER} hoverId={mHover} onHover={id => id && setMHover(id)} onSelect={id => router.push(byId[id].page)} labels="all"
            style={{ position: 'absolute', inset: '0 -12% 0 -6%' }} />
          <TLink href={md.page} data-cursor="OPEN" className={s.card} style={{ opacity: mHover ? 1 : 0, transform: `translateX(${mHover ? '0' : '40px'})` }}>
            <div className={s.cardImg}><Photo src={md.img || brand.undiscovered} alt={md.name} className={s.cardImgInner} vt={'dest-' + md.id} sizes="300px" /></div>
            <div className={s.cardRow}><span className={s.cardName}>{md.name}</span><span className={s.cardAlt}>{fmt(md.alt)} M</span></div>
            <div className={s.cardKind}>{md.kind.toUpperCase()}</div>
            <div className={s.cardTags}>{md.tags.join(' · ').toUpperCase()}</div>
          </TLink>
        </div>
      </section>

      <section id="experiences" className={s.choose} aria-label="Choose">
        {CHOICES.map((c, i) => {
          const on = choice === i;
          const enter = () => {
            setChoice(i);
            const v = vrefs[i].current;
            if (v && c.video && !prefersReducedMotion()) { if (!v.getAttribute('src')) v.src = c.video; v.muted = true; v.play().catch(() => {}); }
          };
          const leave = () => { setChoice(-1); vrefs[i].current?.pause(); };
          return (
            <TLink key={c.no} href={c.href} onMouseEnter={enter} onMouseLeave={leave} data-cursor="ENTER" className={s.panel} style={{ flex: `${on ? 2.2 : 1} 1 300px` }}>
              <Photo src={c.img} alt={c.name} className={s.panelImg} sizes="(max-width: 900px) 100vw, 60vw"
                style={{ transform: `scale(${on ? 1.02 : 1.12})`, filter: `grayscale(${choice >= 0 && !on ? 0.7 : 0}) brightness(${on ? 0.9 : 0.62})` }} />
              {c.video && <video ref={vrefs[i]} className={s.panelVideo} playsInline loop muted preload="none" style={{ opacity: on ? 1 : 0 }} />}
              <div className={s.panelShade} />
              <div className={s.panelText}>
                <div className={s.panelNo}>{c.no}</div>
                <div className={s.panelVerb} style={{ fontStyle: on ? 'italic' : 'normal' }}>{c.verb}</div>
                <div className={s.panelRow}><span>{c.name}</span><span className={s.panelArrow} style={{ opacity: on ? 1 : 0 }}>EXPLORE →</span></div>
                <p className={s.panelP} style={{ opacity: on ? 1 : 0 }}>{c.text}</p>
              </div>
            </TLink>
          );
        })}
      </section>

      <section ref={jRef} className={s.fj} aria-label="Featured journey">
        <div className={s.fjImgCol}>
          <Photo src={j.img} alt="Punakha Dzong at the confluence of the Pho Chhu and Mo Chhu" className={s.fjImg} style={{ transform: `translateY(${((jv - 0.5) * -8).toFixed(2)}%)` }} />
          <div className={s.fjShade} />
          <div className={s.fjMeta}>PUNAKHA DZONG<br />27.5815° N · 89.8631° E<br />1,200 M</div>
          <div className={s.fjDays}>11<span className={s.fjDaysU}>DAYS</span></div>
        </div>
        <div className={s.fjSide}>
          <div className={s.fjEyebrow}>05 — FEATURED · JOURNEY {j.no}</div>
          <h2 className={s.fjHead}>Valleys of the <em>Thunder Dragon</em></h2>
          <p className={s.fjLine}>{j.line}</p>
          <div className={s.fjMap}>
            <BhutanMap route={j.route} markers={[...new Set(j.route)]} flights={j.flight} progress={jProg} labels="none" graticule={false} districts={false} />
          </div>
          <div className={s.fjRoute}>{j.route.map(id => shortU(byId[id])).join(' → ')}</div>
          <div className={s.fjElev}><ElevSpark j={j} prog={jProg} /></div>
          <TLink href={journeyHref(j)} data-cursor="ENTER" className={s.fjCta}>ENTER THE JOURNEY <span className={s.mono}>→</span></TLink>
        </div>
      </section>

      <section className={s.people} aria-label="People">
        <div className={s.portraitWrap}>
          <Photo src={brand.people} alt="Bhutanese people in traditional dress" className={s.portrait} sizes="(max-width: 900px) 100vw, 50vw" />
          <div className={s.redCorner} />
          <div className={s.credit}>PHOTOGRAPH · BMV TOURS &amp; TREKS</div>
        </div>
        <div>
          <div className={s.peopleEyebrow}>06 — PEOPLE OF BHUTAN</div>
          <blockquote className={s.quote}>“You arrive as a guest. <em>You leave as family.</em>”</blockquote>
          <p className={s.peopleP}>BMV is Bhutanese, family-owned and run from Babesa, Thimphu. Our guides grew up in these valleys. They know which farmhouse is lighting its hot-stone bath tonight, and when the monks at Gangtey begin evening prayer.</p>
          <TLink href="/about" className={s.meet}>MEET THE FAMILY <span className={s.mono}>→</span></TLink>
        </div>
      </section>

      <section className={s.steps} aria-label="Not pre-written">
        <div className={s.stepsEyebrow}>07 — YOUR JOURNEY IS NOT PRE-WRITTEN</div>
        <div className={s.stepGrid}>
          {STEPS.map(st => (
            <div key={st.no} className={s.step}>
              <div className={s.stepNo}>{st.no}</div>
              <div className={s.stepQ}>{st.q}</div>
              <div className={s.stepA}>{st.a}</div>
            </div>
          ))}
        </div>
        <TLink href="/build-your-journey" data-cursor="BEGIN" className={s.buildBig}>
          <span className={s.buildWord}>Build your<br /><em>Bhutan</em></span>
          <span className={s.buildArrow}>→</span>
        </TLink>
      </section>

      <section className={s.trust} aria-label="Trust">
        <div className={s.trustHeadRow}>
          <h2 className={s.trustHead}>In good<br /><em>hands.</em></h2>
          <p className={s.trustP}>Licensed in Bhutan and affiliated with the Association of Bhutanese Tour Operators, the Guides Association of Bhutan and the Hotel &amp; Restaurant Association of Bhutan.</p>
        </div>
        <div className={s.trustList}>
          {TRUST.map(t => (
            <TLink key={t.no} href={t.href} className={s.trustRow}>
              <span className={s.trustNo}>{t.no}</span>
              <span className={s.trustTitle}>{t.title}</span>
              <span className={s.trustText}>{t.text}</span>
              <span className={s.trustArrow}>{t.arrow}</span>
            </TLink>
          ))}
        </div>
      </section>

      <section ref={endRef} className={s.end} aria-label="Begin">
        <video ref={endVidRef} className={s.endVideo} playsInline loop muted preload="none" poster={img('punakha', 0)} />
        <div className={s.endShade} />
        <div className={s.endInner}>
          <div className={s.endLine} style={{ opacity: endIn ? 1 : 0, transform: `translateY(${endIn ? '0' : '40px'})` }}>Some places change your plans.</div>
          <div className={`${s.endLine} ${s.endLine2}`} style={{ opacity: endIn ? 1 : 0, transform: `translateY(${endIn ? '0' : '40px'})` }}>Bhutan changes your perspective.</div>
          <TLink href="/build-your-journey" data-cursor="BEGIN" className={s.endCta} style={{ opacity: endIn ? 1 : 0 }}>BEGIN YOUR JOURNEY <span className={s.mono}>→</span></TLink>
        </div>
      </section>
      <Footer />
    </>
  );
}
