// flavors.mjs - the nine Hashables SKUs and their three lines. Facts trace to docs/FACTS.md; tasting notes, taglines,
// stories and pairings are NEW COPY (sensory language, never ingredient claims) for Nova Farms to approve.
export const AWARDS = {
  ht22: { year: '2022', title: 'High Times Cannabis Cup Massachusetts: People’s Choice Edition 2022', place: 'Second Place, Sativa Gummies',
    product: 'Watermelon Jolt', href: 'https://hightimes.com/events/the-winners-of-the-high-times-cannabis-cup-massachusetts-peoples-choice-edition-2022/', source: 'High Times, Nov 28, 2022' },
  ht23: { year: '2023', title: 'High Times Cannabis Cup Massachusetts: People’s Choice Edition 2023', place: 'Third Place, Edibles: Sativa Gummies',
    product: 'Tropical Typhoon', href: 'https://hightimes.com/events/the-winners-of-the-high-times-cannabis-cup-massachusetts-peoples-choice-edition-2023/', source: 'High Times, Jan 16, 2024' },
  hc23: { year: '2023', title: '2023 Harvest Cup, Worcester, MA', place: 'Winner, Sugar Confections',
    product: 'Tropical Typhoon', href: 'https://www.apextrading.com/blog/congratulations-to-the-remarkable-massachusetts-2023-harvest-cup-winners/', source: 'Apex Trading, 2023 Harvest Cup winners' },
};

export const LINES = {
  core: {
    slug: 'core', name: 'Core Flavors', short: 'Core', kicker: 'Year-round', title: 'The Core Five',
    lead: 'Five year-round flavors that never leave the lineup. Same fresh-pressed hash rosin, same uplifting chill, five different ways to taste paradise.',
    body: 'Tropical Typhoon, Bangin’ Berry, Watermelon Jolt, Peachy Mango and Electric Grape are the heart of the stack. Two of them have already brought home trophies. All five are made the same way: our own fresh frozen farm flower, pressed into solventless live rosin, dosed into a sugar-dusted cube.',
    points: ['Year-round, every season', 'Fresh-pressed solventless hash rosin', 'One feeling across the line: uplifting chill'],
    scene: 'lineup', scenePos: '50% 46%', color: '#3facc9',
    seoTitle: 'Core Flavors: Year-Round Hash Rosin Gummies', meta: 'Meet the Hashables Core Five: Tropical Typhoon, Bangin’ Berry, Watermelon Jolt, Peachy Mango and Electric Grape. Fresh-pressed, solventless live rosin gummies.',
  },
  specialty: {
    slug: 'specialty', name: 'Specialty', short: 'Specialty', kicker: 'Made for a moment', title: 'Specialty Gummies',
    lead: 'Two gummies built for specific moments: Remberry for winding down at night, and sugar-free Blue Raspberry for anyone skipping the sugar.',
    body: 'Like the core five, the specialties are here to stay. Remberry pairs fresh-pressed THC hash rosin with CBN and CBD, finished with melatonin in some markets and melatonin-free in others. Blue Raspberry keeps the flavor and leaves out the sugar.',
    points: ['Remberry: a nighttime formula with CBN and CBD', 'Blue Raspberry: sugar-free', 'Year-round, not going anywhere'],
    scene: 'milkyway', scenePos: '50% 40%', color: '#a1c7ee',
    seoTitle: 'Specialty Gummies: Remberry Sleep and Sugar-Free Blue Raspberry', meta: 'Hashables specialty gummies: Remberry, the nighttime hash rosin gummy with CBN and CBD, and sugar-free Blue Raspberry.',
  },
  limited: {
    slug: 'limited-edition', name: 'Limited Edition', short: 'Limited', kicker: 'While they last', title: 'Limited Edition Flavors',
    lead: 'Short runs of big flavor. Lemon Burst and Prickly Pear are in the stack for now, and when they’re gone they may not come back.',
    body: 'Limited editions are where we play. They’re pressed the same way as everything else we make, with fresh-pressed solventless hash rosin, and they stick around for as long as the run lasts. Catch them while they’re in season.',
    points: ['Limited runs', 'Fresh-pressed solventless hash rosin', 'Here while supplies last'],
    scene: 'palms-pink-inv', scenePos: '50% 50%', color: '#ff7ca5',
    seoTitle: 'Limited Edition Hash Rosin Gummies: Lemon Burst and Prickly Pear', meta: 'Hashables limited editions: Lemon Burst and Prickly Pear live rosin gummies. Fresh pressed, solventless, and here while they last.',
  },
};

const CORE_CHIPS = ['Fresh pressed', 'Solventless live rosin', 'Full-spectrum', 'Uplifting chill'];

export const FLAVORS = [
  {
    slug: 'tropical-typhoon', name: 'Tropical Typhoon', line: 'core', color: '#2e8fd6', glow: '#7fd3ff',
    tagline: 'The storm everyone’s chasing.',
    notes: 'A whirl of island fruit that rolls in like a warm front: think ripe pineapple, sunny mango and a tangy twist of passion fruit, wrapped around the clean, flowery finish of fresh-pressed hash rosin.',
    story: 'Tropical Typhoon is the flavor that put trophies on the shelf. It won the Sugar Confections category at the 2023 Harvest Cup in Worcester and took third place for sativa gummies at the High Times Cannabis Cup Massachusetts People’s Choice Edition 2023. The packaging is new; the gummy inside is the same one.',
    pairs: ['A golden-hour porch hang', 'Your summer playlist on shuffle', 'A sunset boardwalk stroll'],
    chips: CORE_CHIPS, awards: ['hc23', 'ht23'],
  },
  {
    slug: 'bangin-berry', name: 'Bangin’ Berry', line: 'core', color: '#d8433a', glow: '#ff8a7a',
    tagline: 'A berry patch with the volume up.',
    notes: 'Bright, jammy and a little wild: think sun-warmed raspberry, juicy strawberry and a deep blackberry finish, all riding on the flower-forward taste that only real hash rosin brings.',
    story: 'Bangin’ Berry is the mixed-berry stack of the core lineup, the taste of the last pick on a July afternoon. It’s a year-round flavor, so berry season never really has to end.',
    pairs: ['A hammock in the shade', 'A record on the turntable', 'A beach-read afternoon'],
    chips: CORE_CHIPS, awards: [],
  },
  {
    slug: 'watermelon-jolt', name: 'Watermelon Jolt', line: 'core', color: '#f0505a', glow: '#ff9aa2',
    tagline: 'Cool, crisp and charged.',
    notes: 'Like the coldest slice in the cooler: think crisp, juicy watermelon with a bright pop of sweetness up front and a clean, flowery hash rosin finish.',
    story: 'Watermelon Jolt took second place for sativa gummies at the High Times Cannabis Cup Massachusetts People’s Choice Edition 2022. It tastes like sticky fingers and long summer days, whatever the calendar says.',
    pairs: ['A shady spot under the umbrella', 'The Sunday crossword', 'Watching the waves roll in'],
    chips: CORE_CHIPS, awards: ['ht22'],
  },
  {
    slug: 'peachy-mango', name: 'Peachy Mango', line: 'core', color: '#f7941d', glow: '#ffc36b',
    tagline: 'Golden hour in a cube.',
    notes: 'Soft, sunny and sweet: think ripe orchard peach melting into lush tropical mango, finished with the gentle floral notes of fresh-pressed rosin.',
    story: 'Peachy Mango is pure golden-hour energy: mellow, warm and easy to love. If a sunset had a flavor, we think it would taste a lot like this.',
    pairs: ['Sunset on the deck', 'A slow dinner at home', 'Your coziest hoodie'],
    chips: CORE_CHIPS, awards: [],
  },
  {
    slug: 'electric-grape', name: 'Electric Grape', line: 'core', color: '#6b2a55', glow: '#c77dff',
    tagline: 'Purple skies, charged up.',
    notes: 'Deep, dark and juicy: think concord grape straight off the vine, a bold, nostalgic flavor with an electric edge and the rich flower finish of real hash rosin.',
    story: 'Electric Grape is the after-dark flavor of the core lineup, all violet skies and summer thunder rumbling far out over the water. Big flavor, same uplifting chill.',
    pairs: ['A summer storm from the porch', 'Movie night on the couch', 'Stargazing from the dunes'],
    chips: CORE_CHIPS, awards: [],
  },
  {
    slug: 'remberry', name: 'Remberry', line: 'specialty', badge: 'Sleep', color: '#f26b5b', glow: '#a1c7ee',
    tagline: 'Made for winding down.',
    notes: 'A soft, dreamy berry blend: think dark blackberry and ripe currant, mellow and round, made for the last part of the day.',
    story: 'Remberry is our nighttime gummy. It pairs fresh-pressed THC hash rosin with CBN and CBD. In some markets it’s finished with a touch of melatonin and in others it’s melatonin-free, so check the label on your pack for what’s inside where you live.',
    pairs: ['Lights low, phone down', 'A warm shower and clean sheets', 'The sound of the ocean (or a good fan)'],
    chips: ['Fresh pressed', 'Solventless live rosin', 'CBN + CBD', 'Nighttime'], feel: 'Winding down', awards: [],
  },
  {
    slug: 'blue-raspberry', name: 'Blue Raspberry', line: 'specialty', badge: 'Sugar-free', color: '#25a99c', glow: '#7ff3e6',
    tagline: 'Big flavor, zero sugar.',
    notes: 'Cool, tangy and bright: think blue raspberry over crushed ice, a snappy, poolside kind of flavor, made without the sugar.',
    story: 'Blue Raspberry is our sugar-free specialty, for anyone watching their sugar who still wants a fresh-pressed hash gummy that tastes like summer.',
    pairs: ['Poolside shade', 'A long walk after dinner', 'A cold glass of water and a good book'],
    chips: ['Fresh pressed', 'Solventless live rosin', 'Sugar-free', 'Uplifting chill'], awards: [],
  },
  {
    slug: 'lemon-burst', name: 'Lemon Burst', line: 'limited', badge: 'Limited edition', color: '#f2c230', glow: '#fff27a',
    tagline: 'Squeeze the day.',
    notes: 'Zesty and sun-bright: think fresh-squeezed lemon with a sweet, sunny finish, a burst of citrus over the floral notes of fresh-pressed rosin.',
    story: 'Lemon Burst is a limited edition, a short run of pure sunshine. When this run is gone it may be gone for good, so grab a stack while it lasts.',
    pairs: ['Bright Saturday mornings', 'Fresh air through an open window', 'A beach chair with your name on it'],
    chips: ['Fresh pressed', 'Solventless live rosin', 'Limited run', 'Uplifting chill'], awards: [],
  },
  {
    slug: 'prickly-pear', name: 'Prickly Pear', line: 'limited', badge: 'Limited edition', color: '#e8457a', glow: '#ff9ec4',
    tagline: 'Desert fruit, ocean breeze.',
    notes: 'Juicy and a little exotic: prickly pear is the fruit of the nopal cactus, and its flavor lands somewhere between watermelon and fresh berry, with a soft floral sweetness that sits right next to the flower-forward finish of fresh-pressed hash rosin.',
    story: 'Ever wondered what prickly pear tastes like? This is your chance. It’s a limited edition, so catch it while it’s in season.',
    pairs: ['A golden-hour beach walk', 'A new album, front to back', 'Sunsets worth staying up for'],
    chips: ['Fresh pressed', 'Solventless live rosin', 'Limited run', 'Uplifting chill'], awards: [],
  },
];

export const lineOf = (f) => LINES[f.line];
export const byLine = (line) => FLAVORS.filter((f) => f.line === line);
export const flavorUrl = (f) => '/live-rosin-gummies/' + f.slug + '/';
export const lineUrl = (l) => '/live-rosin-gummies/' + (LINES[l] || l).slug + '/';
