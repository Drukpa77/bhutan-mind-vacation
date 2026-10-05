// Downloads every photo / film listed in src/content/media-manifest.json into /public,
// so the site serves local files through next/image instead of hotlinking.
// Usage: npm run fetch-media   (skips files that already exist; pass --force to refetch)
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/content/media-manifest.json'), 'utf8'));
const force = process.argv.includes('--force');
const UA = 'BMV-website-build/1.0 (https://www.bhutanmindvacation.com; info@bhutanmindvacation.com)';

const jobs = [
  ...Object.values(manifest.video),
  ...Object.values(manifest.commons).flat(),
  ...Object.values(manifest.brand)
];

const candidates = url => {
  const out = [url];
  // The prototype used thumb.wikimedia.org; the canonical thumbnail host is upload.wikimedia.org.
  if (url.includes('thumb.wikimedia.org/')) out.push(url.replace('https://thumb.wikimedia.org/', 'https://upload.wikimedia.org/'));
  if (url.includes('/thumb/') && url.includes('1920px-')) out.push(url.replace('1920px-', '1280px-'));
  return out;
};

const sleep = ms => new Promise(r => setTimeout(r, ms));
let ok = 0, skipped = 0;
const failed = [];
for (const job of jobs) {
  const dest = path.join(root, 'public', job.local);
  if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 1000) { skipped++; continue; }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let done = false;
  for (const url of candidates(job.remote)) {
    for (let attempt = 0; attempt < 3 && !done; attempt++) {
      try {
        const res = await fetch(url, { headers: { 'User-Agent': UA } });
        if (res.status === 429) { await sleep(2000 * (attempt + 1)); continue; }
        if (!res.ok) break;
        fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
        done = true;
      } catch { await sleep(800); }
    }
    if (done) break;
  }
  if (done) { ok++; process.stdout.write('.'); } else failed.push(job.local + '  <-  ' + job.remote);
  await sleep(250);
}
console.log(`\n${ok} downloaded, ${skipped} already present, ${failed.length} failed`);
if (failed.length) console.log(failed.join('\n'));
