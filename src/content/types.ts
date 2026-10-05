export type Region = 'West' | 'Central' | 'East' | 'North';

export interface Destination {
  id: string;
  name: string;
  /** Short label used on maps and route strings (e.g. "Taktsang"). */
  short?: string;
  lon: number;
  lat: number;
  /** Approximate elevation in metres. */
  alt: number;
  region: Region;
  kind: string;
  tags: string[];
  line: string;
  img: string;
  img2?: string;
  /** Route of the destination page. */
  page: string;
  trek?: boolean;
}

export interface ItineraryDay {
  day: number;
  dest: string;
  title: string;
  text: string;
  img: string;
}

export type Feeling = 'Stillness' | 'Adventure' | 'Wonder' | 'Connection' | 'Culture' | 'Solitude' | 'Celebration';
export type JourneyCategory = 'Culture' | 'Trekking' | 'Luxury' | 'Festivals' | 'Spiritual' | 'Wellness';
export type Pace = 'Slow' | 'Balanced' | 'Packed';

export interface Journey {
  id: string;
  no: string;
  title: string;
  days: number;
  feel: Feeling[];
  cat: JourneyCategory[];
  /** Ordered destination ids. */
  route: string[];
  /** Indices of route legs flown rather than driven. */
  flight?: number[];
  season: string;
  pace: Pace;
  img: string;
  line: string;
  itinerary?: ItineraryDay[];
}

export interface Festival {
  id: string;
  name: string;
  /** 0-based month index. */
  month: number;
  /** Exact published date, when known. */
  date?: string;
  when: string;
  place: string;
  img: string;
  text: string;
}

export interface Experience {
  id: string;
  verb: string;
  name: string;
  img: string;
  video?: string;
  text: string;
}

export interface Story {
  id: string;
  title: string;
  kicker: string;
  date: string;
  img: string;
  dest: string;
  dek: string;
  /** Path of the original post on bhutanmindvacation.com/blog/ */
  orig: string;
}

export interface Contact {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
}

export interface MediaCredit {
  local: string;
  remote: string;
  title?: string;
  by?: string;
  licence?: string;
  page?: string;
  note?: string;
}
