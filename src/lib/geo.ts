/* Projection matched to /geo/terrain-*.jpg (Web Mercator z9 crop, 1347×780).
   Terrain: AWS Terrain Tiles (Mapzen terrarium, derived from SRTM etc.). Boundaries: geoBoundaries gbOpen BTN. */

const W0 = 256 * 512, X0 = 97794.27555555556, Y0 = 54703.03090725474;
export const MAP_W = 1347;
export const MAP_H = 780;

export function project(lon: number, lat: number): [number, number] {
  const r = (lat * Math.PI) / 180;
  const round = (v: number) => Math.round(v * 1000) / 1000;
  return [round(((lon + 180) / 360) * W0 - X0), round(((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2) * W0 - Y0)];
}

type Ring = [number, number][];
interface Geometry { type: 'Polygon' | 'MultiPolygon'; coordinates: Ring[] | Ring[][] }
interface FeatureCollection { features: { properties: { name: string }; geometry: Geometry }[] }

function ringsToPath(geom: Geometry): string {
  const polys = (geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates) as Ring[][];
  let d = '';
  for (const p of polys) for (const ring of p) {
    ring.forEach(([lo, la], i) => { const [x, y] = project(lo, la); d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); });
    d += 'Z';
  }
  return d;
}

export interface GeoPaths { outline: string; districts: { name: string; d: string }[] }

let cache: Promise<GeoPaths> | null = null;

/** Loads the ADM0 outline and the 20 ADM1 districts once per session. */
export function loadGeo(): Promise<GeoPaths> {
  if (cache) return cache;
  cache = Promise.all(['/geo/btn-adm0.json', '/geo/btn-adm1.json'].map(u => fetch(u).then(r => r.json() as Promise<FeatureCollection>)))
    .then(([a0, a1]) => ({
      outline: ringsToPath(a0.features[0].geometry),
      districts: a1.features.map(f => ({ name: f.properties.name, d: ringsToPath(f.geometry) }))
    }));
  cache.catch(() => { cache = null; });
  return cache;
}
