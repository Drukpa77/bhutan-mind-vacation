'use client';
import { useRef, useState } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import TLink from '@/components/TLink';
import { fmt, pad2 } from '@/content';
import { SDF, visaFees, visaSteps } from '@/content/plan';
import { clamp01, useViewport } from '@/lib/hooks';
import s from './Visa.module.css';

type Key = 'adults' | 'kids' | 'nights';

export default function Visa() {
  const { vh } = useViewport();
  const ref = useRef<HTMLElement>(null);
  const [n, setN] = useState<Record<Key, number>>({ adults: 2, kids: 0, nights: 9 });

  const el = ref.current, r = el?.getBoundingClientRect();
  const p = r ? clamp01((vh * 0.6 - r.top) / r.height) : 0;
  const act = Math.min(4, Math.floor(p * 5.2));
  const sdf = (n.adults * SDF.adult + n.kids * SDF.child) * n.nights, visa = (n.adults + n.kids) * SDF.visa;
  const ch = (k: Key, d: number, min: number, max: number) => () => setN(x => ({ ...x, [k]: Math.max(min, Math.min(max, x[k] + d)) }));
  const ctrls: { label: string; k: Key; min: number; max: number }[] = [
    { label: 'Adults (13+)', k: 'adults', min: 1, max: 12 }, { label: 'Children 6–12', k: 'kids', min: 0, max: 8 }, { label: 'Nights in Bhutan', k: 'nights', min: 1, max: 30 }
  ];

  return (
    <>
      <Nav tone="dark" solid />
      <main id="main" tabIndex={-1} className={s.main}>
        <header className={s.intro} data-screen-label="Visa intro">
          <TLink href="/plan" className={s.back}><span aria-hidden="true">← </span>PLAN YOUR TRIP</TLink>
          <h1 className={s.h1}>The visa,<br /><em>handled.</em></h1>
          <p className={s.lead}>Every visitor except nationals of India, Bangladesh and the Maldives needs a visa, approved before you fly. It sounds complicated. It isn’t, when someone in Thimphu does it for you.</p>
        </header>

        <section ref={ref} className={s.process} data-screen-label="Process">
          <div className={s.line} aria-hidden="true"><div className={s.lineFill} style={{ height: (p * 100).toFixed(1) + '%' }} /></div>
          {visaSteps.map(([title, who, text], i) => {
            const on = i <= act;
            return (
              <div key={title} className={s.step} style={{ opacity: on ? 1 : 0.45 }}>
                <div className={s.dot} aria-hidden="true" style={{ background: on ? '#8f2b1f' : 'transparent', color: on ? '#f5f1e8' : '#8f2b1f' }}>{pad2(i + 1)}</div>
                <div className={s.stepBody}>
                  <div><h2 className={s.stepH}>{title}</h2><div className={s.who}>{who}</div></div>
                  <p className={s.stepText}>{text}</p>
                </div>
              </div>
            );
          })}
        </section>

        <section className={s.help} data-screen-label="We help">
          <div className={s.helpH}>We help handle<br /><em>the process.</em></div>
          <p className={s.helpP}>You send a passport scan. We file the application, pay the fees on your behalf, and send the visa clearance letter to show at check-in and on arrival.</p>
        </section>

        <section className={s.fees} data-screen-label="Fees calculator">
          <div>
            <div className={s.eyebrow}>GOVERNMENT FEES · 2026</div>
            <h2 className={s.feesH}>What goes to Bhutan</h2>
            <div className={s.table}>
              {visaFees.map(([k, v]) => <div key={k} className={s.row}><span>{k}</span><span className={s.rowV}>{v}</span></div>)}
            </div>
            <p className={s.small}>SDF CONCESSION IN PLACE UNTIL 31 AUG 2027. 5% GST ON TOUR SERVICES FROM 1 JAN 2026. RULES CHANGE — WE CONFIRM CURRENT RATES WITH EVERY QUOTE.</p>
          </div>
          <div className={s.calc}>
            <div className={s.eyebrow}>ESTIMATE YOUR FEES</div>
            {ctrls.map(c => (
              <div key={c.k} className={s.ctrl} role="group" aria-labelledby={`visa-${c.k}`}>
                <span className={s.ctrlLabel} id={`visa-${c.k}`}>{c.label}</span>
                <div className={s.stepper}>
                  <button type="button" onClick={ch(c.k, -1, c.min, c.max)} disabled={n[c.k] <= c.min} aria-label={`Decrease ${c.label}`} className={s.sBtn}>−</button>
                  <output className={s.sVal} aria-live="polite" aria-label={`${c.label}: ${n[c.k]}`}>{n[c.k]}</output>
                  <button type="button" onClick={ch(c.k, 1, c.min, c.max)} disabled={n[c.k] >= c.max} aria-label={`Increase ${c.label}`} className={s.sBtn}>+</button>
                </div>
              </div>
            ))}
            <div className={s.totalK} id="visa-total">SDF + VISA FEES, TOTAL</div>
            <output className={s.total} aria-labelledby="visa-total" aria-live="polite">USD {fmt(sdf + visa)}</output>
            <div className={s.breakdown}>SDF USD {fmt(sdf)} + visas USD {visa}. Excludes your journey costs and GST.</div>
          </div>
        </section>
        <section className={s.sources}>SOURCES: DEPARTMENT OF TOURISM, ROYAL GOVERNMENT OF BHUTAN; VISA POLICY OF BHUTAN. LAST CHECKED OCTOBER 2026.</section>
      </main>
      <Footer />
    </>
  );
}
