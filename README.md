# Crimson Painting — Store (React + Tailwind)

A fictional D&D-themed miniatures e-commerce prototype, built as a portfolio
project. React recreation of a design prototype, following its design tokens,
copy, and the "Style C" hero layout.

**Live demo:** deployed via GitHub Pages on every push to `main` (see badge/URL
in the repo description once the first deploy completes).

## Running locally

```bash
npm install
cp .env.example .env   # fill in your Supabase project URL/anon key
npm run dev       # development server
npm run build     # production build in dist/
npm run preview   # preview the production build locally
```

## Stack

- React 18 + Vite
- React Router v6 (routes: `/`, `/catalog`, `/product/:slug`, `/cart`, `/checkout`,
  `/checkout/success`, `/checkout/cancel`, `/admin/*`)
- Tailwind CSS 3 (color tokens in `oklch`, Cinzel/EB Garamond fonts via Google Fonts)
- Cart in Context API, persisted to `localStorage` (cart holds `{ productId, qty }`
  only — prices always come from the live product catalog, never from
  `localStorage`)
- **Backend: Supabase** (Postgres + Auth + Edge Functions) + **Stripe Checkout**

## Backend architecture

```
React (static, this repo)
  │
  ├─ reads catalog ──────────► Supabase Postgres (RLS: public read on active
  │                             products/categories, admin-only writes)
  │
  ├─ admin login ────────────► Supabase Auth (role stored in `profiles`)
  │
  └─ checkout ───────────────► Edge Function `create-checkout-session`
                                 (re-prices cart from DB, opens a `pending`
                                 order, creates a Stripe Checkout Session)
                                      │
                                      ▼
                                 Stripe-hosted payment page
                                      │
                                      ▼
                                 Edge Function `stripe-webhook`
                                 (verifies signature, marks order `paid`,
                                 decrements stock)
```

Key design decisions:

- **Prices are never trusted from the client.** `create-checkout-session` looks
  up each product's price and stock in Postgres before building the Stripe
  session — the browser only ever sends product ids and quantities.
- **Stock is only decremented on confirmed payment** (inside the webhook), so
  an abandoned or cancelled checkout never touches inventory.
- **Orders are not readable by anonymous clients at all** — RLS only grants
  `orders`/`order_items` access to admins. The success page shows the order
  number from the value returned when the session was created, not by
  querying the database.
- **Admin access** is a `role` column on `profiles` (auto-created for every
  new Supabase Auth user, defaulting to `customer`). Promote a user to admin
  manually after they sign up once (see setup below).

### One-time setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run `supabase/migrations/0001_init.sql`, then
   `supabase/seed.sql` (migrates the old hardcoded catalog into real rows).
3. Copy the project URL and `anon` public key into `.env` (see
   `.env.example`).
4. Install the [Supabase CLI](https://supabase.com/docs/guides/cli) (or use
   `npx supabase`) and deploy the two Edge Functions:
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase functions deploy create-checkout-session
   npx supabase functions deploy stripe-webhook
   ```
5. Set the Edge Function secrets (Project Settings → Edge Functions, or via
   CLI):
   ```bash
   npx supabase secrets set \
     SUPABASE_URL=https://<your-project-ref>.supabase.co \
     SUPABASE_SERVICE_ROLE_KEY=<service role key, NOT the anon key> \
     STRIPE_SECRET_KEY=sk_test_... \
     STRIPE_WEBHOOK_SECRET=whsec_...
   ```
6. In the [Stripe Dashboard](https://dashboard.stripe.com), add a webhook
   endpoint pointing at
   `https://<your-project-ref>.supabase.co/functions/v1/stripe-webhook`,
   listening for `checkout.session.completed`. Copy its signing secret into
   `STRIPE_WEBHOOK_SECRET` above.
7. Create your admin account: sign up once through Supabase Auth (e.g. via
   the Supabase dashboard's Authentication → Users → "Add user"), then in the
   SQL Editor run:
   ```sql
   update profiles set role = 'admin' where id = '<user-uuid-from-auth-users>';
   ```
   You can then sign in at `/admin/login` to manage products and orders.

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

The build also needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Add
them as **repository variables** (Settings → Secrets and variables → Actions
→ Variables tab) — the anon key is safe to expose publicly, it's what RLS is
for, so it doesn't need to be a masked secret.

## Known limitations (prototype, not production-ready)

- No real product photography yet — `PlaceholderImage` fills in until
  `product_images` has real rows/uploaded assets (Supabase Storage is the
  natural place for those once available).
- No customer-facing order lookup/account area — orders are admin-only by
  design (see Backend architecture above); a customer only ever sees their
  own order once, right after paying.
- No transactional email yet (order confirmation, shipping updates) — the
  `stripe-webhook` function is the natural place to add one (e.g. via
  Resend) once needed.
- No legal/compliance pages (privacy policy, terms, cookie consent) required
  to actually sell in the EU.
