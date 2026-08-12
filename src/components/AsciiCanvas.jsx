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
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v))
const lerp = (a, b, t) => a + (b - a) * t

function sampleCell(data, imgW, x0, y0, w, h) {
  let r = 0, g = 0, b = 0, n = 0
  const x1 = Math.min(x0 + w, imgW)
  const rowW = imgW * 4
  for (let cy = y0; cy < y0 + h; cy++) {
    for (let cx = x0; cx < x1; cx++) {
      const i = cy * rowW + cx * 4
      r += data[i]; g += data[i + 1]; b += data[i + 2]
      n++
    }
  }
  if (n === 0) return [0, 0, 0]
  return [r / n, g / n, b / n]
}

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
  animated: true,
  animStyle: 'pulse',
  animSpeed: { enabled: true, intensity: 100 },
  animIntensity: { enabled: true, intensity: 60 },
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
    let lastSrcData = null
    let lastW = 0, lastH = 0

    const render = (timestamp) => {
      if (!running) return
      rafRef.current = requestAnimationFrame(render)

      const p = paramsRef.current
      // CSS-pixel dimensions (what we draw in after the DPR scale transform)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (w < 2 || h < 2) return
      if (!img.complete || img.naturalWidth === 0) return

      const t = timestamp / 1000

      // Re-sample source only when canvas size changes or first run
      if (!lastSrcData || lastW !== w || lastH !== h) {
        const off = new OffscreenCanvas(w, h)
        const offCtx = off.getContext('2d')
        offCtx.drawImage(img, 0, 0, w, h)
        lastSrcData = offCtx.getImageData(0, 0, w, h)
        lastW = w; lastH = h
      }
      const srcData = lastSrcData

      ctx.save()
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
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
      const cols = Math.ceil(w / cell)
      const rows = Math.ceil(h / cell)

      const speedFactor = p.animSpeed?.enabled ? (p.animSpeed.intensity / 100) : 0
      const intFactor = p.animIntensity?.enabled ? (p.animIntensity.intensity / 100) : 0
      const animBase = p.animated ? t * speedFactor * 1.4 : 0

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (p.coverage < 100 && Math.random() * 100 > p.coverage) continue

          const cx = col * cell, cy = row * cell
          const [sr, sg, sb] = sampleCell(srcData.data, w, cx, cy, cell, cell)
          const [ar, ag, ab] = adjustColor(sr, sg, sb, p.brightness, p.contrast, p.saturation, p.grayscale)
          const lum = luminance(ar, ag, ab) / 255

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

      // Tint overlay
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

      // Post-FX
      const pfx = p.pfx || {}
      if (pfx.scanLines?.enabled) applyScanLines(ctx, w, h, pfx.scanLines.intensity)
      if (pfx.vignette?.enabled) applyVignette(ctx, w, h, pfx.vignette.intensity)
      if (pfx.bloom?.enabled) applyBloom(ctx, w, h, pfx.bloom.intensity)
      if (pfx.halftone?.enabled) applyHalftone(ctx, w, h, pfx.halftone.intensity)
      if (pfx.pixelate?.enabled) applyPixelate(ctx, w, h, pfx.pixelate.intensity)
      if (pfx.filmGrain?.enabled) applyFilmGrain(ctx, w, h, pfx.filmGrain.intensity, t)
      if (pfx.glitch?.enabled) applyGlitch(ctx, w, h, pfx.glitch.intensity)

      // Point lights
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

      ctx.restore()
    }

    // Observe the canvas itself — CSS inset:0/width:100%/height:100% drives layout;
    // we only set the pixel-buffer dimensions here.
    const syncSize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (w < 1 || h < 1) return
      const newW = (w * devicePixelRatio) | 0
      const newH = (h * devicePixelRatio) | 0
      if (canvas.width !== newW || canvas.height !== newH) {
        canvas.width = newW
        canvas.height = newH
        lastSrcData = null // force re-sample on next frame
      }
    }

    const ro = new ResizeObserver(syncSize)
    ro.observe(canvas)
    syncSize() // run once immediately

    const start = () => { rafRef.current = requestAnimationFrame(render) }
    img.onload = start
    if (img.complete && img.naturalWidth > 0) start()

    return () => {
      running = false
      ro.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
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
