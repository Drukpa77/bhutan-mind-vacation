/* Journeys are SAMPLE itineraries built on real road routes — replace with BMV programmes. */
import { brand, img } from './media';
import type { Journey } from './types';

export const DEFAULT_JOURNEY = 'valleys-of-the-thunder-dragon';

export const journeys: Journey[] = [
  {
    id: 'valleys-of-the-thunder-dragon', no: '04', title: 'Valleys of the Thunder Dragon', days: 11, feel: ['Wonder', 'Culture', 'Stillness'], cat: ['Culture', 'Spiritual'],
    route: ['paro', 'thimphu', 'dochula', 'punakha', 'phobjikha', 'trongsa', 'bumthang', 'paro', 'taktsang'], flight: [6], season: 'Mar–May · Sep–Nov', pace: 'Balanced', img: img('punakha', 0),
    line: 'West to the sacred heartland and back — the classic crossing, done slowly.',
    itinerary: [
      { day: 1, dest: 'paro', title: 'Arrival between ridgelines', text: 'The descent into Paro is the first story you will tell. Afternoon at Rinpung Dzong, then the old covered bridge at dusk.', img: img('paro', 0) },
      { day: 2, dest: 'thimphu', title: 'Up the Wang Chhu', text: 'An hour upriver to the capital. Evening walk to the Memorial Chorten as locals circle it, prayer beads in hand.', img: img('thimphuvalley', 1) },
      { day: 3, dest: 'thimphu', title: 'The working capital', text: 'Tashichho Dzong, the Buddha Dordenma above the valley, and the weekend market if your dates allow.', img: img('thimphu', 0) },
      { day: 4, dest: 'dochula', title: 'Over Dochula', text: '108 chortens at the pass. On clear mornings the Himalaya fills the northern horizon. Then down into warmth.', img: img('dochula', 0) },
      { day: 5, dest: 'punakha', title: 'Where two rivers meet', text: 'Punakha Dzong at the confluence of the Pho Chhu and Mo Chhu. Rice terraces, the long suspension bridge, Chimi Lhakhang.', img: img('punakha', 1) },
      { day: 6, dest: 'phobjikha', title: 'Into the glacial bowl', text: 'Climb to Phobjikha. Gangtey Goenpa on its ridge; the nature trail across the valley floor.', img: img('phobjikha', 0) },
      { day: 7, dest: 'trongsa', title: 'The centre of the kingdom', text: 'Over Pele La to Trongsa, the dzong that once held the road between east and west.', img: img('trongsa', 0) },
      { day: 8, dest: 'bumthang', title: 'The sacred heartland', text: 'Into Bumthang’s four valleys. Jakar Dzong, “fortress of the white bird”.', img: img('jakar', 0) },
      { day: 9, dest: 'bumthang', title: 'Temples older than memory', text: 'Jambay Lhakhang and Kurjey Lhakhang. Buckwheat pancakes and local cheese for lunch.', img: img('jakar', 1) },
      { day: 10, dest: 'paro', title: 'Back west', text: 'Domestic flight from Bathpalathang to Paro when schedules allow — otherwise a scenic two-day drive.', img: img('paro', 1) },
      { day: 11, dest: 'taktsang', title: 'The Tiger’s Nest', text: 'The climb to Paro Taktsang. Start early; the light on the cliff is worth it.', img: img('taktsang', 0) }
    ]
  },
  { id: 'western-valleys', no: '01', title: 'First Light in the West', days: 6, feel: ['Wonder', 'Culture'], cat: ['Culture'], route: ['paro', 'thimphu', 'dochula', 'punakha', 'paro', 'taktsang'], season: 'Year-round', pace: 'Balanced', img: img('thimphu', 1), line: 'Paro, Thimphu and Punakha — the essential Bhutan in under a week.' },
  { id: 'jomolhari', no: '07', title: 'Beneath Jomolhari', days: 10, feel: ['Adventure', 'Solitude'], cat: ['Trekking'], route: ['paro', 'jangothang', 'paro', 'taktsang'], season: 'Apr–May · Oct–Nov', pace: 'Packed', img: img('jomolhari', 0), line: 'Yak pastures, high camps, and base camp under a 7,326 m peak.' },
  { id: 'masked-dances', no: '02', title: 'The Masked Dances of Paro', days: 8, feel: ['Celebration', 'Culture'], cat: ['Festivals', 'Culture'], route: ['paro', 'haa', 'thimphu', 'punakha', 'paro'], season: 'Paro Tshechu (spring)', pace: 'Balanced', img: img('parotsechu', 1), line: 'Built around the five days of Paro Tshechu.' },
  { id: 'crane-season', no: '05', title: 'The Season of Cranes', days: 9, feel: ['Stillness', 'Wonder', 'Solitude'], cat: ['Wellness', 'Festivals'], route: ['paro', 'thimphu', 'punakha', 'phobjikha', 'punakha', 'paro'], season: 'Nov – Feb', pace: 'Slow', img: img('crane', 0), line: 'Winter in Phobjikha, timed to the Black-necked Crane Festival.' },
  { id: 'quiet-luxury', no: '03', title: 'Slow & Quiet', days: 7, feel: ['Stillness', 'Connection'], cat: ['Luxury', 'Wellness'], route: ['paro', 'thimphu', 'punakha', 'paro'], season: 'Year-round', pace: 'Slow', img: brand.luxury, line: 'Fewer places, longer stays, hot-stone baths and private guides.' },
  { id: 'haa-chele', no: '06', title: 'Over Chele La', days: 5, feel: ['Adventure', 'Solitude'], cat: ['Trekking', 'Culture'], route: ['paro', 'haa', 'paro', 'taktsang'], season: 'Apr–Jun · Sep–Nov', pace: 'Balanced', img: img('haa', 0), line: 'The highest road pass in the west, then a homestay in Haa.' },
  { id: 'eastern-odyssey', no: '08', title: 'The Long Road East', days: 15, feel: ['Connection', 'Culture', 'Solitude'], cat: ['Culture', 'Spiritual'], route: ['paro', 'thimphu', 'punakha', 'phobjikha', 'trongsa', 'bumthang', 'trashigang'], season: 'Oct – Apr', pace: 'Balanced', img: img('trashigang', 0) || brand.undiscovered, line: 'Across the whole kingdom to the weaving villages of the east.' },
  { id: 'pilgrim', no: '09', title: 'The Pilgrim’s Path', days: 12, feel: ['Stillness', 'Connection'], cat: ['Spiritual'], route: ['paro', 'taktsang', 'thimphu', 'punakha', 'bumthang', 'paro'], season: 'Year-round', pace: 'Slow', img: brand.spiritual, line: 'Sacred sites, butter lamps and teachings — at a pilgrim’s pace.' }
];

export const journeyHref = (j: Pick<Journey, 'id'>) => `/journeys/${j.id}`;
