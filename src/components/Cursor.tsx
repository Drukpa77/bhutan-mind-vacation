'use client';
import { useEffect, useRef } from 'react';

/** Custom cursor (pointer:fine, no reduced motion): a 10px difference-blended dot that lerps at 0.22,
 *  grows to 34px over links/buttons and to 72px with a label from [data-cursor]. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || !window.matchMedia('(pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.body.classList.add('bmv-cursor');
    c.style.display = 'flex';
    let x = -50, y = -50, cx = -50, cy = -50, raf = 0;
    let label: string | null | undefined;
    const onMove = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      const t = (e.target as Element | null)?.closest?.('[data-cursor],a,button');
      const l = t ? t.getAttribute('data-cursor') || '' : null;
      if (l === label) return;
      label = l;
      if (l === null) { c.style.width = c.style.height = '10px'; c.style.margin = '-5px 0 0 -5px'; c.textContent = ''; }
      else if (l === '') { c.style.width = c.style.height = '34px'; c.style.margin = '-17px 0 0 -17px'; c.textContent = ''; }
      else { c.style.width = c.style.height = '72px'; c.style.margin = '-36px 0 0 -36px'; c.textContent = l; }
    };
    const tick = () => { cx += (x - cx) * 0.22; cy += (y - cy) * 0.22; c.style.transform = `translate(${cx}px,${cy}px)`; raf = requestAnimationFrame(tick); };
    window.addEventListener('mousemove', onMove);
    tick();
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); document.body.classList.remove('bmv-cursor'); };
  }, []);
  return (
    <div ref={ref} aria-hidden="true" style={{
      position: 'fixed', left: 0, top: 0, zIndex: 100, pointerEvents: 'none', width: 10, height: 10, margin: '-5px 0 0 -5px', borderRadius: '50%',
      background: '#f5f1e8', mixBlendMode: 'difference', display: 'none', alignItems: 'center', justifyContent: 'center',
      transition: 'width .25s cubic-bezier(.2,.7,.2,1),height .25s cubic-bezier(.2,.7,.2,1),margin .25s',
      fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.14em', color: '#000'
    }} />
  );
}
