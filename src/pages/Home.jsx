import { Link } from 'react-router-dom'
import {
  business, collage, photos, projects, ribbon, services, stats, testimonials,
} from '../data'
import { Marquee } from '../components/common'
import { CountUp, Curtain, useParallax } from '../components/motion'

function Hero() {
  const bg = useParallax(0.1)
  return (
    <section className="hero">
      <div
        ref={bg}
        className="hero__bg"
        style={{ backgroundImage: `url(${photos.heroBg})` }}
        aria-hidden="true"
      />
      <div className="hero__wash" aria-hidden="true" />

      <div className="hero__copy">
        <p className="eyebrow" data-reveal>Interior Designers · Gomti Nagar, Lucknow</p>
        <h1 data-reveal style={{ '--d': '90ms' }}>
          Interiors that feel<br />
          <em>like you</em>, not like<br />a catalogue.
        </h1>
        <p className="hero__sub" data-reveal style={{ '--d': '180ms' }}>
          A decade of work and more than a hundred homes, kitchens and commercial spaces
          across Lucknow. Designed around how you actually live, costed line by line, and
          executed by one team from drawing to handover.
        </p>
        <div className="hero__cta" data-reveal style={{ '--d': '270ms' }}>
          <Link className="btn" to="/contact">Book a consultation</Link>
          <Link className="btn btn--ghost" to="/work">See the work</Link>
        </div>
      </div>

      {/* Three staggered columns of real project photography. */}
      <div className="collage">
        <div className="collage__col collage__col--a">
          {collage.slice(0, 2).map((c, i) => <Tile key={c.src} {...c} delay={i * 120} />)}
        </div>
        <div className="collage__col collage__col--b">
          {collage.slice(2, 4).map((c, i) => <Tile key={c.src} {...c} delay={200 + i * 120} />)}
        </div>
        <div className="collage__col collage__col--c">
          {collage.slice(4, 6).map((c, i) => <Tile key={c.src} {...c} delay={400 + i * 120} />)}
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true"><span /></div>
    </section>
  )
}

function Tile({ src, alt, tag, delay }) {
  return (
    <figure className="tile" data-reveal style={{ '--d': `${delay}ms` }}>
      <img src={src} alt={alt} />
      <figcaption>{tag}</figcaption>
    </figure>
  )
}

function Stats() {
  return (
    <section className="statband" data-stagger>
      {stats.map((s) => (
        <div key={s.label} data-reveal>
          <strong><CountUp value={s.value} /><span>{s.suffix}</span></strong>
          <p>{s.label}</p>
        </div>
      ))}
    </section>
  )
}

/* Full-bleed editorial split — the single biggest image on the page. */
function Spotlight() {
  const p = projects[0]
  return (
    <section className="spotlight">
      <Curtain src={p.images[0]} alt={p.title} ratio="4/3" className="spotlight__media" />
      <div className="spotlight__body">
        <p className="eyebrow" data-reveal>Project in focus</p>
        <h2 data-reveal style={{ '--d': '80ms' }}>{p.title}</h2>
        <p data-reveal style={{ '--d': '160ms' }}>{p.note}</p>
        <div className="spotlight__thumbs" data-stagger>
          {p.images.slice(1).map((img) => (
            <img key={img} src={img} alt="" loading="lazy" data-reveal />
          ))}
        </div>
        <Link className="link" to="/work" data-reveal>See the full project →</Link>
      </div>
    </section>
  )
}

function FeaturedWork() {
  const featured = projects.filter((p) => p.featured)
  return (
    <section className="section">
      <div className="section__head section__head--row" data-reveal>
        <div>
          <p className="eyebrow">Selected Work</p>
          <h2>Rooms we have finished, and would live in.</h2>
        </div>
        <Link className="link" to="/work">All projects →</Link>
      </div>
      <div className="grid" data-stagger>
        {featured.map((p) => (
          <Link key={p.slug} to="/work" className={`card card--${p.span || 'std'}`} data-reveal>
            <img src={p.images[0]} alt={p.title} loading="lazy" />
            <div className="card__body">
              <span className="chip">{p.category}</span>
              <h3>{p.title}</h3>
              <p>{p.location} · {p.year}{p.images.length > 1 && ` · ${p.images.length} photos`}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* Detail strip: the inside-the-wardrobe shots that clients never get shown. */
function Detail() {
  return (
    <section className="detail">
      <div className="detail__text">
        <p className="eyebrow" data-reveal>Inside the joinery</p>
        <h2 data-reveal style={{ '--d': '80ms' }}>The part you only see after you have paid for it.</h2>
        <p data-reveal style={{ '--d': '160ms' }}>
          Anyone can photograph a closed shutter. We plan the inside first: hanging heights,
          drawer depths, a pull-down rail for the top tier, and a lit profile down the frame
          so you can find a black shirt at six in the morning.
        </p>
        <Link className="btn btn--light" to="/services#wardrobes" data-reveal style={{ '--d': '240ms' }}>
          Wardrobes & storage
        </Link>
      </div>
      <div className="detail__grid" data-stagger>
        {[photos.wardrobeShelving, photos.wardrobeInterior, photos.wardrobePulldown].map((src, i) => (
          <figure key={src} data-reveal className={i === 0 ? 'is-lead' : ''}>
            <img src={src} alt="Wardrobe interior detail" loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  )
}

/* An endless horizontal ribbon of photographs, scrolling opposite the text marquee. */
function Ribbon() {
  const strip = [...ribbon, ...ribbon]
  return (
    <section className="ribbon" aria-label="More photographs of our work">
      <div className="ribbon__track">
        {strip.map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" aria-hidden={i >= ribbon.length} />
        ))}
      </div>
    </section>
  )
}

function ServicesTeaser() {
  return (
    <section className="section section--alt">
      <div className="section__head section__head--row" data-reveal>
        <div>
          <p className="eyebrow">What We Do</p>
          <h2>Eight ways we can take your space on.</h2>
        </div>
        <Link className="link" to="/services">All services →</Link>
      </div>
      <div className="teaser" data-stagger>
        {services.map((s) => (
          <Link key={s.id} to={`/services#${s.id}`} className="teaser__row" data-reveal>
            <span className="teaser__thumb"><img src={s.img} alt="" loading="lazy" /></span>
            <h3>{s.title}</h3>
            <p>{s.blurb}</p>
            <span className="teaser__arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Quotes() {
  return (
    <section className="section quotesec">
      <div className="quotesec__media">
        <Curtain src={photos.diningOpen} alt="Open plan dining and living room" ratio="3/4" speed={0.2} />
      </div>
      <div className="quotesec__body">
        <p className="eyebrow" data-reveal>Clients</p>
        <h2 data-reveal style={{ '--d': '80ms' }}>What people say afterwards.</h2>
        <div className="quotes quotes--stack" data-stagger>
          {testimonials.map((t) => (
            <figure key={t.name} data-reveal>
              <div className="stars" aria-label="Five out of five">★★★★★</div>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <strong>{t.name}</strong>
                <span>{t.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Invite() {
  return (
    <section className="band band--photo">
      <img className="band__bg" src={photos.livingRug} alt="" aria-hidden="true" />
      <div className="band__inner">
        <h2 data-reveal>Tell us about the space.</h2>
        <p data-reveal style={{ '--d': '80ms' }}>
          Consultations in {business.city} are on us. Send a few lines about what you are
          planning and we will come back with a site visit slot.
        </p>
        <div className="band__cta" data-reveal style={{ '--d': '160ms' }}>
          <Link className="btn btn--light" to="/contact">Start an enquiry</Link>
          <a className="btn btn--ghost-light" href={`tel:${business.phone}`}>{business.phoneDisplay}</a>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Stats />
      <Spotlight />
      <FeaturedWork />
      <Detail />
      <Ribbon />
      <ServicesTeaser />
      <Quotes />
      <Invite />
    </>
  )
}
