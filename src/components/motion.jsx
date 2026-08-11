import { useEffect, useRef, useState } from 'react'

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
      el.style.setProperty('--py', `${progress * speed * 100}px`)
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

/* Counts a number up once it scrolls into view. Non-numeric values pass through. */
export function CountUp({ value, duration = 1400 }) {
  const target = parseFloat(value)
  const decimals = (value.split('.')[1] || '').length
  const [shown, setShown] = useState(Number.isFinite(target) ? '0' : value)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !Number.isFinite(target)) return
    if (reduced()) {
      setShown(value)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3)
          setShown((target * eased).toFixed(decimals))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, value, decimals, duration])

  return <span ref={ref}>{shown}</span>
}

/* Full-screen banner for inner routes: a slow push-in plus parallax drift. The
   artwork is light and composed right-of-centre, so copy sits left over clear wall. */
export function PageBanner({ src, alt, eyebrow, title, lede, children }) {
  const ref = useParallax(0.1)
  return (
    <header className="banner">
      <div className="banner__media">
        <img ref={ref} src={src} alt={alt} fetchPriority="high" />
      </div>
      <div className="banner__scrim" aria-hidden="true" />
      <div className="banner__inner">
        <p className="eyebrow" data-reveal>{eyebrow}</p>
        <h1 data-reveal style={{ '--d': '80ms' }}>{title}</h1>
        {lede && <p className="lede" data-reveal style={{ '--d': '160ms' }}>{lede}</p>}
        {children}
      </div>
      <div className="banner__scroll" aria-hidden="true"><span /></div>
    </header>
  )
}
