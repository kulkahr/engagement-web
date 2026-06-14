# साखरपुडा — Engagement Invitation

A bilingual (Marathi/English) static engagement invitation website built with SvelteKit. Features botanical Maharashtrian minimal design, RSVP management with CSV storage, Google Drive photo gallery, offline PWA support, and India-only geo-restriction.

**Live site**: [https://hrishi.org.in](https://hrishi.org.in)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | SvelteKit 2.x + TypeScript (runes mode) |
| **Styling** | Vanilla CSS with CSS Custom Properties (design tokens) |
| **Adapter** | `@sveltejs/adapter-static` (fully static export) |
| **Hosting** | Vercel (Edge Middleware, Vercel Blob) |
| **Storage** | Vercel Blob (RSVP CSV), Google Drive (gallery photos) |
| **Fonts** | Noto Serif Devanagari (self-hosted, 4 weights) |
| **Service Worker** | SvelteKit-integrated (`$service-worker` module) |

## Features

- 🌐 **Bilingual** — Full Marathi (मराठी) and English support with `localStorage` persistence + `Ctrl+L` keyboard shortcut
- 📱 **PWA-ready** — Service Worker with full offline support (stale-while-revalidate for navigation, cache-first for assets), installable manifest
- 📸 **Google Drive gallery** — Build-time script fetches photos from shared Drive folder, generates static metadata
- 📋 **RSVP with CSV storage** — Guest submissions saved to Vercel Blob as CSV + password-protected admin download page
- 🛡️ **India-only geo-restriction** — Vercel Edge Middleware blocks non-India traffic
- 🔒 **CSRF-protected API** — Origin header validation + honeypot anti-spam on RSVP endpoint
- 🎉 **Confetti success animation** — CSS confetti + animated SVG checkmark on RSVP submit
- 🔗 **WhatsApp share** — Web Share API with WhatsApp URL fallback (bilingual message)
- 🗺️ **Multi-map navigation** — Google Maps, Apple Maps (Universal Links), MapMyIndia
- 🖼️ **WebP optimizations** — LCP image converted to WebP (85.8% smaller), preloaded with `fetchpriority="high"`
- 🔄 **Auto-update** — Service Worker automatically refreshes page on new deploy
- 📞 **Click-to-call** — Phone numbers for event coordinators

## Visual Design

- **Palette**: Forest green `#2F5A3D`, muted gold `#B08D57`, burgundy `#8A2E42`, ivory `#FBF9F3`
- **Fonts**: Noto Serif Devanagari (self-hosted), Georgia (English headings), system-ui (body)
- **Full design spec**: `docs/design-system.json`

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables (copy template and fill in)
cp .env.example .env
# Then edit .env with your values

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values. See below for where to get each one.

### Gallery Photos

To fetch photos from the Google Drive shared folder:

```bash
GOOGLE_DRIVE_API_KEY=your_api_key npm run build:photos
npm run build   # Rebuild to include photos
```

## Project Structure

```
src/
├── service-worker.js       # SvelteKit-integrated SW (pre-caches all build + static assets)
├── app.html                # HTML shell: OG tags, preloads, SW registration with auto-update
├── app.css                 # Design system + @font-face declarations
├── lib/
│   ├── data/
│   │   ├── config.ts       # SITE_CONFIG (siteUrl, allowedOrigins)
│   │   ├── content.ts      # Bilingual text (mr/en) with typed content
│   │   ├── event.ts        # Event details, venue, timings, contacts
│   │   └── gallery.ts      # Gallery helpers + auto-generated photo data
│   ├── utils/
│   │   ├── api.ts          # RSVP validation (India phone), submission, anti-spam
│   │   ├── maps.ts         # Map deep links (Google, Apple via https://, Mappls)
│   │   ├── i18n.ts         # Language store + localStorage persistence
│   │   └── date.ts         # Countdown calculator, date/time formatting
│   └── components/
│       ├── Header.svelte   # Responsive nav with mobile menu + language toggle + Ctrl+L
│       ├── Footer.svelte
│       ├── CountdownTimer.svelte  # Live countdown + "Event Started!" celebration
│       ├── AddToCalendar.svelte   # Google Calendar, Apple Calendar, Outlook
│       ├── Lightbox.svelte        # Full-screen gallery viewer
│       └── Monogram.svelte        # WebP picture element with PNG fallback
├── routes/
│   ├── +layout.ts          # trailingSlash: 'always' (directory-based routes)
│   ├── +layout.svelte      # Hreflang + canonical links
│   ├── +page.svelte        # Home page: hero, invitation, countdown, contacts
│   ├── +error.svelte       # Custom 404 page
│   ├── rsvp/+page.svelte   # RSVP form with success animation
│   ├── venue/+page.svelte  # Venue details + map buttons + event schedule
│   ├── gallery/+page.svelte  # Photo grid + lightbox + Drive upload section
│   ├── blessings/+page.svelte # Messages with localStorage persistence
│   ├── admin/+page.svelte  # Password-protected RSVP CSV download
│   └── api/rsvp/           # POST endpoint + CSV download endpoint
├── scripts/
│   └── fetch-gallery.ts    # Build-time Google Drive API fetcher
└── static/
    ├── fonts/              # Self-hosted Noto Serif Devanagari (400/500/600/700)
    ├── images/
    │   ├── monogram.webp   # LCP image — WebP (7.7KB)
    │   ├── monogram.png    # PNG fallback for older browsers
    │   ├── og-image.svg    # Open Graph share image (1200×630)
    │   ├── icon-192.png
    │   └── icon-512.png
    ├── favicon.svg
    ├── manifest.json
    ├── robots.txt
    └── sitemap.xml
```

## Deployment

### Vercel

1. Push to GitHub and import in [Vercel dashboard](https://vercel.com)
2. Set the following **environment variables**:

| Variable | Description |
|----------|-------------|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token (enable Blob in dashboard) |
| `RSVP_ADMIN_SECRET` | Password for the admin CSV download page |
| `GOOGLE_DRIVE_API_KEY` | API key for build-time gallery photo fetch |
| `PUBLIC_PHONE_GROOM_FATHER` | Groom's father's phone (public on website) |
| `PUBLIC_PHONE_BRIDE_FATHER` | Bride's father's phone (public on website) |

3. **`vercel.json`** is pre-configured with:
   - Build output directory: `build`
   - Security headers (CSP, X-Frame-Options, X-Content-Type-Options, etc.)
   - India-only geo-restriction via Edge Middleware (`middleware.ts`)

4. Before deploying, update `SITE_CONFIG.siteUrl` in `src/lib/data/config.ts` with your production domain.

### Post-Deploy Checklist

- [ ] Verify custom domain works with SSL
- [ ] Test all pages on mobile devices
- [ ] Test RSVP form submission
- [ ] Test map links (Google Maps, Apple Maps, MapMyIndia)
- [ ] Test language toggle
- [ ] Run Lighthouse audit

## Event Details

All event details are configured via environment variables — see `.env.example` for the full schema. Key env vars:

| Variable | Description |
|----------|-------------|
| `PUBLIC_COUPLE` | Couple names (Marathi + English) |
| `PUBLIC_EVENT` | Event type, date, time, panchang |
| `PUBLIC_VENUE` | Venue name, address, coordinates, maps |
| `PUBLIC_CONTACTS` | Contact persons with relationships |
| `PUBLIC_RSVP_DEADLINE_*` | RSVP deadline dates |

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on `localhost:5173` |
| `npm run build` | Production build → `build/` directory |
| `npm run build:photos` | Refresh gallery metadata from Google Drive |
| `npm run preview` | Preview production build locally |
| `npm run check` | Type-check with `svelte-check` |

## Documentation

- `docs/SRS.md` — Software requirements specification
- `docs/ARCHITECTURE.md` — Architecture overview
- `docs/ROADMAP.md` — Implementation roadmap & task tracking
- `docs/SESSION_CONTEXT.md` — Development session context & remaining tasks
- `docs/COST.md` — Cost estimation
- `docs/TECH_STACK.md` — Technology choices & rationale
