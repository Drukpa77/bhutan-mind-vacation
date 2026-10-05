# Handoff: Bhutan Mind Vacation — Experiential Website (Next.js)

**Target folder:** `C:\Users\palde\OneDrive\Desktop\Websites\bhutan-mind-vision`

## How to use this with Claude Code
1. Unzip this bundle into the target folder (so it sits at `bhutan-mind-vision/design_handoff_bmv_website/`).
2. Open a terminal in `bhutan-mind-vision` and run `claude`.
3. Paste:

> Read `design_handoff_bmv_website/README.md` and every file in `design_handoff_bmv_website/design/`. Scaffold a Next.js 15 (App Router, TypeScript) app in this folder and recreate every page **pixel-for-pixel and behaviour-for-behaviour** as described. Port `assets/data.js` to typed content in `src/content/`, copy `assets/geo/*` to `public/geo/`, and port `BhutanMap.dc.html` to a React component using the same projection in `assets/geo.js`. Work page by page in the order listed under "Build order", and run `npm run dev` to check each one.

## About the design files
The files in `design/` are **design references built in HTML** ("Design Components": a template with inline styles and `{{ holes }}`, plus a `class Component extends DCLogic` holding the logic). They are hi-fi prototypes, not production code. Recreate them in Next.js/React. Each file's logic class works like a React class component: `state`, `setState`, lifecycle methods, and a `renderVals()` that returns the values the template reads.
- `<sc-for list="{{ xs }}" as="x">` → `xs.map(x => …)`
- `<sc-if value="{{ v }}">` → `{v && …}`
- `<dc-import name="Nav">` → `<Nav />`
- `style-hover="…"` → hover styles (CSS module or Tailwind `hover:`)
- `<div role="img" style="background-image:{{ xBg }}">` → use `next/image` with `fill` + `object-fit: cover` in production. The div pattern was only a prototype workaround.

## Fidelity
**High-fidelity.** Match the colours, type, spacing, copy, motion and interactions exactly.

## Stack
- Next.js 15 App Router, TypeScript, React 19
- Styling: CSS Modules or Tailwind. Copy values exactly from the inline styles.
- Motion: plain React scroll state (as in the prototypes) or Framer Motion. Use GSAP ScrollTrigger only if you need it.
- Page transitions: the prototypes use the **cross-document View Transitions API** (`@view-transition { navigation: auto }` plus `view-transition-name` on shared images and words). In Next.js, use `next-view-transitions` (or React 19 `unstable_ViewTransition`) with the same names: `dest-<id>`, `word-<id>`, `story-hero`.
- Map: no map library is needed. It is a pre-rendered terrain image with an SVG overlay (see BhutanMap below).
- Fonts: `next/font/google` with **Instrument Serif** (400, italic), **Archivo** (300–600) and **JetBrains Mono** (400, 500).

## Routes (map from prototype file → Next route)
| Prototype | Route |
|---|---|
| Home.dc.html | `/` |
| Map.dc.html | `/interactive-map` (query `?mode=` and `?d=` supported) |
| Journeys.dc.html | `/journeys` (query `?cat=`, `?feel=`); its `#experiences` strip → also expose `/experiences` |
| Journey.dc.html | `/journeys/[slug]` (default slug `valleys-of-the-thunder-dragon`) |
| Destinations.dc.html | `/destinations` |
| Punakha.dc.html | `/destinations/punakha` (bespoke page) |
| Destination.dc.html | `/destinations/[slug]` (layout variant chosen per slug, see below) |
| Build.dc.html | `/build-your-journey` (query `?from=<journey>`, `?d=<dest>`) |
| Plan.dc.html | `/plan` (sections are anchors; split into `/plan/flights`, `/plan/when-to-visit`, `/plan/accommodation`, `/plan/travel-tips`, `/plan/faq` if desired) |
| Visa.dc.html | `/plan/visa` |
| Festivals.dc.html | `/festivals` |
| About.dc.html | `/about` (anchors `#story`, `#founder`, `#responsible` → `/about/our-story`, `/about/founder`, `/about/responsible-travel`) |
| Stories.dc.html | `/stories` |
| Story.dc.html | `/stories/[slug]` (`hidden-gem` is fully written; others show the summary plus a link to the original BMV blog post) |
| Nav.dc.html, Footer.dc.html | shared layout components |
| BhutanMap.dc.html | shared `<BhutanMap>` client component |

Replace every `X.dc.html?…` link in the prototypes with the matching route above.

## Build order
1. Layout: fonts, globals, `<Nav>` (with the full-screen menu and custom cursor), `<Footer>`
2. `<BhutanMap>` + content files
3. Home → Interactive map → Journeys → Journey → Destinations → Punakha → Destination → Build → Plan/Visa → Festivals → About → Stories/Story

## Design tokens
**Colours**
- ink / page dark `#0f0e0b`; menu/footer `#0b0a08`; charcoal `#1b1a16`; card `#14130f`
- bone `#f5f1e8`; parchment `#ece4d4`; light surface `#e2dacb` / `#d8cfbd`
- saffron (accent on dark) `#e3a23a`; Bhutan red (accent on light) `#8f2b1f`; forest `#24392d`
- body text on light: `#3d382f`, `#4a4439`, `#5a5244`
- text on dark: `rgba(245,241,232,.82 / .75 / .7 / .6)`; hairlines `rgba(245,241,232,.08–.2)`, on light `rgba(27,26,22,.1–.2)`

**Type**
- Display: Instrument Serif 400. Headlines use `clamp()` exactly as in the files, e.g. hero `31vw`, section heads `clamp(48px,8.4vw,150px)`, line-height .84–.95, letter-spacing −.01 to −.03em. Italic is used for emphasis words.
- UI: Archivo, buttons 11–12px / 500 / letter-spacing .22–.26em, uppercase.
- Metadata: JetBrains Mono 9–12px, letter-spacing .14–.3em, uppercase (coordinates, altitudes, counters like `03 / 11 DAYS`).

**Shape:** no border radius anywhere (the only circles are markers, cursor and step dots). No shadows. 1px hairline rules.

**Motion:** micro 120–250ms; UI 250–500ms; cinematic 600–2400ms. The signature easing is `cubic-bezier(.2,.7,.2,1)`, with `cubic-bezier(.77,0,.18,1)` for the menu clip, `cubic-bezier(.7,0,.2,1)` for the map camera, and `(.2,.6,.2,1)` for image scale. Respect `prefers-reduced-motion`: no autoplay video (poster only), no cursor, no view transitions.

## Global components
**Nav** (fixed, 76px): BMV wordmark (Instrument Serif 30px) + "BHUTAN MIND VACATION" mono 9px · EXPLORE (two-line burger) · JOURNEYS · PLAN · right outlined "DESIGN MY JOURNEY →" button (hover: saffron fill). It is transparent until 40px of scroll, then `rgba(15,14,11,.55)` + `blur(14px)`. `tone="dark"` gives the light-page variant with ink text on `rgba(239,233,221,.86)`.
**Full-screen menu:** reveals with `clip-path inset(0 0 100% 0) → inset(0)` over .9s. Seven items, numbered 01–07 (Bhutan, Destinations, Experiences, Interactive Map, Festivals, Stories, About), in Instrument Serif `clamp(44px,8.2vh,104px)`. Items stagger in at 0.25s + i·0.05s. On hover, the item turns italic at full opacity (others .42) and the background crossfades to that item's photo (scale 1.08→1). Esc closes. Footer row has quick links and coordinates.
**Custom cursor** (only for pointer:fine without reduced motion): a 10px circle with `mix-blend-mode:difference` that lerps at 0.22. It grows to 34px over links, or to 72px with a label taken from `data-cursor` (VIEW, EXPLORE, DRAG, OPEN, BEGIN, ENTER, READ, CLOSE…).
**Footer:** dark, 5-column auto-fit grid, contact details from `BMV.contact`.

## BhutanMap (signature component)
- Base image: `public/geo/terrain-dark.jpg` / `terrain-light.jpg` (1347×780). This is real shaded relief with 250 m contours, rendered from AWS Terrain Tiles (zoom 9) and masked by the geoBoundaries outline.
- Projection (must match the image): Web Mercator z9, `x = (lon+180)/360*131072 − 97794.2756`, `y = (1 − asinh(tan(lat))/π)/2*131072 − 54703.0309`. See `assets/geo.js`.
- SVG overlay at viewBox `0 0 1347 780`:
  - 20 district paths (ADM1), stroke at .16 opacity
  - national outline `#efd9ae` at .7
  - graticule every 1° lon and 0.5° lat, dashed, with mono labels
  - route as dashed base segments, plus a solid saffron progressed polyline up to the float `progress`, with a glowing head dot; flight legs are dashed
  - markers: filled when reached; the active marker gets a pulsing ring (`bmvpulse` keyframes) and a larger label; labels in mono uppercase with a text halo; hit radius 22
- Camera: `focus` id + `zoom` + `focusX` translate and scale the inner stage, transition 1.4s `(.7,0,.2,1)`. Marker sizes are divided by the scale so they stay constant on screen.
- Fit: the stage is scaled to fit its container (contain or `fit="slice"`), with an inset box-shadow vignette in the page background colour.
- Props: `variant, markers, route, flights, progress, activeId, hoverId, focus, zoom, focusX, labels ('all'|'active'|'none'), numbered, districts, graticule, onHover, onSelect`.

## Pages (key behaviour; exact styles in each file)
**Home**
1. **Film** (230vh, sticky viewport): full-bleed `<video autoplay muted loop playsinline preload="metadata">` from `heroVideo`, with a poster.
   - A black curtain fades out over 2.2s. Coordinates `27.5142° N / 90.4336° E` appear at top left and "DRUK YUL" at top right.
   - The word BHUTAN (31vw) fades in letter by letter. On scroll, the letters spread apart (x = (i−2.5)·progress·16vw, plus y lift) and fade out, while the video scales to 1.12 and darkens.
   - Tagline "WHERE PROGRESS IS MEASURED IN HAPPINESS"; "ENTER THE KINGDOM ↓"; SOUND OFF/ON toggle.
2. **You don't simply visit** (440vh sticky): four full-bleed slides crossfade by scroll quarter. Headline words rise and un-blur in a stagger, with italic emphasis words. Includes a 01/04 progress bar and a location caption.
3. **Map teaser:** "A kingdom between earth and sky.", the facts 38,394 km² · 7,570 m · 20, and the map. Hovering a marker slides in a photo card (name, altitude, kind, tags). Clicking a marker goes to its destination. CTA "ENTER THE INTERACTIVE MAP →".
4. **Choose:** three full-height panels that use flex-grow (1 → 2.2 on hover, 1s). Hover plays the video where there is one, desaturates the other panels, turns the verb italic and reveals the copy. Panels: Go higher / Find stillness / Follow the celebration.
5. **Featured journey:** a 2/3-width image with metadata and "11 DAYS". The side column holds the route mini-map and the elevation sparkline, both progressing with scroll; CTA "ENTER THE JOURNEY →".
6. **People** (parchment): portrait with a red corner rule; quote "You arrive as a guest. You leave as family."
7. **Not pre-written** (forest green): five steps, then a giant "Build your Bhutan →" link.
8. **Trust** (bone): a ruled list of four items (Tripadvisor Travellers' Choice 2024, family-owned, licensed local guides, high value low volume).
9. **Final:** river video; two lines reveal in sequence; "BEGIN YOUR JOURNEY →".

**Interactive map:** full-viewport map.
- Left: mode title plus a list that hovers and selects.
- Bottom: six modes (Destinations, Journeys, Festivals, Trekking, Culture, Nature). Each mode changes the markers; Journeys mode animates the route over 3.6s and the list switches between journeys.
- Selecting zooms the camera to 2.2 (focusX .4) and opens a right panel: image, coordinates, altitude, kind, line, tags, "EXPLORE <NAME> →". Esc closes it.

**Journeys:** split hero.
- "Discover by feeling": seven huge serif words acting as multi-select toggles, each with a live count.
- "How long" and "What kind": square-cornered segmented toggles; Clear all.
- Results in a varied rhythm: 1 full-bleed feature, then 2 offset editorial items, then 1 horizontal split, then 1 full-width centred italic, then small rows. There's an empty state.
- Horizontal snap strip of experiences; hover plays the video, click filters.

**Journey:** hero with the title and route, then a five-fact strip.
- Elevation profile: SVG with an area fill, revealed as you scroll into view, and the current stop enlarged.
- Itinerary: sticky map on the left (5/12 width), with a `03 / 11 DAYS` counter and progress bar. Each day is a 100vh article (DAY numeral, place, altitude and coordinates, title, text, photo).
- The active day is at full opacity; the others are at .38. The route progress interpolates toward the next day's stop with scroll.
- On mobile (<900px), the map becomes a 38vh sticky band.
- CTA "Make it yours." on parchment.

**Destinations:** sticky map on the left; on the right, a sticky crossfading photo and a numbered list. Hovering the list or a marker syncs both; clicking navigates.

**Punakha** (rivers / warmth):
- Hero with giant "Punakha" (21vw) anchored at the bottom; its image and word carry the view-transition names.
- Two rivers: "Pho Chhu" and "Mo Chhu" converge from opposite sides by scroll (ease-out cubic), over animated sine-wave lines; then "MEET HERE" and the history copy appear.
- Parchment horizontal gallery (320vh): the track translates on vertical scroll; five staggered figures and a counter.
- Things to do list, then a zoomed map with the journeys through Punakha.

**Destination template** (variants by slug):
- `vertical` (paro, taktsang): split hero with a vertical altitude rule, plus the **Tiger's Nest mist sequence** (420vh). Five mist blobs drift away, blur goes 10px→0, saturation .5→1 and scale 1.25→1.05. Then "TIGER'S NEST / Paro Taktsang", then altitude ~3,120 m and ~900 m above the valley, then the trail text, each staged in turn.
- `still` (phobjikha, haa): lots of whitespace, a small centred title, then a wide slow-zoom photo.
- `editorial` (bumthang, trongsa): parchment, a 12-column magazine grid with a giant title.
- `default`: full-bleed hero.

**Build your journey:** seven full-screen steps with background crossfades and a progress bar (`01 / 07`).
- Why: multi-select of serif options.
- Time: range 4–21 days, with a giant numeral and a region note.
- When: 12-month wheel with a rotating needle; shows season copy and that month's festivals.
- Who, Pace, Stay: single select. Interests: multi-select.
- Required steps gate the Continue button. Enter advances.
- Result: "Your Bhutan" with stats (days / places / regions), a stop list that lights up as the route animates over 4s on the map, notes and the SDF estimate. Name and email fields feed a mailto with the full summary; "SEND THIS JOURNEY TO A BHUTAN EXPERT", then a confirmation state.
- The route logic is in `plan()`. Port it as-is.

**Plan** (calm, bone): eight-cell pathway grid, then ruled key/value sections (flights, when, stay, money, health, etiquette), then an FAQ accordion (grid-rows 0fr→1fr).

**Visa:** five-step vertical process whose line fills and whose dots fill as you scroll.
- Red "We help handle the process." band.
- Fee table plus a live calculator (adults × 100 + children 6–12 × 50) × nights + visas × 40.

**Festivals:** sticky month rail (dots on months that have festivals).
- Horizontal calendar with one column per month: drag to scroll (with click suppression after a drag), plus shift+wheel; the rail syncs to the scroll position.
- Clicking a festival opens a full-screen takeover (clip-path from the centre). It shows the story, where (linked), when, journeys through it, and "BUILD A JOURNEY AROUND THIS FESTIVAL →" (→ build with `?d=`).

**About** (parchment): hero; sticky image storytelling across four chapters (images crossfade by scroll); founder section on charcoal (portrait, quote, bio, timeline); responsible-travel pillars.

**Stories:** masthead with kicker filters; lead story in a 2:1 split; staggered grid.
**Story:** 3px reading-progress bar, full hero, drop cap, full-bleed inline photo, giant centred pull quote, two-up figures, then a related-destination map (light variant), a related journey and a CTA.

## Content / data
`assets/data.js` holds:
- **Media config:** `heroVideo`, `heroPoster`, `riverVideo`, plus Commons photos keyed by place.
- **brand:** the BMV-owned photos.
- **dest:** 11 places with coordinates and altitudes.
- **journeys:** 9 journeys, with the full itinerary for `valleys-of-the-thunder-dragon`.
- **festivals**, **experiences**, **stories**, **contact**.

Port all of this to typed TS (`Destination`, `Journey`, `Festival`, …). Put the hero video path in one config constant (`heroVideo: "/video/bhutan-hero.mp4"`) so the client can swap in their own film.

## Assets
See `assets/ASSETS.md` for every source, creator, licence and usage.
- **Hero video:** temporary Pexels clip; its location is unverified, so replace it.
- **Commons photos:** CC BY / CC BY-SA, so attribution is needed. Download them locally and serve them via `next/image` rather than hotlinking.
- **BMV images:** low-res copies from bhutanmindvacation.com; get the high-res originals from the client.
- **Geo data:** geoBoundaries (CC BY), and the terrain renders.

## Open items
- The journeys are sample itineraries; replace them with BMV's programmes.
- Coordinates and elevations are approximate (Wikipedia/OSM), so verify them.
- Non-BMV festival dates are given by lunar month only.
- Experiences category pages and an interactive When-to-Visit tool are not designed yet.

## Files
`design/*.dc.html` (17 files, listed in the Routes table) · `assets/data.js` · `assets/geo.js` · `assets/geo/btn-adm0.json`, `btn-adm1.json`, `terrain-dark.jpg`, `terrain-light.jpg` · `assets/ASSETS.md`
