'use client';
import { useState } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Photo from '@/components/Photo';
import TLink from '@/components/TLink';
import { FULL_STORY, stories } from '@/content';
import s from './Stories.module.css';

const KICKERS = [...new Set(stories.map(x => x.kicker))];
const RATIOS = ['4/5', '1/1', '3/4', '5/4'];

export default function Stories() {
  const [k, setK] = useState<string | null>(null);
  const list = stories.filter(x => !k || x.kicker === k);
  const lead = list.find(x => x.id === FULL_STORY) || list[0];
  const rest = list.filter(x => x !== lead);

  return (
    <>
      <Nav tone="dark" solid />
      <main id="main" tabIndex={-1} className={s.main}>
        <header className={s.mast} data-screen-label="Stories masthead">
          <h1 className={s.h1}>Stories <em>from the Kingdom</em></h1>
          <div className={s.kickers} role="group" aria-label="Filter stories">
            {[{ label: 'ALL', v: null as string | null }, ...KICKERS.map(x => ({ label: x.toUpperCase(), v: x }))].map(x => (
              <button key={x.label} type="button" onClick={() => setK(x.v)} className={s.kicker} aria-pressed={k === x.v}
                style={{ background: k === x.v ? '#1b1a16' : 'transparent', color: k === x.v ? '#f5f1e8' : '#1b1a16' }}>{x.label}</button>
            ))}
          </div>
        </header>

        {lead && (
          <TLink href={`/stories/${lead.id}`} data-cursor="READ" className={s.lead}>
            <div className={s.leadImgBox}><Photo src={lead.img} alt={lead.title} className={s.leadImg} vt="story-hero" sizes="(max-width: 900px) 100vw, 66vw" priority /></div>
            <div className={s.leadText}>
              <div className={s.meta}>{lead.kicker.toUpperCase()} · {lead.date}</div>
              <h2 className={s.leadH2}>{lead.title}</h2>
              <p className={s.leadDek}>{lead.dek}</p>
              <span className={s.read} aria-hidden="true">READ THE STORY →</span>
            </div>
          </TLink>
        )}

        <p className="bmv-sr" role="status">{list.length} {list.length === 1 ? 'story' : 'stories'}{k ? ` in ${k}` : ''}</p>
        <div className={s.grid}>
          {rest.map((x, i) => (
            <TLink key={x.id} href={`/stories/${x.id}`} data-cursor="READ" className={`${s.card} ${i % 3 === 1 ? s.cardOffset : ''}`}>
              <div className={s.cardImgBox} style={{ aspectRatio: RATIOS[i % 4] }}><Photo src={x.img} alt={x.title} className={s.cardImg} sizes="(max-width: 700px) 100vw, 33vw" /></div>
              <div className={s.meta} style={{ marginTop: 18 }}>{x.kicker.toUpperCase()} · {x.date}</div>
              <h3 className={s.cardH3}>{x.title}</h3>
              <p className={s.cardDek}>{x.dek}</p>
            </TLink>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
