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

export const heroVideo =
  // 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_031045_0e1165dd-ab48-46e3-ad3d-5fe77f217647.mp4'
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260701_083907_581a119a-89b7-4c9f-a6ef-560625e0086f.mp4'
export const brands = [
  'Puma',
  'FCUK',
  'Myntra',
  "Levi's",
  'Walmart',
  'MyTUK',
  'Underlinen',
  'Puffer',
]

export const stats = [
  { metric: '4+', label: 'years in apparel product development' },
  { metric: '9', label: 'brands including Puma, FCUK, Myntra, and Levi’s' },
  { metric: '65', label: 'boards of collections, tech packs, and prints' },
]

export const process = [
  {
    number: '01',
    title: 'Discover',
    description:
      'Trend research, competitor scans, and customer insight distilled into a clear seasonal direction.',
  },
  {
    number: '02',
    title: 'Design',
    description:
      'Moodboards, color stories, original prints, and silhouettes sketched into a cohesive collection story.',
  },
  {
    number: '03',
    title: 'Develop',
    description:
      'Technical flats, measurement charts, construction detail, and fit reviews through every sample round.',
  },
  {
    number: '04',
    title: 'Deliver',
    description:
      'Vendor coordination, fabric and trim sourcing, and final production approval for the retail floor.',
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
  'Fabric & Trim Sourcing',
  'Sample Development',
  'Fit Review',
  'Vendor Management',
  'Production Coordination',
]

export const experience = [
  {
    period: 'Apr 2025 to Present',
    title: 'Design and Development Lead',
    org: 'MyTUK',
    description:
      'Leads end to end knitwear, sportswear, and lifestyle apparel development from concept through production, including trend research, tech packs, sampling, fit approval, sourcing, buyer presentations, and production coordination.',
  },
  {
    period: 'Sep 2024 to Apr 2025',
    title: 'Design & Product Executive',
    org: 'Underlinen Fashion House',
    description:
      'Owned kidswear development for Milou Swish and contributed across FC, FCUK, and Puma, translating trend and competitor analysis into seasonal palettes, graphics, tech packs, fit reviews, and product ready for production.',
  },
  {
    period: 'Apr 2023 to Sep 2024',
    title: 'Designer',
    org: 'Puffer Fashion Business Services',
    description:
      'Designed kidswear collections for FC, FCUK, and Myntra, developing original prints, moodboards, color stories, fabric trims, and ranges ready for retail across back to back seasons.',
  },
]

export const selectedWork = [
  {
    page: 4,
    tag: 'Kidswear · Walmart',
    title: 'Wonder Nation Brand Board',
    description:
      'A kid centric brand board built for adventure, sized 0 to 18, designed for comfort that survives wear after wear and wash after wash.',
  },
  {
    page: 30,
    tag: 'Sportswear · Cycling',
    title: 'Performance Cycling Kit',
    description:
      'Technical jerseys and bibs engineered for fit and function, developed panel by panel from flat sketch to finished kit.',
  },
  {
    page: 60,
    tag: 'Graphics · Print Development',
    title: 'Indigenous Print Story',
    description:
      'An original graphic language taken through four colorways, from Pantone selection to placement on the finished garment.',
  },
]

export const galleryHighlights = [1, 4, 10, 20, 30, 45, 60, 62]

export const galleryCount = 65

export function thumbSrc(page: number) {
  return `/portfolio/thumb/page-${String(page).padStart(2, '0')}.jpg`
}

export function fullSrc(page: number) {
  return `/portfolio/full/page-${String(page).padStart(2, '0')}.jpg`
}
