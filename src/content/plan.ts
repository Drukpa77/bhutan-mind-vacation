/* Plan your trip — practical copy. Fees and rules change: re-check with the Department of Tourism before launch. */

export const planPaths: [title: string, href: string, sub: string][] = [
  ['Visa & SDF', '/plan/visa', 'Process, fees, what we handle'], ['Flights', '#flights', 'Paro, carriers, connections'], ['When to visit', '#when', 'Seasons and festivals'], ['Accommodation', '#stay', 'From farmhouses to lodges'],
  ['Money', '#money', 'Ngultrum, cards, tipping'], ['Health', '#health', 'Altitude and insurance'], ['Etiquette', '#etiquette', 'Dzongs, chortens, dress'], ['FAQ', '#faq', 'Short answers']
];

export const planSections: { id: string; title: string; items: [string, string][] }[] = [
  { id: 'flights', title: 'Flights', items: [['ARRIVAL', 'Paro International Airport is the only international airport. Flights are operated by Drukair and Bhutan Airlines.'], ['CONNECTIONS', 'Via regional hubs such as Bangkok, Delhi, Kathmandu and Singapore. Schedules change seasonally — we book and confirm seats for you.'], ['BY LAND', 'Overland entry is possible via Phuentsholing, Gelephu and Samdrup Jongkhar.'], ['TIP', 'On the approach into Paro, the left side usually has the mountain views.']] },
  { id: 'when', title: 'When to visit', items: [['SPRING · MAR–MAY', 'Blossom and rhododendrons, mild days, Paro Tshechu.'], ['SUMMER · JUN–AUG', 'Monsoon: green, quiet, wet afternoons.'], ['AUTUMN · SEP–NOV', 'Clear skies, harvest, peak trekking and festival season.'], ['WINTER · DEC–FEB', 'Cold, clear, best mountain views; cranes in Phobjikha.'], ['FESTIVALS', 'See the full calendar on the Festivals page.']] },
  { id: 'stay', title: 'Accommodation', items: [['STANDARD', 'Tourist hotels in Bhutan are certified by the Department of Tourism; most journeys use 3-star and above.'], ['BOUTIQUE & LUXURY', 'International luxury lodges operate in Paro, Thimphu, Punakha, Gangtey and Bumthang.'], ['HOMESTAYS', 'Farmhouse stays — hot-stone baths, home cooking — in Haa, Paro and Bumthang.']] },
  { id: 'money', title: 'Money', items: [['CURRENCY', 'The ngultrum (BTN), pegged 1:1 to the Indian rupee.'], ['CARDS', 'Accepted at larger hotels and shops; carry cash for villages and markets.'], ['FEES', 'The Sustainable Development Fee is a government levy, quoted separately and clearly.']] },
  { id: 'health', title: 'Health', items: [['ALTITUDE', 'Most valleys sit between 1,200 and 3,000 m; passes and treks go higher. Take the first days gently.'], ['INSURANCE', 'Comprehensive travel insurance with medical evacuation is strongly recommended.'], ['ADVICE', 'Ask your doctor about vaccinations well before you travel.']] },
  { id: 'etiquette', title: 'Culture & etiquette', items: [['DZONGS & TEMPLES', 'Long sleeves and long trousers or skirts; no hats. Photography inside temples is not allowed.'], ['CHORTENS', 'Walk around chortens and prayer wheels clockwise.'], ['TOBACCO', 'Smoking in public places is restricted — ask your guide.']] }
];

export const planFaq: [q: string, a: string][] = [
  ['Do I have to travel with a tour operator?', 'Visas are processed through a licensed Bhutanese tour operator or the official portal; licensed guides are required for most of the country. We arrange both.'],
  ['How much is the Sustainable Development Fee?', 'USD 100 per adult per night, under a concession in place until 31 August 2027. Children aged 6–12 pay 50%; 5 and under are exempt. Indian nationals pay INR 1,200 per night.'],
  ['Is the SDF included in the tour price?', 'We show it as a separate line so you can see exactly what goes to the government and what goes to your journey.'],
  ['What is the best time to visit?', 'Spring (March–May) and autumn (September–November) for clear weather and festivals. Winter is cold and clear; summer is green and quiet.'],
  ['Can you plan around a festival?', 'Yes — festival dates follow the lunar calendar and are confirmed each year. Tell us which one and we’ll build around it.']
];

/** /plan/<slug> sub-routes → the section anchor they open on. */
export const planSubRoutes: Record<string, { anchor: string; title: string }> = {
  flights: { anchor: 'flights', title: 'Flights to Bhutan' },
  'when-to-visit': { anchor: 'when', title: 'When to visit Bhutan' },
  accommodation: { anchor: 'stay', title: 'Accommodation in Bhutan' },
  'travel-tips': { anchor: 'money', title: 'Travel tips for Bhutan' },
  faq: { anchor: 'faq', title: 'Bhutan travel FAQ' }
};

export const visaSteps: [title: string, who: string, text: string][] = [
  ['Choose your journey', 'YOU + US', 'Tell us what you want from Bhutan. We shape the route, the pace and the places to stay.'],
  ['Confirm travel', 'YOU', 'Approve the itinerary and pay in full — including the Sustainable Development Fee — as Bhutan requires before a visa is issued.'],
  ['Passport details', 'YOU', 'Send a clear colour scan of your passport, valid for at least six months from your date of departure from Bhutan.'],
  ['Visa processing', 'US', 'We submit your application to the Department of Immigration and pay the USD 40 fee. Approval usually takes a few working days.'],
  ['Arrive in Bhutan', 'YOU', 'Show your visa clearance letter at check-in and on arrival at Paro. The visa is stamped into your passport. Your guide is waiting.']
];

export const visaFees: [k: string, v: string][] = [
  ['Visa fee (one-time)', 'USD 40'], ['SDF — adults (13+)', 'USD 100 / night'], ['SDF — children 6–12', 'USD 50 / night'], ['SDF — children 5 and under', 'Exempt'], ['SDF — Indian nationals', 'INR 1,200 / night']
];

export const SDF = { adult: 100, child: 50, visa: 40 } as const;
