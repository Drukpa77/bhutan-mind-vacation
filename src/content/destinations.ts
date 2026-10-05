/* Coordinates: WGS84, rounded; from Wikipedia/OpenStreetMap place pages for each town / dzong.
   Elevations: approximate, from Wikipedia place articles. CROSS-CHECK BEFORE LAUNCH. */
import { img } from './media';
import type { Destination } from './types';

export const destinations: Destination[] = [
  { id: 'paro', name: 'Paro', lon: 89.4134, lat: 27.4305, alt: 2200, region: 'West', kind: 'Valley of arrival', tags: ['Airport', 'Rinpung Dzong', 'Tiger’s Nest', 'Farmhouses'], line: 'Every journey begins with a landing between ridgelines.', img: img('paro', 0), img2: img('paro', 1), page: '/destinations/paro' },
  { id: 'taktsang', name: 'Paro Taktsang', short: 'Taktsang', lon: 89.3634, lat: 27.4919, alt: 3120, region: 'West', kind: 'Cliffside monastery', tags: ['Pilgrimage', 'Hike', '~900 m above the valley'], line: 'Tiger’s Nest clings to a granite face above the Paro valley.', img: img('taktsang', 0), img2: img('taktsang', 2), page: '/destinations/taktsang' },
  { id: 'haa', name: 'Haa Valley', short: 'Haa', lon: 89.2806, lat: 27.3866, alt: 2670, region: 'West', kind: 'Hidden valley', tags: ['Chele La', 'Homestays', 'Summer festival'], line: 'Opened to visitors only in 2002 — and still quiet.', img: img('haa', 0), page: '/destinations/haa' },
  { id: 'thimphu', name: 'Thimphu', lon: 89.6386, lat: 27.4716, alt: 2320, region: 'West', kind: 'Capital without traffic lights', tags: ['Tashichho Dzong', 'Buddha Dordenma', 'Weekend market'], line: 'A capital that still directs traffic by hand.', img: img('thimphu', 0), img2: img('thimphuvalley', 0), page: '/destinations/thimphu' },
  { id: 'dochula', name: 'Dochula', lon: 89.7493, lat: 27.4920, alt: 3100, region: 'West', kind: 'Mountain pass', tags: ['108 chortens', 'Himalayan panorama'], line: 'On a clear day, the high Himalaya lines the northern horizon.', img: img('dochula', 0), page: '/destinations/dochula' },
  { id: 'punakha', name: 'Punakha', lon: 89.8631, lat: 27.5815, alt: 1200, region: 'West', kind: 'Subtropical valley', tags: ['Rivers', 'Dzong', 'Rafting', 'Hikes'], line: 'Where the Pho Chhu and Mo Chhu meet beneath the most beautiful dzong in the kingdom.', img: img('punakha', 0), img2: img('punakha', 1), page: '/destinations/punakha' },
  { id: 'phobjikha', name: 'Phobjikha', lon: 90.1800, lat: 27.4590, alt: 2900, region: 'Central', kind: 'Glacial valley', tags: ['Black-necked cranes', 'Gangtey Goenpa', 'Nature trail'], line: 'A wide, silent bowl where cranes arrive each winter.', img: img('phobjikha', 0), img2: img('crane', 0), page: '/destinations/phobjikha' },
  { id: 'trongsa', name: 'Trongsa', lon: 90.5076, lat: 27.4996, alt: 2200, region: 'Central', kind: 'Ancestral seat', tags: ['Trongsa Dzong', 'Royal history'], line: 'The dzong that once controlled the only road between east and west.', img: img('trongsa', 0), page: '/destinations/trongsa' },
  { id: 'bumthang', name: 'Bumthang', lon: 90.7525, lat: 27.5492, alt: 2600, region: 'Central', kind: 'Sacred heartland', tags: ['Jakar Dzong', 'Jambay Lhakhang', 'Kurjey Lhakhang'], line: 'Four valleys, older than history, dense with temples.', img: img('jakar', 0), img2: img('jakar', 1), page: '/destinations/bumthang' },
  { id: 'trashigang', name: 'Trashigang', lon: 91.5536, lat: 27.3333, alt: 1100, region: 'East', kind: 'Eastern frontier', tags: ['Trashigang Dzong', 'Textiles', 'Merak & Sakteng'], line: 'The far east, where few travellers go.', img: '', page: '/destinations/trashigang' },
  { id: 'jangothang', name: 'Jangothang', lon: 89.3317, lat: 27.8548, alt: 4080, region: 'North', kind: 'Jomolhari base camp', tags: ['Trek', 'Jomolhari 7,326 m'], line: 'Base camp beneath Jomolhari’s east face.', img: img('jomolhari', 0), page: '/destinations/jangothang', trek: true }
];

export const byId: Record<string, Destination> = Object.fromEntries(destinations.map(d => [d.id, d]));

/** Destination page copy (headline + body) — falls back to kind + line. */
export const destinationCopy: Record<string, [string, string]> = {
  paro: ['Arrival, height, cliffs', 'The only international airport sits at around 2,200 m, approached through a narrow valley — one of the most remarkable landings anywhere. Above the town, Rinpung Dzong guards the river; above that, Tiger’s Nest hangs on its granite face.'],
  taktsang: ['A monastery on the edge of the sky', 'Built in 1692 around the cave where Guru Rinpoche is said to have meditated. The walk up is a pilgrimage for Bhutanese families and a rite of passage for visitors.'],
  haa: ['The quiet valley', 'Over Chele La from Paro, Haa opened to visitors only in 2002. Farmhouse homestays, the Haa Summer Festival, and very few other travellers.'],
  thimphu: ['A capital at human scale', 'Bhutan’s capital is still small enough to walk. Tashichho Dzong houses the throne room and government; the Buddha Dordenma watches from the ridge.'],
  dochula: ['The pass of 108 chortens', 'At about 3,100 m on the road from Thimphu to Punakha, the Druk Wangyal chortens frame — on clear winter mornings — a long line of Himalayan peaks.'],
  phobjikha: ['Stillness, space, cranes', 'A wide glacial valley on the western slopes of the Black Mountains. From late autumn, endangered black-necked cranes arrive from the Tibetan plateau to winter in its marshes. Gangtey Goenpa watches from the ridge.'],
  trongsa: ['The centre of the kingdom', 'Trongsa Dzong commands the old east–west route. The first two kings of Bhutan ruled from here, and the Crown Prince traditionally serves as Trongsa Penlop.'],
  bumthang: ['History, sacred landscape, culture', 'Bumthang’s four valleys — Chokhor, Tang, Ura and Chhume — hold some of the oldest temples in the kingdom, including Jambay Lhakhang and Kurjey Lhakhang. Buckwheat, cheese, honey and yathra weaving.'],
  trashigang: ['The far east', 'Bhutan’s largest district by population, and the gateway to the semi-nomadic Brokpa communities of Merak and Sakteng.'],
  jangothang: ['Beneath Jomolhari', 'Base camp of the Jomolhari trek at around 4,080 m, under the 7,326 m east face of Jomolhari.']
};

export type DestinationVariant = 'vertical' | 'still' | 'editorial' | 'default';

/** Layout variant of the destination template, chosen per slug. */
export const destinationVariant = (id: string): DestinationVariant =>
  ({ paro: 'vertical', taktsang: 'vertical', phobjikha: 'still', haa: 'still', bumthang: 'editorial', trongsa: 'editorial' } as Record<string, DestinationVariant>)[id] ?? 'default';
