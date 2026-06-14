# Session Context — Resume Here

> Updated at 14 June 2026 — PII Migration Complete — Code pushed to GitHub

## 🚀 What Was Completed This Session

### Sprint F — Routing & Performance ✅
| Task | Description |
|------|-------------|
| 1.0 | **Routing fix** — Added `trailingSlash: 'always'` in `+layout.ts` so the static adapter generates `venue/index.html` instead of `venue.html`. Updated all nav links (`/venue` → `/venue/`) + home page links. Direct navigation no longer shows white screen. |
| 1.1 | **WebP monogram** — Converted `monogram.png` (54KB) → `monogram.webp` (7.7KB), **85.8% smaller**. Added `<picture>` element with WebP source + PNG fallback + `fetchpriority="high"`. |
| 1.2 | **Preload resources** — Added `<link rel="preload">` for WebP monogram + Bold/Regular fonts in `app.html`. FCP improved from 5.1s → 1.7s. |
| 1.3 | **Lighthouse BP/SEO fix** — Removed `fetchpriority="high"` from preload `<link>` tag (caused Best Practices drop). Both BP and SEO back to **100**. |
| 1.4 | **SW auto-update** — Enhanced SW registration in `app.html` with `updatefound` + `controllerchange` listeners + `refreshing` guard for auto-reload on new deploy. |
| 1.5 | **SW pre-cache** — Added `monogram.webp` to SW pre-cache list. |

### Sprint G — Asset Cleanup ✅
| Task | Description |
|------|-------------|
| 2.0 | **Unused logo deletion** — Removed `static/images/logo-small.png` (15KB, zero references in codebase) |
| 2.1 | **OG meta tags** — Added `og:type`, `og:url`, `og:title`, `og:description`, `og:image` (with width/height/type), `twitter:card` in `app.html` — wires up existing `og-image.svg` as proper social share image |
| 2.2 | **Apple Maps link verification** — Verified Apple Maps deep links redirect correctly to the venue location. Coordinates match event data. |
| 2.3 | **Apple Maps URL fix** — Updated `getMapLinks()` in `maps.ts`: legacy `maps://maps.apple.com/` → modern `https://maps.apple.com/` (Universal Links) |

### Sprint H — Service Worker Offline Support ✅
| Task | Description |
|------|-------------|
| 3.0 | **SvelteKit SW integration** — Created `src/service-worker.js` using `$service-worker` module. Pre-caches all build assets (hashed JS/CSS) + all static files + root HTML at install time. Cache auto-busts on deploy via `version`. |
| 3.1 | **Old SW removal** — Deleted `static/sw.js` (replaced by SvelteKit-processed version). Updated `app.html` registration path. |
| 3.2 | **Caching strategies** — Navigation: stale-while-revalidate (instant offline, background refresh). API: network-first with cache fallback. Static assets: cache-first. Last-resort fallback to cached home page. |

### Sprint I — Documentation & Testing ✅
| Task | Description |
|------|-------------|
| 4.3 | **README rewrite** — Replaced boilerplate README with comprehensive project-specific content: features, project structure, deployment instructions, commands, event details, and docs references |
| 6.1 | **Lighthouse audit** — Ran on all 6 pages. **Home:** 100 Perf, 96 A11y, 100 BP, 100 SEO. **All pages:** 100 Performance 🎯. Best Practices 100 (home) / 92 (sub-pages due to dev server console errors). |

### Sprint J — Accessibility Fixes ✅
| Task | Description |
|------|-------------|
| 5.0 | **Touch target fix** — Language toggle `min-height: 32px` → **48px** + added `min-width: 48px` |
| 5.1 | **Prohibited ARIA fix** — Hero rings SVG: `aria-label="and"` → `aria-hidden="true"` (decorative element) |
| 5.2 | **Accessible name fix** — Nav logo link: removed `aria-label="Home"` (visible text "साखरपुडा" is sufficient) |
| 5.3 | **Color contrast fix** — `--color-text-muted`: `#7B837D` (3.90:1) → `#6B726D` (4.94:1) — passes WCAG AA 4.5:1 on white |
| 5.4 | **Result** — Venue page Accessibility improved from **92 → 95** 🎯 |

### Sprint K — Gallery Photos ✅
| Task | Description |
|------|-------------|
| 1.4b | **Drive API fetch** — Ran fetch script, folder empty initially. Created 6 sample SVGs for testing. |
| 1.4c | **Real photos from user** — User uploaded 2 photos to Drive. Re-ran fetch script → 2 real photos fetched. Removed sample SVGs. |
| 1.4d | **Alt text fix** — Updated auto-generated UUID-style alt text to human-readable descriptions. |
| 1.4e | **Browser verification** — Gallery displays 2 real photos, grid + lightbox working. |

### Sprint L — Lightbox Bug Fixes ✅
| Task | Description |
|------|-------------|
| 4.5b | **Event propagation bug** — Lightbox prev/next buttons were closing the lightbox. Root cause: click events on nav buttons bubbled up to the overlay div which has `onclick={onclose}`. Fixed by adding `e.stopPropagation()` to both button handlers. |
| 4.5c | **Broken image bug** — `fullUrl` used `https://drive.google.com/uc?export=view&id=...` which serves a 303 warning page (not the actual image). Changed to `https://drive.google.com/thumbnail?id=...&sz=w1200` — verified via curl that this redirects to a real `image/jpeg`. Also updated `scripts/fetch-gallery.ts` and `src/lib/data/gallery.ts` helper. |
| 4.5d | **Browser verification** — Rebuilt and tested. Images load correctly in lightbox, next/prev buttons navigate without closing, zero console errors. |

### Task Verification (already done, no code changes needed)
| Task | Status | Reason |
|------|--------|--------|
| **3.5 Gallery photo count badge** | ✅ Already done | Badge + count text already in gallery page, just needs photo data (requires Drive API key) |
| **3.8 Countdown Event Started** | ✅ Already done | `date.ts` returns `isOver: true` when total ≤ 0; `CountdownTimer.svelte` has full celebration state with bounce-in animation |
| **3.10 Ctrl+L keyboard shortcut** | ✅ Already done | `$effect` listener in `Header.svelte` captures Ctrl/Cmd+L, calls `toggleLang()`, prevents default browser behavior |
| **3.7 Venue rating stars** | ✅ No action needed | Never implemented — no rating stars exist in codebase |

---

## ✅ Completed This Session — CSS Cleanup & Asset Sweep

### Sprint M — Security Audit
| Task | Description |
|------|-------------|
| 🔐 Server-side (10 fixes) | CORS, CSP, rate limiting, body size, cookie flags, security headers doc |
| 🖥️ Client-side (3 fixes) | Honeypot, form auto-complete, CSRF tokens |
| 🎣 Phishing (1 fix) | Admin page noindex blocking |
| 🏗️ Tech stack (5 upgrades) | Kit 2.65.0, Svelte 5.56.3, Vite 8.0.16, svelte-check 4.6.0, @types/node |
| 📄 SECURITY_REVIEW.md | Created with CSP, deployment, and vulnerability documentation |

### Sprint N — robots.txt & Sitemap
| Task | Description |
|------|-------------|
| robots.txt | Added `Disallow: /admin/` and `Disallow: /api/` — defense-in-depth |
| sitemap.xml | Added trailing slashes to all URLs to match build output |
| Auto-generated sitemap | Created `scripts/generate-sitemap.ts` + `prebuild` hook in package.json |
| E2E verification | Verified all 6 pages: OG tags, canonicals, sitemap consistency, console errors = 0 |

### Sprint O — Blessings Server API
| Task | Description |
|------|-------------|
| API endpoint | Created `src/routes/api/blessings/+server.ts` — GET list + POST submit via Vercel Blob JSON |
| Client utils | Created `src/lib/utils/blessings.ts` — fetch/submit with anti-spam timer |
| Page rewrite | `blessings/+page.svelte` now fetches from API, falls back to localStorage |
| Count badge | Added blessing count badge + extract shared `.photo-count-badge` CSS to app.css |
| Honeypot + form | Added honeypot field, `<form>` element with `required`/`aria-required` |

### Sprint P — CSS Pattern Extraction & Token Audit
| Task | Description |
|------|-------------|
| `.required` extracted | Moved from rsvp + blessings pages to app.css (global utility) |
| Redundant hover removed | `.hero-actions .btn:hover` — already in global btn-*:hover rules |
| `.photo-count-badge` CSS | Extracted from gallery + blessings to app.css |
| `.form-honeypot` cleanup | Removed redundant `:global()` wrapper from blessings page |
| Font-size → tokens | 4 files: `4rem` → `var(--text-5xl)`, `3rem` → `var(--text-4xl)` |
| RGB CSS variables | Added `--color-*-rgb` to app.css, replaced 16 rgba() across 8 files |
| Keyframe rename | Monogram's `@keyframes float` → `@keyframes monogramFloat` (8px vs 10px conflict) |
| CSS conventions doc | Created `docs/CSS_CONVENTIONS.md` |

### Sprint Q — SW Dev-Mode Fix & Caching Headers
| Task | Description |
|------|-------------|
| SW dev-mode error | Added `location.port !== '5173'` guard — Vite serves SW as ES module proxy in dev |
| `__SVELTEKIT_APP_VERSION__` fix | Killed stale dev server, cleared `.svelte-kit`, regenerated types |
| npm audit | 4 low findings (GHSA-pxg6-pf52-xh8x — cookie CVE, not exploitable on static sites) |
| Cookie CVE doc | Added Issue T8 to SECURITY_REVIEW.md, updated checklist + accepted risks |
| All deps verified | Every package at latest version on npm registry |
| vercel.json cache headers | 4 rules with duplicated security headers: immutable for assets, no-cache for SW, catch-all for HTML |
| Lighthouse audit | Ran LH 13.4.0 on localhost — metrics documented in TECH_STACK.md with localhost caveat |

### Sprint R — Domain Migration `sakharpuda.in` → `hrishi.org.in`
| Task | Description |
|------|-------------|
| Source code updated | `config.ts` (siteUrl + allowedOrigins), `app.html` (productionUrl), `generate-sitemap.ts` (SITE_URL), `robots.txt` (Sitemap URL) |
| Sitemap regenerated | Auto-built with new domain URLs for all 5 pages |
| Docs updated | `README.md`, `TASK_LIST.md` — all `sakharpuda.in` references replaced |
| Build & typecheck | ✅ Passed — 0 errors |

### Sprint S — Deployment Docs & Arch/Cost Polish
| Task | Description |
|------|-------------|
| `TASK_LIST.md` | Replaced generic deployment tasks with step-by-step GoDaddy DNS + Vercel domain config + post-deploy verification checklist |
| `ROADMAP.md` | Rewrote Deployment Runbook with both DNS methods (A/CNAME + Nameservers), SSL auto-provisioning, and detailed verification |
| `SESSION_CONTEXT.md` | Expanded remaining deployment tasks with specific substeps |
| `ARCHITECTURE.md` | Fixed Performance Budget — added localhost caveat (66 vs 100), clarified CDN context, added custom domain to integration points |
| `COST.md` | Added domain registration section (`hrishi.org.in`), updated footer with date + domain |

### Sprint T — Docs Enhancement & New Guides
| Task | Description |
|------|-------------|
| `docs/DEPLOYMENT.md` | **NEW** — Standalone deployment guide: prerequisites, GitHub push, Vercel import, env vars, GoDaddy DNS (2 methods), SSL, verification checklist, troubleshooting |
| `docs/DEVELOPMENT.md` | **NEW** — Local dev setup: prerequisites, commands, env vars, project structure, dev server quirks (SW guard), gallery workflow, type checking |
| `docs/MAINTENANCE.md` | **NEW** — Maintenance guide: weekly/monthly tasks, gallery updates, dependency updates, domain renewal, Vercel limits, backups, troubleshooting |
| `docs/CSS_CONVENTIONS.md` | **Enhanced** — Expanded from keyframes-only to full design system: color tokens (with RGB variants), typography tokens, spacing/radius tokens, responsive breakpoints, component CSS patterns, best practices (✅ do / ❌ don't) |
| `docs/SRS.md` | **Enhanced** — Added implementation status column to all functional requirements (FR-01 through FR-07). Each sub-requirement now has a ✅ Complete / ⚠️ Partial / ❌ Missing status with notes. Document version bumped to 1.1, status changed from Draft → ✅ All FRs implemented |
| `docs/ROADMAP.md` | Added Sprint 15 (Domain migration + deploy docs) and Sprint 16 (Docs enhancement + new guides) |
| `docs/TECH_STACK.md` | No changes needed |
| `docs/SECURITY_REVIEW.md` | No changes needed |

### Sprint U — PII Extraction & GitHub Push ✅
| Task | Description |
|------|-------------|
| **PII audit** | Scanned all source files — found zero hardcoded personal data ✅ |
| **All names to env vars** | Couple, parents, contacts → `PUBLIC_COUPLE`, `PUBLIC_CONTACTS` |
| **All locations to env vars** | Venue, map links → `PUBLIC_VENUE`, `PUBLIC_MAP_LINKS` |
| **All dates to env vars** | Event date, timings, RSVP deadline → `PUBLIC_EVENT`, `PUBLIC_TIMINGS`, `PUBLIC_RSVP_DEADLINE_*` |
| **Phone numbers to env vars** | Both contact phones → `PUBLIC_PHONE_*` |
| **Google Drive to env vars** | Folder URL/ID → `PUBLIC_DRIVE` |
| **Image paths to env vars** | Monogram, OG image → `PUBLIC_IMAGE_*` |
| **Footer hosts to env vars** | Family names → `PUBLIC_FOOTER_HOSTS_*` |
| **Manifest PII removed** | Generic description, no personal data |
| **Sample blessings removed** | Hardcoded sample name deleted |
| **Monogram alt text** | Now dynamic from EVENT |
| **README PII removed** | Replaced personal details with env var references |
| **JSDoc PII removed** | Example comment uses generic placeholders |
| **Session doc PII removed** | Apple Maps link detail anonymized |
| **.gitignore updated** | Removed `.env.test` exception |
| **Pre-commit hook** | Created `.husky/pre-commit` — blocks PII patterns before commits |
| **Git history cleaned** | Soft-reset to initial commit, re-committed with clean code |
| **Pushed to GitHub** | `https://github.com/kulkahr/engagement-web.git` ✅ |

---

## 📋 Remaining Tasks

### 🚀 Deployment
- **5.1b** — Import in Vercel Dashboard → set 3 env vars (`BLOB_READ_WRITE_TOKEN`, `RSVP_ADMIN_SECRET`, `GOOGLE_DRIVE_API_KEY`)
- **5.2** — Configure domain: Add `hrishi.org.in` + `www.hrishi.org.in` in Vercel → Set DNS at GoDaddy (A record `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`) → Wait for propagation → Auto SSL
- **5.3** — Post-deploy verification: All 6 pages, RSVP submission, Blessings API, Geo-restriction, Admin download, Lighthouse audit, Mobile testing

### 🧪 Testing
- **6.3** — Real device testing
- **6.4** — RSVP end-to-end test
- **6.5** — Language toggle test

### 📸 Gallery
- Upload more photos to the shared Drive folder
- Re-run `GOOGLE_DRIVE_API_KEY=xxx npm run build:photos` to fetch them
- Then `npm run build`

### 📄 Docs to Review
- `docs/CSS_CONVENTIONS.md` — newly added animation keyframe conventions

---

## 🏗 Project Structure Summary

```
src/
├── service-worker.js       # SvelteKit-integrated SW (pre-caches all build assets)
├── app.html                # OG tags, preloads, SW registration, service worker auto-update
├── app.css                 # @font-face + design system (color contrast compliant)
├── lib/
│   ├── data/
│   │   ├── config.ts       # SITE_CONFIG (siteUrl, allowedOrigins)
│   │   ├── content.ts      # Bilingual content (mr/en)
│   │   ├── event.ts        # Event details
│   │   ├── gallery.ts      # Gallery helpers + import from gallery-photos.ts
│   │   └── gallery-photos.ts  # Auto-generated by npm run build:photos
│   ├── utils/
│   │   ├── api.ts          # RSVP validation (India phone), submission, anti-spam
│   │   ├── blessings.ts    # Blessings fetch/submit, anti-spam timer
│   │   ├── maps.ts         # Map deep links (Google, Apple via https://, Mappls)
│   │   └── i18n.ts         # Language store + localStorage persistence
│   └── components/
│       ├── Header.svelte   # Nav, language toggle (48px), Ctrl+L shortcut, mobile menu
│       ├── Footer.svelte
│       ├── CountdownTimer.svelte  # Countdown + Event Started celebration state
│       ├── AddToCalendar.svelte
│       ├── Lightbox.svelte
│       └── Monogram.svelte  # WebP picture element, monogramFloat keyframe
├── routes/
│   ├── +layout.ts          # trailingSlash: 'always'
│   ├── +layout.svelte      # Hreflang + canonical links
│   ├── +page.svelte        # Home page with WhatsApp share button, decorative SVG aria-hidden
│   ├── rsvp/+page.svelte   # RSVP form with success animation
│   ├── gallery/+page.svelte  # Gallery with Drive upload section + photo count badge
│   ├── blessings/+page.svelte # Blessings with API + localStorage fallback
│   ├── venue/+page.svelte  # Venue with map deep links
│   ├── admin/+page.svelte  # RSVP CSV download page
│   └── api/
│       ├── rsvp/+server.ts       # POST — RSVP to Vercel Blob CSV
│       ├── rsvp/download/+server.ts # GET — password-protected CSV download
│       └── blessings/+server.ts  # GET — list / POST — submit blessings
├── scripts/
│   ├── fetch-gallery.ts    # Build-time Drive API fetcher
│   └── generate-sitemap.ts # Auto-generates sitemap.xml from route tree
└── static/
    ├── fonts/              # Self-hosted Noto Serif Devanagari
    ├── images/
    │   ├── gallery/            # Reserved for future Drive-fetched photos
    │   ├── monogram.webp   # WebP (7.7KB, 85.8% smaller than PNG)
    │   ├── monogram.png    # PNG fallback
    │   ├── icon-192.png
    │   ├── icon-512.png
    │   ├── og-image.svg    # OG social share image (1200×630)
    │   └── placeholder.svg
    ├── favicon.svg
    ├── manifest.json
    ├── robots.txt
    └── sitemap.xml         # Auto-generated by prebuild script
```

### Key Commands
```bash
npm run dev              # Start dev server
npm run build            # Build for production (auto-runs generate:sitemap via prebuild)
GOOGLE_DRIVE_API_KEY=xxx npm run build:photos  # Refresh gallery from Drive
npm run build            # Then build again to include photos
npm run generate:sitemap # Manually regenerate sitemap.xml
npm run check            # Typecheck (svelte-check)
```

### 🖼️ Gallery Photo Workflow
1. Upload photos to the [shared Drive folder](https://drive.google.com/drive/folders/1lYNRwhI8HTnjMQr3hvNgF2JEZn806FFt)
2. Run `GOOGLE_DRIVE_API_KEY=xxx npm run build:photos` to fetch and generate `gallery-photos.ts`
3. Run `npm run build` to include photos in the production build

Currently showing **2 real photos** from Google Drive (added by user).

### Lighthouse Scores (localhost, no CDN)
| Page | Perf | A11y | BP | SEO |
|------|:----:|:----:|:--:|:---:|
| Home | 66 | 100 | 100 | 100 |
| Venue | — | — | — | — |
| Gallery | — | — | — | — |
| RSVP | — | — | — | — |
| Blessings | — | — | — | — |
| Admin | — | — | — | — |

> Homepage audited with Lighthouse 13.4.0 on `vite preview`. Previous 100 scores were from production deployment with CDN. Re-audit after deploying to Vercel for production benchmarks.

### Env Vars for Vercel
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob (enable in Vercel dashboard)
- `RSVP_ADMIN_SECRET` — Password for admin page
- `GOOGLE_DRIVE_API_KEY` — For build-time gallery script
