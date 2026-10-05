'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { byId, destinations, type Destination } from '@/content';
import { loadGeo, MAP_H as H, MAP_W as W, project, type GeoPaths } from '@/lib/geo';

export interface BhutanMapProps {
  variant?: 'dark' | 'light';
  /** Destination ids to show as markers (defaults to all 11). */
  markers?: string[];
  /** Ordered destination ids drawn as a route. */
  route?: string[];
  /** Indices of route legs that are flights (drawn dashed). */
  flights?: number[];
  /** Float position along the route (0 … route.length-1). Defaults to fully drawn. */
  progress?: number | null;
  activeId?: string | null;
  hoverId?: string | null;
  /** Camera target id; '' / null = whole kingdom. */
  focus?: string | null;
  zoom?: number;
  /** Horizontal position of the focus point in the frame (0–1). */
  focusX?: number;
  labels?: 'all' | 'active' | 'none';
  numbered?: boolean;
  districts?: boolean;
  graticule?: boolean;
  haze?: boolean;
  fit?: 'meet' | 'slice';
  accent?: string;
  terrainOpacity?: number;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  className?: string;
  style?: CSSProperties;
}

const LBL: Record<string, 'n' | 's' | 'e' | 'w'> = { haa: 'w', taktsang: 'w', dochula: 'n', paro: 's', jangothang: 'e', thimphu: 'e', wangdue: 's' };
const MONO = "var(--mono)";

/** Pre-rendered shaded relief + SVG overlay (districts, outline, graticule, route, markers), with a camera. */
export default function BhutanMap(p: BhutanMapProps) {
  const box = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<GeoPaths | null>(null);
  const [size, setSize] = useState({ cw: 0, ch: 0 });

  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(() => setSize({ cw: el.clientWidth, ch: el.clientHeight }));
    ro.observe(el);
    let alive = true;
    loadGeo().then(g => { if (alive) setGeo(g); }).catch(() => {});
    return () => { alive = false; ro.disconnect(); };
  }, []);

  const dark = (p.variant || 'dark') === 'dark';
  const ink = dark ? '#f5f1e8' : '#1b1a16', acc = p.accent || (dark ? '#e3a23a' : '#8f2b1f');
  const ids = p.markers || destinations.map(d => d.id);
  const markers = ids.map(i => byId[i]).filter(Boolean).map(d => { const [x, y] = project(d.lon, d.lat); return { ...d, x, y }; });
  const route = (p.route || []).map(i => byId[i]).filter(Boolean).map(d => { const [x, y] = project(d.lon, d.lat); return { id: d.id, x, y }; });
  const prog = p.progress == null ? route.length - 1 : Math.max(0, Math.min(route.length - 1, p.progress));
  const flights = p.flights || [];
  let focus: { x: number; y: number } | null = null;
  if (p.focus) {
    const m = markers.find(mm => mm.id === p.focus);
    const d: Destination | undefined = byId[p.focus];
    focus = m ? m : d ? (([x, y]) => ({ x, y }))(project(d.lon, d.lat)) : null;
  }
  const s = focus ? (p.zoom || 2.6) : 1;
  const tx = focus ? W * (p.focusX || 0.5) - focus.x * s : 0, ty = focus ? H / 2 - focus.y * s : 0;
  const active = p.activeId, hover = p.hoverId;
  const kids: ReactNode[] = [];

  if (p.graticule !== false) {
    [89, 90, 91, 92].forEach(lon => {
      const [x] = project(lon, 27);
      kids.push(<line key={'gx' + lon} x1={x} x2={x} y1={0} y2={H} stroke={ink} strokeOpacity={0.09} strokeWidth={0.6 / s} strokeDasharray={`${2 / s} ${6 / s}`} />,
        <text key={'gtx' + lon} x={x + 4 / s} y={H - 10 / s} fill={ink} fillOpacity={0.4} fontSize={9 / s} style={{ fontFamily: MONO }} letterSpacing={1 / s}>{lon + '°E'}</text>);
    });
    [27, 27.5, 28].forEach(lat => {
      const [, y] = project(89, lat);
      kids.push(<line key={'gy' + lat} x1={0} x2={W} y1={y} y2={y} stroke={ink} strokeOpacity={0.09} strokeWidth={0.6 / s} strokeDasharray={`${2 / s} ${6 / s}`} />,
        <text key={'gty' + lat} x={8 / s} y={y - 4 / s} fill={ink} fillOpacity={0.4} fontSize={9 / s} style={{ fontFamily: MONO }} letterSpacing={1 / s}>{lat.toFixed(1) + '°N'}</text>);
    });
  }
  if (geo) {
    if (p.districts !== false) geo.districts.forEach((d, i) => kids.push(<path key={'d' + i} d={d.d} fill="none" stroke={ink} strokeOpacity={dark ? 0.16 : 0.2} strokeWidth={0.7 / s} />));
    kids.push(<path key="ol" d={geo.outline} fill="none" stroke={dark ? '#efd9ae' : '#3a2a1c'} strokeOpacity={0.7} strokeWidth={1.4 / s} />);
  }
  if (route.length > 1) {
    for (let i = 0; i < route.length - 1; i++) {
      const a = route[i], b = route[i + 1], fl = flights.includes(i);
      kids.push(<line key={'rb' + i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ink} strokeOpacity={0.28} strokeWidth={1 / s} strokeDasharray={`${3 / s} ${4 / s}`} />);
      const t = Math.max(0, Math.min(1, prog - i));
      if (t > 0) kids.push(<line key={'rp' + i} x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * t} y2={a.y + (b.y - a.y) * t} stroke={acc} strokeWidth={2.2 / s} strokeLinecap="round" strokeDasharray={fl ? `${6 / s} ${5 / s}` : undefined} />);
    }
    const hi = Math.floor(prog), t = prog - hi, a = route[hi], b = route[Math.min(hi + 1, route.length - 1)];
    const hx = a.x + (b.x - a.x) * t, hy = a.y + (b.y - a.y) * t;
    kids.push(<circle key="head" cx={hx} cy={hy} r={5 / s} fill={acc} style={{ filter: `drop-shadow(0 0 ${6 / s}px ${acc})` }} />);
  }
  const routeIdx = (id: string) => route.findIndex(r => r.id === id);
  markers.forEach(m => {
    const ri = routeIdx(m.id), onRoute = ri >= 0, lit = onRoute ? ri <= prog + 0.001 : true;
    const isA = m.id === active || m.id === hover;
    const r = (isA ? 6.5 : onRoute ? 4.5 : 4) / s;
    const pos = LBL[m.id] || 'e';
    const dx = pos === 'w' ? -12 / s : pos === 'e' ? 12 / s : 0, dy = pos === 'n' ? -14 / s : pos === 's' ? 20 / s : 4 / s;
    const anchor = pos === 'w' ? 'end' : pos === 'e' ? 'start' : 'middle';
    const showLabel = p.labels === 'none' ? false : p.labels === 'active' ? isA : true;
    kids.push(
      <g key={'m' + m.id} transform={`translate(${m.x},${m.y})`}>
        {isA && <circle r={7 / s} fill="none" stroke={acc} strokeWidth={1.2 / s} style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'bmvpulse 1.8s ease-out infinite' }} />}
        <circle r={r} fill={lit ? (isA ? acc : (dark ? '#f5f1e8' : '#1b1a16')) : 'transparent'} stroke={lit ? (dark ? '#14130f' : '#f5f1e8') : ink} strokeOpacity={lit ? 1 : 0.5} strokeWidth={1.2 / s} style={{ transition: 'r .25s' }} />
        {showLabel && (
          <text x={dx} y={dy} textAnchor={anchor} fill={ink} fillOpacity={lit ? (isA ? 1 : 0.85) : 0.4} fontSize={(isA ? 13 : 10.5) / s} letterSpacing={1.6 / s} fontWeight={isA ? 600 : 400}
            style={{ fontFamily: MONO, paintOrder: 'stroke', stroke: dark ? 'rgba(10,10,8,.65)' : 'rgba(245,241,232,.8)', strokeWidth: 3 / s, transition: 'font-size .25s' }}>
            {(p.numbered && onRoute ? String(ri + 1).padStart(2, '0') + ' ' : '') + (m.short || m.name).toUpperCase()}
          </text>
        )}
        <circle r={22 / s} fill="transparent" style={{ cursor: 'pointer' }} data-cursor="OPEN" role="button" aria-label={m.name}
          onMouseEnter={() => p.onHover?.(m.id)} onMouseLeave={() => p.onHover?.(null)} onClick={() => p.onSelect?.(m.id)} />
      </g>
    );
  });

  const { cw: cw0, ch: ch0 } = size;
  const cw = cw0 || 1, ch = ch0 > 10 ? ch0 : (cw * H) / W;
  const k = p.fit === 'slice' ? Math.max(cw / W, ch / H) : Math.min(cw / W, ch / H);
  const hz = dark ? '15,14,11' : '243,238,228';

  return (
    <div className={p.className} style={p.style ?? { position: 'absolute', inset: 0 }}>
    <div ref={box} style={{ position: 'relative', width: '100%', height: '100%', minHeight: 200, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', left: (cw - W * k) / 2, top: (ch - H * k) / 2, width: W, height: H, transform: `scale(${k})`, transformOrigin: '0 0', visibility: cw0 ? 'visible' : 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, transform: `translate(${tx}px,${ty}px) scale(${s})`, transformOrigin: '0 0', transition: 'transform 1.4s cubic-bezier(.7,0,.2,1)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- fixed 1347×780 stage; must not be resized or re-encoded */}
            <img src={dark ? '/geo/terrain-dark.jpg' : '/geo/terrain-light.jpg'} alt="Shaded relief of Bhutan" draggable={false}
              style={{ position: 'absolute', inset: 0, width: W, height: H, opacity: p.terrainOpacity ?? 1, userSelect: 'none' }} />
            <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>{cw0 ? kids : null}</svg>
          </div>
        </div>
      </div>
      {p.haze !== false && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: `inset 0 0 ${Math.round(Math.min(cw, ch) * 0.18)}px ${Math.round(Math.min(cw, ch) * 0.08)}px rgb(${hz})` }} />
      )}
    </div>
    </div>
  );
}
