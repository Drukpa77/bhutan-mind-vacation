'use client';
import { useEffect, useRef } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Photo from '@/components/Photo';
import TLink from '@/components/TLink';
import { brand, pad2 } from '@/content';
import { useViewport } from '@/lib/hooks';
import s from './About.module.css';

const CHAPTERS: [k: string, title: string, text: string, img: string][] = [
  ['FAMILY-OWNED', 'Run from home', 'Bhutan Mind Vacation is owned and operated by a Bhutanese family in Babesa, Thimphu. When you write to us, you are writing to the people who will look after you.', brand.happiness],
  ['PRIVATE GUESTS', 'Experiences most visitors miss', 'We travel with you as hosts: a farmhouse dinner, a monk’s blessing, a village archery match. Personal care and attention to detail from a small, well-trained team.', brand.culture],
  ['LOCAL EXPERTISE', 'Guides from these valleys', 'Our guides are licensed, Bhutanese, and grew up in the places you’ll visit. They know the trails, the festivals, and which pass is open this week.', brand.trekking],
  ['TAILOR-MADE', 'No two journeys alike', 'Cultural, wellness, trekking, pilgrimage, adventure or that long-awaited anniversary. Action-packed or serene — designed with you, not for you.', brand.custom]
];

const TIMELINE = [
  { y: '2005', t: 'Joins a renowned Bhutanese tour agent as assistant to sales and ground operations.' },
  { y: '—', t: 'Promoted to ground operations manager.' },
  { y: '—', t: 'Registers as a professional tour guide; travels every corner of Bhutan.' },
  { y: '2012', t: 'Founds Bhutan Mind Vacation Tours and Treks.' },
  { y: '2024', t: 'Tripadvisor Travellers’ Choice award.' }
];

const PILLARS = [
  { t: 'Socially acceptable', d: 'Tours designed to respect the communities we visit, with fair work for local guides, drivers and homestay families.' },
  { t: 'Culturally respectful', d: 'We brief every guest on etiquette in dzongs, temples and homes.' },
  { t: 'Environmentally friendly', d: 'Bhutan is carbon-negative and keeps most of its land under forest. We travel lightly to keep it that way.' },
  { t: 'Gross National Happiness', d: 'His Majesty Jigme Singye Wangchuck’s philosophy of putting people and balance at the centre of development guides how we work.' }
];

export default function About({ anchor }: { anchor?: string }) {
  const { y, vh } = useViewport();
  const storyRef = useRef<HTMLElement>(null);
  const chRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
  }, [anchor]);

  // Active chapter: the last one whose top has passed 60% of the viewport (works for both the side-by-side and stacked layouts).
  let ch = 0;
  chRefs.current.forEach((a, i) => { if (a && a.getBoundingClientRect().top < vh * 0.6) ch = i; });

  return (
    <>
      <Nav tone="dark" />
      <main id="main" tabIndex={-1} className={s.main}>
        <header className={s.intro} data-screen-label="About intro">
          <div className={s.eyebrow}>ABOUT · BMV TOURS &amp; TREKS · SINCE 2012</div>
          <h1 className={s.h1}>A Bhutanese family,<br /><em>at your service.</em></h1>
          <div className={s.anchors} role="navigation" aria-label="On this page">
            <TLink href="#story">OUR STORY</TLink><TLink href="#founder">THE FOUNDER</TLink><TLink href="#responsible">RESPONSIBLE TRAVEL</TLink>
          </div>
        </header>
        <div className={s.heroBox}>
          <Photo src={brand.people} alt="Bhutanese people in traditional dress" className={s.heroImg} priority style={{ transform: `translateY(${(Math.min(y, 900) * -0.08).toFixed(1)}px)` }} />
        </div>

        <section id="story" ref={storyRef} className={s.story} data-screen-label="Our story">
          <div className={s.storySticky} aria-hidden="true">
            {CHAPTERS.map(([, title, , im], i) => <Photo key={title} src={im} alt="" className={s.chImg} sizes="(max-width: 800px) 100vw, 50vw" style={{ opacity: i === ch ? 1 : 0 }} />)}
            <div className={s.chNo}>{pad2(ch + 1)} / 04</div>
          </div>
          <div>
            {CHAPTERS.map(([k, title, text], i) => (
              <article key={title} ref={a => { chRefs.current[i] = a; }} className={s.chapter}>
                <div className={s.eyebrow}>{k}</div>
                <h2 className={s.chH2}>{title}</h2>
                <p className={s.chP}>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="founder" className={s.founder} data-screen-label="Founder">
          <div className={s.founderGrid}>
            <div>
              <Photo src={brand.founder} alt="Tshering Dorji, founder of Bhutan Mind Vacation" className={s.portrait} sizes="(max-width: 800px) 100vw, 45vw" />
              <div className={s.caption}>TSHERING DORJI · FOUNDER &amp; CEO</div>
            </div>
            <div>
              <div className={s.eyebrowDark}>THE FOUNDER</div>
              <blockquote className={s.quote}>“People need some breathing space, which is often lost in the chaos of this crazy modern world.”</blockquote>
              <p className={s.bio}>Tshering Dorji began in Bhutan’s travel industry in 2005, became a licensed guide, and walked the kingdom’s great treks — Jomolhari, Laya–Lingshi, the Druk Path, Dagala Thousand Lakes. Friendships with the travellers he guided took him across Europe, America, Asia and Australia. In 2012 he founded Bhutan Mind Vacation for people looking for serenity, happiness and a spiritual journey — while giving back to the country and its people.</p>
              <div className={s.timeline}>
                {TIMELINE.map((t, i) => <div key={i} className={s.tRow}><span className={s.tY} aria-hidden={t.y === '—'}>{t.y}</span><span className={s.tT}>{t.t}</span></div>)}
              </div>
            </div>
          </div>
        </section>

        <section id="responsible" className={s.resp} data-screen-label="Responsible travel">
          <div className={s.respGrid}>
            <div>
              <div className={s.eyebrow}>RESPONSIBLE TRAVEL</div>
              <h2 className={s.respH2}>High value,<br /><em>low volume.</em></h2>
            </div>
            <div>
              {PILLARS.map((p, i) => (
                <div key={p.t} className={s.pillar}>
                  <span className={s.pNo} aria-hidden="true">{pad2(i + 1)}</span>
                  <div><div className={s.pT}>{p.t}</div><p className={s.pD}>{p.d}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
