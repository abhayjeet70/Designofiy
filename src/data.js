// All site content lives here so copy and photos can be edited without touching components.
//
// SOURCES for the business information below:
//   Instagram  - https://www.instagram.com/designofiy/  (handle, brand name "Designofiy Interior LLP")
//   homify     - https://www.homify.in/professionals/8538883/designofiy (address, phone, services)
//   MCA/Tofler - LLPIN ABB-0142, incorporated 14 May 2022
//   GST        - 09AATFD7640L1ZP (Uttar Pradesh)
//
// PHOTOS: every photograph on the site is the studio's own work, supplied by the
// client as a Drive folder on 2026-08-13 (113 files). They are auto-rotated from
// their EXIF orientation and converted to WebP under /public/work/dfy/, indexed
// by the dfy() helper below. No stock photography remains anywhere on the site.
// Project titles, localities and years are inferred from the photographs and
// grouped by decor language - CONFIRM THEM WITH THE STUDIO before launch.

const dfy = (n) => `/work/dfy/${String(n).padStart(3, '0')}.webp`

// Backdrops for the home hero ASCII canvas and the closing band.
export const heroStock = {
  bg: dfy(82),
  living: dfy(102),
  kitchen: dfy(77),
  wardrobe: dfy(16),
  dining: dfy(93),
  bathroom: dfy(51),
  invite: dfy(15),
}

export const photos = {
  logo: '/logo.png',
  heroBg: heroStock.bg,
  living: dfy(24),
  livingWarm: dfy(21),
  livingWide: dfy(84),
  livingRug: dfy(23),
  diningArched: dfy(31),
  diningOpen: dfy(95),
  kitchen: dfy(77),
  bedroomClassic: dfy(32),
  bedroomTerracotta: dfy(6),
  wardrobeCorridor: dfy(34),
  wardrobeInterior: dfy(37),
  wardrobePulldown: dfy(36),
  wardrobeShelving: dfy(85),
  bathroom: dfy(0),
  partition: dfy(89),
  salon: dfy(15),
}


// The hero runs as a sequence: the backdrop holds, while the photograph and the
// headline advance together. `lead` is set in the serif italic accent face.
// Keep lines short — they are set at display size and must not wrap awkwardly.
export const heroSequence = [
  {
    tag: 'Living',
    src: dfy(102),
    alt: 'Panelled living room in warm taupe with gold ring pendants and a marble floor',
    lines: ['Interiors with', 'a sense of', '<em>permanence</em>'],
    sub: 'Sand leather, hand-knotted wool and a single warm pendant. Rooms composed to hold their quality for a decade, not a season.',
    to: '/work',
  },
  {
    tag: 'Kitchens',
    src: dfy(77),
    alt: 'Handleless modular kitchen in walnut and sand with a full-width marble backsplash',
    lines: ['Kitchens made', 'for the way', 'you <em>cook</em>'],
    sub: 'Fluted glass lit from within, quartz run full width, and drawer stacks where lesser kitchens put shutters.',
    to: '/services#modular',
  },
  {
    tag: 'Wardrobes',
    src: dfy(16),
    alt: 'Dressing room with a backlit mirror, fluted glass screen and a glazed wardrobe run',
    lines: ['Joinery that', 'earns its', '<em>keep</em>'],
    sub: 'Teak frames, cane-textured panels, and interiors planned to the centimetre before a single shutter was drawn.',
    to: '/services#wardrobes',
  },
  {
    tag: 'Dining',
    src: dfy(93),
    alt: 'Backlit glass crockery units in dark oak above a marble counter, with brass pendants',
    lines: ['The table', 'everything', '<em>gathers</em> around'],
    sub: 'Marble on a fluted timber base, arched crockery units lit from behind glass, and seating in two complementary weaves.',
    to: '/work',
  },
  {
    tag: 'Bathrooms',
    src: dfy(51),
    alt: 'Freestanding black stone bath against a warm timber wall under a concealed cove light',
    lines: ['Stone, light', 'and quiet', '<em>restraint</em>'],
    sub: 'Full-height charcoal stone, a honed black counter, concealed services and a mirror lit at exactly face height.',
    to: '/services#bathrooms',
  },
]

// Styled flatlays for the full-screen page banners. All are light, warm and composed
// with their subject on the right, so banner copy sits left against clear wall.
export const pageHeroes = {
  work: {
    src: dfy(95),
    alt: 'Photographs of finished interiors propped against a plaster wall with stone samples and a rolled drawing',
  },
  services: {
    src: dfy(91),
    alt: 'Fan of material samples: travertine, fluted timber, brass, marble and folded fabric',
  },
  studio: {
    src: dfy(96),
    alt: 'A studio desk with design books, pencils, an interior sketch and drawing sheets',
  },
  process: {
    src: dfy(105),
    alt: 'Five stepped cards reading Discover, Design, Develop, Execute and Deliver',
  },
  contact: {
    src: dfy(17),
    alt: 'A card reading "Let\'s create something beautiful together" beside a Designofiy business card, pen and envelope',
  },
}

// Landscape frames for the diagonal marquee band that closes the Home and Work
// pages. Chosen for wide crops and a spread across rooms so the rotated rows do
// not repeat a look.
export const marqueeImages = [
  dfy(21), dfy(93), dfy(77), dfy(84), dfy(31), dfy(102),
  dfy(6), dfy(64), dfy(50), dfy(107), dfy(89), dfy(19),
  dfy(71), dfy(95), dfy(15), dfy(66),
]

// The horizontally scrolling photo ribbon on the home page.
export const ribbon = [
  photos.livingRug, photos.wardrobeInterior, photos.bedroomClassic, photos.bathroom,
  photos.diningOpen, photos.salon, photos.partition, photos.wardrobeShelving,
]

export const business = {
  name: 'Designofiy',
  legalName: 'Designofiy Interior LLP',
  tagline: 'Enhance your home style',
  city: 'Lucknow',
  phone: '+917388000830',
  phoneDisplay: '+91 73880 00830',
  email: 'hello@designofiy.com',
  instagram: 'https://www.instagram.com/designofiy/',
  instagramHandle: '@designofiy',
  facebook: 'https://www.facebook.com/designofiy',
  address: {
    line1: 'L2/583, Vineet Khand',
    line2: 'Gomti Nagar',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pin: '226010',
  },
  mapQuery: 'Designofiy Interior LLP, Vineet Khand, Gomti Nagar, Lucknow 226010',
  hours: [
    ['Monday to Saturday', '10:00 AM - 7:30 PM'],
    ['Sunday', 'By appointment'],
  ],
  llpin: 'ABB-0142',
  gstin: '09AATFD7640L1ZP',
  incorporated: '14 May 2022',
  rating: '4.5',
}

export const stats = [
  { value: '10', suffix: '+', label: 'Years of experience' },
  { value: '100', suffix: '+', label: 'Projects delivered' },
  { value: '100', suffix: '%', label: 'Price transparency' },
  { value: '4.5', suffix: '★', label: 'Client rating' },
]

export const services = [
  {
    id: 'residential',
    title: 'Residential Interiors',
    blurb:
      'Full-home interiors for apartments, villas and independent houses, planned room by room, from the entryway console to the last switch plate.',
    points: ['Space planning & 3D walkthroughs', 'Bespoke furniture', 'False ceiling & lighting', 'Turnkey execution'],
    img: photos.livingWarm,
    alt: 'Sand leather living room with framed art and a warm pendant',
  },
  {
    id: 'modular',
    title: 'Modular Kitchens',
    blurb:
      'Ergonomic kitchens built around how you actually cook. The work triangle first, then the finishes. Branded hardware, factory-finished shutters.',
    points: ['L / U / island layouts', 'Soft-close hardware', 'Tall units & pantry pull-outs', 'Anti-termite ply cores'],
    img: photos.kitchen,
    alt: 'Handleless modular kitchen with fluted glass wall units',
  },
  {
    id: 'wardrobes',
    title: 'Wardrobes & Storage',
    blurb:
      'Storage designed from the inside out. We plan the hanging, folding and drawer space you actually need first, then wrap it in a shutter that suits the room.',
    points: ['Pull-down hanging rails', 'Lit interiors & profile strips', 'Drawer and shelf modules', 'Walk-in and sliding layouts'],
    img: photos.wardrobeCorridor,
    alt: 'Teak and cane wardrobe run over a herringbone wood floor',
  },
  {
    id: 'bathrooms',
    title: 'Bathrooms',
    blurb:
      'Compact bathrooms that feel considered. Full-height stone, concealed cisterns, backlit mirrors and lighting placed where you actually use it.',
    points: ['Large-format tiling', 'Backlit mirrors', 'Concealed plumbing', 'Waterproofing & falls'],
    img: photos.bathroom,
    alt: 'Charcoal stone bathroom with a round backlit mirror',
  },
  {
    id: 'commercial',
    title: 'Commercial & Retail',
    blurb:
      'Salons, clinics, studios, cafes and offices designed to move people through a space and make them want to stay in it.',
    points: ['Salon & spa fit-outs', 'Office & co-working', 'Retail display design', 'Brand-led signage'],
    img: photos.salon,
    alt: 'Olive salon with backlit mirror stations',
  },
  {
    id: 'renovation',
    title: 'Home Renovation',
    blurb:
      'An older home that deserves better. We reopen the plan, fix the services and rebuild the finishes without knocking down what still works.',
    points: ['Structural re-planning', 'Plumbing & electrical rework', 'Flooring replacement', 'Phased, liveable timelines'],
    img: photos.bedroomClassic,
    alt: 'Ivory and teak bedroom with brass wall lanterns',
  },
  {
    id: 'decor',
    title: 'Interior Decor & Styling',
    blurb:
      'The last ten percent that makes a room photograph well: drapery, art, rugs, planters and the lighting temperature to hold it together.',
    points: ['Furniture & art curation', 'Soft furnishing', 'Accent lighting', 'Festive & event styling'],
    img: photos.partition,
    alt: 'Reclaimed pine and steel partition unit',
  },
  {
    id: 'consult',
    title: 'Design Consultation',
    blurb:
      'Not ready for a full project? Book a session, walk us through the space, and leave with a layout, a material direction and a real budget.',
    points: ['On-site measurement', 'Mood board & palette', 'Itemised cost estimate', 'Vendor shortlist'],
    img: photos.diningArched,
    alt: 'Marble dining table beside an arched glass crockery unit',
  },
]

// `images` drives the lightbox gallery; the first entry is also the grid thumbnail.
export const projects = [
  {
    slug: 'jungle-mural-residence',
    title: 'Jungle Mural Residence',
    category: 'Residential',
    location: 'Lucknow',
    year: '2025',
    note: 'A hand-painted jungle mural runs the full headboard wall, answered by a walnut media unit on the opposite run and herringbone flooring throughout. Curved upholstered headboard, dresser niche and matching wardrobe shutters.',
    images: [dfy(6), dfy(10), dfy(70), dfy(72), dfy(7), dfy(71), dfy(73), dfy(74), dfy(11), dfy(75)],
    span: 'wide',
    featured: true,
  },
  {
    slug: 'beige-leather-living',
    title: 'Beige Leather Living Room',
    category: 'Residential',
    location: 'Lucknow',
    year: '2026',
    note: 'A deep beige leather sectional on a marbled charcoal rug, framed prints filling the long wall and warm floor lamps at either end. Lit almost entirely without downlights.',
    images: [dfy(21), dfy(18), dfy(20), dfy(23), dfy(24), dfy(19), dfy(13), dfy(14), dfy(22)],
    featured: true,
  },
  {
    slug: 'arched-crockery-dining',
    title: 'Arched Crockery Dining',
    category: 'Residential',
    location: 'Lucknow',
    year: '2026',
    note: 'An arched, backlit crockery unit in ivory and gold behind a marble-top dining table, with woven-back chairs and a runner of block-printed placemats.',
    images: [dfy(31), dfy(30), dfy(67)],
    featured: true,
  },
  {
    slug: 'grey-marble-bathroom',
    title: 'Grey Marble Bathroom',
    category: 'Bathrooms',
    location: 'Lucknow',
    year: '2025',
    note: 'Grey-green marble run floor to ceiling and across the shower return, a walnut vanity with a backlit square mirror, and a frameless glass screen keeping the wet zone open.',
    images: [dfy(0), dfy(1), dfy(2), dfy(3), dfy(4)],
    featured: true,
  },
  {
    slug: 'dark-stone-bathroom',
    title: 'Dark Stone Bathroom',
    category: 'Bathrooms',
    location: 'Lucknow',
    year: '2026',
    note: 'Charcoal stone, an oval vessel basin on a honed black counter and a full-width backlit mirror. Cool-toned and deliberately restrained.',
    images: [dfy(38), dfy(50), dfy(51)],
  },
  {
    slug: 'backlit-vanity-bath',
    title: 'Backlit Stone Vanity',
    category: 'Bathrooms',
    location: 'Lucknow',
    year: '2026',
    note: 'A warm cove light washes the wall behind the mirror over a honed stone counter and undermount basin, with a compact tub tucked into the return.',
    images: [dfy(61), dfy(62)],
  },
  {
    slug: 'maroon-powder-room',
    title: 'Maroon Powder Room',
    category: 'Bathrooms',
    location: 'Lucknow',
    year: '2025',
    note: 'A small guest bath given the full treatment: deep maroon walls, a gold-framed oval mirror and a stone counter with a brushed brass mixer.',
    images: [dfy(98)],
  },
  {
    slug: 'backlit-pooja-mandir',
    title: 'Backlit Pooja Mandir',
    category: 'Decor & Styling',
    location: 'Lucknow',
    year: '2025',
    note: 'An arched mandir niche in white and gold, backlit around a carved mandala with a shloka etched above the altar. Open shelving either side and a drawer bank below for daily use.',
    images: [dfy(99), dfy(12), dfy(100), dfy(101)],
    span: 'tall',
    featured: true,
  },
  {
    slug: 'wardrobe-run-interiors',
    title: 'Wardrobe Run & Interiors',
    category: 'Wardrobes',
    location: 'Lucknow',
    year: '2026',
    note: 'A full-height walnut wardrobe run planned from the inside out — hanging, folding and drawer space set before a single shutter was drawn. Glazed and mirrored fronts where the corridor needed light.',
    images: [dfy(34), dfy(35), dfy(36), dfy(37), dfy(45), dfy(49)],
    featured: true,
  },
  {
    slug: 'white-wardrobe-corridor',
    title: 'White Wardrobe Corridor',
    category: 'Wardrobes',
    location: 'Lucknow',
    year: '2025',
    note: 'A tall white wardrobe wall down a narrow passage, handleless and flush so the corridor keeps its width, with an oak run continuing into the bedroom.',
    images: [dfy(5), dfy(16), dfy(106), dfy(25), dfy(56), dfy(57), dfy(58)],
  },
  {
    slug: 'grey-modular-kitchen',
    title: 'Grey & Oak Modular Kitchen',
    category: 'Modular Kitchens',
    location: 'Lucknow',
    year: '2025',
    note: 'A U-shaped kitchen in slate grey and warm oak, full-height tall units, an under-cabinet hob run and a breakfast counter closing the working triangle.',
    images: [dfy(77), dfy(76), dfy(97)],
    featured: true,
  },
  {
    slug: 'island-kitchen',
    title: 'Island Kitchen & Pantry',
    category: 'Modular Kitchens',
    location: 'Lucknow',
    year: '2026',
    note: 'A powder-blue island kitchen with a full-height fridge bay, concealed pantry storage and a lit shelf niche over the counter run.',
    images: [dfy(78), dfy(79)],
  },
  {
    slug: 'duplex-staircase-bar',
    title: 'Duplex Staircase & Bar',
    category: 'Residential',
    location: 'Lucknow',
    year: '2025',
    note: 'A double-height stairwell under a cascading crystal chandelier, a blue-panelled bar counter set into the walnut wall below, and a carpeted timber stair with a wrought-iron balustrade.',
    images: [dfy(84), dfy(86), dfy(87), dfy(80), dfy(83), dfy(88), dfy(82), dfy(92), dfy(81)],
    span: 'wide',
    featured: true,
  },
  {
    slug: 'round-table-dining',
    title: 'Round Table Dining',
    category: 'Residential',
    location: 'Lucknow',
    year: '2026',
    note: 'A round marble-top dining table on a fluted timber base with woven-back chairs, opening onto a sofa run with paired timber coffee tables.',
    images: [dfy(64), dfy(63), dfy(65), dfy(68), dfy(66), dfy(69)],
    featured: true,
  },
  {
    slug: 'pink-bedroom-suite',
    title: 'Blush Bedroom Suite',
    category: 'Residential',
    location: 'Lucknow',
    year: '2026',
    note: 'A blush and chocolate bedroom with a channel-tufted headboard, striped drapery to the full height and a black-framed dresser mirror opposite.',
    images: [dfy(52), dfy(41), dfy(47), dfy(48), dfy(53), dfy(54), dfy(55)],
  },
  {
    slug: 'navy-bedroom',
    title: 'Navy & Chalk Bedroom',
    category: 'Residential',
    location: 'Lucknow',
    year: '2026',
    note: 'Navy bedding against chalk walls, a slim pendant either side of the bed in place of table lamps, and a drawer bank built into the bed base.',
    images: [dfy(59), dfy(60)],
  },
  {
    slug: 'herringbone-bedroom',
    title: 'Herringbone Guest Bedroom',
    category: 'Residential',
    location: 'Lucknow',
    year: '2026',
    note: 'A quieter guest room — teak headboard and wardrobe against white walls, brass wall lanterns either side and herringbone timber underfoot.',
    images: [dfy(32), dfy(33), dfy(39), dfy(40), dfy(28), dfy(29), dfy(8), dfy(9)],
  },
  {
    slug: 'study-nook',
    title: 'Study Nooks & Display',
    category: 'Decor & Styling',
    location: 'Lucknow',
    year: '2026',
    note: 'Compact work nooks carved out of bedroom walls: a rust-backed desk with a floating shelf over, a lit display column beside it, and framed botanicals opposite.',
    images: [dfy(42), dfy(43), dfy(44), dfy(26), dfy(27), dfy(46)],
    span: 'wide',
  },
  {
    slug: 'travel-office-lounge',
    title: 'Travel Studio Lounge',
    category: 'Commercial',
    location: 'Lucknow',
    year: '2026',
    note: 'A mustard velvet lounge under a curved wall of aviation photography — the waiting area of a full office fit-out for a travel consultancy.',
    images: [dfy(107), dfy(108)],
  },
  {
    slug: 'travel-office-cabins',
    title: 'Travel Studio Cabins',
    category: 'Commercial',
    location: 'Lucknow',
    year: '2026',
    note: 'The rest of the same fit-out: a private cabin with a timber world map on textured stone, open desks along the window wall, and a blue-lit briefing room seated like a cabin interior.',
    images: [dfy(111), dfy(112), dfy(110), dfy(109)],
  },
  {
    slug: 'storage-walls',
    title: 'Storage Walls & Media Units',
    category: 'Wardrobes',
    location: 'Lucknow',
    year: '2025',
    note: 'Full-height storage runs treated as joinery rather than furniture — flush shutters, open display bays in contrasting walnut, and a media unit built into the same wall.',
    images: [dfy(85), dfy(94), dfy(89), dfy(90), dfy(103), dfy(104)],
  },
]

export const process = [
  {
    step: '01',
    title: 'Conversation',
    body: 'We meet at the site or over a call. You tell us how you live, who lives with you, and what the budget honestly is.',
  },
  {
    step: '02',
    title: 'Measure & Plan',
    body: 'Site measurement, structural checks, and two or three layout options, with the trade-offs of each spelled out.',
  },
  {
    step: '03',
    title: 'Design & 3D',
    body: 'Mood boards, material samples in hand, and 3D views of every room so nothing is a surprise on site.',
  },
  {
    step: '04',
    title: 'Itemised Costing',
    body: 'A line-by-line quote with brand, finish and quantity against every item. No lump sums, no hidden margin.',
  },
  {
    step: '05',
    title: 'Execution',
    body: 'One project manager, a fixed schedule, weekly photo updates, and the site cleaned at the end of every stage.',
  },
  {
    step: '06',
    title: 'Handover',
    body: 'Snag list closed, warranties documented, and a walkthrough of how every fitting in your home works.',
  },
]

export const testimonials = [
  {
    quote: 'They gave us the full cost sheet on day one and finished within it. In this city, that is the whole review.',
    name: 'Ritika S.',
    detail: '3BHK, Gomti Nagar',
  },
  {
    quote: 'Our salon was shut for exactly the twenty-eight days they promised. The mirror detailing gets complimented every single day.',
    name: 'Ankit V.',
    detail: 'Salon fit-out, Lucknow',
  },
  {
    quote: 'I asked for a kitchen my mother could work in without bending. They rebuilt the layout around that one sentence.',
    name: 'Neha M.',
    detail: 'Modular kitchen, Lucknow',
  },
  {
    quote: 'A thirty-year-old house that finally feels like it has light in it. The weekly photo updates kept us calm the whole time.',
    name: 'Sandeep & Poonam K.',
    detail: 'Renovation, Lucknow',
  },
]

export const faqs = [
  {
    q: 'What does an interior project with Designofiy cost?',
    a: 'It depends on scope and finish level, not on square feet alone. After the site visit you receive an itemised estimate with every item priced by brand, finish and quantity, so you can add or drop line items yourself. We work to budgets, not around them.',
  },
  {
    q: 'How long does a full home take?',
    a: 'A 2 to 3 BHK turnkey project typically runs 45 to 75 days from design sign-off, depending on civil work and custom furniture. Modular kitchens alone are usually 3 to 4 weeks. You get a dated schedule before work starts.',
  },
  {
    q: 'Do you take up small or single-room projects?',
    a: 'Yes. A single kitchen, one bedroom, a study wall or a styling refresh are all welcome. Consultation-only engagements are available too if you want the drawings and plan to execute yourself.',
  },
  {
    q: 'Which materials and brands do you use?',
    a: 'Branded plywood with anti-termite treatment, standard-brand laminates and veneers, and soft-close hardware as the default. Every material is named in your quote, so you always know exactly what is going into your home.',
  },
  {
    q: 'Do you work outside Lucknow?',
    a: 'Our core service area is Lucknow and the surrounding belt. For projects further out, get in touch. We take them on selectively depending on scale and schedule.',
  },
  {
    q: 'Can I see work in progress?',
    a: 'Always. Sites are open to clients, and you also get weekly photo updates through the build. Recent work is posted on Instagram at @designofiy.',
  },
  {
    q: 'Do you provide 3D designs before starting?',
    a: 'Yes, we create detailed 3D visualisations. You will know exactly how the finished space will look, down to the lighting and textures, before we start any execution.',
  },
  {
    q: 'Are there any hidden charges?',
    a: 'No. Our itemised quotes are transparent. Any changes in cost will only happen if you explicitly request a change in scope, materials, or design during the project.',
  },
  {
    q: 'Do you handle civil work like ceilings and plumbing?',
    a: 'Absolutely. Our turnkey execution covers everything from masonry, false ceilings, plumbing, and electricals to the final coat of paint and custom furniture.',
  },
  {
    q: 'How do we get started?',
    a: 'Reach out via WhatsApp or our contact form. We will schedule a preliminary call, followed by a site visit or a meeting at our studio to discuss your requirements in detail.',
  },
]

export const marquee = [
  'Residential Interiors',
  'Modular Kitchens',
  'Commercial Fit-outs',
  'Home Renovation',
  'Turnkey Execution',
  'Interior Styling',
  'Lucknow, India',
]
