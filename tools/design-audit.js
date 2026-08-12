/**
 * DESIGN AUDIT — paste into the browser console on any site to extract its
 * type, palette, spacing and layout decisions.
 *
 * Usage:
 *   1. Open the site, scroll the whole page once (so lazy sections render).
 *   2. DevTools > Console. If it blocks pasting, type "allow pasting" first.
 *   3. Paste this whole file, hit enter.
 *   4. Read the tables. `copy(__audit)` puts the full JSON on your clipboard.
 *
 * Reads only what the browser already computed — no network calls, nothing sent
 * anywhere. Note that font FILES are licensed: use this to identify a typeface,
 * then buy/license it properly. Identifying is legal; copying webfont files is not.
 */
(() => {
  const MAX = 6000
  const els = [...document.querySelectorAll('body *')].slice(0, MAX)

  const visible = els.filter((el) => {
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) return false
    const s = getComputedStyle(el)
    return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0.05
  })

  const bump = (map, key, weight = 1) => {
    if (!key) return
    map.set(key, (map.get(key) || 0) + weight)
  }
  const rank = (map, n = 14) =>
    [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n)

  const fonts = new Map()
  const sizes = new Map()
  const weights = new Map()
  const textColors = new Map()
  const bgColors = new Map()
  const radii = new Map()
  const shadows = new Map()
  const gaps = new Map()
  const tracking = new Map()
  const leading = new Map()

  for (const el of visible) {
    const s = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    const area = Math.round((r.width * r.height) / 1000) || 1
    const hasText = [...el.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim().length > 1
    )

    if (hasText) {
      bump(fonts, s.fontFamily.split(',')[0].replace(/["']/g, '').trim())
      bump(sizes, `${Math.round(parseFloat(s.fontSize))}px`)
      bump(weights, s.fontWeight)
      bump(textColors, s.color)
      if (s.letterSpacing !== 'normal') bump(tracking, s.letterSpacing)
      bump(leading, s.lineHeight)
    }

    // Backgrounds weighted by painted area — this is what the eye actually reads
    // as "the palette", rather than what appears most often in the DOM.
    const bg = s.backgroundColor
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') bump(bgColors, bg, area)

    if (s.borderRadius !== '0px') bump(radii, s.borderRadius)
    if (s.boxShadow !== 'none') bump(shadows, s.boxShadow)
    if (s.display === 'flex' || s.display === 'grid') {
      if (s.gap && s.gap !== 'normal') bump(gaps, s.gap)
    }
  }

  // --- loaded webfonts + their source files ---
  const faces = []
  try {
    document.fonts.forEach((f) => {
      if (f.status === 'loaded') faces.push(`${f.family} ${f.weight} ${f.style}`)
    })
  } catch {}
  const fontFiles = performance
    .getEntriesByType('resource')
    .map((e) => e.name)
    .filter((u) => /\.(woff2?|ttf|otf)(\?|$)/i.test(u))

  // --- design tokens the site declares on :root ---
  const tokens = {}
  for (const sheet of document.styleSheets) {
    let rules
    try { rules = sheet.cssRules } catch { continue }  // cross-origin
    for (const rule of rules || []) {
      if (rule.selectorText === ':root' || rule.selectorText === 'html') {
        for (const prop of rule.style) {
          if (prop.startsWith('--')) tokens[prop] = rule.style.getPropertyValue(prop).trim()
        }
      }
    }
  }

  // --- layout: how wide is the content column, really ---
  const containers = visible
    .filter((el) => {
      const s = getComputedStyle(el)
      return s.maxWidth !== 'none' && parseFloat(s.maxWidth) > 300
    })
    .map((el) => getComputedStyle(el).maxWidth)
  const columns = new Map()
  containers.forEach((c) => bump(columns, c))

  const grids = visible
    .filter((el) => getComputedStyle(el).display === 'grid')
    .map((el) => getComputedStyle(el).gridTemplateColumns)
    .filter((v) => v && v !== 'none')
  const gridShapes = new Map()
  grids.forEach((g) => bump(gridShapes, `${g.split(' ').length} cols`))

  const out = {
    url: location.href,
    scanned: visible.length,
    typefaces: rank(fonts, 8),
    typeScale: rank(sizes, 16).sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])),
    weights: rank(weights, 8),
    letterSpacing: rank(tracking, 8),
    lineHeight: rank(leading, 8),
    textColors: rank(textColors, 10),
    backgrounds: rank(bgColors, 10),
    borderRadius: rank(radii, 8),
    shadows: rank(shadows, 6),
    flexGridGaps: rank(gaps, 10),
    contentWidths: rank(columns, 6),
    gridShapes: rank(gridShapes, 6),
    loadedFaces: [...new Set(faces)],
    fontFiles: [...new Set(fontFiles)],
    cssVariables: tokens,
  }

  const table = (label, pairs) => {
    if (!pairs?.length) return
    console.groupCollapsed(`%c${label}`, 'color:#b08b46;font-weight:600')
    console.table(pairs.map(([value, count]) => ({ value, count })))
    console.groupEnd()
  }

  console.clear()
  console.log(`%cDESIGN AUDIT — ${location.hostname}`, 'font:600 16px system-ui;color:#b08b46')
  console.log(`${visible.length} visible elements scanned\n`)

  table('TYPEFACES (by element count)', out.typefaces)
  table('TYPE SCALE (largest first)', out.typeScale)
  table('FONT WEIGHTS', out.weights)
  table('LETTER SPACING', out.letterSpacing)
  table('LINE HEIGHT', out.lineHeight)
  table('TEXT COLOURS', out.textColors)
  table('BACKGROUNDS (by painted area)', out.backgrounds)
  table('BORDER RADIUS', out.borderRadius)
  table('SHADOWS', out.shadows)
  table('GAPS', out.flexGridGaps)
  table('CONTENT WIDTHS', out.contentWidths)
  table('GRID SHAPES', out.gridShapes)

  if (out.loadedFaces.length) {
    console.groupCollapsed('%cLOADED FONT FACES', 'color:#b08b46;font-weight:600')
    out.loadedFaces.forEach((f) => console.log(f))
    console.groupEnd()
  }
  if (out.fontFiles.length) {
    console.groupCollapsed('%cFONT FILES', 'color:#b08b46;font-weight:600')
    out.fontFiles.forEach((f) => console.log(f))
    console.groupEnd()
  }
  if (Object.keys(out.cssVariables).length) {
    console.groupCollapsed('%cCSS VARIABLES ON :root', 'color:#b08b46;font-weight:600')
    console.table(out.cssVariables)
    console.groupEnd()
  }

  // Paint the background palette as swatches so you can judge it by eye.
  console.log('%cPALETTE', 'color:#b08b46;font-weight:600')
  out.backgrounds.slice(0, 8).forEach(([c]) =>
    console.log(`%c    %c ${c}`, `background:${c};padding:2px 14px;border:1px solid #8886`, '')
  )

  window.__audit = out
  console.log('\nFull object in `__audit`. Run `copy(__audit)` to copy it as JSON.')
  return out
})()
