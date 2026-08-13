import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { business, photos, services } from '../data'
import { WhatsAppFab, useReveal } from './common'

export const ROUTES = [
  ['Work', '/work'],
  ['Services', '/services'],
  ['Studio', '/studio'],
  ['Process', '/process'],
  ['Contact', '/contact'],
]

const TITLES = {
  '/': 'Designofiy | Interior Designers in Lucknow',
  '/work': 'Our Work | Designofiy Interiors, Lucknow',
  '/services': 'Services | Designofiy Interiors, Lucknow',
  '/studio': 'The Studio | Designofiy Interior LLP',
  '/process': 'How We Work | Designofiy Interiors',
  '/contact': 'Contact | Designofiy Interiors, Lucknow',
}

/* Every route opens on a full-screen hero with a dark wash behind the nav, so the
   header starts transparent with light type and goes solid on scroll. */
function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toTop = useScrollTop()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : 'nav--overlay'}`}>
      <Link to="/" className="brand" onClick={() => { setOpen(false); toTop('/') }}>
        <img className="brand__mark" src={photos.logo} alt="Designofiy Interior LLP" />
      </Link>

      <nav className={`nav__links ${open ? 'is-open' : ''}`}>
        {ROUTES.map(([label, path]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => (isActive ? 'is-current' : '')}
            onClick={() => setOpen(false)}
          >
            {label}
          </NavLink>
        ))}
        <a className="btn btn--sm" href={`tel:${business.phone}`}>{business.phoneDisplay}</a>
      </nav>

      <button
        className={`burger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>
    </header>
  )
}

function Footer() {
  const { address } = business
  const toTop = useScrollTop()
  return (
    <footer className="footer">
      <div className="footer__top">
        <div>
          <Link to="/" className="brand brand--footer" onClick={() => toTop('/')}>
            <img className="brand__mark" src={photos.logo} alt="Designofiy Interior LLP" />
          </Link>
          <p className="footer__blurb">
            Interior design and turnkey execution in Lucknow. Residential, modular and
            commercial, designed to a budget you set.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          {ROUTES.map(([label, path]) => (
            <Link key={path} to={path}>{label}</Link>
          ))}
        </div>
        <div>
          <h4>Services</h4>
          {services.map((s) => (
            <Link key={s.id} to={`/services#${s.id}`}>{s.title}</Link>
          ))}
        </div>
        <div>
          <h4>Studio</h4>
          <p>{address.line1}<br />{address.line2}<br />{address.city}, {address.state} {address.pin}</p>
          <a href={`tel:${business.phone}`}>{business.phoneDisplay}</a>
          <a href={business.instagram} target="_blank" rel="noopener noreferrer">{business.instagramHandle}</a>
        </div>
      </div>
      <div className="footer__bar">
        <p>© {new Date().getFullYear()} {business.legalName}. All rights reserved.</p>
        <p>GSTIN {business.gstin} · LLPIN {business.llpin}</p>
        <p className="footer__credit">
          Designed and maintained by{' '}
          <a href="https://webnxt.co/" target="_blank" rel="noopener noreferrer">WebNxt</a>
        </p>
      </div>
    </footer>
  )
}

/* Clicking the wordmark should always end up at the top of the page. Router
   <Link> only scrolls via ScrollManager, which keys off pathname — so from the
   footer of the page you are already on, nothing happened at all. */
function useScrollTop() {
  const { pathname } = useLocation()
  return (to) => {
    if (pathname !== to) return // a real navigation; ScrollManager handles it
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }
}

/* Route changes should land at the top of the new page, but an in-page
   anchor (/services#modular) still needs to scroll to its target. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function Layout() {
  const { pathname } = useLocation()
  useReveal([pathname])

  useEffect(() => {
    document.title = TITLES[pathname] || TITLES['/']
  }, [pathname])

  return (
    <>
      <ScrollManager />
      <Header />
      <main><Outlet /></main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
