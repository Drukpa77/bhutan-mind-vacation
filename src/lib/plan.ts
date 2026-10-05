import { byId } from '@/content';

export interface PlanInput {
  days: number;
  /** 0-based month index. */
  month: number;
  why: string[];
  interests: string[];
  pace: string | null;
  /** Destination id requested via `?d=`. */
  extra: string | null;
}

/** Route sketch for the journey builder — ported as-is from the Build prototype. */
export function plan(st: PlanInput): { route: string[]; trekOK: boolean } {
  const d = st.days, wants = (x: string) => st.why.includes(x) || st.interests.includes(x);
  let r = ['paro', 'thimphu'];
  const trekOK = (wants('trek') || wants('Hikes')) && d >= 9 && [3, 4, 9, 10].includes(st.month);
  if (d >= 5) r.push('dochula', 'punakha');
  if (d >= 8 && !trekOK) r.push('phobjikha');
  if (d >= 10 && !trekOK) r.push('trongsa', 'bumthang');
  if (d >= 15 && !trekOK) r.push('trashigang');
  if (trekOK) r = ['paro', 'jangothang', 'paro', 'thimphu', ...(d >= 12 ? ['dochula', 'punakha'] : [])];
  if (st.extra && !r.includes(st.extra) && byId[st.extra]) r.splice(Math.max(1, r.length - 1), 0, st.extra);
  if (d >= 6 && !r.includes('haa') && (wants('solitude') || st.pace === 'Slow') && !trekOK) r.splice(1, 0, 'haa');
  if (r[r.length - 1] !== 'paro' && r[r.length - 1] !== 'trashigang') r.push('paro');
  if (r[r.length - 1] === 'paro') r.push('taktsang'); else r.unshift('taktsang');
  return { route: r, trekOK };
}

/** Season label + copy for a 0-based month. */
export function season(m: number): [string, string] {
  if (m <= 1 || m === 11) return ['WINTER · CLEAR & COLD', 'Crisp, clear skies and the best mountain views; high passes can see snow. Cranes in Phobjikha from around November.'];
  if (m <= 4) return ['SPRING · BLOSSOM', 'Rhododendrons and blossom, mild days, festival season in Paro and Punakha.'];
  if (m <= 7) return ['SUMMER · MONSOON', 'Green, lush and quiet; afternoon rain is common and some high trails close.'];
  return ['AUTUMN · HARVEST', 'Clear skies after the monsoon, golden rice terraces, peak trekking and festival season.'];
}
