# Performance & Motion Plan — Designofiy

Audit: 2026-08-13 · branch `main`, baseline `24fb20f`

Covers two linked goals: making the site stop feeling heavy, and making its
transitions feel smooth. They are linked because **the same thing causes both** —
`AsciiCanvas` saturates the main thread, and no amount of easing-curve tuning will
make animations smooth while it does. Fix the canvas first; the motion work after
it is polish that will actually be visible.

---

## Status

Measured on the Home page, headless Chrome, 6s wall-clock sample.

| | Original `24fb20f` | Now |
|---|---|---|
| Frames delivered | **2.0 fps** (13 frames / 6.5s) | **47.5 fps** (285 frames / 6s) |
| Long tasks | 14, totalling 6,729 ms | 1, totalling 63 ms |
| Page weight | 6.64 MB | **1.58 MB** |
| Imagery | 6.27 MB | 1.20 MB |

**Done**

- §1a/1b Canvas cell-grid cache + ImageData rasteriser
- §1c Canvas pauses off-screen, on hidden tab, and under reduced motion
- §1d DPR capped at 1.5, 30fps throttle
- §2a/2b All photography converted to WebP (`tools/img-to-webp.py`), `data.js` repointed
- §4a `.nav` no longer transitions `padding`
- §4b Parallax writes the `translate` property instead of a `--py` custom property
- Hero photography, gradient backdrop, word-space fix, slideshow retiming

**Still open** — §2c/2d (preload, intrinsic dimensions), §3 (route splitting, fonts,
vendor chunk), §4c (reveal timing), §4d (curtain layer, ribbon marquee),
§4e (drop `motion` from SlideUpText), §4f/4g (scroll + observer cleanup).

**Housekeeping** — `public/` still holds 12.41 MB of now-unreferenced PNGs that
Vite copies into `dist/` on every build. They cost nothing at page load (nothing
requests them) but bloat the deploy. Delete them, or move them out of `public/`
to keep the originals under version control without publishing them.

---

## 1. AsciiCanvas render loop — the main event

[AsciiCanvas.jsx:403-552](src/components/AsciiCanvas.jsx#L403-L552)

At 1440×900 with the shipped `cellSize: 9`:

| Per frame | Count |
|---|---|
| Grid cells (`160 × 100`) | 16,000 |
| Pixel reads in `sampleCell` (81 px/cell) | ~1,300,000 |
| `fillRect` calls issued | ~100,000–250,000 |

At 60 fps that is **~78 M array reads and ~9 M `fillRect` calls per second, per
canvas**. Home mounts two ([hero](src/pages/Home.jsx#L78), [Invite band](src/pages/Home.jsx#L320));
every inner route mounts one via [PageBanner](src/components/motion.jsx#L113).
Nothing stops them when scrolled past or when the tab is hidden, and the backing
store is DPR-scaled so a 2× display quadruples the area.

**This is why animations stutter.** Every reveal, every parallax write, every
hover transition is competing with that loop for the same 16 ms.

### 1a. Cache the cell grid — removes ~100% of per-frame sampling
The sampled grid is a pure function of `(image, w, h, cell)` and never changes
between frames, yet `sampleCell` re-averages 81 pixels per cell every frame.
Replace it with a native box downscale: draw the image into an offscreen canvas
at exactly `cols × rows` and `getImageData` once on resize. Run `adjustColor` in
the same pass and keep the results:

```js
cellRGB = new Uint8ClampedArray(cols * rows * 3)  // post-adjustColor
cellLum = new Float32Array(cols * rows)           // 0..1
```

~16,000 pixels read on resize instead of 1.3 M every frame.

### 1b. Rasterise into ImageData instead of `fillRect`
For `dither` (the only mode this site uses) each cell is a 4×4 Bayer block.
Write into a persistent `ImageData` of `(cols*4) × (rows*4)` — 640×400 for the
case above — then `putImageData` to a small offscreen canvas and `drawImage` it
up to the display canvas with `imageSmoothingEnabled = false`.

~100k Canvas2D calls become ~256k typed-array writes plus one `drawImage`.
Expect 20–50×. The only visual delta is the 0.88 sub-cell gap in
[drawDither](src/components/AsciiCanvas.jsx#L83), which at a 2.25 px sub-cell is
0.27 px and already invisible. Keep the per-cell path as a fallback for the other
14 render modes.

### 1c. Stop rendering when nothing is watching
- `IntersectionObserver` on the canvas (`rootMargin: '200px'`) → cancel the RAF
  on exit, restart on re-entry.
- `visibilitychange` → cancel on `document.hidden`.
- `prefers-reduced-motion: reduce` → render one frame, then stop. The CSS honours
  reduced motion; the canvas currently does not.

### 1d. Cap resolution and frame rate
- Clamp the backing store to `min(devicePixelRatio, 1.5)` — 44% less area on a 2×
  display, and there is nothing for the extra pixels to resolve in a dither.
- Throttle to ~30 fps with a timestamp accumulator. The pulse is 1.4 Hz.
- Below ~700 px wide, render one static frame and stop.

---

## 2. Remaining image weight

`public/` is still **13 MB of PNG**, minus the hero set already converted:

```
public/hero/   6.9 MB   7 page-banner flatlays, ~1.0 MB each at ~1100×600
public/work/   5.7 MB  16 project photos, up to 0.5 MB each
```

These are screenshot-grade PNGs used as photographs. The same Pillow script that
produced the hero WebPs handles them — no new dependency.

- **2a.** Convert `public/work/` and the `pageHeroes` flatlays to WebP q82.
  Expect ~13 MB → ~1.2 MB. Keep the PNGs in git until verified, then delete.
- **2b.** Update the paths in [data.js](src/data.js#L27-L46) — a mechanical
  extension swap in one file.
- **2c.** Preload the LCP image and give the first hero slide
  `fetchpriority="high"`.
- **2d.** Add intrinsic `width`/`height` to every `<img>`. The ribbon and card
  images have no `aspect-ratio`, so they shift layout as they load.

---

## 3. Bundle and network

Current build: **365 KB JS**, 30 KB CSS, one chunk.

- **3a.** Route-level `React.lazy` for the six non-Home routes.
- **3b.** `motion` is the largest dependency and is pulled in by `SlideUpText`,
  used on every page — so splitting will not remove it from the initial chunk.
  See §4e; removing it is both a size win and a smoothness win.
- **3c.** Self-host the two fonts. `index.html` makes render-blocking requests to
  two third-party origins, each costing a DNS + TLS handshake on the critical path.
- **3d.** `manualChunks` for a stable react/react-router vendor chunk.

---

## 4. Motion and transition quality

### Already fixed
The hero slideshow drift was a `transition: transform 4s linear` running against
a 3.6 s hold — it was cut off mid-zoom and then played *backwards* on the
outgoing frame, which is what made each change read as a lurch. It is now a
keyframe animation timed to complete inside the hold (`--hero-ken: 2900ms` vs
`HOLD = 3000`), with the fade on its own curve and the headline stagger tightened
to land well before the swap.

### 4a. `.nav` animates `padding` — layout on every frame
[styles.css:177](src/styles.css#L177) transitions `padding` for 0.5 s, and
`.nav--solid` changes `padding-block`. That forces layout every frame for half a
second on a `position: fixed` flex container — **and it fires exactly when the
user starts scrolling**, so it lands on the worst possible frames. Transition
`background` and `color` only; get the size change from `transform: scaleY()` on
a background pseudo-element, or accept an instant padding snap.

### 4b. `useParallax` invalidates style through a custom property
[motion.jsx:11-47](src/components/motion.jsx#L11-L47) is correctly rAF-throttled,
but it writes `--py`, which `transform: translateY(var(--py))` consumes. Changing
a custom property invalidates style for the element **and its whole subtree** —
for `.hero__bg` that subtree contains the canvas. Write
`el.style.transform = 'translate3d(0,' + y + 'px,0)'` directly and it stays a
pure compositor mutation.

### 4c. Reveals are slow and over-staggered
[styles.css:211-214](src/styles.css#L211-L214) transitions opacity and transform
over 0.9 s, and [useReveal](src/components/common.jsx#L26-L29) adds up to
`8 × 90 ms` of stagger — so the last item in a group finishes **1.62 s** after
the group enters view. Drop to ~0.55 s with a ~55 ms stagger capped at 6 items.
Same choreography, half the wait.

### 4d. Layers held forever, and a marquee that never stops
- [.curtain img](src/styles.css#L217) carries a permanent `will-change: transform`,
  holding a compositor layer for every large photo for the whole session. Set it
  only while the transition runs.
- [.ribbon__track](src/styles.css#L518) runs a 90 s infinite `translateX` over 16
  large images, on Home, always — including when scrolled far past. Pause it with
  an `IntersectionObserver`-toggled `animation-play-state`.

### 4e. `SlideUpText` mounts one `motion.span` per word
Every heading builds a React component and an independent animation per word —
Home mounts several hundred. `motion` is used for exactly one effect:
`translateY(105% → 0)` with a staggered delay. That is a CSS transition plus
`transition-delay: calc(var(--i) * 45ms)`, driven by the `.in` class `useReveal`
already applies. Removing it drops ~45–60 KB gzipped, deletes hundreds of
component instances, and makes the stagger frame-exact instead of scheduler-dependent.

Bigger change than the rest of §4, so do it after §1 and §2.

### 4f. Header scroll handler is not throttled
[Layout.jsx:29-34](src/components/Layout.jsx#L29-L34) calls `setScrolled` on every
scroll event. React bails out on an unchanged boolean, but the handler still runs
uncoalesced on every event. Wrap it in the same rAF guard `useParallax` uses.

### 4g. `useReveal` re-queries the document on every render
[common.jsx:10-34](src/components/common.jsx#L10-L34) has no dependency array, so
it tears down its observer and re-runs `querySelectorAll` over the whole document
after every `Layout` render. Key it off `pathname` plus the Work page's filter
state.

---

## Order of work

| # | Task | Effort | Impact |
|---|---|---|---|
| 1 | Canvas: pause off-screen / hidden / reduced-motion (1c) | ~30 min | **Very high** |
| 2 | Canvas: cache cell grid + ImageData rasteriser (1a, 1b) | ~2 h | **Very high** |
| 3 | Canvas: DPR cap, 30 fps, mobile static (1d) | ~30 min | High |
| 4 | Convert remaining PNGs to WebP (2a, 2b) | ~1 h | **Very high** |
| 5 | `.nav` padding transition (4a) | ~15 min | High — very visible |
| 6 | Parallax writes transform directly (4b) | ~20 min | High |
| 7 | Reveal timing + ribbon/curtain layers (4c, 4d) | ~45 min | Medium |
| 8 | Preload, intrinsic dimensions (2c, 2d) | ~30 min | Medium |
| 9 | Scroll/observer cleanup (4f, 4g) | ~30 min | Medium |
| 10 | Route splitting + vendor chunk (3a, 3d) | ~30 min | Medium |
| 11 | Self-host fonts (3c) | ~45 min | Medium |
| 12 | Replace `motion` in SlideUpText with CSS (4e) | ~2 h | Medium |

Steps 1–6 are what change how the site feels. 7–12 are polish.

Note that 5 and 6 are cheap, highly visible, and independent of the canvas work —
worth doing early even though the canvas dominates the raw numbers.

## How to verify

Capture a baseline first, so the work is measurable rather than assumed:

- DevTools → Performance, record 10 s of scrolling `/`. Note frame rate, the
  self-time of `render` in `AsciiCanvas.jsx`, and any purple (layout) bands during
  the nav transition.
- Network, cache disabled, hard reload `/` → total transferred bytes.
- Lighthouse mobile → LCP and TBT.

Re-measure after step 4 and again after step 6. Targets: no long task over 50 ms
while scrolling, initial page weight under 1.5 MB, LCP under 2.5 s on throttled 4G,
and no layout events during the header state change.
