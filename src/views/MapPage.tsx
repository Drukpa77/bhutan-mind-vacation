'use client';
import { useState } from 'react';
import BhutanMap from '@/components/BhutanMap';
import Nav from '@/components/Nav';
import Photo from '@/components/Photo';
import TLink from '@/components/TLink';
import { brand, byId, destinations, festivals, fmt, journeys, months, pad2 } from '@/content';
import { useKey, useTween, useWidth } from '@/lib/hooks';
import s from './MapPage.module.css';

import type { MapMode } from '@/content';

const MODES: Record<MapMode, { label: string; title: string; ids?: string[]; route?: string[] }> = {
  destinations: { label: 'DESTINATIONS', title: 'Eleven places, one kingdom', ids: destinations.map(d => d.id) },
  journeys: { label: 'JOURNEYS', title: 'Routes across the real terrain' },
  festivals: { label: 'FESTIVALS', title: 'Where the masks come out', ids: [...new Set(festivals.map(f => f.place))] },
  trekking: { label: 'TREKKING', title: 'Higher ground', ids: ['jangothang', 'haa', 'taktsang', 'dochula', 'phobjikha'], route: ['paro', 'jangothang'] },
  culture: { label: 'CULTURE', title: 'The great dzongs', ids: ['paro', 'thimphu', 'punakha', 'trongsa', 'bumthang', 'trashigang'] },
  nature: { label: 'NATURE', title: 'Valleys, passes, cranes', ids: ['phobjikha', 'haa', 'dochula', 'jangothang', 'punakha'] }
};


interface Row { key: string; no: string; name: string; meta: string; on: boolean; pad: boolean; click: () => void; enter?: () => void; leave?: () => void }

export default function MapPage({ initialMode = 'destinations', initialSel = null }: { initialMode?: MapMode; initialSel?: string | null }) {
  const [mode, setMode] = useState<MapMode>(initialMode);
  const [sel, setSel] = useState<string | null>(initialSel && byId[initialSel] ? initialSel : null);
  const [hov, setHov] = useState<string | null>(null);
  const [journey, setJourney] = useState(0);
  const [anim, runRoute] = useTween(3600);
  const w = useWidth();
  useKey('Escape', () => setSel(null));

  const m = MODES[mode];
  let markers: string[], route: string[] = [], flights: number[] = [], numbered = false, list: Row[];
  if (mode === 'journeys') {
    const j = journeys[journey]; route = j.route; flights = j.flight || []; markers = [...new Set(j.route)]; numbered = true;
    list = journeys.map((jj, i) => ({ key: jj.id, no: jj.no, name: jj.title, meta: jj.days + ' D', on: i === journey, pad: i === journey, click: () => { setJourney(i); setSel(null); runRoute(); } }));
  } else if (mode === 'festivals') {
    markers = m.ids!;
    list = festivals.map(f => ({ key: f.id, no: months[f.month], name: f.name, meta: (byId[f.place].short || byId[f.place].name).toUpperCase(), on: hov === f.place || sel === f.place, pad: sel === f.place,
      click: () => setSel(f.place), enter: () => setHov(f.place), leave: () => setHov(null) }));
  } else {
    markers = m.ids!; route = m.route || [];
    list = m.ids!.map((id, i) => { const d = byId[id]; return { key: id, no: pad2(i + 1), name: d.name, meta: fmt(d.alt) + ' M', on: hov === id || sel === id, pad: sel === id,
      click: () => setSel(id), enter: () => setHov(id), leave: () => setHov(null) }; });
  }
  const progress = route.length ? anim * (route.length - 1) : null;
  const dd = byId[sel || hov || 'punakha'];
  const showPanel = !!(sel || hov);

  return (
    <>
      <Nav />
      <main className={s.main}>
        <div className={s.mapArea}>
          <BhutanMap markers={markers} route={route} flights={flights} progress={progress} activeId={sel} hoverId={hov} focus={sel || ''} zoom={2.2} focusX={w > 900 ? 0.4 : 0.5}
            numbered={numbered} onHover={setHov} onSelect={setSel} />
        </div>

        <div className={s.side}>
          <div>
            <div className={s.eyebrow}>INTERACTIVE MAP · {m.label}</div>
            <h1 className={s.title}>{mode === 'journeys' ? journeys[journey].title : m.title}</h1>
          </div>
          <div className={s.list}>
            {list.map(it => (
              <button key={it.key} onClick={it.click} onMouseEnter={it.enter} onMouseLeave={it.leave} className={s.row}
                style={{ color: it.on ? '#e3a23a' : '#f5f1e8', paddingLeft: it.pad ? '10px' : '0' }}>
                <span className={s.rowNo}>{it.no}</span>
                <span className={s.rowName}>{it.name}</span>
                <span className={s.rowMeta}>{it.meta}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className={s.panel} aria-hidden={!showPanel} style={{ transform: `translateX(${showPanel ? '0' : '110%'})`, opacity: showPanel ? 1 : 0, pointerEvents: sel ? 'auto' : 'none' }}>
          <div className={s.photoBox}>
            <Photo src={dd.img || brand.undiscovered} alt={dd.name} className={s.photo} vt={sel ? 'dest-' + dd.id : undefined} sizes="340px" />
            <div className={s.coords}>{dd.lat.toFixed(4)}° N · {dd.lon.toFixed(4)}° E</div>
          </div>
          <div className={s.nameRow}>
            <h2 className={s.name}>{dd.name}</h2>
            <span className={s.alt}>{fmt(dd.alt)} M</span>
          </div>
          <div className={s.kind}>{dd.kind.toUpperCase()} · {dd.region.toUpperCase()}</div>
          <p className={s.line}>{dd.line}</p>
          <div className={s.tags}>{dd.tags.map(t => <span key={t} className={s.tag}>{t.toUpperCase()}</span>)}</div>
          <TLink href={dd.page} data-cursor="ENTER" className={s.explore}>EXPLORE {(dd.short || dd.name).toUpperCase()} <span className={s.mono}>→</span></TLink>
          <button onClick={() => { setSel(null); setHov(null); }} className={s.back}>× BACK TO THE KINGDOM</button>
        </aside>

        <div className={s.bottom}>
          <div className={s.modes}>
            {(Object.keys(MODES) as MapMode[]).map(k => (
              <button key={k} className={s.mode} onClick={() => { setMode(k); setSel(null); setHov(null); runRoute(); }}
                style={{ color: k === mode ? '#e3a23a' : 'rgba(245,241,232,.75)', borderBottomColor: k === mode ? '#e3a23a' : 'transparent' }}>{MODES[k].label}</button>
            ))}
          </div>
          <div className={s.credit}>RELIEF: AWS TERRAIN TILES (SRTM) · BOUNDARIES: GEOBOUNDARIES gbOpen<br />COORDINATES: OPENSTREETMAP / WIKIPEDIA</div>
        </div>
      </main>
    </>
  );
}
