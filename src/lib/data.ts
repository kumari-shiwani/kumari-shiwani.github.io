export const contact = {
  name: 'Shiwani Kumari',
  role: 'Sportswear & Knitwear Designer',
  email: 'shiwanikumari.here@gmail.com',
  phone: '+91 95701 86369',
  phoneHref: '+919570186369',
  linkedin: 'https://www.linkedin.com/in/shiwanikumari3',
  cv: '/Shiwani_CV.pdf',
  portfolioPdf: '/Shiwani_Kumari_Portfolio.pdf',
}

export const brands = [
  'Puma',
  'FC',
  'FCUK',
  'Myntra',
  'Marks & Spencer',
  "Levi's",
  'Walmart',
  'Milou',
  'MyTUK',
]

export type Chapter = {
  no: string
  title: string
  kicker: string
  description: string
  from: number
  to: number
}

export const chapters: Chapter[] = [
  {
    no: '01',
    title: 'Amma',
    kicker: 'Unisex infantwear · S/S',
    description:
      'An infantwear capsule for Mother’s Day, drawn from the bond between a mother and her little one. Hand illustrated characters and a Protect & Connect palette from WGSN × Coloro S/S 24.',
    from: 2,
    to: 6,
  },
  {
    no: '02',
    title: 'Knit Lab',
    kicker: 'Weft knit development',
    description:
      'Swatches knitted and documented by hand: front bed, back bed, tuck and miss notation, loop length, gauge, GSM and the yarn behind every structure.',
    from: 7,
    to: 11,
  },
  {
    no: '03',
    title: 'Milou',
    kicker: 'Care. The Swiss Way',
    description:
      'Kidswear for Milou, from print and appliqué artwork to finished sleepsuits, rompers and tees, through to the campaign.',
    from: 12,
    to: 16,
  },
  {
    no: '04',
    title: 'Ranges',
    kicker: 'Kidswear line sheets',
    description:
      'Seasonal boys, girls and infant ranges, planned and flat drawn style by style across tops, bottoms, outerwear and sets.',
    from: 17,
    to: 21,
  },
  {
    no: '05',
    title: 'Sportswear',
    kicker: 'Cycling training range · S/S 23',
    description:
      'A menswear training range designed to solve saddle sores. Fabric research, pencil development, colourways and complete tech packs for jerseys, bibs and jackets.',
    from: 22,
    to: 30,
  },
  {
    no: '06',
    title: 'Loungewear',
    kicker: 'Soul Space · Super Comfy',
    description:
      'Menswear forecast boards translated into a soft, relaxed lounge line, with swatch boards, line-up and specification sheets.',
    from: 31,
    to: 35,
  },
  {
    no: '07',
    title: 'Graphics',
    kicker: 'T-shirt artwork & colourways',
    description:
      'Original placement graphics, each developed into Pantone matched colour options and shown on garment.',
    from: 36,
    to: 43,
  },
  {
    no: '08',
    title: 'FCUK',
    kicker: 'Style Clyde · sketch to shelf',
    description:
      'One style followed all the way: combos, sketch details, brand carrier artwork, neck tape, woven labels and the packaging trade pack.',
    from: 44,
    to: 47,
  },
  {
    no: '09',
    title: 'Performance',
    kicker: 'Men’s training range · Health. Empower. You.',
    description:
      'Fifteen tech packed styles of tees, muscle tees, vests, shorts, joggers and trackpants in recycled polyester and mesh, each with construction notes, trims and colourways.',
    from: 48,
    to: 63,
  },
  {
    no: '10',
    title: 'Varsity',
    kicker: 'AZORTE · Women’s capsule S/S 27',
    description:
      'A six look varsity capsule for AZORTE: WGSN research, mood and colour, design exploration, AI renders and tech packs, ending in a full collection overview.',
    from: 64,
    to: 76,
  },
  {
    no: '11',
    title: 'Theory',
    kicker: 'Built for the city. Designed for movement.',
    description:
      'A capsule built around realistic line drafts and product innovation: modular pockets, articulated sleeves and convertible utility pieces with streetwear silhouettes.',
    from: 77,
    to: 82,
  },
]

const titles: Record<number, string> = {
  2: 'Kidswear',
  3: 'Design brief',
  4: 'Concept note',
  5: 'Colour story & flats',
  6: 'Character artwork',
  7: 'Weft knitting notation',
  8: 'SSJ1 single jersey · Spinel',
  9: 'SSJ4 single jersey · Seashell',
  10: 'SSJ4 with Lycra · Scarlet',
  11: 'SR2 rib · Smithsonite',
  12: 'Fox print sleepsuit',
  13: 'Kangaroo pocket romper',
  14: 'Appliqué romper',
  15: '“Hi, I’m new here” romper',
  16: 'Campaign',
  17: 'Infant & toddler range',
  18: 'Boys range',
  19: 'Boys & infant girls',
  20: 'Girls range I',
  21: 'Girls range II',
  22: 'Sportswear',
  23: 'Brief · defining the problem',
  24: 'Fabric research',
  25: 'Mood & palette',
  26: 'Development sketches',
  27: 'Colourways',
  28: 'Final kit line-up',
  29: 'Tech packs I',
  30: 'Tech packs II',
  31: 'Loungewear',
  32: 'Forecast boards',
  33: 'Super Comfy · swatch board',
  34: 'Collection line-up',
  35: 'Specification sheets',
  36: 'T-shirt graphics',
  37: 'Locally Grown · Prioritize Your Peace',
  38: 'Just Bloom',
  39: 'Golden Rules for Happiness',
  40: 'Exploration',
  41: 'Perfectly Imperfect',
  42: 'Good Vibes',
  43: 'Indigenous',
  44: 'Campaign',
  45: 'Combos & sketch details',
  46: 'Artwork & trim details',
  47: 'Packaging instructions',
  48: 'Brand & colour direction',
  49: 'Training tee · HS-MTS-001',
  50: 'Training tee · HS-MTS-002',
  51: 'Training tee · HS-MTS-003',
  52: 'Training tee · HS-MTS-004',
  53: 'Muscle tee · HS-MMT-001',
  54: 'Muscle tee · HS-MMT-002',
  55: 'Training vest · HS-MMT-003',
  56: 'Training shorts · HS-MSH-001',
  57: 'Training shorts · HS-MSH-002',
  58: 'Training shorts · HS-MSH-003',
  59: 'Training shorts · HS-MSH-004',
  60: 'Joggers · HS-MJG-001',
  61: 'Trackpants · HS-MTP-001',
  62: 'Joggers · HS-MJG-002',
  63: 'Trackpants · HS-MTP-002',
  64: 'Project brief',
  65: 'Research & colour analysis',
  66: 'Mood & colour board',
  67: 'Concept & swatch board',
  68: 'Exploration · cropped jersey',
  69: 'Exploration · varsity jacket',
  70: 'Exploration · Lucky Charming',
  71: 'Exploration · team jersey',
  72: 'Exploration · Be a Warrior',
  73: 'Tech pack · raglan polo',
  74: 'Tech pack · cargo shorts',
  75: 'Tech pack · varsity jacket',
  76: 'Collection overview',
  77: 'Capsule concept',
  78: 'Design features',
  79: 'Functionality & everyday use',
  80: 'Tech pack · utility cargo',
  81: 'Tech pack · training tee',
  82: 'Tech pack · utility jacket',
  83: 'Thank you',
}

export type Board = {
  page: number
  title: string
  chapter: number
}

export const boards: Board[] = Array.from({ length: 82 }, (_, k) => {
  const page = k + 2
  const chapter = chapters.findIndex((c) => page >= c.from && page <= c.to)
  return { page, title: titles[page] ?? '', chapter }
})

export const BOARD_ASPECT = 7016 / 2482

const pad = (n: number) => String(n).padStart(2, '0')
export const thumbSrc = (page: number) => `/portfolio/thumb/p${pad(page)}.jpg`
export const texSrc = (page: number) => `/portfolio/tex/p${pad(page)}.jpg`
export const fullSrc = (page: number) => `/portfolio/full/p${pad(page)}.jpg`

export const stats = [
  { metric: '4+', label: 'years in apparel product development' },
  { metric: '9', label: 'brands, from Puma to Walmart' },
  { metric: '11', label: 'collections on the line' },
  { metric: '82', label: 'boards of research, design and tech packs' },
]

export const process = [
  {
    no: '01',
    title: 'Discover',
    body: 'Trend research, competitor scans and customer insight distilled into a clear seasonal direction.',
  },
  {
    no: '02',
    title: 'Design',
    body: 'Moodboards, colour stories, original prints and silhouettes sketched into one collection story.',
  },
  {
    no: '03',
    title: 'Develop',
    body: 'Technical flats, measurement charts, construction detail and fit reviews through every sample round.',
  },
  {
    no: '04',
    title: 'Deliver',
    body: 'Vendor coordination, fabric and trim sourcing, and final production approval for the retail floor.',
  },
]

export const capabilities = [
  'Sportswear Design',
  'Knitwear Design',
  'Activewear',
  'Technical Design',
  'Trend Forecasting',
  'Range Planning',
  'Tech Packs',
  'Technical Flats',
  'Print & Graphic Development',
  'Fashion Illustration',
  'Fabric & Trim Sourcing',
  'Sample Development',
  'Fit Review',
  'Vendor Management',
  'Production Coordination',
]

export const tools = ['Illustrator', 'Photoshop', 'InDesign', 'Excel', 'PowerPoint']

export const experience = [
  {
    period: 'Apr 2025 — Present',
    title: 'Design & Development Lead',
    org: 'MyTUK',
    body: 'Leads end to end knitwear, sportswear and lifestyle development, from trend research and tech packs to sampling, fit approval, sourcing, buyer presentations and production.',
  },
  {
    period: 'Sep 2024 — Apr 2025',
    title: 'Design & Product Executive',
    org: 'Underlinen Fashion House',
    body: 'Owned kidswear development for Milou Swish and contributed to FC, FCUK and Puma: palettes, graphics, tech packs, fit reviews and sustainable product development.',
  },
  {
    period: 'Apr 2023 — Sep 2024',
    title: 'Designer',
    org: 'Puffer Fashion Business Services',
    body: 'Designed kidswear collections for FC, FCUK and Myntra across back to back seasons, building original prints, moodboards, colour stories and retail ready ranges.',
  },
]
