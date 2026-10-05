'use client';
import { useEffect, useState, type RefObject } from 'react';

export interface Viewport { y: number; vh: number; w: number }

/** Re-renders on scroll/resize (throttled to one update per frame), like the prototypes' onScroll → setState. */
export function useViewport(): Viewport {
  const [v, setV] = useState<Viewport>({ y: 0, vh: 800, w: 1200 });
  useEffect(() => {
    let raf = 0;
    const read = () => { raf = 0; setV({ y: window.scrollY, vh: window.innerHeight, w: window.innerWidth }); };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    read();
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);
  return v;
}

/** Window width only (no scroll re-renders). */
export function useWidth(): number {
  const [w, setW] = useState(1200);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener('resize', on); on();
    return () => window.removeEventListener('resize', on);
  }, []);
  return w;
}

/** 0→1 progress through a tall sticky section (top reaches viewport top → bottom reaches viewport bottom). */
export function stickyProgress(ref: RefObject<HTMLElement | null>, vh: number): number {
  const el = ref.current; if (!el) return 0;
  const r = el.getBoundingClientRect(); const span = r.height - vh;
  return Math.max(0, Math.min(1, span > 0 ? -r.top / span : 0));
}

/** 0→1 from the section's top entering the viewport bottom to its bottom leaving the top. */
export function inViewProgress(ref: RefObject<HTMLElement | null>, vh: number): number {
  const el = ref.current; if (!el) return 0;
  const r = el.getBoundingClientRect();
  return Math.max(0, Math.min(1, (vh - r.top) / (r.height + vh)));
}

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useReducedMotion(): boolean {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setR(m.matches); on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return r;
}

export function useKey(key: string, fn: (e: KeyboardEvent) => void) {
  useEffect(() => {
    const on = (e: KeyboardEvent) => { if (e.key === key) fn(e); };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  });
}

/** requestAnimationFrame tween 0→1 over `ms`; returns [value, restart]. */
export function useTween(ms: number, autostart = true): [number, () => void] {
  const [t, setT] = useState(0);
  const [run, setRun] = useState(autostart ? 1 : 0);
  useEffect(() => {
    if (!run) return;
    let raf = 0; const t0 = performance.now();
    const tick = (now: number) => { const a = Math.min(1, (now - t0) / ms); setT(a); if (a < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, ms]);
  return [t, () => { setT(0); setRun(r => r + 1); }];
}
