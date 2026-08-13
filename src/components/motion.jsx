import { useEffect, useRef } from 'react'
import AsciiCanvas, { BACKDROP_ANIM } from './AsciiCanvas'
import SlideUpText from './SlideUpText'

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Drives translateY on an element from its position in the viewport.
   `speed` is the fraction of scroll distance the element lags behind by. */
export function useParallax(speed = 0.18) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return

    let ticking = false
    const apply = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -200 || r.top > vh + 200) {
        ticking = false
        return
      }
      // -1 above the fold, 0 centred, 1 below.
      const progress = (r.top + r.height / 2 - vh / 2) / vh
      // Use the independent `translate` property rather than a --py custom
      // property. Two reasons: custom properties invalidate style for the
      // element *and its whole subtree* (and .hero__bg's subtree holds the
      // canvas), and `translate` composes with the `transform: scale()` the
      // curtain reveal uses instead of clobbering it — so this no longer gets
      // dragged through that rule's 1.4s transform transition.
      el.style.translate = `0 ${(progress * speed * 100).toFixed(2)}px`
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [speed])

  return ref
}

/* A photo that wipes in behind a moving panel, then settles from a slight
   scale-up. Used for the big editorial images rather than every thumbnail. */
export function Curtain({ src, alt, ratio = '4/5', speed = 0.14, className = '', priority = false }) {
  const ref = useParallax(speed)
  const wrap = useRef(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in')
          io.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className={`curtain ${className}`} style={{ '--ratio': ratio }}>
      <img ref={ref} src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} />
      <span className="curtain__panel" aria-hidden="true" />
    </div>
  )
}

const BANNER_PARAMS = {
  renderMode: 'dither',
  bgMode: 'none',
  cellSize: 9,
  coverage: 100,
  invert: false,
  /* Deliberately NOT the same as ASCII_PARAMS in Home. The banner sources in
     `pageHeroes` are light flatlays, so most cells sit well above the Bayer
     threshold and a full density reads correctly. Home's source is a dark
     interior and needs a much lower density — see the note there. */
  brightness: 0,
  contrast: 158,
  density: 20,
  tintOpacity: 0,
  saturation: 100,
  grayscale: 0,
  ...BACKDROP_ANIM,
  pfx: {
    vignette: { enabled: false, intensity: 38 },
    scanLines: { enabled: false, intensity: 40 },
    bloom: { enabled: false, intensity: 25 },
    filmGrain: { enabled: false, intensity: 30 },
    glitch: { enabled: false, intensity: 20 },
    pixelate: { enabled: false, intensity: 15 },
    halftone: { enabled: false, intensity: 20 },
    chromatic: { enabled: false, intensity: 15 },
    filmDust: { enabled: false, intensity: 20 },
  },
  lights: { enabled: false, points: [] },
  mask: { enabled: false, invert: false, dataUrl: null },
}

/* Full-screen banner for inner routes: a slow push-in plus parallax drift. The
   artwork is light and composed right-of-centre, so copy sits left over clear wall. */
export function PageBanner({ src, alt, eyebrow, title, lede, children }) {
  const ref = useParallax(0.1)
  return (
    <header className="banner">
      <div className="banner__media" ref={ref}>
        <AsciiCanvas src={src} params={BANNER_PARAMS} />
      </div>
      <div className="banner__scrim" aria-hidden="true" />
      <div className="banner__inner">
        <p className="eyebrow" data-reveal>{eyebrow}</p>
        <h1 data-reveal style={{ '--d': '80ms' }}>
          {typeof title === 'string'
            ? <SlideUpText split="words" stagger={0.09} delay={0.1}>{title}</SlideUpText>
            : title}
        </h1>
        {lede && <p className="lede" data-reveal style={{ '--d': '160ms' }}>{lede}</p>}
        {children}
      </div>
      <div className="banner__scroll" aria-hidden="true">Scroll</div>
    </header>
  )
}
