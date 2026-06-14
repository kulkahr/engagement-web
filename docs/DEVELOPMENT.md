# Development Guide — Getting Started

> **Domain:** `hrishi.org.in`
> **Stack:** SvelteKit + TypeScript + Vanilla CSS + Vercel Blob (private for data, public for images)
> **Last updated:** 14 June 2026

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18+ (`lts/iron`) | `node --version` |
| npm | 10+ | `npm --version` |
| Git | Any modern version | `git --version` |

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd engagement-web

# 2. Install dependencies
npm install

# 3. Set up environment variables (optional — for API features)
cp .env.example .env   # Create if .env.example exists
# Or create .env manually with:
# BLOB_READ_WRITE_TOKEN=your_token_here
# RSVP_ADMIN_SECRET=your_secret_here

# 4. Start dev server
npm run dev

# 5. Open in browser
open http://localhost:5173
```

---

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server (port 5173) with HMR |
| `npm run build` | Production build (runs sitemap generation via `prebuild`) |
| `npm run preview` | Preview production build locally (port 4173) |
| `npm run check` | Typecheck with `svelte-check` (run before committing) |
| `npm run build:photos` | Fetch gallery photos from Google Drive (requires `GOOGLE_DRIVE_API_KEY`) |
| `npm run generate:sitemap` | Manually regenerate `static/sitemap.xml` |
| `npm run lint` | Check code style |
| `npm audit` | Check for dependency vulnerabilities |

---

## Environment Variables

| Variable | Required For | Where to Get |
|----------|-------------|-------------|
| `BLOB_READ_WRITE_TOKEN` | RSVP + Blessings API in dev mode (private blob store) | Vercel Dashboard → Storage → Blob |
| `PUBLIC_IMAGE_MONOGRAM` | Full public blob URL for monogram.webp | From re-upload script or Vercel Dashboard |
| `PUBLIC_IMAGE_MONOGRAM_FALLBACK` | Full public blob URL for monogram.png | From re-upload script or Vercel Dashboard |
| `PUBLIC_IMAGE_OG` | Full public blob URL for og-image.svg | From re-upload script or Vercel Dashboard |
| `RSVP_ADMIN_SECRET` | Admin page CSV download in dev mode | Choose a password yourself |
| `GOOGLE_DRIVE_API_KEY` | Gallery photo rebuild (`build:photos`) | Google Cloud Console |
| `PUBLIC_PHONE_GROOM_FATHER` | Contact phone (public on website) | Your personal number |
| `PUBLIC_PHONE_BRIDE_FATHER` | Contact phone (public on website) | Your personal number |

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` with your values:

```
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here
RSVP_ADMIN_SECRET=your_admin_password
PUBLIC_PHONE_GROOM_FATHER=+91-XXXXXXXXXX
PUBLIC_PHONE_BRIDE_FATHER=+91-XXXXXXXXXX
```

**Note on PUBLIC_ env vars:** These are **required for the build** — the contact phone numbers are inlined at build time. Without them, the site will still build but display a warning. For local dev, set them in `.env`. For Vercel, set them in the dashboard.

Other env vars (`BLOB_READ_WRITE_TOKEN`, `RSVP_ADMIN_SECRET`) are optional for dev — without them, RSVP and Blessings will fall back gracefully (showing empty states or logging to console).

---

## Project Structure

```
src/
├── service-worker.js       # PWA service worker (SvelteKit-integrated)
├── app.html                # HTML shell: OG tags, preloads, SW registration
├── app.css                 # Design system: fonts, tokens, keyframes
├── lib/
│   ├── data/               # Static data (event details, bilingual content, gallery)
│   ├── utils/              # Utility functions (i18n, maps, date, API helpers)
│   └── components/         # Reusable Svelte components
├── routes/                 # SvelteKit file-based routing
│   ├── +page.svelte        # Home / Landing page
│   ├── rsvp/               # RSVP form page
│   ├── venue/              # Venue details + map links
│   ├── gallery/            # Photo gallery with lightbox
│   ├── blessings/          # Well-wishes messages
│   ├── admin/              # Password-protected CSV download
│   └── api/                # Serverless API endpoints
├── scripts/
│   ├── fetch-gallery.ts    # Build-time Google Drive photo fetcher
│   └── generate-sitemap.ts # Auto-generates sitemap.xml
└── static/
    ├── fonts/              # Self-hosted Noto Serif Devanagari
    ├── images/             # Icons, placeholder (PII images served via blob proxy)
    ├── favicon.svg
    ├── manifest.json       # PWA manifest
    ├── robots.txt
    └── sitemap.xml         # Auto-generated
```

---

## Dev Server Details

| Aspect | Detail |
|--------|--------|
| **Port** | 5173 |
| **Hot Module Replacement** | ✅ Full HMR — changes reflect instantly |
| **Service Worker** | ❌ Not registered in dev mode (guarded by `location.port !== '5173'`) |
| **Preview build** | `npm run build && npm run preview` (port 4173) — SW works here |
| **TypeScript** | Strict mode — type errors fail the build |

### Known Dev Quirk: Service Worker

The service worker is **not registered** in dev mode (`npm run dev` on port 5173). This is intentional — Vite serves the SW as an ES module proxy, which service workers can't execute. To test SW functionality:

```bash
npm run build && npm run preview
# Open http://localhost:4173 — SW registers normally
```

---

## Making Changes — Workflow

### For Content Changes (text, dates, event info)

Files to edit:
- `src/lib/data/content.ts` — All bilingual text (Marathi/English)
- `src/lib/data/event.ts` — Event dates, venue, timings, names

### For Styling Changes

- `src/app.css` — Design tokens (`--color-*`, `--text-*`, `--spacing-*`)
- Component `<style>` blocks — Component-specific styles
- See `docs/CSS_CONVENTIONS.md` for animation and token conventions

### For Gallery Photos

Full workflow is documented in the Gallery section below.

### For Adding a New Page

1. Create a new folder in `src/routes/` with a `+page.svelte` file
2. Add the route to `src/lib/data/content.ts` for page metadata
3. Add navigation link in `Header.svelte`
4. Run `npm run build` — sitemap auto-generates with the new route

---

## Gallery Photo Workflow

```bash
# 1. Upload photos to the shared Google Drive folder:
#    https://drive.google.com/drive/folders/1lYNRwhI8HTnjMQr3hvNgF2JEZn806FFt

# 2. Fetch photos and regenerate gallery-photos.ts:
GOOGLE_DRIVE_API_KEY=your_api_key npm run build:photos

# 3. Rebuild the site to include new photos:
npm run build
```

> **Note:** Step 2 requires `GOOGLE_DRIVE_API_KEY`. If you don't have one, the gallery will show photos from the last successful fetch.

---

## Type Checking

Always run type checking before committing:

```bash
npm run check
```

This runs `svelte-check` which catches:
- TypeScript type errors
- Svelte template errors (missing imports, wrong props)
- Accessibility warnings in templates

---

## Building for Production

```bash
npm run build
```

The build pipeline:
1. **Prebuild:** `scripts/generate-sitemap.ts` generates `static/sitemap.xml` with hreflang tags
2. **SvelteKit build:** Compiles all pages, components, and scripts
3. **Adapter:** `@sveltejs/adapter-auto` detects Vercel environment → uses `adapter-vercel` → produces serverless functions for API routes + static files for pages
4. **Service worker:** Vite processes `src/service-worker.js` through `$service-worker` module

Output: `build/` directory — ready to deploy to any static host.

---

## Preview Production Build

```bash
npm run build && npm run preview
```

Opens on `http://localhost:4173`. The production build includes:
- ✅ Service worker registration (not blocked by port guard)
- ✅ All preloaded fonts and images
- ✅ Sitemap with current routes
- ⚠️ No CDN caching or Brotli compression (localhost only)

---

## Security Tips

- **Never commit** `.env` files or API keys
- **Run `npm audit`** periodically for dependency vulnerabilities
- **Test admin page** access control (should require password)
- **Verify CSP** in production (Vercel applies `vercel.json` headers)
- See `docs/SECURITY_REVIEW.md` for full audit

---

## Related Documents

| Document | Description |
|----------|-------------|
| `docs/DEPLOYMENT.md` | Production deployment guide |
| `docs/MAINTENANCE.md` | Ongoing maintenance procedures |
| `docs/CSS_CONVENTIONS.md` | Design tokens, keyframes, styling patterns |
| `docs/TECH_STACK.md` | Technology choices and rationale |
| `docs/ARCHITECTURE.md` | System architecture and data flow |

---

*End of Development Guide — 16 June 2026*
