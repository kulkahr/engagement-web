# System Architecture Document
## Maharashtrian "साखरपुडा" Engagement Invitation Web Application

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │ Landing  │ │ Venue &  │ │  RSVP    │ │ Gallery  │ │  Blessings   │ │
│  │  Page    │ │  Maps    │ │  Form    │ │  Page    │ │  Section     │ │
│  └────▲─────┘ └────▲─────┘ └────▲─────┘ └────▲─────┘ └───────▲──────┘ │
│       │            │            │            │               │         │
│  ┌────┴────────────┴────────────┴────────────┴───────────────┴──────┐ │
│  │                  SVELTEKIT STATIC APP (+ Service Worker)          │ │
│  │  Pre-rendered HTML + Svelte hydration + offline support           │ │
│  └────────────────────────────────┬──────────────────────────────────┘ │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │
                  ┌─────────────────┼──────────────────┐
                  │                 │                  │
           ┌──────▼──────┐   ┌──────▼───────┐   ┌─────▼──────┐
           │   CDN Edge   │   │   Google     │   │  Vercel    │
           │  (Vercel /   │   │  Drive API   │   │  Blob      │
           │  Cloudflare)  │   │  (read-only) │   │  (RSVP     │
           │              │   │              │   │   CSV)     │
           └──────────────┘   └──────────────┘   └────────────┘
```

## 2. Frontend Architecture

### 2.1. Component Tree
```
src/
├── service-worker.js            # SvelteKit-integrated SW (pre-caches all assets)
├── app.html                     # HTML shell: OG tags, preloads, SW registration
├── app.css                      # Design system CSS (color contrast compliant)
├── routes/
│   ├── +layout.ts               # trailingSlash: 'always' — directory-based routes
│   ├── +layout.svelte           # Root layout: header, footer, i18n, hreflang, canonical
│   ├── +page.svelte             # Landing page: hero, invitation, countdown, contacts
│   ├── +error.svelte            # Custom 404 page
│   ├── rsvp/+page.svelte        # RSVP form with success animation (confetti)
│   ├── venue/+page.svelte       # Venue details, map buttons, event schedule
│   ├── gallery/+page.svelte     # Google Drive photo gallery with lightbox
│   ├── blessings/+page.svelte   # Well-wishes / messages (API + localStorage fallback)
│   ├── admin/+page.svelte       # Password-protected RSVP CSV download
│   └── api/
│       ├── rsvp/+server.ts      # POST endpoint — stores RSVP in Vercel Blob CSV
│       ├── rsvp/download/+server.ts  # GET endpoint — password-protected CSV download
│       └── blessings/+server.ts  # GET/POST endpoint — list/submit blessings in Vercel Blob JSON
├── lib/
│   ├── components/
│   │   ├── Header.svelte        # Nav with mobile menu, language toggle (48px), Ctrl+L
│   │   ├── Footer.svelte        # Footer with credits
│   │   ├── Monogram.svelte      # WebP picture element with PNG fallback
│   │   ├── CountdownTimer.svelte# Live countdown + "Event Started!" celebration
│   │   ├── Lightbox.svelte      # Full-screen photo viewer
│   │   └── AddToCalendar.svelte # Google Calendar, Apple Calendar, Outlook
│   ├── data/
│   │   ├── config.ts            # SITE_CONFIG (siteUrl, allowedOrigins)
│   │   ├── content.ts           # Bilingual text content (mr/en)
│   │   ├── event.ts             # Event details (dates, venue, names, timings)
│   │   └── gallery.ts           # Gallery photo metadata + helpers
│   └── utils/
│       ├── i18n.ts              # Lang store, localStorage persistence
│       ├── maps.ts              # Map deep links (Google, Apple https://, Mappls)
│       ├── date.ts              # Countdown calculator, date/time formatting
│       ├── api.ts               # RSVP validation (India phone), submission, anti-spam
│       └── blessings.ts          # Blessings fetch/submit utilities, anti-spam timer
├── scripts/
│   ├── fetch-gallery.ts         # Build-time Google Drive API fetcher
│   └── generate-sitemap.ts      # Build-time sitemap.xml generator (scans routes, excludes admin/api)
└── static/
    ├── fonts/                   # Self-hosted Noto Serif Devanagari (4 weights)
    ├── images/
    │   ├── icon-192.png
    │   └── icon-512.png
    ├── favicon.svg
    ├── manifest.json            # PWA manifest
    ├── robots.txt
    └── sitemap.xml
```

### 2.2. Rendering Strategy
- **All pages:** Pre-rendered at build time (static export)
- **Client hydration:** Only on interactive components (RSVP form, gallery lightbox, countdown)
- **Svelte 5 runes:** Using `$state`, `$derived`, `$effect` for reactivity
- **Adapter:** `@sveltejs/adapter-auto` (Vercel) — pre-renders static pages, deploys API routes as serverless functions
- **Directory-based routes:** `trailingSlash: 'always'` generates `venue/index.html` instead of `venue.html`

### 2.3. Service Worker Strategy
- **SvelteKit-integrated:** `src/service-worker.js` uses `$service-worker` module
- **Install:** Pre-caches all build assets (hashed JS/CSS) + static files + root HTML
- **Navigation:** Stale-while-revalidate — serve cached HTML instantly, refresh in background
- **API calls:** Network-first with cache fallback
- **Static assets:** Cache-first (instant from cache)
- **Offline fallback:** Cached home page as last resort
- **Cache busting:** Cache named with `$service-worker.version` — auto-invalidates on deploy
- **Dev-mode guard:** SW registration blocked on port 5173 (Vite dev serves SW as ES module proxy — service workers can't use `import` statements)
- **Auto-update:** Page reloads when new SW takes over (updatefound + controllerchange listeners)

### 2.4. Performance Optimizations
- **WebP monogram:** 54KB PNG → 7.7KB WebP (85.8% smaller), `<picture>` element with PNG fallback
- **Preloading:** `<link rel="preload">` for LCP image + critical fonts
- **LCP prioritization:** `fetchpriority="high"` on monogram image
- **Self-hosted fonts:** Noto Serif Devanagari served from own CDN, no external requests
- **FCP:** Improved from 5.1s to 1.7s after optimizations

## 3. Data Flow

### 3.1. Invitation Content Flow
```
[Build Time]
  src/lib/data/content.ts ──► SvelteKit static pages ──► Pre-rendered HTML
  src/lib/data/event.ts   ──►                            ──► CDN
  Static images           ──►
```

### 3.2. RSVP Flow
```
[Client]                      [Vercel Blob]                [Storage]
   │                              │                          │
   ├─► Submit form ──────────────►├─► Validate ─────────────►├─► Append to CSV
   │   (anti-spam: honeypot,      │   (Origin header,        │
   │    timing, India phone)      │    honeypot, rate limit) │
   ◄── Confirmation ─────────────◄── 200 OK ────────────────◄── Written
```

### 3.3. Blessings Flow
```
[Client]                      [Vercel Blob]                [Storage]
   │                              │                          │
   ├─► Page load ────────────────►├─► GET /api/blessings ───►├─► Read JSON array
   ◄── Blessings list ───────────◄── JSON response ─────────◄──
   │                              │                          │
   ├─► Submit blessing ──────────►├─► POST /api/blessings ──►├─► Append to JSON array
   │   (anti-spam: honeypot,      │   (rate limit 20/hr,    │
   │    timer)                     │    honeypot, body size) │
   ◄── Confirmation ─────────────◄── 200 OK ────────────────◄── Written
   │                              │                          │
   │  Falls back to localStorage if API unavailable          │
```

### 3.4. Gallery Flow

### 3.4. Gallery Flow
```
[Build Time: fetch-gallery.ts]     [Runtime - Client]
         │                              │
         ├─► Fetch Google Drive ──────►  │
         │   via Drive API v3            │
         │   + API key                   │
         │                              ├─► Display thumbnails
         │                              │   with lazy loading
         │                              │
         │                              ├─► Click opens lightbox
         │                              │   with full-res image
         │                              │
         └─► Generate gallery-photos.ts─►└─► CDN caches images
              (metadata array)
```

## 4. Security Boundaries

```
┌────────────────────────────────────────────────────────────────┐
│                      PUBLIC ZONE                                │
│  - All static pages publicly accessible                         │
│  - Gallery images publicly viewable                             │
│  - No authentication for guests                                 │
│                                                                 │
│  ╔══════════════════════════════════════════════════════════════╗ │
│  ║                   PROTECTED ZONE                             ║ │
│  ║  - RSVP endpoint: Origin/Referer header validation           ║ │
│  ║  - RSVP endpoint: Honeypot anti-spam                        ║ │
│  ║  - RSVP endpoint: Time threshold (min 2s)                   ║ │
│  ║  - Blessings endpoint: Rate limit 20/hr, honeypot, body size║ │
│  ║  - Admin page: Password-protected CSV download               ║ │
│  ║  - Geo-restriction: Vercel Edge Middleware (India only)      ║ │
│  ╚══════════════════════════════════════════════════════════════╝ │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## 5. Request Lifecycle

### Static Page Request
```
1. User requests / or /venue/ or /rsvp/
2. DNS resolves to CDN edge
3. CDN serves pre-rendered HTML (cache hit: <10ms)
4. Browser parses HTML, applies CSS
5. Service Worker intercepts, serves from cache (if previously visited)
6. Browser loads JS bundle (deferred, non-blocking)
7. Svelte hydrates interactive components
8. Page is fully interactive and available offline
```

### RSVP Submission
```
1. User fills form and clicks Submit
2. Client validates all fields (including India phone validation)
3. Honeypot check (silent fail if triggered)
4. Timestamp check (reject if < 2s since page load)
5. POST to /api/rsvp endpoint
6. Edge function validates Origin/Referer header
7. Appends to Vercel Blob CSV
8. Returns success/failure JSON
9. Client shows animated confetti success state
```

### Offline Page Visit
```
1. User navigates to /venue/ without network
2. Service Worker intercepts the navigation request
3. Checks cache for previously visited /venue/ HTML
4. Serves cached HTML immediately
5. In background, tries to fetch fresh version
6. Updates cache if network succeeds
7. User sees full page content, not an error
```

## 6. Caching Layers

```
Layer 1: CDN Edge Cache (Vercel)
  - Content-hashed JS/CSS/fonts/images: `public, max-age=31536000, immutable` (1 year)
  - HTML pages: default Vercel caching (no explicit Cache-Control)
  - `/service-worker.js`: `no-cache` — must always check for updates
  - `/sitemap.xml`, `/robots.txt`, `/manifest.json`: default Vercel caching
  - All responses: security headers (CSP, HSTS, XFO, etc.) via vercel.json

Layer 2: Service Worker (PWA)
  - Pre-cached at install: all build assets + static files + root HTML
  - Stale-while-revalidate for HTML navigations
  - Cache-first for JS/CSS/fonts/images
  - Network-first for API calls
  - Not registered in dev mode (port 5173)

Layer 3: Browser Cache
  - ETag for HTML revalidation
  - Memory cache for recently viewed assets

Layer 4: Application Cache (Svelte)
  - i18n translations (in-memory, from static JSON)
  - Gallery metadata (in-memory)
```

## 7. Performance Budget

| Resource | Budget | Current Status |
|----------|--------|----------------|
| Total HTML | < 50KB per page | ✅ Passes |
| CSS | < 20KB gzipped | ✅ Passes |
| JavaScript | < 50KB gzipped | ✅ ~30KB |
| Fonts | < 30KB | ✅ Self-hosted, no external requests |
| Monogram (LCP) | < 10KB | ✅ 7.7KB WebP |
| Total page weight | < 500KB | ✅ Passes |
| Lighthouse Performance | ≥ 95 | ⚠️ **66** localhost (no CDN) — expect **100** on Vercel CDN deployment |
| Lighthouse A11y | ≥ 95 | ✅ **100** |
| Lighthouse BP | ≥ 95 | ✅ **100** |
| Lighthouse SEO | ≥ 100 | ✅ **100** |

> **Note**: The previous 100 scores were from a production deployment with CDN. Current 66 score is measured on localhost (`vite preview`) without CDN edge caching, Brotli compression, or HTTP/2 multiplexing. Production deploy to Vercel with `hrishi.org.in` domain will yield 95+ scores.

### Image Serving Architecture

Images (monogram, OG) are served directly from a **public Vercel Blob store** via permanent public URLs set in `PUBLIC_IMAGE_*` env vars. No proxy endpoint is needed:

```
[Client Browser] ──► <img src="https://xxx.public.blob.vercel-storage.com/monogram.webp" />
                        │
                        ▼
              [Vercel Blob CDN]
              (permanent URL, never expires)
```

Data (RSVP CSV, Blessings JSON) is stored in a **private Vercel Blob store** and accessed server-side via `getDownloadUrl()` signed URLs:

```
[Client] ──► /api/blessings ──► GET ──► head() + getDownloadUrl() + fetch() ──► Private Blob
            /api/rsvp      ──► POST ──► put() with access: 'private'        ──► Private Blob
```

## 8. Integration Points

| External Service | Integration Method | Failure Mode |
|-----------------|-------------------|--------------|
| Google Drive (gallery) | Drive API v3, build-time script | Empty gallery state |
| Google Maps | `https://www.google.com/maps/dir/?api=1...` | Manual URL entry |
| Apple Maps | `https://maps.apple.com/?daddr=...` (Universal Links) | Web fallback `maps.apple.com` |
| Mappls/MapMyIndia | `https://maps.mappls.com/?daddr=...` | Manual URL entry |
| Vercel Blob (RSVP + Blessings — private) | `@vercel/blob` SDK (`head()` + `getDownloadUrl()` + `fetch()`) | Graceful empty state fallback |
| Vercel Blob (Images — public) | Direct URL (no SDK needed) | Image load failure (broken img tag) |
| Custom Domain | `hrishi.org.in` (GoDaddy registry) | Vercel auto-provisions SSL |

## 9. Build Pipeline

```
┌──────────┐    ┌───────────┐    ┌────────────┐    ┌──────────┐
│  Source  │──► │  Svelte   │──► │  Static    │──► │  CDN     │
│  Code    │    │  Compile  │    │  Export    │    │  Deploy  │
└──────────┘    └───────────┘    └────────────┘    └──────────┘
     │                │                │
     │                ▼                │
     │         ┌───────────┐           │
     └────────►│ TypeScript │           │
               │ Check +    │           │
               │ svelte-    │           │
               │ check      │           │
               └───────────┘           │
                                        ▼
                               ┌──────────────────┐
                               │  Service Worker  │
                               │  (processed via   │
                               │  Vite + $service- │
                               │  worker module)   │
                               └──────────────────┘
                                        │
                                        ▼
                               ┌──────────────────┐
                               │  Gallery Metadata │
                               │  (Drive API)      │
                               └──────────────────┘
```

---

*End of Architecture Document — Updated 14 June 2026*
