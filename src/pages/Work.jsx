import { useCallback, useEffect, useMemo, useState } from 'react'
import { pageHeroes, photos, projects } from '../data'
import { CtaBand, useReveal } from '../components/common'
import { PageBanner } from '../components/motion'

export default function Work() {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => p.category)))],
    []
  )
  const [active, setActive] = useState('All')
  const [open, setOpen] = useState(null)   // the project being viewed
  const [frame, setFrame] = useState(0)    // index within that project's images

  const shown = active === 'All' ? projects : projects.filter((p) => p.category === active)

  // The grid is keyed on `active`, so changing the filter mounts a fresh set of
  // [data-reveal] cards that Layout's observer never sees. Re-scan for them.
  useReveal([active])

  const show = (p) => { setOpen(p); setFrame(0) }
  const step = useCallback(
    (dir) => setFrame((f) => (open ? (f + dir + open.images.length) % open.images.length : 0)),
    [open]
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, step])

  const shots = projects.reduce((n, p) => n + p.images.length, 0)

  return (
    <>
      <PageBanner
        {...pageHeroes.work}
        eyebrow="Selected work"
        title={<>Projects across <em>Lucknow</em>.</>}
        lede={`${projects.length} projects, ${shots} photographs. Filter by what you are building, then click any project to page through it.`}
      />

      <section className="section section--tight">
        <div className="filters" data-reveal>
          {categories.map((c) => (
            <button
              key={c}
              className={c === active ? 'is-active' : ''}
              onClick={() => setActive(c)}
              aria-pressed={c === active}
            >
              {c}
              <em>{c === 'All' ? projects.length : projects.filter((p) => p.category === c).length}</em>
            </button>
          ))}
        </div>

        <div className="grid" data-stagger key={active}>
          {shown.map((p) => (
            <button
              key={p.slug}
              className={`card card--${p.span || 'std'}`}
              data-reveal
              onClick={() => show(p)}
              aria-label={`View ${p.title}`}
            >
              <img src={p.images[0]} alt={p.title} loading="lazy" />
              {p.images.length > 1 && <span className="card__count">{p.images.length}</span>}
              <div className="card__body">
                <span className="chip">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.location} · {p.year}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <CtaBand
        title="Want something like this?"
        body="Send us the floor plan, or just the address. We will come measure and tell you honestly what it takes."
        image={photos.livingWide}
        imageAlt=""
      />

      {open && (
        <div className="lightbox" onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={open.title}>
          <button className="lightbox__close" aria-label="Close" onClick={() => setOpen(null)}>×</button>
          <figure onClick={(e) => e.stopPropagation()}>
            <div className="lightbox__stage">
              {open.images.length > 1 && (
                <button className="lightbox__nav lightbox__nav--prev" onClick={() => step(-1)} aria-label="Previous photo">‹</button>
              )}
              <img key={frame} src={open.images[frame]} alt={`${open.title}, photo ${frame + 1}`} />
              {open.images.length > 1 && (
                <button className="lightbox__nav lightbox__nav--next" onClick={() => step(1)} aria-label="Next photo">›</button>
              )}
            </div>

            {open.images.length > 1 && (
              <div className="lightbox__thumbs">
                {open.images.map((img, i) => (
                  <button
                    key={img}
                    className={i === frame ? 'is-active' : ''}
                    onClick={() => setFrame(i)}
                    aria-label={`Photo ${i + 1}`}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}

            <figcaption>
              <span className="chip">{open.category}</span>
              <h2>{open.title}</h2>
              <p className="muted">
                {open.location} · {open.year}
                {open.images.length > 1 && ` · ${frame + 1} of ${open.images.length}`}
              </p>
              <p>{open.note}</p>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
