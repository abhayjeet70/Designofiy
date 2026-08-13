// All site content lives here so copy and photos can be edited without touching components.
//
// SOURCES for the business information below:
//   Instagram  - https://www.instagram.com/designofiy/  (handle, brand name "Designofiy Interior LLP")
//   homify     - https://www.homify.in/professionals/8538883/designofiy (address, phone, services)
//   MCA/Tofler - LLPIN ABB-0142, incorporated 14 May 2022
//   GST        - 09AATFD7640L1ZP (Uttar Pradesh)
//
// PHOTOS: photography in /public/work/ is the studio's own, with ONE exception -
// marble-feature-living.webp is licensed stock (see ATTRIBUTION.md) presented as a
// project at the client's request. Project titles, localities and years below are
// placeholder labels - confirm them with the studio.

// Editorial photography for the home hero and the two ASCII backdrops only.
// These are licensed stock (Unsplash, free for commercial use — see ATTRIBUTION.md),
// NOT studio work, so they are kept on their own keys: the project cards in
// `projects` below carry localities and years and must stay the studio's own
// photographs.
export const heroStock = {
  bg: '/hero/hero_bg.webp',
  living: '/hero/stock-living.webp',
  kitchen: '/hero/stock-kitchen.webp',
  wardrobe: '/hero/stock-wardrobe.webp',
  dining: '/hero/stock-dining.webp',
  bathroom: '/hero/stock-bathroom.webp',
  invite: '/hero/stock-invite.webp',
  // Charred-timber texture for the Work grid's closing CTA tile. Deliberately a
  // material rather than a room, so it cannot be mistaken for a project photo.
  ctaTile: '/hero/cta-texture.webp',
}

export const photos = {
  logo: '/logo.png',
  heroBg: heroStock.bg,
  living: '/work/living-room.webp',
  livingWarm: '/work/living-warm.webp',
  livingWide: '/work/living-wide.webp',
  livingRug: '/work/living-rug.webp',
  diningArched: '/work/dining-arched.webp',
  diningOpen: '/work/dining-open-plan.webp',
  kitchen: '/work/modular-kitchen.webp',
  bedroomClassic: '/work/bedroom-classic.webp',
  bedroomTerracotta: '/work/bedroom-terracotta.webp',
  wardrobeCorridor: '/work/wardrobe-corridor.webp',
  wardrobeInterior: '/work/wardrobe-interior.webp',
  wardrobePulldown: '/work/wardrobe-pulldown.webp',
  wardrobeShelving: '/work/wardrobe-shelving.webp',
  bathroom: '/work/bathroom-grey.webp',
  partition: '/work/partition-unit.webp',
  salon: '/work/salon.webp',
  // Licensed stock, NOT studio work — see the note above and ATTRIBUTION.md.
  marbleFeature: '/work/marble-feature-living.webp',
  // Licensed stock, NOT studio work — see the note above and ATTRIBUTION.md.
  blackMarbleBath: '/work/black-marble-bath.webp',
  spaStoneBath: '/work/spa-stone-bath.webp',
}

// The hero runs as a sequence: the backdrop holds, while the photograph and the
// headline advance together. `lead` is set in the serif italic accent face.
// Keep lines short — they are set at display size and must not wrap awkwardly.
export const heroSequence = [
  {
    tag: 'Living',
    src: heroStock.living,
    alt: 'Panelled living room in warm taupe with gold ring pendants and a marble floor',
    lines: ['Interiors with', 'a sense of', '<em>permanence</em>'],
    sub: 'Sand leather, hand-knotted wool and a single warm pendant. Rooms composed to hold their quality for a decade, not a season.',
    to: '/work',
  },
  {
    tag: 'Kitchens',
    src: heroStock.kitchen,
    alt: 'Handleless modular kitchen in walnut and sand with a full-width marble backsplash',
    lines: ['Kitchens made', 'for the way', 'you <em>cook</em>'],
    sub: 'Fluted glass lit from within, quartz run full width, and drawer stacks where lesser kitchens put shutters.',
    to: '/services#modular',
  },
  {
    tag: 'Wardrobes',
    src: heroStock.wardrobe,
    alt: 'Dressing room with a backlit mirror, fluted glass screen and a glazed wardrobe run',
    lines: ['Joinery that', 'earns its', '<em>keep</em>'],
    sub: 'Teak frames, cane-textured panels, and interiors planned to the centimetre before a single shutter was drawn.',
    to: '/services#wardrobes',
  },
  {
    tag: 'Dining',
    src: heroStock.dining,
    alt: 'Backlit glass crockery units in dark oak above a marble counter, with brass pendants',
    lines: ['The table', 'everything', '<em>gathers</em> around'],
    sub: 'Marble on a fluted timber base, arched crockery units lit from behind glass, and seating in two complementary weaves.',
    to: '/work',
  },
  {
    tag: 'Bathrooms',
    src: heroStock.bathroom,
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
    src: '/hero/work.webp',
    alt: 'Photographs of finished interiors propped against a plaster wall with stone samples and a rolled drawing',
  },
  services: {
    src: '/hero/services.webp',
    alt: 'Fan of material samples: travertine, fluted timber, brass, marble and folded fabric',
  },
  studio: {
    src: '/hero/studio.webp',
    alt: 'A studio desk with design books, pencils, an interior sketch and drawing sheets',
  },
  process: {
    src: '/hero/process.webp',
    alt: 'Five stepped cards reading Discover, Design, Develop, Execute and Deliver',
  },
  contact: {
    src: '/hero/contact.webp',
    alt: 'A card reading "Let\'s create something beautiful together" beside a Designofiy business card, pen and envelope',
  },
}

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
  phone: '+917349752323',
  phoneDisplay: '+91 73497 52323',
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
    slug: 'sand-leather-living-room',
    title: 'Sand Leather Living Room',
    category: 'Residential',
    location: 'Lucknow',
    year: '2025',
    note: 'Twin sand-toned leather sofas facing a pair of round nesting tables, with a hand-knotted marbled rug tying the seating back to the polished stone floor. Framed textile art anchors the wall, and a single amber pendant does the warm work that the cove lighting deliberately leaves alone.',
    images: [photos.livingWarm, photos.livingWide, photos.livingRug, photos.living],
    span: 'tall',
    featured: true,
  },
  {
    slug: 'arched-crockery-dining',
    title: 'Arched Crockery Dining',
    category: 'Residential',
    location: 'Lucknow',
    year: '2025',
    note: 'A marble-topped table on a fluted timber base, ringed by upholstered chairs in two complementary weaves. Behind it, a run of arched-glass crockery units lit from within, with a stone-topped counter for serving.',
    images: [photos.diningArched, photos.diningOpen],
    span: 'wide',
    featured: true,
  },
  {
    slug: 'teak-cane-wardrobe-run',
    title: 'Teak & Cane Wardrobe Run',
    category: 'Wardrobes',
    location: 'Lucknow',
    year: '2025',
    note: 'A full-height wardrobe wall in teak frames with cane-textured inset panels, running the length of a herringbone floor. Inside: lit white carcasses, brass hanging rails, a pull-down rail for the top tier, and drawer modules sized before the shutters were ever drawn.',
    images: [photos.wardrobeCorridor, photos.wardrobeShelving, photos.wardrobeInterior, photos.wardrobePulldown],
    featured: true,
  },
  {
    slug: 'fluted-glass-modular-kitchen',
    title: 'Fluted Glass Modular Kitchen',
    category: 'Modular Kitchens',
    location: 'Lucknow',
    year: '2025',
    note: 'A handleless parallel kitchen in beige and black. Fluted glass wall units lit from within, a full-width quartz counter, profile lighting under the overheads, and deep drawer stacks instead of shutters below the hob.',
    images: [photos.kitchen],
    featured: true,
  },
  {
    slug: 'terracotta-panelled-bedroom',
    title: 'Terracotta Panelled Bedroom',
    category: 'Residential',
    location: 'Lucknow',
    year: '2025',
    note: 'A moulded terracotta accent wall behind an upholstered bed, balanced by fluted ivory panelling on the adjacent run. Wall sconce, wooden fan and a slim work nook keep the room usable as well as photogenic.',
    images: [photos.bedroomTerracotta],
    span: 'tall',
    featured: true,
  },
  {
    slug: 'charcoal-stone-bathroom',
    title: 'Charcoal Stone Bathroom',
    category: 'Bathrooms',
    location: 'Lucknow',
    year: '2025',
    note: 'Full-height charcoal stone with a honed black counter, a rounded vessel basin and a backlit circular mirror. Slim cylinder pendants either side, a recessed niche stack for storage, and a clear glass screen keeping the shower open to the room.',
    images: [photos.bathroom],
    featured: true,
  },
  {
    slug: 'minimalist-ambient-living',
    title: 'Minimalist Ambient Living',
    category: 'Residential',
    location: 'Lucknow',
    year: '2025',
    note: 'A minimal living space bathed in natural light, featuring warm wooden textures, neutral upholstery, and subtle ambient lighting for a calm, serene environment.',
    images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    span: 'wide',
    featured: true,
  },
  {
    slug: 'black-marble-bath',
    title: 'Black Marble Bath',
    category: 'Bathrooms',
    location: 'Lucknow',
    year: '2025',
    note: 'A book-matched black marble bath surround with a deep soaking tub, brass fixtures and a wall-mounted vanity mirror set into the stone.',
    // NOTE: licensed stock photography, not a delivered project — added at the
    // client's request so the Bathrooms filter is not left with an empty grid
    // cell. Swap `images` for a real project photo when one is available.
    images: [photos.blackMarbleBath],
  },
  {
    slug: 'spa-stone-bathroom',
    title: 'Spa Stone Bathroom',
    category: 'Bathrooms',
    location: 'Lucknow',
    year: '2025',
    note: 'Warm stone walls, a freestanding tub and a walk-in rain shower behind a frameless glass screen.',
    images: [photos.spaStoneBath],
  },
  {
    slug: 'ivory-teak-bedroom',
    title: 'Ivory & Teak Bedroom',
    category: 'Residential',
    location: 'Lucknow',
    year: '2024',
    note: 'A quieter guest bedroom. Teak headboard and wardrobe against white walls, brass wall lanterns either side, and a recessed ceiling with concealed spots for even, shadow-free light.',
    images: [photos.bedroomClassic],
  },
  {
    slug: 'crate-steel-partition',
    title: 'Crate & Steel Partition',
    category: 'Decor & Styling',
    location: 'Lucknow',
    year: '2024',
    note: 'A slim black steel frame with reclaimed pine crates set at alternating depths. A room divider that stores, displays and plants without closing off the light between two zones.',
    images: [photos.partition],
  },
  {
    slug: 'olive-salon-fit-out',
    title: 'Olive Salon Fit-out',
    category: 'Commercial',
    location: 'Lucknow',
    year: '2024',
    note: 'Full-height olive shutter walls, backlit mirror stations at face level so colour work reads true, tan leather chairs and a dome pendant over the styling floor.',
    images: [photos.salon],
    span: 'wide',
  },
  {
    slug: 'marble-feature-living-room',
    title: 'Marble Feature Living Room',
    category: 'Residential',
    location: 'Lucknow',
    year: '2025',
    note: 'A book-matched marble feature wall behind a channel-tufted sofa, fluted timber returns, a carved jaali screen to the entry and brass nesting tables on a marble floor.',
    // NOTE: licensed stock photography, not a delivered project. Added at the
    // client's request to fill the grid. Swap `images` for a real project photo
    // when one is available.
    images: [photos.marbleFeature],
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
