'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { brand, contact, img } from '@/content';
import { useModal } from '@/lib/hooks';
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

const isCurrent = (path: string, href: string) => !href.includes('#') && (path === href || path.startsWith(href + '/'));

/** Fixed 76px bar + full-screen menu. `tone="dark"` = ink text for light pages. */
export default function Nav({ tone = 'light', solid: forceSolid = false }: { tone?: 'light' | 'dark'; solid?: boolean }) {
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname() || '/';
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);
  useModal(open, menuRef, triggerRef, close);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const light = tone === 'dark';
  const solid = scrolled || forceSolid;
  const cur = (href: string) => (isCurrent(path, href) ? 'page' as const : undefined);

  return (
    <>
      <header className={s.bar} style={{
        color: light ? '#1b1a16' : '#f5f1e8',
        background: solid ? (light ? 'rgba(239,233,221,.86)' : 'rgba(15,14,11,.55)') : 'transparent',
        backdropFilter: solid ? 'blur(14px)' : 'none', WebkitBackdropFilter: solid ? 'blur(14px)' : 'none',
        borderBottomColor: solid ? (light ? 'rgba(27,26,22,.1)' : 'rgba(245,241,232,.08)') : 'transparent'
      }}>
        <div className={s.left}>
          <TLink href="/" data-cursor="HOME" className={s.brand} aria-label="Bhutan Mind Vacation — home">
            <span className={s.wordmark} aria-hidden="true">BMV</span>
            <span className={s.brandSub} aria-hidden="true">BHUTAN MIND VACATION</span>
          </TLink>
          <nav className={s.links} aria-label="Primary">
            <button ref={triggerRef} type="button" onClick={() => setOpen(o => !o)} data-cursor="OPEN" className={s.explore} aria-expanded={open} aria-controls="bmv-menu" aria-haspopup="dialog">
              <span className={s.burger} aria-hidden="true"><span /><span /></span>EXPLORE
            </button>
            <TLink href="/journeys" className={s.navLink} aria-current={cur('/journeys')}>JOURNEYS</TLink>
            <TLink href="/plan" className={s.navLink} aria-current={cur('/plan')}>PLAN</TLink>
          </nav>
        </div>
        <TLink href="/build-your-journey" data-cursor="BEGIN" className={s.cta} aria-current={cur('/build-your-journey')}>
          <span><span className={s.ctaLong}>DESIGN MY </span>JOURNEY</span> <span className={s.arrow} aria-hidden="true">→</span>
        </TLink>
      </header>

      <div id="bmv-menu" ref={menuRef} className={s.menu} role="dialog" aria-modal="true" aria-label="Site menu" inert={!open}
        style={{ clipPath: open ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)', pointerEvents: open ? 'auto' : 'none', visibility: open ? 'visible' : 'hidden', transitionProperty: 'clip-path, visibility', transitionDelay: open ? '0s, 0s' : '0s, .9s' }}>
        {MENU.map(([label, , , im], i) => (
          <Photo key={label} src={im} className={s.menuBg} sizes="100vw" style={{ opacity: open && hov === i ? 1 : 0, transform: `scale(${hov === i ? 1 : 1.08})` }} />
        ))}
        <div className={s.menuShade} />
        <div className={s.menuGrid}>
          <div className={s.menuTop}>
            <span className={s.menuWordmark} aria-hidden="true">BMV</span>
            <button type="button" onClick={close} data-cursor="CLOSE" className={s.close} aria-label="Close menu">CLOSE <span className={s.closeX} aria-hidden="true">×</span></button>
          </div>
          <nav className={s.items} aria-label="Explore">
            {MENU.map(([label, href, sub], i) => (
              <TLink key={label} href={href} onMouseEnter={() => setHov(i)} onFocus={() => setHov(i)} onClick={close} data-cursor="ENTER" className={s.item} aria-current={cur(href)}
                style={{ opacity: open ? (hov === i ? 1 : 0.42) : 0, transform: `translateY(${open ? '0' : '40px'})`, transition: `opacity .4s, transform .9s cubic-bezier(.2,.7,.2,1) ${open ? 0.25 + i * 0.05 : 0}s` }}>
                <span className={s.itemNo} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className={s.itemLabel} style={{ fontStyle: hov === i ? 'italic' : 'normal' }}>{label}</span>
                <span className={s.itemSub} style={{ opacity: hov === i ? 0.9 : 0 }}>{sub}</span>
              </TLink>
            ))}
          </nav>
          <div className={s.menuFoot}>
            <div className={s.menuFootLinks}>
              <TLink href="/journeys" onClick={close} className={s.footJourneys}>JOURNEYS</TLink><TLink href="/plan" onClick={close}>PLAN</TLink><TLink href="/plan/visa" onClick={close}>VISA</TLink><TLink href="/build-your-journey" onClick={close}>BUILD YOUR JOURNEY</TLink><a href={`mailto:${contact.email}`}>{contact.email.toUpperCase()}</a>
            </div>
            <div aria-hidden="true">THIMPHU · 27.4716° N 89.6386° E</div>
          </div>
        </div>
      </div>
    </>
  );
}
