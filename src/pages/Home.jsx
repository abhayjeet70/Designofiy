import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  business, heroSequence, marqueeImages, photos, projects, ribbon, services, stats, testimonials,
} from '../data'
import { Curtain, useParallax } from '../components/motion'
import AsciiCanvas, { BACKDROP_ANIM } from '../components/AsciiCanvas'
import DiagonalMarquee from '../components/DiagonalMarquee'
import SlideUpText from '../components/SlideUpText'

const ASCII_PARAMS = {
  renderMode: 'dither',
  bgMode: 'none',
  bgBlur: 12,
  bgOpacity: 90,
  cellSize: 9,
  coverage: 100,
  invert: false,
  /* density is the lever that matters: drawDither scales the Bayer threshold by
     density/20, so 20 lights almost every cell and swamps the headline. Held low
     so only the highlights of the source punch through onto the gradient. */
  brightness: -6,
  contrast: 155,
  density: 8,
  tint: '#3ca6ff',
  tintOpacity: 0,
  overlayBlend: 'multiply',
  saturation: 100,
  grayscale: 0,
  ...BACKDROP_ANIM,
  pfx: {
    vignette: { enabled: false, intensity: 38 },
    scanLines: { enabled: false, intensity: 40 },
    chromatic: { enabled: false, intensity: 15 },
    bloom: { enabled: false, intensity: 25 },
    filmGrain: { enabled: false, intensity: 30 },
    glitch: { enabled: false, intensity: 20 },
    pixelate: { enabled: false, intensity: 15 },
    halftone: { enabled: false, intensity: 20 },
    filmDust: { enabled: false, intensity: 20 },
  },
  lights: { enabled: false, points: [] },
  mask: { enabled: false, invert: false, dataUrl: null },
}

// ms each slide holds before advancing. Paired with --hero-ken in styles.css,
// which must stay just under this so the drift lands before the swap.
const HOLD = 3000

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
      <div ref={bg} className="hero__bg" aria-hidden="true">
        <AsciiCanvas src={photos.heroBg} params={ASCII_PARAMS} />
      </div>
      <div className="hero__veil" aria-hidden="true" />

      <div className="hero__copy">
        <p className="hero__index">
          Interior architecture &amp; turnkey execution · Lucknow, since 2022
        </p>

        {/* key remounts so slide-up replays on each slide change */}
        <h1 key={`h${i}`} className="hero__head">
          {slide.lines.map((line, n) => (
            <span className="mask" key={n}>
              <SlideUpText
                split="words"
                delay={n * 0.06}
                stagger={0.045}
                /* tighter than the 0.55s default so all three lines land well
                   inside the 3s hold rather than still moving at the swap */
                transition={{ type: 'tween', ease: [0.625, 0.05, 0, 1], duration: 0.42 }}
                style={{ '--d': `${n * 60}ms` }}
              >
                {line.replace(/<[^>]+>/g, '')}
              </SlideUpText>
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
        <h2 data-reveal style={{ '--d': '80ms' }}>
          <SlideUpText split="words" stagger={0.07} inView once>
            {p.title}
          </SlideUpText>
        </h2>

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
  let currentColumn = 0;
  return (
    <section className="section">
      <div className="section__head section__head--row" data-reveal>
        <div>
          <p className="eyebrow">Selected work</p>
          <h2>
            <SlideUpText split="words" stagger={0.07} inView once>
              Nine commissions, across the city.
            </SlideUpText>
          </h2>

        </div>
        <Link className="link" to="/work">All projects</Link>
      </div>
      <div className="grid" data-stagger>
        {featured.map((p) => {
          let span = p.span === 'wide' ? 2 : 1;
          let direction = 'bottom';
          if (currentColumn === 0) direction = 'left';
          else if (currentColumn === 2 || (currentColumn === 1 && span === 2)) direction = 'right';
          currentColumn = (currentColumn + span) % 3;
          return (
            <Link key={p.slug} to="/work" className={`card card--${p.span || 'std'}`} data-reveal={direction}>
              <img src={p.images[0]} alt={p.title} loading="lazy" />
              <div className="card__body">
                <span className="chip">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.location} · {p.year}{p.images.length > 1 && ` · ${p.images.length} photos`}</p>
              </div>
            </Link>
          )
        })}
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
          <SlideUpText split="words" stagger={0.07} inView once>
            The interior of the interior.
          </SlideUpText>
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
          <h2>
            <SlideUpText split="words" stagger={0.07} inView once>
              Eight ways in.
            </SlideUpText>
          </h2>

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
        <h2 data-reveal style={{ '--d': '80ms' }}>
          <SlideUpText split="words" stagger={0.07} inView once>
            Said after handover.
          </SlideUpText>
        </h2>

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
      <DiagonalMarquee images={marqueeImages}>
        <h2 data-reveal>
          <SlideUpText split="words" stagger={0.08} inView once>
            Tell us about the space.
          </SlideUpText>
        </h2>
        <p data-reveal style={{ '--d': '80ms' }}>
          Consultations in {business.city} are on us. Send a few lines about what you are
          planning and we will come back with a site visit slot.
        </p>
        <div className="band__cta" data-reveal style={{ '--d': '150ms' }}>
          <Link className="btn btn--solid" to="/contact">Start an enquiry</Link>
          <a className="btn" href={`tel:${business.phone}`}>{business.phoneDisplay}</a>
        </div>
      </DiagonalMarquee>
    </>
  )
}
