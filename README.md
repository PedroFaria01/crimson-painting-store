# Crimson Painting — Store (React + Tailwind)

https://pedrofaria01.github.io/crimson-painting-store/

A fictional D&D-themed miniatures e-commerce prototype, built as a portfolio
project. React recreation of a design prototype, following its design tokens,
copy, and the "Style C" hero layout.

**Live demo:** deployed via GitHub Pages on every push to `main` (see badge/URL
in the repo description once the first deploy completes).

## Running locally

```bash
npm install
npm run dev       # development server
npm run build     # production build in dist/
npm run preview   # preview the production build locally
```

## Stack

- React 18 + Vite
- React Router v6 (routes: `/`, `/catalog`, `/product/:id`, `/cart`, `/checkout`)
- Tailwind CSS 3 (color tokens in `oklch`, Cinzel/EB Garamond fonts via Google Fonts)
- Cart in Context API, persisted to `localStorage`

## Assets

Logo and background image live in `public/` and are served as-is
(`/crimson-logo.png`, `/bg-stone.jpg`).

Product, testimonial, and "about" photos are placeholders (`PlaceholderImage`
component) — no real photography exists yet for this prototype.

## Deployment

`.github/workflows/deploy.yml` builds the app and publishes `dist/` to GitHub
Pages on every push to `main`. `vite.config.js` reads `VITE_BASE_PATH` (set by
the workflow to `/<repo-name>/`) so asset URLs resolve correctly under the
project-pages subpath, and the build step copies `index.html` to `404.html` so
client-side routes survive a hard refresh on GitHub Pages' static hosting.

## Known limitations (prototype, not production-ready)

- Checkout is not connected to any real payment provider — it's a client-side
  simulation (order number generated in the browser, no persistence).
- No backend/database — products are hardcoded in `src/data/products.js` and
  there is no order history, stock tracking, or email confirmation.
- No legal/compliance pages (privacy policy, terms, cookie consent) required
  to actually sell in the EU.
- Product, testimonial, and studio photos are placeholders.
