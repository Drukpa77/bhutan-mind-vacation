'use client';
import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import TLink from '@/components/TLink';
import { pad2 } from '@/content';
import { planFaq, planPaths, planSections } from '@/content/plan';
import s from './Plan.module.css';

export default function Plan({ anchor }: { anchor?: string }) {
  const [open, setOpen] = useState(0);

  useEffect(() => {
    if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
  }, [anchor]);

  return (
    <>
      <Nav tone="dark" solid />
      <main id="main" tabIndex={-1} className={s.main}>
        <header className={s.intro} data-screen-label="Plan intro">
          <div>
            <div className={s.eyebrow}>PLAN YOUR TRIP</div>
            <h1 className={s.h1}>Everything,<br /><em>calmly.</em></h1>
          </div>
          <p className={s.lead}>Bhutan asks a little more planning than most places. We handle the visa, permits and logistics; here’s what’s useful to know before you ask.</p>
        </header>

        <nav className={s.paths} data-screen-label="Pathways" aria-label="Plan sections">
          {planPaths.map(([title, href, sub], i) => (
            <TLink key={title} href={href} className={s.path}>
              <span className={s.pathNo} aria-hidden="true">{pad2(i + 1)}</span>
              <span className={s.pathTitle}>{title}</span>
              <span className={s.pathSub}>{sub}</span>
            </TLink>
          ))}
        </nav>

        <div>
          {planSections.map((sec, i) => (
            <section key={sec.id} id={sec.id} className={s.section}>
              <div>
                <div className={s.secNo}>{pad2(i + 2)}</div>
                <h2 className={s.h2}>{sec.title}</h2>
              </div>
              <div className={s.items}>
                {sec.items.map(([k, v]) => (
                  <div key={k} className={s.item}><span className={s.itemK}>{k}</span><span className={s.itemV}>{v}</span></div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section id="faq" className={s.faq} data-screen-label="FAQ">
          <h2 className={s.faqH2}>Questions<br /><em>people ask</em></h2>
          <div className={s.items}>
            {planFaq.map(([q, a], i) => (
              <div key={q} className={s.qa}>
                <h3 className={s.qH}>
                  <button type="button" id={`faq-q${i}`} onClick={() => setOpen(open === i ? -1 : i)} className={s.q} aria-expanded={open === i} aria-controls={`faq-a${i}`}>
                    {q}<span className={s.plus} aria-hidden="true" style={{ transform: `rotate(${open === i ? 45 : 0}deg)` }}>+</span>
                  </button>
                </h3>
                <div id={`faq-a${i}`} role="region" aria-labelledby={`faq-q${i}`} aria-hidden={open !== i} className={s.aWrap} style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}><div className={s.aInner}><p className={s.a}>{a}</p></div></div>
              </div>
            ))}
          </div>
        </section>

        <section className={s.ready}>
          <div className={s.readyH}>Ready when you are.</div>
          <TLink href="/build-your-journey" className={s.readyBtn}>BUILD YOUR JOURNEY <span aria-hidden="true">→</span></TLink>
        </section>
      </main>
      <Footer />
    </>
  );
}
