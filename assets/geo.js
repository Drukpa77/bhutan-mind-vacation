/* Projection matched to assets/geo/terrain-*.jpg (Web Mercator z9 crop, 1347x780).
   Terrain: AWS Terrain Tiles (Mapzen terrarium, derived from SRTM etc.). Boundaries: geoBoundaries gbOpen BTN. */
(function(){
const W0 = 256 * 512, X0 = 97794.27555555556, Y0 = 54703.03090725474;
const W = 1347, H = 780;
function project(lon, lat){ const r = lat*Math.PI/180; return [ (lon+180)/360*W0 - X0, (1 - Math.asinh(Math.tan(r))/Math.PI)/2*W0 - Y0 ]; }
function ringsToPath(geom){
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  let d = '';
  for (const p of polys) for (const ring of p) { ring.forEach(([lo,la],i)=>{ const [x,y]=project(lo,la); d += (i?'L':'M') + x.toFixed(1) + ' ' + y.toFixed(1); }); d += 'Z'; }
  return d;
}
let cache = null;
function base(){ const s = document.currentScript; return ''; }
function load(){
  if (cache) return cache;
  cache = Promise.all(['assets/geo/btn-adm0.json','assets/geo/btn-adm1.json'].map(u => fetch(u).then(r => r.json())))
    .then(([a0,a1]) => ({ outline: ringsToPath(a0.features[0].geometry), districts: a1.features.map(f => ({ name: f.properties.name, d: ringsToPath(f.geometry) })) }));
  return cache;
}
window.BMVGeo = { W, H, project, load };
})();
