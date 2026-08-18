export const contact = {
  name: 'Shiwani Kumari',
  role: 'Sportswear & Knitwear Designer',
  email: 'shiwanikumari.here@gmail.com',
  phone: '+91 95701 86369',
  phoneHref: '+919570186369',
  linkedin: 'https://www.linkedin.com/in/shiwanikumari3',
  cv: '/Shiwani_CV.pdf',
  portfolioPdf: '/Shiwani%20kumari.pdf',
}

export const stats = [
  { metric: '4+ yrs', label: 'apparel product development' },
  { metric: '9 brands', label: "Puma, FCUK, Myntra, Levi's, Walmart & more" },
  { metric: '360°', label: 'trend, tech pack, sample, fit, vendor, production' },
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
  'Fabric & Trim Sourcing',
  'Sample Development',
  'Fit Review',
  'Vendor Management',
  'Production Coordination',
]

export const experience = [
  {
    period: 'Apr 2025 — Present',
    title: 'Design and Development Lead',
    org: 'MyTUK',
    description:
      'Leads end-to-end knitwear, sportswear, and lifestyle apparel development from concept through production, including trend research, tech packs, sampling, fit approval, sourcing, buyer presentations, and production coordination.',
  },
  {
    period: 'Sep 2024 — Apr 2025',
    title: 'Design & Product Executive',
    org: 'Underlinen Fashion House',
    description:
      'Owned kidswear development for Milou Swish and contributed across FC, FCUK, and Puma, translating trend and competitor analysis into seasonal palettes, graphics, tech packs, fit reviews, and production-ready product.',
  },
  {
    period: 'Apr 2023 — Sep 2024',
    title: 'Designer',
    org: 'Puffer Fashion Business Services',
    description:
      'Designed kidswear collections for FC, FCUK, and Myntra, developing original prints, moodboards, color stories, fabric trims, and retail-ready ranges across back-to-back seasons.',
  },
]

export const heroBoards = [
  '/portfolio/full/page-01.jpg',
  '/portfolio/full/page-04.jpg',
  '/portfolio/full/page-30.jpg',
  '/portfolio/full/page-60.jpg',
]

export const galleryCount = 65

export function thumbSrc(page: number) {
  return `/portfolio/thumb/page-${String(page).padStart(2, '0')}.jpg`
}

export function fullSrc(page: number) {
  return `/portfolio/full/page-${String(page).padStart(2, '0')}.jpg`
}
