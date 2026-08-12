import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  business, heroSequence, photos, projects, ribbon, services, stats, testimonials,
} from '../data'
import { Curtain, useParallax } from '../components/motion'

const HOLD = 6000 // ms each slide holds before advancing

/* The backdrop holds still while the photograph and the headline advance together.
   Autoplay pauses on hover/focus and never starts under prefers-reduced-motion. */
function Hero() {
  const bg = useParallax(0.06)
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef(null)

  const go = (n) => setI((n + heroSequence.length) % heroSequence.length)

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    timer.current = setTimeout(() => go(i + 1), HOLD)
    return () => clearTimeout(timer.current)
  }, [i, paused])

  const slide = heroSequence[i]

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={bg}
        className="hero__bg"
        style={{ backgroundImage: `url(${photos.heroBg})` }}
        aria-hidden="true"
      />
      <div className="hero__veil" aria-hidden="true" />

      <div className="hero__copy">
        <p className="hero__index">
          Interior architecture &amp; turnkey execution · Lucknow, since 2022
        </p>

        {/* key remounts the block so the line-by-line mask animation replays */}
        <h1 key={`h${i}`} className="hero__head">
          {slide.lines.map((line, n) => (
            <span className="mask" key={n}>
              <span
                className="mask__in"
                style={{ '--d': `${n * 90}ms` }}
                dangerouslySetInnerHTML={{ __html: line }}
              />
            </span>
          ))}
        </h1>

        <p key={`s${i}`} className="hero__sub">{slide.sub}</p>

        <div className="hero__cta">
          <Link className="btn btn--solid" to="/contact">Book a consultation</Link>
          <Link className="btn" to={slide.to}>See {slide.tag.toLowerCase()}</Link>
        </div>
      </div>

      <figure className="hero__media">
        {heroSequence.map((s, n) => (
          <img
            key={s.src}
            src={s.src}
            alt={n === i ? s.alt : ''}
            className={n === i ? 'is-active' : ''}
            aria-hidden={n !== i}
            loading={n === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </figure>

      <div className="hero__ticker" role="tablist" aria-label="Hero slides">
        {heroSequence.map((s, n) => (
          <button
            key={s.tag}
            role="tab"
            aria-selected={n === i}
            className={n === i ? 'is-active' : ''}
            onClick={() => go(n)}
          >
            <span className="hero__tick" aria-hidden="true">
              <i style={{ animationDuration: `${HOLD}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
            </span>
            {s.tag}
          </button>
        ))}
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="statband" data-stagger>
      {stats.map((s) => (
        <div key={s.label} data-reveal>
          <strong>{s.value}<span>{s.suffix}</span></strong>
          <p>{s.label}</p>
        </div>
      ))}
    </section>
  )
}

function Spotlight() {
  const p = projects[0]
  return (
    <section className="spotlight">
      <Curtain src={p.images[0]} alt={p.title} ratio="4/5" className="spotlight__media" />
      <div className="spotlight__body">
        <p className="eyebrow" data-reveal>Project in focus</p>
        <h2 data-reveal style={{ '--d': '80ms' }}>{p.title}</h2>
        <p data-reveal style={{ '--d': '150ms' }}>{p.note}</p>
        <div className="spotlight__thumbs" data-stagger>
          {p.images.slice(1).map((img) => (
            <img key={img} src={img} alt="" loading="lazy" data-reveal />
          ))}
        </div>
        <Link className="link" to="/work" data-reveal>See the full project</Link>
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
          <p className="eyebrow">Selected work</p>
          <h2>Nine commissions, across the city.</h2>
        </div>
        <Link className="link" to="/work">All projects</Link>
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

function Detail() {
  return (
    <section className="detail section--paper">
      <div className="detail__text">
        <p className="eyebrow" data-reveal>Inside the joinery</p>
        <h2 data-reveal style={{ '--d': '80ms' }}>
          The <em>interior</em> of the interior.
        </h2>
        <p data-reveal style={{ '--d': '150ms' }}>
          Anyone can photograph a closed shutter. We resolve what sits behind it first:
          hanging heights, drawer depths, a pull-down rail for the top tier, and a lit
          profile down the frame so a black shirt is findable at six in the morning.
        </p>
        <Link className="btn" to="/services#wardrobes" data-reveal style={{ '--d': '220ms' }}>
          Wardrobes &amp; storage
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
          <p className="eyebrow">Disciplines</p>
          <h2>Eight ways in.</h2>
        </div>
        <Link className="link" to="/services">All services</Link>
      </div>
      <div className="teaser" data-stagger>
        {services.map((s, i) => (
          <Link key={s.id} to={`/services#${s.id}`} className="teaser__row" data-reveal>
            <span className="teaser__num">{String(i + 1).padStart(2, '0')}</span>
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
        <Curtain src={photos.diningOpen} alt="Open plan dining and living room" ratio="3/4" speed={0.14} />
      </div>
      <div className="quotesec__body">
        <p className="eyebrow" data-reveal>Clients</p>
        <h2 data-reveal style={{ '--d': '80ms' }}>Said after handover.</h2>
        <div className="quotes" data-stagger>
          {testimonials.map((t) => (
            <figure key={t.name} data-reveal>
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
        <div className="band__cta" data-reveal style={{ '--d': '150ms' }}>
          <Link className="btn btn--solid" to="/contact">Start an enquiry</Link>
          <a className="btn" href={`tel:${business.phone}`}>{business.phoneDisplay}</a>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
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
