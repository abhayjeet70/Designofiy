# Photography attribution

## Studio photography

Everything in `public/work/` is Designofiy's own photography — real project photos
supplied by the client via Google Drive on 2026-08-13 (113 source files, of which
the strongest ~15 were selected, auto-rotated per their EXIF orientation, and
converted to WebP by `tools/img-to-webp.py`). The project cards in `src/data.js`
(`projects`) carry real localities and years; titles below are inferred from the
photos and should be confirmed with the studio.

As of this Drive delivery, the two placeholder stock photos previously standing in
for "Black Marble Bath" and "Marble Feature Living Room" have been replaced with
real photographs — `slate-stone-bath.webp` / `backlit-vanity-bath.webp` and
`gallery-living-room.webp` respectively — and their old files removed. Every
project card in the Work grid is now the studio's own photography.

## Licensed stock — home hero and ASCII backdrops only

The files below are from [Unsplash](https://unsplash.com), used under the
[Unsplash License](https://unsplash.com/license): free for commercial use, no
permission or attribution required. Credit is recorded here as good practice.

These are kept on a separate `heroStock` key in `src/data.js` precisely so they
cannot be mistaken for, or accidentally reused as, completed client projects.

| File | Unsplash photo | Used for |
|---|---|---|
| `public/hero/hero_bg.webp` | [photo-1758448755778](https://unsplash.com/photos/1758448755778-90ebf4d0f1e7) — dark marble feature wall with crystal chandelier | Home hero ASCII backdrop |
| `public/hero/stock-living.webp` | [photo-1648881806148](https://unsplash.com/photos/1648881806148-e5c51179c826) — panelled taupe living room with gold ring pendants | Hero slide 1, "Living" |
| `public/hero/stock-kitchen.webp` | [photo-1742280879518](https://unsplash.com/photos/1742280879518-ada47b660ccd) — walnut and sand handleless modular kitchen | Hero slide 2, "Kitchens" |
| `public/hero/stock-wardrobe.webp` | [photo-1774301211236](https://unsplash.com/photos/1774301211236-dab64d553241) — dressing room with backlit mirror and fluted glass | Hero slide 3, "Wardrobes" |
| `public/hero/stock-dining.webp` | [photo-1688647063090](https://unsplash.com/photos/1688647063090-36f36f692d95) — backlit glass crockery units in dark oak | Hero slide 4, "Dining" |
| `public/hero/stock-bathroom.webp` | [photo-1642755622569](https://unsplash.com/photos/1642755622569-69a0a6f180a6) — freestanding black bath against warm timber | Hero slide 5, "Bathrooms" |
| `public/hero/stock-invite.webp` | [photo-1704040686370](https://unsplash.com/photos/1704040686370-52238a5dab05) — black leather seating with brass lamps | Home "Invite" band ASCII backdrop |

All seven were resized to 1600 px wide and encoded as WebP at quality 82.
`stock-dining` and `stock-bathroom` were additionally cropped to 3:2 from tall
originals so they sit correctly in the landscape hero frame.

No `premium_photo-` (Unsplash+) assets were used — those are paid and were
deliberately excluded.

## Real photography added 2026-08-13

Nine project photos were selected from the client's Drive folder and added or
substituted in this pass. Three replace what was previously licensed stock;
six are new project entries filling out categories that were thin (Modular
Kitchens, Decor & Styling, Commercial had one project each before this).

| File | Shown as | Category |
|---|---|---|
| `gallery-living-room.webp` | Taupe Gallery Living Room | Residential |
| `slate-stone-bath.webp` | Slate Stone Bathroom | Bathrooms |
| `backlit-vanity-bath.webp` | Backlit Stone Vanity | Bathrooms |
| `jungle-mural-bedroom.webp` | Jungle Mural Bedroom | Residential |
| `round-table-dining.webp` | Round Table Dining Room | Residential |
| `duplex-staircase.webp` | Duplex Staircase & Fireplace | Residential |
| `backlit-pooja-mandir.webp` | Backlit Pooja Mandir | Decor & Styling |
| `grey-modular-kitchen.webp` | Grey & Wood Modular Kitchen | Modular Kitchens |
| `travel-office-lounge.webp` | Travel Studio Office Fit-out | Commercial |

The Drive folder contained ~113 photos spanning what reads as at least four
distinct projects (by decor language and file grouping): a jungle-mural-themed
apartment, a large multi-bedroom duplex with a double-height stairwell, a
walnut-and-marble home with a mandir room, and a travel-consultancy office fit
out. Only the strongest single shot per space was used here — the remaining
~100 photos are still in the Drive folder and can be worked through for
per-project galleries (multiple photos per `images: []` array) in a follow-up
pass, rather than every photo being placed sight-unseen in this one.
