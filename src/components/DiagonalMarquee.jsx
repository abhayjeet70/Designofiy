import { useEffect, useRef } from 'react'

/**
 * DiagonalMarquee — rows of photographs sliding past on a diagonal.
 *
 * Ported from the Great UI "diagonal marquee carousel" (React + Tailwind + TS)
 * to this project's stack: plain JSX, no Tailwind, no `cn()` helper, styling in
 * styles.css against the existing design tokens. Deliberate divergences:
 *
 *  - Square corners, not `rounded-xl`. DESIGN.md reserves rounding for pills.
 *  - Three rows of ~9 cards, not five rows of 18. The original mounts ~180
 *    <img> elements; this site just had its main thread rescued from a canvas
 *    loop and is not getting it taken away again by a footer.
 *  - Pauses when scrolled out of view, and holds still under reduced motion —
 *    the same treatment the hero canvas got.
 */
export default function DiagonalMarquee({
  images = [],
  angle = -18,
  baseSpeed = 90,
  className = '',
  children,
}) {
  const ref = useRef(null)

  // Only animate while the band is actually on screen.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => el.classList.toggle('is-paused', !e.isIntersecting),
      { rootMargin: '150px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!images.length) return null

  // Three rows, each offset so the same photo never sits directly above itself.
  const rows = [
    { items: images, speed: baseSpeed, reverse: false },
    { items: [...images].reverse(), speed: baseSpeed - 18, reverse: true },
    { items: [...images.slice(3), ...images.slice(0, 3)], speed: baseSpeed + 14, reverse: false },
  ]

  return (
    <section
      ref={ref}
      className={`marquee ${children ? 'marquee--cta' : ''} ${className}`}
      aria-label={children ? undefined : 'Photographs from recent projects'}
    >
      <div className="marquee__stage" style={{ '--angle': `${angle}deg` }} aria-hidden="true">
        {rows.map((row, r) => (
          <div className="marquee__row" key={r}>
            <div
              className={`marquee__track ${row.reverse ? 'marquee__track--rev' : ''}`}
              style={{ '--speed': `${row.speed}s` }}
            >
              {/* rendered twice so the loop meets itself seamlessly at -50% */}
              {[0, 1].map((copy) => (
                <div className="marquee__set" key={copy}>
                  {row.items.map((src, i) => (
                    <div className="marquee__card" key={`${copy}-${i}`}>
                      <img src={src} alt="" loading="lazy" decoding="async" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="marquee__fade marquee__fade--top" aria-hidden="true" />
      <div className="marquee__fade marquee__fade--bottom" aria-hidden="true" />

      {/* When the band carries copy the photographs become its ground, so they
          need a scrim heavy enough to hold text contrast on the left. */}
      {children && (
        <>
          <div className="marquee__scrim" aria-hidden="true" />
          <div className="marquee__inner">{children}</div>
        </>
      )}
    </section>
  )
}
