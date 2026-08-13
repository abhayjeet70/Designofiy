/**
 * AsciiCanvas — Canvas2D implementation of the "Ink Garden" effect from 21st.dev
 *
 * Render pipeline:
 *  1. Draw source image into offscreen canvas at target size
 *  2. Grid-sample each cell for average colour/luminance
 *  3. Per-cell primitive based on renderMode (default: "dither")
 *  4. Colour adjustments: brightness, contrast, saturation, grayscale, tint
 *  5. Post-FX layer (scanLines, vignette, bloom, chromatic, filmGrain, glitch, halftone, pixelate)
 *  6. Optional point lights
 *  7. Pulse animation via animStyle / animSpeed / animIntensity
 */

import { useEffect, useRef } from 'react'

/* ---------- constants ---------- */
const CHAR_SETS = {
  standard: ' .:-=+*#%@',
  blocks: ' \u2591\u2592\u2593\u2588',
  dots: ' \u00b7\u2236\u2237\u28ff',
}

/* ---------- helpers ---------- */
/* Backing-store scale. Capped at 1.5: the output is a 4x4 dither cell, so there
   is nothing for a 2x buffer to resolve, and area (and therefore fill cost)
   grows with the square of this number. */
const MAX_DPR = 1.5
const dpr = () => Math.min(window.devicePixelRatio || 1, MAX_DPR)

const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v))
const lerp = (a, b, t) => a + (b - a) * t

/* Modes handled by the per-cell Canvas2D fallback. 'dither' is absent on
   purpose: it takes the fast ImageData path, and anything unrecognised falls
   back to dither too, matching the original `else` branch. */
const MODES = new Set([
  'characters', 'dots', 'pixel', 'mosaic', 'cross', 'diamond', 'lines',
  'diagonal', 'hatch', 'stars', 'hearts', 'hexagons', 'triangles', 'rings',
  'bubbles', 'halfblocks',
])

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function adjustColor(r, g, b, brightness, contrast, saturation, grayscale) {
  let nr = r / 255, ng = g / 255, nb = b / 255
  const bShift = brightness / 100
  nr += bShift; ng += bShift; nb += bShift
  const cf = contrast / 100
  nr = (nr - 0.5) * cf + 0.5
  ng = (ng - 0.5) * cf + 0.5
  nb = (nb - 0.5) * cf + 0.5
  const lum = 0.2126 * nr + 0.7152 * ng + 0.0722 * nb
  const sf = saturation / 100
  nr = lerp(lum, nr, sf); ng = lerp(lum, ng, sf); nb = lerp(lum, nb, sf)
  if (grayscale > 0) {
    const gf = grayscale / 100
    const gl = 0.2126 * nr + 0.7152 * ng + 0.0722 * nb
    nr = lerp(nr, gl, gf); ng = lerp(ng, gl, gf); nb = lerp(nb, gl, gf)
  }
  return [clamp(nr) * 255, clamp(ng) * 255, clamp(nb) * 255]
}

/* ---------- render primitives ---------- */

const BAYER = [
  [ 0, 8, 2,10],
  [12, 4,14, 6],
  [ 3,11, 1, 9],
  [15, 7,13, 5],
]
// Same matrix, pre-divided and flattened for the hot rasteriser loop.
const BAYER_FLAT = Float32Array.from(BAYER.flat(), (v) => v / 16)

function drawDither(ctx, cx, cy, cell, r, g, b, lum, invert, density, animMod) {
  const threshold = invert ? 1 - lum : lum
  const densScale = density / 20
  const stepX = cell / 4, stepY = cell / 4
  ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
  for (let dy = 0; dy < 4; dy++) {
    for (let dx = 0; dx < 4; dx++) {
      const bayerVal = BAYER[dy][dx] / 16 + animMod * 0.12
      if (threshold * densScale > bayerVal) {
        ctx.fillRect(cx + dx * stepX, cy + dy * stepY, stepX * 0.88, stepY * 0.88)
      }
    }
  }
}

function drawDots(ctx, cx, cy, cell, r, g, b, lum, invert) {
  const t = invert ? 1 - lum : lum
  const radius = (cell / 2) * t * 0.9
  if (radius < 0.4) return
  ctx.beginPath()
  ctx.arc(cx + cell / 2, cy + cell / 2, radius, 0, Math.PI * 2)
  ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
  ctx.fill()
}

function drawCharacters(ctx, cx, cy, cell, r, g, b, lum, invert, charSet) {
  const chars = CHAR_SETS[charSet] || CHAR_SETS.standard
  const t = invert ? 1 - lum : lum
  const idx = Math.floor(t * (chars.length - 1))
  const ch = chars[idx]
  if (!ch || ch === ' ') return
  ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
  ctx.font = `${cell}px monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(ch, cx + cell / 2, cy + cell / 2)
}

function drawMosaic(ctx, cx, cy, cell, r, g, b) {
  const pad = cell * 0.06
  ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
  ctx.fillRect(cx + pad, cy + pad, cell - pad * 2, cell - pad * 2)
}

function drawCross(ctx, cx, cy, cell, r, g, b, lum, invert) {
  const t = invert ? 1 - lum : lum
  const thickness = Math.max(1, cell * 0.12 * t)
  const half = cell / 2
  ctx.strokeStyle = `rgb(${r|0},${g|0},${b|0})`
  ctx.lineWidth = thickness
  ctx.beginPath()
  ctx.moveTo(cx + half, cy); ctx.lineTo(cx + half, cy + cell)
  ctx.moveTo(cx, cy + half); ctx.lineTo(cx + cell, cy + half)
  ctx.stroke()
}

function drawDiamond(ctx, cx, cy, cell, r, g, b, lum, invert) {
  const t = invert ? 1 - lum : lum
  const s = (cell / 2) * t
  const mx = cx + cell / 2, my = cy + cell / 2
  if (s < 0.5) return
  ctx.beginPath()
  ctx.moveTo(mx, my - s); ctx.lineTo(mx + s, my); ctx.lineTo(mx, my + s); ctx.lineTo(mx - s, my)
  ctx.closePath()
  ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
  ctx.fill()
}

function drawLines(ctx, cx, cy, cell, r, g, b, lum, invert, density) {
  const t = invert ? 1 - lum : lum
  const n = Math.max(1, Math.round(t * density * 0.4))
  const gap = cell / n
  ctx.strokeStyle = `rgb(${r|0},${g|0},${b|0})`
  ctx.lineWidth = Math.max(0.5, gap * 0.35)
  for (let i = 0; i < n; i++) {
    const y = cy + i * gap + gap / 2
    ctx.beginPath(); ctx.moveTo(cx, y); ctx.lineTo(cx + cell, y); ctx.stroke()
  }
}

function drawHatch(ctx, cx, cy, cell, r, g, b, lum, invert) {
  const t = invert ? 1 - lum : lum
  const n = Math.max(1, Math.round(t * 4))
  const gap = cell / n
  ctx.strokeStyle = `rgb(${r|0},${g|0},${b|0})`
  ctx.lineWidth = 0.5
  for (let i = 0; i < n; i++) {
    const y = cy + i * gap + gap / 2
    ctx.beginPath(); ctx.moveTo(cx, y); ctx.lineTo(cx + cell, y); ctx.stroke()
    if (t > 0.5) {
      const x = cx + i * gap + gap / 2
      ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x, cy + cell); ctx.stroke()
    }
  }
}

function drawStars(ctx, cx, cy, cell, r, g, b, lum, invert) {
  const t = invert ? 1 - lum : lum
  if (t < 0.08) return
  const mx = cx + cell / 2, my = cy + cell / 2
  const outer = (cell / 2) * t, inner = outer * 0.38
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2
    const rad = i % 2 === 0 ? outer : inner
    const x = mx + Math.cos(angle) * rad, y = my + Math.sin(angle) * rad
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
  ctx.fill()
}

function drawHearts(ctx, cx, cy, cell, r, g, b, lum, invert) {
  const t = invert ? 1 - lum : lum
  if (t < 0.08) return
  const s = (cell * 0.42) * t
  const mx = cx + cell / 2, my = cy + cell / 2
  ctx.beginPath()
  ctx.moveTo(mx, my + s * 0.7)
  ctx.bezierCurveTo(mx - s, my, mx - s, my - s, mx, my - s * 0.5)
  ctx.bezierCurveTo(mx + s, my - s, mx + s, my, mx, my + s * 0.7)
  ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
  ctx.fill()
}

function drawHexagons(ctx, cx, cy, cell, r, g, b, lum, invert) {
  const t = invert ? 1 - lum : lum
  if (t < 0.05) return
  const rad = (cell / 2) * 0.85
  const mx = cx + cell / 2, my = cy + cell / 2
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    const x = mx + Math.cos(angle) * rad * t, y = my + Math.sin(angle) * rad * t
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
  ctx.fill()
}

function drawTriangles(ctx, cx, cy, cell, r, g, b, lum, invert) {
  const t = invert ? 1 - lum : lum
  if (t < 0.05) return
  const s = cell * t
  const mx = cx + cell / 2, my = cy + cell / 2
  ctx.beginPath()
  ctx.moveTo(mx, my - s / 2); ctx.lineTo(mx + s / 2, my + s / 2); ctx.lineTo(mx - s / 2, my + s / 2)
  ctx.closePath()
  ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
  ctx.fill()
}

function drawRings(ctx, cx, cy, cell, r, g, b, lum, invert) {
  const t = invert ? 1 - lum : lum
  if (t < 0.05) return
  const mx = cx + cell / 2, my = cy + cell / 2
  const thickness = Math.max(0.8, cell * 0.08)
  const radius = (cell / 2) * t - thickness / 2
  if (radius <= 0) return
  ctx.strokeStyle = `rgb(${r|0},${g|0},${b|0})`
  ctx.lineWidth = thickness
  ctx.beginPath(); ctx.arc(mx, my, radius, 0, Math.PI * 2); ctx.stroke()
}

function drawBubbles(ctx, cx, cy, cell, r, g, b, lum, invert) {
  const t = invert ? 1 - lum : lum
  if (t < 0.06) return
  const mx = cx + cell / 2, my = cy + cell / 2
  const radius = (cell / 2) * t
  ctx.strokeStyle = `rgba(${r|0},${g|0},${b|0},0.9)`
  ctx.lineWidth = Math.max(0.6, cell * 0.06)
  ctx.fillStyle = `rgba(${r|0},${g|0},${b|0},0.12)`
  ctx.beginPath(); ctx.arc(mx, my, radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
}

function drawHalfBlocks(ctx, cx, cy, cell, r, g, b, lum, invert) {
  const t = invert ? 1 - lum : lum
  const h = cell * t
  ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
  ctx.fillRect(cx, cy + (cell - h), cell, h)
}

/* ---------- post-FX ---------- */

function applyVignette(ctx, w, h, intensity) {
  const cx = w / 2, cy = h / 2
  const r = Math.sqrt(cx * cx + cy * cy) * 1.1
  const grad = ctx.createRadialGradient(cx, cy, r * 0.35, cx, cy, r)
  const alpha = (intensity / 100) * 0.85
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(1, `rgba(0,0,0,${alpha})`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
}

function applyScanLines(ctx, w, h, intensity) {
  const alpha = (intensity / 100) * 0.5
  ctx.fillStyle = `rgba(0,0,0,${alpha})`
  for (let y = 0; y < h; y += 2) ctx.fillRect(0, y, w, 1)
}

function applyBloom(ctx, w, h, intensity) {
  const alpha = (intensity / 100) * 0.22
  ctx.globalAlpha = alpha
  ctx.globalCompositeOperation = 'screen'
  ctx.drawImage(ctx.canvas, 0, 0)
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
}

function applyFilmGrain(ctx, w, h, intensity, t) {
  const alpha = (intensity / 100) * 0.14
  const grain = ctx.createImageData(w, h)
  const d = grain.data
  const seed = (t * 17.3) | 0
  for (let i = 0; i < d.length; i += 4) {
    const n = ((Math.sin(i * 0.0001 + seed) * 43758.5453) % 1 + 1) * 0.5 * 255
    d[i] = d[i + 1] = d[i + 2] = n | 0
    d[i + 3] = alpha * 255
  }
  ctx.putImageData(grain, 0, 0)
}

function applyGlitch(ctx, w, h, intensity) {
  const slices = Math.floor((intensity / 100) * 5) + 1
  for (let i = 0; i < slices; i++) {
    const sy = Math.floor(Math.random() * h)
    const sh = Math.floor(Math.random() * 8) + 2
    const dx = (Math.random() - 0.5) * (intensity / 100) * 18
    try {
      const slice = ctx.getImageData(0, sy, w, Math.min(sh, h - sy))
      ctx.putImageData(slice, dx, sy)
    } catch (_) {}
  }
}

function applyHalftone(ctx, w, h, intensity) {
  const dotSize = Math.max(2, (intensity / 100) * 6)
  ctx.globalAlpha = 0.22
  ctx.fillStyle = '#000'
  for (let y = 0; y < h; y += dotSize * 2) {
    for (let x = 0; x < w; x += dotSize * 2) {
      ctx.beginPath()
      ctx.arc(x + dotSize, y + dotSize, dotSize * 0.45, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

function applyPixelate(ctx, w, h, intensity) {
  const size = Math.max(2, Math.floor((intensity / 100) * 12))
  for (let y = 0; y < h; y += size) {
    for (let x = 0; x < w; x += size) {
      try {
        const d = ctx.getImageData(x + (size / 2 | 0), y + (size / 2 | 0), 1, 1).data
        ctx.fillStyle = `rgb(${d[0]},${d[1]},${d[2]})`
        ctx.fillRect(x, y, size, size)
      } catch (_) {}
    }
  }
}

/* Shared pulse settings for every backdrop on the site, so the hero and the
   inner-page banners always drift at the same rate.

   `animSpeed.intensity` is a percentage of the base rate: drawFrame computes
   animBase = t * (intensity / 100) * 1.4, and the pulse is sin(animBase * 2PI),
   so 100 is a 1.4Hz throb. That read as restless pixel noise behind the
   headline. 28 puts it at roughly 0.4Hz — one slow breath every 2.5s.

   `animIntensity` is amplitude, not rate; it is left alone so the effect keeps
   the same depth, just calmer. */
export const BACKDROP_ANIM = {
  animated: true,
  animStyle: 'pulse',
  animSpeed: { enabled: true, intensity: 28 },
  animIntensity: { enabled: true, intensity: 60 },
}

/* ---------- default parameters ---------- */

const DEFAULT_PARAMS = {
  renderMode: 'dither',
  bgMode: 'none',
  bgBlur: 12,
  bgOpacity: 90,
  cellSize: 9,
  coverage: 100,
  invert: false,
  charSet: 'standard',
  brightness: 0,
  contrast: 158,
  density: 20,
  tint: '#3ca6ff',
  tintOpacity: 0,
  overlayBlend: 'multiply',
  saturation: 100,
  grayscale: 0,
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
  ...BACKDROP_ANIM,
  lights: { enabled: false, points: [] },
  mask: { enabled: false, invert: false, dataUrl: null },
}

/* ---------- component ---------- */

export default function AsciiCanvas({ src, params: userParams = {}, className = '', style = {} }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const imgRef = useRef(null)
  const paramsRef = useRef({ ...DEFAULT_PARAMS, ...userParams })

  useEffect(() => {
    paramsRef.current = { ...DEFAULT_PARAMS, ...userParams }
  }, [userParams])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    imgRef.current = img

    let running = true
    let lastW = 0, lastH = 0

    /* --- when the loop is allowed to run ---------------------------------
       The effect is decorative and costs a full grid redraw per frame, so it
       only runs while the canvas is actually on screen, the tab is focused,
       and the user has not asked for reduced motion. Previously it ran flat
       out for the life of the page, including for canvases scrolled far out
       of view and for background tabs. */
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let onScreen = false
    let imgReady = false
    let lastFrameAt = 0

    // A pulse at ~1.4Hz does not need 60fps, and every frame skipped is a full
    // grid of fillRects not issued.
    const MIN_FRAME_MS = 1000 / 30

    const shouldRun = () => imgReady && onScreen && !document.hidden

    const stop = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    const start = () => {
      if (!running || rafRef.current !== null || !shouldRun()) return
      if (motionQuery.matches) {
        // Reduced motion: one static frame, never scheduled again. Drawn at
        // t=0 so the pulse sits at its neutral phase — passing the wall clock
        // here would freeze the effect at an arbitrary point in the cycle.
        drawFrame(0)
        return
      }
      lastFrameAt = 0
      rafRef.current = requestAnimationFrame(render)
    }

    const render = (timestamp) => {
      if (!running) return
      if (!shouldRun()) { rafRef.current = null; return }
      rafRef.current = requestAnimationFrame(render)
      if (timestamp - lastFrameAt < MIN_FRAME_MS) return
      lastFrameAt = timestamp
      drawFrame(timestamp)
    }

    /* --- cached cell grid -------------------------------------------------
       The sampled grid is a pure function of (image, w, h, cell) and the colour
       params — none of which change between frames. It used to be recomputed
       every frame, averaging 81 source pixels per cell. Now the browser does
       the box-filter for us by drawing the image straight to a cols x rows
       canvas, and the result is cached until something it depends on changes. */
    let grid = null
    let gridKey = ''

    const ensureGrid = (w, h, cell, p) => {
      const cols = Math.ceil(w / cell)
      const rows = Math.ceil(h / cell)
      const key = `${cols}x${rows}|${p.brightness},${p.contrast},${p.saturation},${p.grayscale}`
      if (grid && gridKey === key) return grid

      const off = new OffscreenCanvas(cols, rows)
      const offCtx = off.getContext('2d', { willReadFrequently: true })
      offCtx.imageSmoothingEnabled = true
      offCtx.imageSmoothingQuality = 'high'
      offCtx.drawImage(img, 0, 0, cols, rows)
      const src = offCtx.getImageData(0, 0, cols, rows).data

      const n = cols * rows
      const rgb = new Uint8ClampedArray(n * 3)
      const lum = new Float32Array(n)
      for (let i = 0; i < n; i++) {
        const s = i * 4
        const [ar, ag, ab] = adjustColor(
          src[s], src[s + 1], src[s + 2],
          p.brightness, p.contrast, p.saturation, p.grayscale,
        )
        rgb[i * 3] = ar; rgb[i * 3 + 1] = ag; rgb[i * 3 + 2] = ab
        lum[i] = luminance(ar, ag, ab) / 255
      }
      grid = { cols, rows, rgb, lum }
      gridKey = key
      return grid
    }

    /* --- dither rasteriser ------------------------------------------------
       The dither is a 4x4 Bayer block per cell, so instead of issuing up to 16
       fillRect calls per cell (~100k per frame at 1440x900) we write the
       sub-cells straight into a cols*4 x rows*4 ImageData and blit it up with a
       single nearest-neighbour drawImage. Same output, typed-array writes
       instead of Canvas2D path setup. */
    let ditherBuf = null, ditherCanvas = null, ditherCtx = null

    const drawDitherFast = (p, g, w, h, animBase, intFactor) => {
      const { cols, rows, rgb, lum } = g
      const bw = cols * 4, bh = rows * 4
      if (!ditherBuf || ditherBuf.width !== bw || ditherBuf.height !== bh) {
        ditherCanvas = new OffscreenCanvas(bw, bh)
        ditherCtx = ditherCanvas.getContext('2d')
        ditherBuf = ditherCtx.createImageData(bw, bh)
      }
      const d = ditherBuf.data
      d.fill(0)

      const densScale = p.density / 20
      const invert = p.invert
      const animated = p.animated && intFactor > 0
      const style = p.animStyle || 'pulse'
      // 'pulse' is spatially uniform, so hoist it out of the per-cell loop.
      const uniformMod = animated && style === 'pulse'
        ? Math.sin(animBase * 2 * Math.PI) * intFactor
        : 0
      const coverage = p.coverage

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (coverage < 100 && Math.random() * 100 > coverage) continue
          const ci = row * cols + col

          let animMod = uniformMod
          if (animated && style !== 'pulse') {
            if (style === 'wave') {
              animMod = Math.sin(animBase * 2 * Math.PI + (col + row) * 0.3) * intFactor
            } else if (style === 'shimmer') {
              animMod = Math.sin(animBase * 3 + col * 0.4) * intFactor
            } else if (style === 'ripple') {
              const dx = col - cols / 2, dy = row - rows / 2
              animMod = Math.sin(animBase * 4 - Math.sqrt(dx * dx + dy * dy) * 0.5) * intFactor
            } else if (style === 'flicker') {
              animMod = (Math.random() - 0.5) * 2 * intFactor
            }
          }

          const modLum = clamp(lum[ci] + animMod * 0.18)
          const threshold = (invert ? 1 - modLum : modLum) * densScale
          const bias = animMod * 0.12
          const r = rgb[ci * 3], gg = rgb[ci * 3 + 1], b = rgb[ci * 3 + 2]
          const bx = col * 4, by = row * 4

          for (let dy = 0; dy < 4; dy++) {
            const rowOff = (by + dy) * bw
            for (let dx = 0; dx < 4; dx++) {
              if (threshold > BAYER_FLAT[dy * 4 + dx] + bias) {
                const o = (rowOff + bx + dx) * 4
                d[o] = r; d[o + 1] = gg; d[o + 2] = b; d[o + 3] = 255
              }
            }
          }
        }
      }

      ditherCtx.putImageData(ditherBuf, 0, 0)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(ditherCanvas, 0, 0, w, h)
      ctx.imageSmoothingEnabled = true
    }

    /* Tint, post-FX and point lights. Shared by the fast dither path and the
       per-cell fallback, so both composite identically. */
    const finishFrame = (p, w, h, t) => {
      if (p.tintOpacity > 0) {
        ctx.save()
        ctx.globalAlpha = p.tintOpacity / 100
        ctx.globalCompositeOperation = p.overlayBlend || 'multiply'
        ctx.fillStyle = p.tint || '#3ca6ff'
        ctx.fillRect(0, 0, w, h)
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1
        ctx.restore()
      }

      const pfx = p.pfx || {}
      if (pfx.scanLines?.enabled) applyScanLines(ctx, w, h, pfx.scanLines.intensity)
      if (pfx.vignette?.enabled) applyVignette(ctx, w, h, pfx.vignette.intensity)
      if (pfx.bloom?.enabled) applyBloom(ctx, w, h, pfx.bloom.intensity)
      if (pfx.halftone?.enabled) applyHalftone(ctx, w, h, pfx.halftone.intensity)
      if (pfx.pixelate?.enabled) applyPixelate(ctx, w, h, pfx.pixelate.intensity)
      if (pfx.filmGrain?.enabled) applyFilmGrain(ctx, w, h, pfx.filmGrain.intensity, t)
      if (pfx.glitch?.enabled) applyGlitch(ctx, w, h, pfx.glitch.intensity)

      if (p.lights?.enabled && p.lights.points?.length) {
        p.lights.points.forEach(({ x, y, radius = 0.25, intensity: li = 0.6 }) => {
          const px = x * w, py = y * h
          const r = radius * Math.min(w, h)
          const grad = ctx.createRadialGradient(px, py, 0, px, py, r)
          grad.addColorStop(0, `rgba(255,220,120,${li * 0.7})`)
          grad.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.globalCompositeOperation = 'screen'
          ctx.fillStyle = grad
          ctx.fillRect(0, 0, w, h)
          ctx.globalCompositeOperation = 'source-over'
        })
      }
    }

    const drawFrame = (timestamp) => {
      const p = paramsRef.current
      // CSS-pixel dimensions (what we draw in after the DPR scale transform)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (w < 2 || h < 2) return
      if (!img.complete || img.naturalWidth === 0) return

      const t = timestamp / 1000
      if (lastW !== w || lastH !== h) { grid = null; lastW = w; lastH = h }

      ctx.save()
      ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0)
      ctx.clearRect(0, 0, w, h)

      // Background
      if (p.bgMode === 'photo') {
        ctx.save(); ctx.globalAlpha = p.bgOpacity / 100; ctx.drawImage(img, 0, 0, w, h); ctx.restore()
      } else if (p.bgMode === 'blur') {
        ctx.save(); ctx.filter = `blur(${p.bgBlur}px)`; ctx.globalAlpha = p.bgOpacity / 100
        ctx.drawImage(img, 0, 0, w, h); ctx.filter = 'none'; ctx.restore()
      } else if (p.bgMode === 'color') {
        ctx.fillStyle = p.bgColor || '#000'; ctx.fillRect(0, 0, w, h)
      }

      // Grid drawing
      const cell = Math.max(2, p.cellSize)
      const g = ensureGrid(w, h, cell, p)
      const { cols, rows } = g

      const speedFactor = p.animSpeed?.enabled ? (p.animSpeed.intensity / 100) : 0
      const intFactor = p.animIntensity?.enabled ? (p.animIntensity.intensity / 100) : 0
      const animBase = p.animated ? t * speedFactor * 1.4 : 0

      const mode = p.renderMode
      // Fast path: the mode this site actually uses. Everything else falls
      // through to the original per-cell Canvas2D loop below, now reading the
      // cached grid rather than re-sampling the source.
      if (mode === 'dither' || !MODES.has(mode)) {
        drawDitherFast(p, g, w, h, animBase, intFactor)
        finishFrame(p, w, h, t)
        ctx.restore()
        return
      }

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (p.coverage < 100 && Math.random() * 100 > p.coverage) continue

          const cx = col * cell, cy = row * cell
          const ci = row * cols + col
          const ar = g.rgb[ci * 3], ag = g.rgb[ci * 3 + 1], ab = g.rgb[ci * 3 + 2]
          const lum = g.lum[ci]

          let animMod = 0
          if (p.animated && intFactor > 0) {
            const style = p.animStyle || 'pulse'
            if (style === 'pulse') {
              animMod = Math.sin(animBase * 2 * Math.PI) * intFactor
            } else if (style === 'wave') {
              animMod = Math.sin(animBase * 2 * Math.PI + (col + row) * 0.3) * intFactor
            } else if (style === 'shimmer') {
              animMod = Math.sin(animBase * 3 + col * 0.4) * intFactor
            } else if (style === 'ripple') {
              const dx = col - cols / 2, dy = row - rows / 2
              animMod = Math.sin(animBase * 4 - Math.sqrt(dx * dx + dy * dy) * 0.5) * intFactor
            } else if (style === 'flicker') {
              animMod = (Math.random() - 0.5) * 2 * intFactor
            }
          }

          const modLum = clamp(lum + animMod * 0.18)

          const mode = p.renderMode
          if (mode === 'dither') {
            drawDither(ctx, cx, cy, cell, ar, ag, ab, modLum, p.invert, p.density, animMod)
          } else if (mode === 'characters') {
            drawCharacters(ctx, cx, cy, cell, ar, ag, ab, modLum, p.invert, p.charSet || 'standard')
          } else if (mode === 'dots') {
            drawDots(ctx, cx, cy, cell, ar, ag, ab, modLum, p.invert)
          } else if (mode === 'pixel' || mode === 'mosaic') {
            drawMosaic(ctx, cx, cy, cell, ar, ag, ab)
          } else if (mode === 'cross') {
            drawCross(ctx, cx, cy, cell, ar, ag, ab, modLum, p.invert)
          } else if (mode === 'diamond') {
            drawDiamond(ctx, cx, cy, cell, ar, ag, ab, modLum, p.invert)
          } else if (mode === 'lines' || mode === 'diagonal') {
            drawLines(ctx, cx, cy, cell, ar, ag, ab, modLum, p.invert, p.density)
          } else if (mode === 'hatch') {
            drawHatch(ctx, cx, cy, cell, ar, ag, ab, modLum, p.invert)
          } else if (mode === 'stars') {
            drawStars(ctx, cx, cy, cell, ar, ag, ab, modLum, p.invert)
          } else if (mode === 'hearts') {
            drawHearts(ctx, cx, cy, cell, ar, ag, ab, modLum, p.invert)
          } else if (mode === 'hexagons') {
            drawHexagons(ctx, cx, cy, cell, ar, ag, ab, modLum, p.invert)
          } else if (mode === 'triangles') {
            drawTriangles(ctx, cx, cy, cell, ar, ag, ab, modLum, p.invert)
          } else if (mode === 'rings') {
            drawRings(ctx, cx, cy, cell, ar, ag, ab, modLum, p.invert)
          } else if (mode === 'bubbles') {
            drawBubbles(ctx, cx, cy, cell, ar, ag, ab, modLum, p.invert)
          } else if (mode === 'halfblocks') {
            drawHalfBlocks(ctx, cx, cy, cell, ar, ag, ab, modLum, p.invert)
          } else {
            drawDither(ctx, cx, cy, cell, ar, ag, ab, modLum, p.invert, p.density, animMod)
          }
        }
      }

      finishFrame(p, w, h, t)
      ctx.restore()
    }

    // Observe the canvas itself — CSS inset:0/width:100%/height:100% drives layout;
    // we only set the pixel-buffer dimensions here.
    const syncSize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (w < 1 || h < 1) return
      const newW = (w * dpr()) | 0
      const newH = (h * dpr()) | 0
      if (canvas.width !== newW || canvas.height !== newH) {
        canvas.width = newW
        canvas.height = newH
        grid = null // force the cell grid to rebuild at the new size
        if (rafRef.current === null) start() // repaint a paused/static canvas
      }
    }

    const ro = new ResizeObserver(syncSize)
    ro.observe(canvas)
    syncSize() // run once immediately

    // Only paint while the canvas is near the viewport.
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting
        if (onScreen) start(); else stop()
      },
      { rootMargin: '200px' }
    )
    io.observe(canvas)

    const onVisibility = () => { if (document.hidden) stop(); else start() }
    document.addEventListener('visibilitychange', onVisibility)

    const onMotionChange = () => { stop(); start() }
    motionQuery.addEventListener?.('change', onMotionChange)

    const onLoad = () => { imgReady = true; start() }
    img.onload = onLoad
    if (img.complete && img.naturalWidth > 0) onLoad()

    return () => {
      running = false
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      motionQuery.removeEventListener?.('change', onMotionChange)
      stop()
    }
  }, [src])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        ...style,
      }}
      aria-hidden="true"
    />
  )
}
