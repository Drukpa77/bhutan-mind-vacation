/* ===== MEDIA CONFIG =====
   Swap the hero film by dropping your own file in /public/video and changing heroVideo.
   Every photo is served locally from /public/img (see scripts/fetch-media.mjs and
   src/content/media-manifest.json for source, creator and licence of each file). */
import manifest from './media-manifest.json';
import type { MediaCredit } from './types';

export const media = {
  /** TEMPORARY Pexels clip (location unverified) — replace with BMV's own film. */
  heroVideo: '/video/bhutan-hero.mp4',
  heroPoster: '/img/hero-poster.jpg',
  riverVideo: '/video/bhutan-river.mp4'
} as const;

type CommonsKey = keyof typeof manifest.commons;
type BrandKey = keyof typeof manifest.brand;

const commons = manifest.commons as Record<CommonsKey, MediaCredit[]>;

/** Wikimedia Commons photo `i` for a place key, or '' when there is none (mirrors BMV.img in the prototype). */
export function img(key: CommonsKey, i = 0): string {
  return commons[key]?.[i]?.local ?? '';
}

/** BMV-owned photography (low-res copies from bhutanmindvacation.com — replace with originals). */
export const brand = Object.fromEntries(
  Object.entries(manifest.brand).map(([k, v]) => [k, v.local])
) as Record<BrandKey, string>;

/** All Commons credits, for the attribution page / footer. */
export const credits: MediaCredit[] = Object.values(commons).flat();
