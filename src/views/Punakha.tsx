'use client';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import BhutanMap from '@/components/BhutanMap';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Photo from '@/components/Photo';
import TLink from '@/components/TLink';
import { byId, img, journeyHref, journeysThrough, pad2 } from '@/content';
import { clamp01, stickyProgress, useViewport } from '@/lib/hooks';
import s from './Punakha.module.css';

const GALLERY = [
  { title: 'Punakha Dzong', img: img('punakha', 1), text: 'Palace of Great Happiness, at the confluence.', w: 'clamp(300px,36vw,620px)', h: '62vh', y: '-4vh' },
  { title: 'The dzong at rest', img: img('punakha', 2), text: 'Whitewash, red-ochre band, cantilevered bridges.', w: 'clamp(220px,22vw,360px)', h: '44vh', y: '10vh' },
  { title: 'Chimi Lhakhang', img: img('chimi', 0), text: 'The 15th-century temple of the Divine Madman, on a hillock among rice fields.', w: 'clamp(280px,30vw,520px)', h: '54vh', y: '-8vh' },
  { title: 'The Wheel of Life', img: img('punakha', 3), text: 'Murals painted in the dzong’s courtyard galleries.', w: 'clamp(320px,40vw,680px)', h: '40vh', y: '12vh' },
  { title: 'Wangdue Phodrang', img: img('wangdue', 0), text: 'Downstream, the rebuilt dzong on its ridge above the Punatsangchhu.', w: 'clamp(240px,24vw,400px)', h: '58vh', y: '0vh' }
];

const TODO = [
  { title: 'Punakha Dzong', text: 'Cross the cantilever bridge over the Mo Chhu into the courtyards. Built 1637–38.' },
  { title: 'Chimi Lhakhang', text: 'A short walk through rice terraces to the temple of Drukpa Kunley, the Divine Madman.' },
  { title: 'Suspension bridge', text: 'One of the longest in Bhutan, strung with prayer flags above the Pho Chhu.' },
  { title: 'Khamsum Yulley Namgyal Chorten', text: 'A hike through paddy and pine to a chorten consecrated for the kingdom’s wellbeing.' },
  { title: 'Rafting', text: 'Gentle to lively water on the Mo Chhu and Pho Chhu, ending beneath the dzong.' }
];

const NEAR = ['punakha', 'thimphu', 'dochula', 'phobjikha', 'paro'];

function Waves({ p }: { p: number }) {
  const W = 1440, H = 800;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      {[0, 1, 2, 3, 4, 5].map(k => {
        let d = '';
        for (let x = 0; x <= W; x += 12) {
          const y = H * 0.5 + (k - 2.5) * 46 * (1 - p * 0.7) + Math.sin(x / 140 + k * 0.7 + p * 6) * (18 + k * 3);
          d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1);
        }
        return <path key={k} d={d} fill="none" stroke={k % 2 ? '#e3a23a' : '#f5f1e8'} strokeOpacity={0.14 + (k % 2) * 0.1} strokeWidth={1} />;
      })}
    </svg>
  );
}

export default function Punakha() {
  const { y, vh, w } = useViewport();
  const router = useRouter();
  const rivRef = useRef<HTMLElement>(null), galRef = useRef<HTMLElement>(null);
  const rp = stickyProgress(rivRef, vh), gp = stickyProgress(galRef, vh);
  const conv = 1 - Math.pow(1 - Math.min(1, rp / 0.55), 3);
  const meet = clamp01((rp - 0.45) / 0.15), story = clamp01((rp - 0.55) / 0.2);
  const trackW = w * 2.7;

  return (
    <>
      <Nav />
      <main className={s.main}>
        <header className={s.hero} data-screen-label="Punakha hero">
          <Photo src={img('punakha', 0)} alt="Punakha Dzong" className={s.heroImg} vt="dest-punakha" priority style={{ transform: `translateY(${(Math.min(y, 900) * 0.25).toFixed(1)}px) scale(1.06)` }} />
          <div className={s.heroShade} />
          <div className={s.heroL}><TLink href="/destinations" className={s.back}>← DESTINATIONS</TLink><br />06 / 11 · WESTERN BHUTAN</div>
          <div className={s.heroR}>27.5815° N · 89.8631° E<br />~1,200 M<br />SUBTROPICAL VALLEY</div>
          <h1 className={s.word} style={{ viewTransitionName: 'word-punakha' }}>Punakha</h1>
        </header>

        <section ref={rivRef} className={s.rivers} data-screen-label="Two rivers">
          <div className={s.sticky}>
            <div className={s.waves}><Waves p={rp} /></div>
            <div className={s.riverLbls}>
              <span style={{ opacity: (1 - conv).toFixed(2) }}>THE FATHER RIVER</span><span style={{ opacity: (1 - conv).toFixed(2) }}>THE MOTHER RIVER</span>
            </div>
            <div className={s.riverStage}>
              <div className={s.river} style={{ transform: `translateX(calc(-100% - ${((1 - conv) * 22 + 1).toFixed(2)}vw))` }}>Pho Chhu</div>
              <div className={s.river} style={{ fontStyle: 'italic', transform: `translateX(${((1 - conv) * 22 + 1).toFixed(2)}vw)` }}>Mo Chhu</div>
              <div className={s.meet} style={{ opacity: meet.toFixed(2), transform: `translateY(${((1 - meet) * 20).toFixed(1)}px)` }}>MEET HERE</div>
            </div>
            <div className={s.story} style={{ opacity: story.toFixed(2), transform: `translateY(${((1 - story) * 40).toFixed(1)}px)` }}>
              <p className={s.storyLead}>At their confluence, Zhabdrung Ngawang Namgyal built Punakha Dzong in 1637 — the kingdom’s second-oldest fortress, and its capital until 1955.</p>
              <p className={s.storyBody}>The valley sits low and warm. The central monk body still winters here, and in 2011 the King and Queen were married inside these walls. In spring, jacarandas bloom purple against the whitewash.</p>
            </div>
          </div>
        </section>

        <section ref={galRef} className={s.gallery} data-screen-label="River gallery">
          <div className={s.galSticky}>
            <div className={s.galNo}>DOWNSTREAM · {pad2(Math.min(5, Math.floor(gp * 5) + 1))} / 05</div>
            <div className={s.track} style={{ transform: `translateX(${(-gp * trackW * 0.62).toFixed(0)}px)` }}>
              <div className={s.galIntro}>
                <h2 className={s.galH2}>Follow the <em>water.</em></h2>
                <p className={s.galP}>Five places along the rivers, in the order you’d meet them walking downstream.</p>
              </div>
              {GALLERY.map((g, i) => (
                <figure key={g.title} className={s.fig} style={{ width: g.w, transform: `translateY(${g.y})` }}>
                  <div className={s.figImgBox} style={{ height: g.h }}><Photo src={g.img} alt={g.title} className={s.figImg} sizes="40vw" /></div>
                  <figcaption className={s.figCap}><span className={s.figTitle}>{g.title}</span><span className={s.figNo}>{pad2(i + 1)}</span></figcaption>
                  <p className={s.figText}>{g.text}</p>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className={s.valley} data-screen-label="In the valley">
          <div className={s.valleyGrid}>
            <div>
              <div className={s.eyebrow}>IN THE VALLEY</div>
              <h2 className={s.valleyH2}>Warmth, <em>rice &amp; rapids</em></h2>
            </div>
            <div>
              {TODO.map((t, i) => (
                <div key={t.title} className={s.todo}>
                  <span className={s.todoNo}>{pad2(i + 1)}</span>
                  <div><div className={s.todoTitle}>{t.title}</div><p className={s.todoText}>{t.text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={s.mapSec} data-screen-label="Punakha on the map">
          <div className={s.mapBox}>
            <BhutanMap markers={NEAR} activeId="punakha" focus="punakha" zoom={3} labels="all" onSelect={id => router.push(byId[id].page)} />
          </div>
          <div className={s.jCol}>
            <div className={s.eyebrow}>JOURNEYS THROUGH PUNAKHA</div>
            {journeysThrough('punakha').map(j => (
              <TLink key={j.id} href={journeyHref(j)} data-cursor="VIEW" className={s.jRow}>
                <span className={s.jTitle}>{j.title}</span>
                <span className={s.jDays}>{j.days} DAYS →</span>
              </TLink>
            ))}
            <TLink href="/build-your-journey?d=punakha" data-cursor="BEGIN" className={s.build}>BUILD A JOURNEY WITH PUNAKHA <span className={s.mono}>→</span></TLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
