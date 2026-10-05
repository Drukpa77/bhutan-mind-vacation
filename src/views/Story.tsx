'use client';
import { useEffect, useState } from 'react';
import BhutanMap from '@/components/BhutanMap';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Photo from '@/components/Photo';
import TLink from '@/components/TLink';
import { byId, destinations, FULL_STORY, img, journeyHref, journeys, stories } from '@/content';
import s from './Story.module.css';

function HiddenGem() {
  return (
    <div className={s.body}>
      <div className={s.col}>
        <p className={s.p}><span className={s.drop}>C</span>ome over the last ridge from Wangdue and the forest simply stops. Below is a wide, flat-floored bowl of grass and marsh, ringed by hills of blue pine — a glacial valley at around 2,900 metres, so open it feels like a held breath.</p>
        <p className={s.p}>This is Phobjikha. Bhutanese call it a sacred place, and it is easy to understand why. On the ridge above the valley floor sits Gangtey Goenpa, the most important Nyingma monastery in western Bhutan, its golden roof catching the first light hours before it reaches the farmhouses below.</p>
      </div>
      <figure className={s.bleed}>
        <Photo src={img('phobjikha', 1)} alt="Phobjikha valley in autumn" className={s.bleedImg} />
        <figcaption className={s.bleedCap}>PHOBJIKHA VALLEY IN AUTUMN · WIKIMEDIA COMMONS</figcaption>
      </figure>
      <div className={s.col}>
        <p className={s.p}>Every year, from late October, black-necked cranes fly in from the Tibetan plateau to spend the winter in the valley’s marshes. They are endangered, shy, and deeply loved here. Local tradition says that when they arrive, they circle Gangtey Goenpa three times before landing — and again before they leave in spring.</p>
      </div>
      <blockquote className={s.pull}>No power lines cross the marsh — <em>so the cranes can land.</em></blockquote>
      <div className={s.col}>
        <p className={s.p}>Electricity came to Phobjikha by underground cable, at the community’s choosing, to keep the flight paths clear. The Royal Society for Protection of Nature runs a small crane information centre at the valley’s edge, with telescopes trained on the marsh.</p>
        <p className={s.p}>Each 11 November the monastery courtyard fills for the Black-necked Crane Festival. Schoolchildren in crane costumes dance for the returning birds, and the whole valley comes to watch.</p>
      </div>
      <div className={s.twoUp}>
        <figure className={s.fig}><Photo src={img('crane', 0)} alt="Black-necked cranes in Phobjikha" className={s.fig1} sizes="(max-width: 700px) 100vw, 50vw" /><figcaption className={s.cap}>BLACK-NECKED CRANES, PHOBJIKHA</figcaption></figure>
        <figure className={s.fig} style={{ marginTop: 40 }}><Photo src={img('gangtey', 0)} alt="Gangtey Goenpa" className={s.fig2} sizes="(max-width: 700px) 100vw, 50vw" /><figcaption className={s.cap}>GANGTEY GOENPA</figcaption></figure>
      </div>
      <div className={s.col}>
        <p className={s.p} style={{ margin: 0 }}>Stay two nights. Walk the Gangtey nature trail down from the monastery through pine and dwarf bamboo to the valley floor. Then do very little at all. That, more than anything, is what Phobjikha is for.</p>
      </div>
    </div>
  );
}

export default function Story({ id }: { id: string }) {
  const st = stories.find(x => x.id === id) || stories[1];
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => { const h = document.documentElement.scrollHeight - window.innerHeight; setP(h > 0 ? window.scrollY / h : 0); };
    window.addEventListener('scroll', on, { passive: true }); on();
    return () => window.removeEventListener('scroll', on);
  }, []);

  const dd = byId[st.dest];
  const j = journeys.find(x => x.route.includes(dd.id)) || journeys[0];
  const full = st.id === FULL_STORY;
  const near = destinations.filter(x => Math.hypot(x.lon - dd.lon, x.lat - dd.lat) < 0.7).map(x => x.id);

  return (
    <>
      <Nav tone="light" />
      <div className={s.progress} aria-hidden="true" style={{ width: (p * 100).toFixed(2) + '%' }} />
      <main id="main" tabIndex={-1}>
      <article className={s.article}>
        <header className={s.hero} data-screen-label="Article hero">
          <Photo src={st.img} alt={st.title} className={s.heroImg} vt="story-hero" priority />
          <div className={s.heroShade} />
          <div className={s.heroText}>
            <TLink href="/stories" className={s.back}><span aria-hidden="true">← </span>STORIES · {st.kicker.toUpperCase()}</TLink>
            <h1 className={s.h1}>{st.title}</h1>
            <p className={s.dek}>{st.dek}</p>
            <div className={s.date}>{st.date} · {full ? '4 MIN READ' : 'FROM THE ARCHIVE'}</div>
          </div>
        </header>

        {full ? <HiddenGem /> : (
          <div className={s.partial}>
            <p className={s.p} style={{ margin: 0 }}>{st.dek}</p>
            <a href={`https://www.bhutanmindvacation.com/blog/${st.orig}`} className={s.orig} target="_blank" rel="noopener">READ THE ORIGINAL ON THE BMV BLOG <span aria-hidden="true">↗</span><span className="bmv-sr"> (opens in a new tab)</span></a>
          </div>
        )}

        <section className={s.related} data-screen-label="Article related">
          <div className={s.mapBox} aria-hidden="true">
            <BhutanMap variant="light" markers={near} activeId={dd.id} focus={dd.id} zoom={2.4} labels="all" />
            <div className={s.loc}>LOCATION · {dd.lat.toFixed(3)}° N {dd.lon.toFixed(3)}° E</div>
          </div>
          <div className={s.relText}>
            <TLink href={dd.page} className={s.relLink}><div className={s.relK}>RELATED DESTINATION</div><div className={s.relV}>{dd.name} →</div></TLink>
            <TLink href={journeyHref(j)} className={s.relLink}><div className={s.relK}>RELATED JOURNEY · {j.days} DAYS</div><div className={s.relV}>{j.title} →</div></TLink>
            <TLink href={`/build-your-journey?d=${dd.id}`} className={s.go}>GO THERE YOURSELF →</TLink>
          </div>
        </section>
      </article>
      </main>
      <Footer />
    </>
  );
}
