# Designofiy — static React site

No backend. Vite + React, plain CSS.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/  (deploy anywhere static: Netlify, Vercel, GitHub Pages)
```

## Editing content

All copy, contact details, services, projects, testimonials and FAQs live in
[src/data.js](src/data.js). Components in [src/App.jsx](src/App.jsx) just render it.

## Photos

All photography is the studio's own, in `public/work/`, plus `public/logo.png`.
Every path is declared once in the `photos` object at the top of
[src/data.js](src/data.js) — add a file there and reference it to add more.

## Verify before launch

Business details pulled from public listings (homify, MCA/GST records). Confirm:

- Phone `+91 73497 52323` and address `L2/583, Vineet Khand, Gomti Nagar, Lucknow 226010`
- Email `hello@designofiy.com` — **placeholder, needs the real address**
- Facebook URL — **guessed, needs the real one**
- Project titles, localities and years in the gallery are **placeholder labels** written
  from what the photos show — replace with the actual project names
- Testimonials are placeholder copy — swap in real client quotes
