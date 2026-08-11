import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { business, marquee } from '../data'

export const waLink = (text) =>
  `https://wa.me/${business.phone.replace('+', '')}?text=${encodeURIComponent(text)}`

/* Adds .in when an element scrolls into view. Re-runs on every render so newly
   mounted nodes (e.g. after a route change or a gallery filter) get observed too. */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px' }
    )
    document.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => {
      // Children of a [data-stagger] container cascade in rather than landing together.
      const group = el.parentElement
      if (group?.hasAttribute('data-stagger') && !el.style.getPropertyValue('--d')) {
        const i = [...group.children].indexOf(el)
        el.style.setProperty('--d', `${Math.min(i, 8) * 90}ms`)
      }
      io.observe(el)
    })
    return () => io.disconnect()
  })
}

export function Marquee() {
  const items = [...marquee, ...marquee]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((m, i) => (
          <span key={i}>{m}<i>✦</i></span>
        ))}
      </div>
    </div>
  )
}

export function WhatsAppIcon({ size = 26 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  )
}

export function WhatsAppFab() {
  return (
    <a
      className="fab"
      href={waLink('Hi Designofiy! I would like to discuss an interior project.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Designofiy on WhatsApp"
      title="Chat on WhatsApp"
    >
      <WhatsAppIcon size={28} />
      <span className="fab__pulse" aria-hidden="true" />
    </a>
  )
}

/* Bottom-of-page conversion block, shared by every inner route. */
export function CtaBand({ title, body, cta = 'Book a consultation' }) {
  return (
    <section className="band" data-reveal>
      <div className="band__inner">
        <h2>{title}</h2>
        <p>{body}</p>
        <div className="band__cta">
          <Link className="btn btn--light" to="/contact">{cta}</Link>
          <a className="btn btn--ghost-light" href={`tel:${business.phone}`}>{business.phoneDisplay}</a>
        </div>
      </div>
    </section>
  )
}
