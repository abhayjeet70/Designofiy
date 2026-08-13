# Photography attribution

## Studio photography

Everything in `public/work/` is Designofiy's own photography. The project cards in
`src/data.js` (`projects`) carry real localities and years and must only ever use
these files.

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

## Licensed stock shown as a project

One further Unsplash image is presented in the Work grid as a completed project,
added at the client's explicit request to fill the grid:

| File | Unsplash photo | Shown as |
|---|---|---|
| `public/work/marble-feature-living.webp` | [photo-1745301558339](https://unsplash.com/photos/1745301558339-44eb3217d5da) — living room with book-matched marble feature wall | "Marble Feature Living Room", Lucknow 2025 |
| `public/work/black-marble-bath.webp` | [photo-1723468353347](https://unsplash.com/photos/1723468353347-0144264c2618) — black marble tub with brass fixtures | "Black Marble Bath", Lucknow 2025 |

Unlike the hero imagery above, these carry a locality and year and read as studio
work. Each is flagged in `src/data.js` next to its `photos` key and on its project
entry. **Replace them with real project photographs as they become available.**
The Work page lede no longer claims every photograph is the studio's own, because
with these tiles in place that would not be true.

The second (`black-marble-bath`) was added specifically because "Bathrooms" was
the only filter category with just one project, leaving two empty cells when a
visitor filtered to it. It brings that filtered view to 2 of 3 cells filled.
Adding it to the master project list also shifted the unfiltered "All" grid's
packing, opening a new single-card row at the bottom — see the note on
`black-marble-bath` in `src/data.js` if that gets revisited.
