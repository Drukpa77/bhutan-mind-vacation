/* Bhutan Mind Vacation — structured content (ported from the prototype's assets/data.js).
   Festival dates: exact dates only where published by BMV for 2026; others follow the lunar calendar (month shown). */
import { brand, img } from './media';
import { journeys } from './journeys';
import type { Contact, Experience, Festival, Story } from './types';

export * from './types';
export { media, img, brand, credits } from './media';
export { destinations, byId, destinationCopy, destinationVariant } from './destinations';
export { journeys, journeyHref, DEFAULT_JOURNEY } from './journeys';

export const festivals: Festival[] = [
  { id: 'punakha-drubchen', name: 'Punakha Drubchen & Tshechu', month: 1, when: 'Feb–Mar · lunar', place: 'punakha', img: img('punakha', 2), text: 'Re-enacts the 17th-century battle against Tibetan forces, followed by mask dances at the dzong.' },
  { id: 'paro-tshechu', name: 'Paro Tshechu', month: 2, when: 'Mar–Apr · lunar', place: 'paro', img: img('parotsechu', 0), text: 'Five days of mask dances. Before dawn on the last day, a giant thangka is unrolled across the dzong wall.' },
  { id: 'ura-yakchoe', name: 'Ura Yakchoe', month: 4, when: 'Apr–May · lunar', place: 'bumthang', img: img('jakar', 2), text: 'A village festival in Ura, Bumthang, centred on a sacred relic carried from the temple.' },
  { id: 'kurjey', name: 'Kurjey Tshechu', month: 5, when: 'Jun–Jul · lunar', place: 'bumthang', img: img('jakar', 1), text: 'Held at Kurjey Lhakhang, honouring Guru Rinpoche’s birth.' },
  { id: 'haa-summer', name: 'Haa Summer Festival', month: 6, when: 'July', place: 'haa', img: img('haa', 1), text: 'Nomadic life, local food, archery and songs in the Haa valley.' },
  { id: 'thimphu-tshechu', name: 'Thimphu Tshechu', month: 8, when: 'Sep–Oct · lunar', place: 'thimphu', img: img('thimtsechu', 0), text: 'The capital’s largest festival, at Tashichho Dzong.' },
  { id: 'jakar-tshechu', name: 'Jakar Tshechu', month: 9, date: '18 Oct 2026', when: '18 Oct 2026', place: 'bumthang', img: img('jakar', 0), text: 'Sacred mask dances and folk songs over three days, from the 7th day of the 9th lunar month.' },
  { id: 'jambay-drub', name: 'Jambay Lhakhang Drub', month: 9, date: '26 Oct 2026', when: '26 Oct 2026', place: 'bumthang', img: img('jakar', 2), text: 'One of Bhutan’s most unusual festivals — a midnight fire blessing at one of the kingdom’s oldest temples.' },
  { id: 'crane-festival', name: 'Black-necked Crane Festival', month: 10, date: '11 Nov', when: '11 November, annually', place: 'phobjikha', img: img('crane', 0), text: 'Children in crane costumes dance in the Gangtey Goenpa courtyard to welcome the returning birds.' },
  { id: 'dochula-festival', name: 'Druk Wangyel Tshechu', month: 11, date: '13 Dec 2026', when: '13 Dec 2026', place: 'dochula', img: img('dochula', 1), text: 'Performed by the Royal Bhutan Army rather than monks, at the 108 chortens of Dochula.' }
];

export const experiences: Experience[] = [
  { id: 'trekking', verb: 'Go higher', name: 'Trekking', img: brand.trekking, video: '/video/bhutan-river.mp4', text: 'From day hikes to Jomolhari base camp.' },
  { id: 'spiritual', verb: 'Find stillness', name: 'Spiritual journeys', img: brand.spiritual, text: 'Pilgrimage, meditation and the living faith of the dzongs.' },
  { id: 'festivals', verb: 'Follow the celebration', name: 'Festivals', img: brand.festivals, text: 'Mask dances, unrolled thangkas, whole valleys in their finest.' },
  { id: 'culture', verb: 'Be a guest', name: 'Culture', img: brand.culture, text: 'Farmhouses, archery, weaving and butter tea.' },
  { id: 'wellness', verb: 'Slow down', name: 'Wellness', img: brand.wellness, text: 'Yoga, hot-stone baths, forest walks.' },
  { id: 'adventure', verb: 'Move fast', name: 'Adventure', img: brand.adventure, text: 'Rafting, mountain biking, motorcycle routes.' },
  { id: 'photography', verb: 'Hold the light', name: 'Photography', img: brand.photography, text: 'Guided by people who know when the mist lifts.' },
  { id: 'honeymoon', verb: 'Begin together', name: 'Honeymoon', img: brand.honeymoon, text: 'Private valleys and quiet lodges.' },
  { id: 'luxury', verb: 'Be looked after', name: 'Luxury', img: brand.luxury, text: 'The kingdom’s finest lodges, privately guided.' },
  { id: 'culinary', verb: 'Taste it', name: 'Culinary', img: brand.culinary, text: 'Ema datshi, red rice, local wine and farmhouse kitchens.' },
  { id: 'eco', verb: 'Tread lightly', name: 'Ecotourism', img: brand.eco, text: 'A carbon-negative country, explored on its terms.' }
];

export const stories: Story[] = [
  { id: 'chumphu', title: 'The Hike to Chumphu Ney', kicker: 'Pilgrimage', date: '23 Feb 2021', img: brand.chumphu, dest: 'paro', dek: 'One of the holiest hikes in Bhutan, to a statue said to float above the ground.', orig: '2021/02/23/hike-to-chumphu-ney' },
  { id: 'hidden-gem', title: 'The Hidden Gem', kicker: 'Valleys', date: '15 May 2018', img: img('phobjikha', 1), dest: 'phobjikha', dek: 'Sacred wildlife, Buddhist history and alpine silence in Phobjikha.', orig: '2018/05/15/the-hidden-gyem' },
  { id: 'jabdo', title: 'The Sacred Jabdo Goenpa', kicker: 'Sacred sites', date: '8 Aug 2019', img: brand.jabdo, dest: 'thimphu', dek: 'A sacred abode of one of the nine Guru statues sculpted by Pentsi Dew.', orig: '2019/08/08/the-sacred-jabdo-goenpa' },
  { id: 'marriage', title: 'Marriage in Bhutan', kicker: 'People', date: '7 Mar 2019', img: brand.marriage, dest: 'thimphu', dek: 'Customs, ceremony and family in Bhutanese marriage.', orig: '2019/03/07/marriage-in-bhutan' },
  { id: 'lockdown', title: 'A Lockdown Like No Other', kicker: 'Kingdom', date: '9 Nov 2020', img: brand.lockdown, dest: 'thimphu', dek: 'How a small kingdom looked after its own.', orig: '2020/11/09/a-lockdown-like-no-other-bhutan' }
];

export const FULL_STORY = 'hidden-gem';

export const contact: Contact = {
  phone: '+975 7763 6226',
  whatsapp: '+97577636226',
  email: 'info@bhutanmindvacation.com',
  address: 'House No PHA-1-38, Unit 01-01, Babesa, Thimphu 11001, Bhutan'
};

export const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const;
export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const;

/** Upper-cased short name, e.g. "TAKTSANG". */
export const shortU = (d: { short?: string; name: string }) => (d.short || d.name).toUpperCase();
export const fmt = (n: number) => n.toLocaleString('en-US');
export const pad2 = (n: number) => String(n).padStart(2, '0');

/** Display order of the destinations atlas (west → east, then the high north). */
export const DESTINATION_ORDER = ['paro', 'taktsang', 'haa', 'thimphu', 'dochula', 'punakha', 'phobjikha', 'trongsa', 'bumthang', 'trashigang', 'jangothang'];

/** Journeys whose route passes through a destination. */
export const journeysThrough = (id: string) => journeys.filter(j => j.route.includes(id));

/** /about/<slug> sub-routes → the section anchor they open on. */
export const ABOUT_SUB_ROUTES: Record<string, { anchor: string; title: string }> = {
  'our-story': { anchor: 'story', title: 'Our Story' },
  founder: { anchor: 'founder', title: 'The Founder' },
  'responsible-travel': { anchor: 'responsible', title: 'Responsible Travel' }
};

export const FEELINGS: import('./types').Feeling[] = ['Stillness', 'Adventure', 'Wonder', 'Connection', 'Culture', 'Solitude', 'Celebration'];
export const CATS: import('./types').JourneyCategory[] = ['Culture', 'Trekking', 'Luxury', 'Festivals', 'Spiritual', 'Wellness'];
export const MAP_MODES = ['destinations', 'journeys', 'festivals', 'trekking', 'culture', 'nature'] as const;
export type MapMode = (typeof MAP_MODES)[number];
export const isMapMode = (m: string | undefined): m is MapMode => !!m && (MAP_MODES as readonly string[]).includes(m);
