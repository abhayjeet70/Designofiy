# Designofiy — Design System

Reference: **Studio X** (`thisisstudiox.com`), audited with [tools/design-audit.js](tools/design-audit.js).

We take their **system** — the structural decisions that make it feel designed rather than
generated. We do **not** take their palette, their typefaces or their layout, because
cloning a live studio's site is both a legal risk and a worse outcome than having our own
identity. What follows is: what they do, why it works, what we do instead.

---

## 1. What the audit actually revealed

### The four decisions that do most of the work

**a. Sans-dominant, serif as a rare accent.**
`Saans` appears on 102 elements. `Serrif Compressed` appears on **14**. The serif is a
condiment, not the meal — used at weight 300, often italic, for one or two phrases.

> Our old site did the exact inverse: Cormorant Garamond on every heading. A serif on
> every heading is the single loudest "AI-generated" signal, because it's the default
> a model reaches for when asked to make something "elegant".

**b. A type scale with a cliff in it.**
Only four sizes actually render: `104px, 80px, 28px, 17px`. There is nothing between
28px and 80px. Their tokens confirm it — `h2` tops out at 4.998rem, `h3` at 1.752rem.
That gap is deliberate: a heading is either *enormous* or *body-sized*. No timid middle
tier. A smooth 1.25-ratio scale where every step is slightly bigger than the last is what
generated designs produce, and it reads as flat.

**c. One vivid accent, used almost nowhere.**
`--swatch--brand: #ff4101`. By painted area it scores **37** — against 28,057 for the
background. That's roughly 0.1% of the page. The confidence comes from the restraint.

**d. No shadows.**
Three faint `inset` shadows on the entire site. Separation is done with hairline borders
(`color-mix(in srgb, dark 10%, transparent)`) and with space. Soft drop shadows on
rounded cards are a template signature.

### The rest of their system

| | Studio X |
|---|---|
| Ground | `#f2f0e6` bone, card `#eae7db` |
| Ink | `#1d1d1d` — **neutral**, not warm brown |
| Accent | `#ff4101` |
| Grid | 12 columns, `.5rem` gutter |
| Page max | `160rem` (2560px) — they let it run very wide |
| Narrow max | `60rem` |
| Fluid range | viewport `20rem → 160rem`, everything `clamp()`ed between |
| Line height | `1` display · `1.2` medium · `1.3` large · `1.5` long-form |
| Tracking | `-0.02em` tight, `0em` normal. **No positive tracking anywhere** |
| Radius | pill `100vw` (49 elements), `1rem` cards |
| Section rhythm | `tiny 1.75→4.25rem` · `main 4→10rem` · `huge 9→27rem` |
| Text | `text-wrap: pretty`, plus cap-height trim tokens for optical alignment |

Note the **absence** of `text-transform: uppercase` as a default — their token is
`--_typography---text-transform--none`. Uppercase letterspaced eyebrow labels above every
heading is a tell we were guilty of on every single section.

---

## 2. Our system

### Typography

Two faces, neither of them a Google-default:

- **Switzer** — Indian Type Foundry, free for commercial use via Fontshare. A grotesque
  with a tall x-height and slight warmth. Carries *everything*: headings, body, UI.
  (An Indian foundry's typeface for a Lucknow studio is a better story than Jost.)
- **Instrument Serif Italic** — used for **one or two phrases per page** and nothing else.
  High contrast, condensed, distinctly not Cormorant.

**The scale has a cliff, on purpose.** Fluid between `20rem` and `120rem` viewport:

| Token | min → max | Line height | Tracking |
|---|---|---|---|
| `--fs-display` | 3.5 → 9rem | 0.94 | -0.035em |
| `--fs-h1` | 2.75 → 6rem | 0.98 | -0.03em |
| `--fs-h2` | 2 → 4.25rem | 1.02 | -0.025em |
| — cliff — | | | |
| `--fs-h3` | 1.25 → 1.6rem | 1.2 | -0.01em |
| `--fs-h4` | 1.0625 → 1.25rem | 1.25 | 0 |
| `--fs-body` | 1 → 1.125rem | 1.5 | 0 |
| `--fs-small` | 0.8125 → 0.875rem | 1.4 | 0 |

Weights: **400 / 500 / 600 only.** No 300 (it goes fragile at display sizes), no 700.

**Banned outright**, because each is a generated-design tell:
- `text-transform: uppercase` with positive `letter-spacing` on section labels
- Serif on every heading
- More than two typefaces

### Colour

Dark-dominant. Interior photography — warm woods, brass, plaster — separates far better
from a near-black ground than from cream, and cream + serif + brass is precisely the
palette the client recognised as generated.

| Token | Value | Role |
|---|---|---|
| `--ink` | `#121212` | Dominant ground. Neutral, not brown |
| `--ink-2` | `#1a1a1a` | Raised surface, hairline separations |
| `--paper` | `#EDEBE5` | Text on dark; ground for light sections |
| `--paper-2` | `#E3E0D8` | Light section variant |
| `--accent` | `#C9A227` | Gold, drawn from the logo |
| `--accent-ink` | `#8A6D14` | Deeper gold, for accents on paper grounds |
| `--line` | `color-mix(in srgb, currentColor 12%, transparent)` | All borders |

**The accent is used at roughly 1% coverage** — focus rings, one hover state, the active
filter, a single rule. It never fills a button at rest and never tints a background.

> The accent is a single token (`--accent`), set to the logo's gold at the client's
> request. Gold was part of what read as generated on the old site — but only because it
> was *everywhere*: brass headings, brass rules, brass icons, on cream, under a serif.
> Held to ~1% coverage on a near-black ground, under a grotesque, it reads as a brand
> mark rather than a template. **The discipline is the restraint, not the hue.**
> Changing that one line to `#2F49FF` (cobalt) or `#C2410C` (rust) restyles everything.

Shadows: **none.** Hairline borders and space only.

### Space and layout

- 12-column grid, `.5rem` gutter, page margin fluid `1.25 → 3rem`
- `--max-w` `88rem` · `--max-w-narrow` `62rem` (we're not a 2560px site; going as wide as
  Studio X would leave our photography stranded)
- Section rhythm, fluid: `tiny 3→5rem` · `main 5→10rem` · `large 7→14rem`
- Radius: **pill (`100vw`) for interactive things only — buttons, chips, filters.
  Everything else is square.** Images are never rounded; sharp edges read editorial.

### Motion

One signature move, executed well, beats eight scattered effects. Generated designs
animate everything.

- **Keep**: image mask-reveal (a wipe on scroll-in), a small text rise, hero parallax,
  the photo ribbon.
- **Cut**: floating collage columns, the pulsing WhatsApp ring, hover-scale on every
  thumbnail, count-up on stats, the marquee of service names.

Everything stays behind `prefers-reduced-motion`.

### Copy

Tells to avoid, all of which were in the old site:
- "X, not Y" headline construction
- Em-dash asides in every paragraph
- Rhetorical section headers ("since you will ask")
- An eyebrow label above every single heading

---

## 3. What stays

Per the brief: **all photography and the logo are unchanged.** Only their arrangement,
framing and captioning changes.

---

## 4. Changing it later

Every value above lives as a CSS custom property at the top of
[src/styles.css](src/styles.css). Palette and type scale are ~40 lines. Content stays in
[src/data.js](src/data.js). Neither requires touching a component.
