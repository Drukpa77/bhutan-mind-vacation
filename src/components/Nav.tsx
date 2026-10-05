'use client';
import { useEffect, useState } from 'react';
import { brand, contact, img } from '@/content';
import Photo from './Photo';
import TLink from './TLink';
import s from './Nav.module.css';

const MENU: [label: string, href: string, sub: string, image: string][] = [
  ['Bhutan', '/#kingdom', 'THE KINGDOM', img('jomolhari', 0)],
  ['Destinations', '/destinations', '11 PLACES', img('phobjikha', 0)],
  ['Experiences', '/experiences', 'BY FEELING', brand.trekking],
  ['Interactive Map', '/interactive-map', 'REAL TERRAIN', img('dochula', 1)],
  ['Festivals', '/festivals', 'TSHECHU CALENDAR', img('parotsechu', 1)],
  ['Stories', '/stories', 'FROM THE KINGDOM', img('taktsang', 1)],
  ['About', '/about', 'A BHUTANESE FAMILY', brand.people]
];

/** Fixed 76px bar + full-screen menu. `tone="dark"` = ink text for light pages. */
export default function Nav({ tone = 'light', solid: forceSolid = false }: { tone?: 'light' | 'dark'; solid?: boolean }) {
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey); };
  }, []);

  const light = tone === 'dark';
  const solid = scrolled || forceSolid;
  const close = () => setOpen(false);

  return (
    <>
      <div className={s.bar} style={{
        color: light ? '#1b1a16' : '#f5f1e8',
        background: solid ? (light ? 'rgba(239,233,221,.86)' : 'rgba(15,14,11,.55)') : 'transparent',
        backdropFilter: solid ? 'blur(14px)' : 'none', WebkitBackdropFilter: solid ? 'blur(14px)' : 'none',
        borderBottomColor: solid ? (light ? 'rgba(27,26,22,.1)' : 'rgba(245,241,232,.08)') : 'transparent'
      }}>
        <div className={s.left}>
          <TLink href="/" data-cursor="HOME" className={s.brand}>
            <span className={s.wordmark}>BMV</span>
            <span className={s.brandSub}>BHUTAN MIND VACATION</span>
          </TLink>
          <nav className={s.links}>
            <button onClick={() => setOpen(o => !o)} data-cursor="OPEN" className={s.explore} aria-expanded={open} aria-controls="bmv-menu">
              <span className={s.burger}><span /><span /></span>EXPLORE
            </button>
            <TLink href="/journeys" className={s.navLink}>JOURNEYS</TLink>
            <TLink href="/plan" className={s.navLink}>PLAN</TLink>
          </nav>
        </div>
        <TLink href="/build-your-journey" data-cursor="BEGIN" className={s.cta}>DESIGN MY JOURNEY <span className={s.arrow}>→</span></TLink>
      </div>

      <div id="bmv-menu" className={s.menu} aria-hidden={!open} style={{ clipPath: open ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)', pointerEvents: open ? 'auto' : 'none' }}>
        {MENU.map(([label, , , im], i) => (
          <Photo key={label} src={im} className={s.menuBg} sizes="100vw" style={{ opacity: open && hov === i ? 1 : 0, transform: `scale(${hov === i ? 1 : 1.08})` }} />
        ))}
        <div className={s.menuShade} />
        <div className={s.menuGrid}>
          <div className={s.menuTop}>
            <span className={s.menuWordmark}>BMV</span>
            <button onClick={() => setOpen(o => !o)} data-cursor="CLOSE" className={s.close} tabIndex={open ? 0 : -1}>CLOSE <span className={s.closeX}>×</span></button>
          </div>
          <div className={s.items}>
            {MENU.map(([label, href, sub], i) => (
              <TLink key={label} href={href} onMouseEnter={() => setHov(i)} onFocus={() => setHov(i)} onClick={close} data-cursor="ENTER" className={s.item} tabIndex={open ? 0 : -1}
                style={{ opacity: open ? (hov === i ? 1 : 0.42) : 0, transform: `translateY(${open ? '0' : '40px'})`, transition: `opacity .4s, transform .9s cubic-bezier(.2,.7,.2,1) ${open ? 0.25 + i * 0.05 : 0}s` }}>
                <span className={s.itemNo}>{String(i + 1).padStart(2, '0')}</span>
                <span className={s.itemLabel} style={{ fontStyle: hov === i ? 'italic' : 'normal' }}>{label}</span>
                <span className={s.itemSub} style={{ opacity: hov === i ? 0.9 : 0 }}>{sub}</span>
              </TLink>
            ))}
          </div>
          <div className={s.menuFoot}>
            <div className={s.menuFootLinks}>
              <TLink href="/plan" onClick={close}>PLAN</TLink><TLink href="/plan/visa" onClick={close}>VISA</TLink><TLink href="/build-your-journey" onClick={close}>BUILD YOUR JOURNEY</TLink><a href={`mailto:${contact.email}`}>{contact.email.toUpperCase()}</a>
            </div>
            <div>THIMPHU · 27.4716° N 89.6386° E</div>
          </div>
        </div>
      </div>
    </>
  );
}
