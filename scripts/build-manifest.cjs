// One-off: derive src/content/media-manifest.json from the prototype's assets/data.js
const fs = require('fs'), vm = require('vm');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync('assets/data.js', 'utf8'), ctx);
const M = ctx.window.BMV_MEDIA, B = ctx.window.BMV;
const commons = {};
for (const [k, list] of Object.entries(M.img)) commons[k] = list.map((x, i) => ({
  local: `/img/commons/${k}-${i}.jpg`, remote: x.src.split('?')[0], title: x.title, by: x.by.replace(/\s+/g, ' ').trim(), licence: x.lic, page: x.page }));
const brand = {};
for (const [k, url] of Object.entries(B.brand)) brand[k] = { local: `/img/bmv/${k}.jpg`, remote: url };
brand.founder = { local: '/img/bmv/founder.jpg', remote: 'https://www.bhutanmindvacation.com/img/paths/assets/images/banners/Bhutanese-Man-.jpg/ef400417ec0bc52fe36cb0e0cb017216.jpg' };
const video = {
  heroVideo: { local: '/video/bhutan-hero.mp4', remote: M.heroVideo, by: 'Serg Alesenko', licence: 'Pexels licence', page: 'https://www.pexels.com/video/13978913/', note: 'TEMPORARY — location unverified; replace with BMV film.' },
  heroPoster: { local: '/img/hero-poster.jpg', remote: M.heroPoster },
  riverVideo: { local: '/video/bhutan-river.mp4', remote: M.riverVideo, by: 'Serg Alesenko', licence: 'Pexels licence', page: 'https://www.pexels.com/video/13978919/', note: 'TEMPORARY — location unverified.' }
};
fs.writeFileSync('src/content/media-manifest.json', JSON.stringify({ video, commons, brand }, null, 1));
console.log(Object.values(commons).flat().length, 'commons;', Object.keys(brand).length, 'brand');
