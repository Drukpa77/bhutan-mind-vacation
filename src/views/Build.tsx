'use client';
import { useEffect, useRef, useState } from 'react';
import BhutanMap from '@/components/BhutanMap';
import Nav from '@/components/Nav';
import Photo from '@/components/Photo';
import { brand, byId, contact, festivals, fmt, img, monthNames, months, pad2 } from '@/content';
import { plan, season } from '@/lib/plan';
import s from './Build.module.css';

type Multi = 'why' | 'interests';
type One = 'who' | 'pace' | 'stay';
interface Step { key: string; q: string; hint: string; bg: string; multi?: Multi; one?: One; opts?: [string, string][]; days?: true; month?: true }

const STEPS: Step[] = [
  { key: 'WHY', q: 'Why Bhutan?', hint: 'CHOOSE ANY THAT FEEL TRUE', bg: img('taktsang', 1), multi: 'why', opts: [['stillness', 'I want stillness'], ['adventure', 'I want adventure'], ['culture', 'I want culture'], ['trek', 'I want to trek'], ['photo', 'I want to photograph it'], ['celebrate', 'I want to celebrate'], ['unsure', 'I’m not sure yet']] },
  { key: 'TIME', q: 'How much time can Bhutan have?', hint: 'DRAG TO CHOOSE', bg: img('dochula', 1), days: true },
  { key: 'WHEN', q: 'When do you want to go?', hint: 'TAP A MONTH ON THE WHEEL', bg: img('phobjikha', 1), month: true },
  { key: 'WHO', q: 'Who is coming?', hint: 'CHOOSE ONE', bg: brand.people, one: 'who', opts: [['Solo', 'Solo'], ['Couple', 'Couple'], ['Family', 'Family'], ['Friends', 'Friends'], ['Private group', 'Private group']] },
  { key: 'PACE', q: 'How do you like to travel?', hint: 'CHOOSE ONE', bg: img('punakha', 2), one: 'pace', opts: [['Slow', 'Slow — fewer places, longer stays'], ['Balanced', 'Balanced'], ['Packed', 'Packed — see it all']] },
  { key: 'STAY', q: 'Where do you want to sleep?', hint: 'CHOOSE ONE', bg: brand.luxury, one: 'stay', opts: [['Comfortable', 'Comfortable 3-star'], ['Boutique', 'Boutique 4-star'], ['Luxury', 'Luxury lodges'], ['Farmhouse', 'Farmhouse homestays']] },
  { key: 'INTERESTS', q: 'What would make it unforgettable?', hint: 'CHOOSE ANY', bg: img('parotsechu', 2), multi: 'interests', opts: ['Dzongs & temples', 'Hikes', 'Festivals', 'Food', 'Textiles', 'Birds & wildlife', 'Hot-stone baths', 'Archery', 'Rafting'].map(x => [x, x] as [string, string]) }
];

interface State { why: string[]; interests: string[]; who: string | null; pace: string | null; stay: string | null }

export default function Build({ initialDays = 10, extra = null }: { initialDays?: number; extra?: string | null }) {
  const [step, setStep] = useState(0);
  const [days, setDays] = useState(initialDays);
  const [month, setMonth] = useState(9);
  const [sel, setSel] = useState<State>({ why: [], interests: [], who: null, pace: null, stay: null });
  const [anim, setAnim] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const raf = useRef(0);

  const req: Record<number, unknown> = { 0: sel.why.length, 3: sel.who, 4: sel.pace, 5: sel.stay };
  const ready = req[step] === undefined || !!req[step];

  const animate = () => {
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const tick = (t: number) => { const a = Math.min(1, (t - t0) / 4000); setAnim(a); if (a < 1) raf.current = requestAnimationFrame(tick); };
    raf.current = requestAnimationFrame(tick);
  };
  const go = (dir: number) => {
    const n = Math.max(0, Math.min(7, step + dir));
    setStep(n); if (n === 7) animate(); window.scrollTo(0, 0);
  };
  const goRef = useRef(go); goRef.current = go;
  const readyRef = useRef(ready); readyRef.current = ready;
  const stepRef = useRef(step); stepRef.current = step;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && stepRef.current < 7 && !['INPUT', 'BUTTON', 'A'].includes((e.target as HTMLElement).tagName) && readyRef.current) goRef.current(1);
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); cancelAnimationFrame(raf.current); };
  }, []);

  const cur = STEPS[Math.min(step, 6)];
  const toggle = (k: Multi, v: string) => setSel(p => ({ ...p, [k]: p[k].includes(v) ? p[k].filter(x => x !== v) : [...p[k], v] }));
  const [seasonU, seasonText] = season(month);
  const monthFests = festivals.filter(f => f.month === month);
  const { route, trekOK } = plan({ days, month, why: sel.why, interests: sel.interests, pace: sel.pace, extra });
  const routeIds = [...new Set(route)];
  const rprog = anim * (route.length - 1);
  const valleys = routeIds.filter(id => !['dochula', 'taktsang'].includes(id)).length;
  const regions = new Set(routeIds.map(id => byId[id].region)).size;
  const nights = days - 1;
  const fest = monthFests.find(f => routeIds.includes(f.place)) || monthFests[0];
  const notes = [fest ? `${fest.name} falls in ${months[month]} — we’ll check this year’s lunar dates.` : '', trekOK ? 'Includes the Jomolhari base-camp trek (season permitting).' : '', sel.stay ? `${sel.stay} stays throughout.` : '', sel.pace ? `${sel.pace} pace.` : ''].filter(Boolean).join(' ');
  const summary = `My Bhutan sketch\n${days} days, ${months[month]}\nWho: ${sel.who || '-'} · Pace: ${sel.pace || '-'} · Stay: ${sel.stay || '-'}\nWhy: ${sel.why.join(', ') || '-'}\nInterests: ${sel.interests.join(', ') || '-'}\nRoute: ${routeIds.map(id => byId[id].name).join(' → ')}\n\n${name}`;
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent('My Bhutan — ' + days + ' days')}&body=${encodeURIComponent(summary + (email ? '\n' + email : ''))}`;
  const daysNote = days <= 6 ? 'THE WEST' : days <= 9 ? 'WEST + CENTRAL VALLEYS' : days <= 14 ? 'ACROSS TO BUMTHANG' : 'THE WHOLE KINGDOM';

  return (
    <>
      <Nav />
      <main className={s.main} data-screen-label="Builder">
        {STEPS.map((st, i) => (
          <Photo key={st.key} src={st.bg} className={s.bg} style={{ opacity: step === 7 ? 0 : i === Math.min(step, 6) ? 0.55 : 0, transform: `scale(${i === step ? 1.06 : 1})` }} />
        ))}
        <div className={s.shade} />

        {step < 7 ? (
          <div className={s.steps}>
            <div className={s.progress}>
              <span className={s.stepNo}>{pad2(Math.min(step, 6) + 1)} / 07</span>
              <div className={s.track}><div className={s.trackFill} style={{ width: ((Math.min(step, 6) + 1) / 7 * 100) + '%' }} /></div>
              <span className={s.stepKey}>{cur.key}</span>
            </div>
            <div className={s.body}>
              <h1 className={s.q}>{cur.q}</h1>
              <p className={s.hint}>{cur.hint}</p>

              {cur.opts && (
                <div className={s.opts}>
                  {cur.opts.map(([v, label]) => {
                    const on = cur.multi ? sel[cur.multi].includes(v) : sel[cur.one!] === v;
                    return (
                      <button key={v} className={s.opt} aria-pressed={on} style={{ color: on ? '#e3a23a' : undefined, fontStyle: on ? 'italic' : 'normal' }}
                        onClick={() => cur.multi ? toggle(cur.multi, v) : setSel(p => ({ ...p, [cur.one!]: v }))}>
                        <span className={s.optMark} style={{ opacity: on ? 1 : 0 }}>●</span>{label}
                      </button>
                    );
                  })}
                </div>
              )}

              {cur.days && (
                <div className={s.daysBox}>
                  <div className={s.daysRow}><span className={s.daysNum}>{days}</span><span className={s.daysU}>DAYS · {nights} NIGHTS</span></div>
                  <input type="range" min={4} max={21} step={1} value={days} onChange={e => setDays(+e.target.value)} aria-label="Number of days" className={s.range} />
                  <div className={s.rangeLbls}><span>4</span><span>{daysNote}</span><span>21</span></div>
                </div>
              )}

              {cur.month && (
                <div className={s.monthRow}>
                  <div className={s.wheel}>
                    <div className={s.ring} />
                    <div className={s.needleBox} style={{ transform: `rotate(${month / 12 * 360}deg)` }}><div className={s.needle} /></div>
                    {months.map((m, i) => {
                      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
                      return <button key={m} className={s.month} onClick={() => setMonth(i)} aria-pressed={i === month}
                        style={{ left: (50 + Math.cos(a) * 45) + '%', top: (50 + Math.sin(a) * 45) + '%', color: i === month ? '#e3a23a' : 'rgba(245,241,232,.7)' }}>{m}</button>;
                    })}
                    <div className={s.wheelCentre}>
                      <div className={s.monthName}>{monthNames[month]}</div>
                      <div className={s.seasonU}>{seasonU}</div>
                    </div>
                  </div>
                  <div className={s.monthInfo}>
                    <div className={s.festK}>FESTIVALS THIS MONTH</div>
                    {monthFests.map(f => <div key={f.id} className={s.fest}>{f.name} <span className={s.festWhen}>{f.when}</span></div>)}
                    {monthFests.length === 0 && <div className={s.quiet}>A quieter month — valleys to yourself.</div>}
                    <p className={s.seasonText}>{seasonText}</p>
                  </div>
                </div>
              )}
            </div>
            <div className={s.footRow}>
              <button onClick={() => go(-1)} className={s.back} style={{ opacity: step === 0 ? 0.25 : 1 }}>← BACK</button>
              <button onClick={() => ready && go(1)} data-cursor="NEXT" className={s.next} style={{ background: ready ? '#e3a23a' : 'rgba(245,241,232,.35)' }}>
                {step === 6 ? 'SHOW MY BHUTAN' : ready ? 'CONTINUE' : 'CHOOSE TO CONTINUE'} <span className={s.mono}>→</span>
              </button>
            </div>
          </div>
        ) : (
          <div className={s.result}>
            <div className={s.resText}>
              <div className={s.resKicker}>A FIRST SKETCH · {(sel.who || 'YOU').toUpperCase()} · {monthNames[month]}</div>
              <h1 className={s.resH1}>Your <em>Bhutan</em></h1>
              <div className={s.stats}>
                {[{ v: days, k: 'DAYS' }, { v: valleys, k: 'PLACES' }, { v: regions, k: regions === 1 ? 'REGION' : 'REGIONS' }].map(x => (
                  <div key={x.k}><div className={s.statV}>{x.v}</div><div className={s.statK}>{x.k}</div></div>
                ))}
              </div>
              <div className={s.stops}>
                {routeIds.map((id, i) => (
                  <div key={id} className={s.stop} style={{ opacity: route.indexOf(id) <= rprog + 0.01 ? 1 : 0.25 }}>
                    <span className={s.stopNo}>{pad2(i + 1)}</span><span className={s.stopName}>{byId[id].name.toUpperCase()}</span><span className={s.stopAlt}>{fmt(byId[id].alt)} M</span>
                  </div>
                ))}
              </div>
              <div className={s.notes}>{notes}<br /><span className={s.fees}>GOVERNMENT FEES: SDF USD 100 PER ADULT PER NIGHT (≈ USD {fmt(nights * 100)} EACH FOR {nights} NIGHTS) · VISA USD 40 · CHILDREN REDUCED/EXEMPT</span></div>
              {!sent ? (
                <>
                  <div className={s.fields}>
                    <input placeholder="Your name" aria-label="Your name" value={name} onChange={e => setName(e.target.value)} className={s.input} style={{ marginRight: 16 }} />
                    <input placeholder="Email" aria-label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} className={s.input} />
                  </div>
                  <div className={s.sendRow}>
                    <a href={mailto} onClick={() => setTimeout(() => setSent(true), 300)} data-cursor="SEND" className={s.send}>SEND THIS JOURNEY TO A BHUTAN EXPERT <span className={s.mono}>→</span></a>
                    <button onClick={() => { setStep(0); setAnim(0); setSent(false); }} className={s.restart}>↺ START AGAIN</button>
                  </div>
                </>
              ) : (
                <div className={s.sent}>
                  <div className={s.sentH}>On its way to Thimphu.</div>
                  <p className={s.sentP}>Your email app has your sketch ready to send. A BMV specialist replies personally — usually within a day. Or WhatsApp us on {contact.phone}.</p>
                </div>
              )}
            </div>
            <div className={s.resMap}>
              <BhutanMap route={route} markers={routeIds} progress={rprog} numbered labels="all" />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
