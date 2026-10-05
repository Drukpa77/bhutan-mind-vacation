'use client';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import BhutanMap from '@/components/BhutanMap';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Photo from '@/components/Photo';
import TLink from '@/components/TLink';
import { brand, byId, destinationCopy, destinations, destinationVariant, fmt, img, journeyHref, journeysThrough, shortU } from '@/content';
import { clamp01, stickyProgress, useViewport } from '@/lib/hooks';
import s from './Destination.module.css';

const MIST: [l: number, t: number, size: number, dir: number][] = [[-10, 10, 70, -1], [40, -10, 80, 1], [10, 40, 90, -1], [55, 45, 75, 1], [20, 70, 85, 0]];

function Mist() {
  const { vh } = useViewport();
  const ref = useRef<HTMLElement>(null);
  const mp = stickyProgress(ref, vh);
  const reveal = Math.min(1, mp / 0.5);
  const step = (a: number, b: number) => clamp01((mp - a) / (b - a));
  const t1 = step(0.5, 0.62), t2 = step(0.64, 0.76), t3 = step(0.78, 0.9);
  const rise = (t: number) => ({ opacity: t.toFixed(2), transform: `translateY(${(1 - t) * 30}px)` });
  return (
    <section ref={ref} className={s.mist} data-screen-label="Tiger's Nest">
      <div className={s.mistSticky}>
        <Photo src={img('taktsang', 0)} alt="Paro Taktsang on its cliff" className={s.fill} sizes="100vw"
          style={{ transform: `scale(${(1.25 - reveal * 0.2).toFixed(3)})`, filter: `blur(${((1 - reveal) * 10).toFixed(1)}px) saturate(${(0.5 + reveal * 0.5).toFixed(2)})` }} />
        {MIST.map(([l, t, sz, dir], i) => (
          <div key={i} className={s.blob} style={{ left: l + '%', top: t + '%', width: sz + 'vw', height: sz + 'vw', transform: `translate(${dir * reveal * 70}vw,${-reveal * (30 + i * 10)}vh)`, opacity: (1 - reveal * 0.95).toFixed(2) }} />
        ))}
        <div className={s.fill} style={{ background: `rgba(232,234,230,${((1 - reveal) * 0.75).toFixed(2)})` }} />
        <div className={s.mistShade} style={{ opacity: step(0.45, 0.6).toFixed(2) }} />
        <div className={s.mistText}>
          <div className={s.mistKicker} style={rise(t1)}>TIGER’S NEST</div>
          <div className={s.mistTitle} style={rise(t1)}>Paro Taktsang</div>
          <div className={s.mistFacts}>
            <div style={rise(t2)}><div className={s.mistK}>ALTITUDE</div><div className={s.mistV}>~3,120 m</div></div>
            <div style={rise(t2)}><div className={s.mistK}>ABOVE THE VALLEY</div><div className={s.mistV}>~900 m</div></div>
            <div style={{ ...rise(t3), maxWidth: 420 }}><div className={s.mistK}>THE TRAIL</div><div className={s.mistTrail}>Through blue pine and prayer flags, past the halfway cafeteria viewpoint, then down and up steps across the gorge. Allow most of a day. Built in 1692 around Guru Rinpoche’s meditation cave; restored after a fire in 1998.</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Destination({ id }: { id: string }) {
  const dd = byId[id] || byId.paro;
  const { y } = useViewport();
  const router = useRouter();
  const V = destinationVariant(dd.id);
  const light = V === 'still' || V === 'editorial';
  const [head, body] = destinationCopy[dd.id] || [dd.kind, dd.line];
  const pic = dd.img || brand.undiscovered, pic2 = dd.img2 || dd.img || brand.nature;
  const altLabel = '~' + fmt(dd.alt) + ' M', coords = dd.lat.toFixed(4) + '° N · ' + dd.lon.toFixed(4) + '° E';
  const kindU = dd.kind.toUpperCase(), regionU = dd.region.toUpperCase(), nameU = shortU(dd);
  const imgVt = 'dest-' + dd.id, wordVt = { viewTransitionName: 'word-' + dd.id };
  const bg = light ? (V === 'still' ? '#f5f1e8' : '#ece4d4') : '#0f0e0b', fg = light ? '#1b1a16' : '#f5f1e8';
  const acc = light ? '#8f2b1f' : '#e3a23a', line = light ? 'rgba(27,26,22,.15)' : 'rgba(245,241,232,.12)';
  const hasMist = dd.id === 'paro' || dd.id === 'taktsang';
  const near = destinations.filter(x => Math.hypot(x.lon - dd.lon, x.lat - dd.lat) < 0.75).map(x => x.id);

  return (
    <>
      <Nav tone={light ? 'dark' : 'light'} />
      <main id="main" tabIndex={-1} className={s.main} style={{ background: bg, color: fg }}>
        {V === 'vertical' && (
          <header className={s.vHero} data-screen-label="Hero vertical">
            <div className={s.vLeft}>
              <TLink href="/destinations" className={s.backDark}>← DESTINATIONS · {regionU}</TLink>
              <h1 className={s.vH1} style={wordVt}>{dd.name}</h1>
              <div className={s.vRuleRow}>
                <div className={s.vRule} />
                <div className={s.meta}>{altLabel}<br />{coords}<br />{kindU}</div>
              </div>
            </div>
            <div className={s.vRight}><Photo src={pic} alt={dd.name} className={s.fill} vt={imgVt} priority sizes="(max-width: 760px) 100vw, 50vw" /></div>
          </header>
        )}

        {V === 'still' && (
          <>
            <header className={s.sHero} data-screen-label="Hero still">
              <div className={s.sTop}><TLink href="/destinations" className={s.backLight}>← DESTINATIONS</TLink><span>{coords} · {altLabel}</span></div>
              <h1 className={s.sH1} style={wordVt}>{dd.name}</h1>
              <p className={s.sLine}>{dd.line}</p>
            </header>
            <div className={s.sWide}><Photo src={pic} alt={dd.name} className={s.fullBox} vt={imgVt} priority style={{ transform: `scale(${(1 + Math.min(y, 1200) / 12000).toFixed(4)})` }} /></div>
          </>
        )}

        {V === 'editorial' && (
          <header className={s.eHero} data-screen-label="Hero editorial">
            <div className={s.eTop}><TLink href="/destinations" className={s.backLight}>← DESTINATIONS</TLink><span>{kindU}</span><span>{altLabel}</span></div>
            <h1 className={s.eH1} style={wordVt}>{dd.name}</h1>
            <div className={s.eMain}><Photo src={pic} alt={dd.name} className={s.eImg} vt={imgVt} priority sizes="(max-width: 900px) 100vw, 58vw" /></div>
            <div className={s.eSide}>
              <p className={s.eLine}>{dd.line}</p>
              <Photo src={pic2} alt={dd.name} className={s.eImg2} sizes="25vw" />
            </div>
          </header>
        )}

        {V === 'default' && (
          <header className={s.dHero} data-screen-label="Hero">
            <Photo src={pic} alt={dd.name} className={s.fill} vt={imgVt} priority />
            <div className={s.dShade} />
            <TLink href="/destinations" className={s.dBack}>← DESTINATIONS · {regionU}</TLink>
            <div className={s.dBottom}>
              <h1 className={s.dH1} style={wordVt}>{dd.name}</h1>
              <div className={`${s.meta} ${s.dMeta}`}>{altLabel}<br />{coords}<br />{kindU}</div>
            </div>
          </header>
        )}

        {hasMist && <Mist />}

        <section className={s.about} data-screen-label="About the place">
          <div>
            <div className={s.kicker} style={{ color: acc }}>{kindU}</div>
            <h2 className={s.h2}>{head}</h2>
          </div>
          <div>
            <p className={s.body}>{body}</p>
            <div className={s.tags}>{dd.tags.map(t => <span key={t} style={{ borderBottom: `1px solid ${acc}`, paddingBottom: 4 }}>{t.toUpperCase()}</span>)}</div>
          </div>
        </section>

        <section className={s.mapSec} style={{ borderTop: `1px solid ${line}` }} data-screen-label="Map & journeys">
          <div className={s.mapBox} style={{ background: bg }}>
            <BhutanMap variant={light ? 'light' : 'dark'} markers={near} activeId={dd.id} focus={dd.id} zoom={2.6} labels="all" onSelect={i => router.push(byId[i].page)} />
          </div>
          <div className={s.jCol}>
            <div className={s.kicker} style={{ color: acc }}>JOURNEYS THROUGH {nameU}</div>
            {journeysThrough(dd.id).map(j => (
              <TLink key={j.id} href={journeyHref(j)} className={s.jRow} style={{ borderBottom: `1px solid ${line}` }}>
                <span className={s.jTitle}>{j.title}</span>
                <span className={s.jDays}>{j.days} DAYS →</span>
              </TLink>
            ))}
            <TLink href={`/build-your-journey?d=${dd.id}`} className={s.build}>BUILD A JOURNEY WITH {nameU} <span className={s.mono}>→</span></TLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
