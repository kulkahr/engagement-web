# Implementation Roadmap
## Maharashtrian Engagement Invitation Web Application

---

## 1. Sprint Plan

### Sprint 1: Foundation (Days 1-2)
- [x] Initialize SvelteKit project with static adapter
- [x] Create project structure and configuration
- [x] SRS document generation
- [x] Architecture design document
- [x] Technology stack analysis
- [x] Design system CSS (custom properties, typography, components)

### Sprint 2: Core Pages (Days 3-4)
- [x] Landing page with hero, invitation details
- [x] Countdown timer component
- [x] Event details section
- [x] Navigation header with mobile menu
- [x] Footer component
- [x] Language toggle (Marathi/English)

### Sprint 3: Interactive Features (Days 5-6)
- [x] RSVP form with validation
- [x] API endpoint for RSVP submission
- [x] Venue page with map deep links
- [x] Google Maps, Apple Maps, Mappls integration
- [x] Add to Calendar functionality

### Sprint 4: Gallery & Polish (Days 7-8)
- [x] Gallery page with photo grid
- [x] Lightbox viewer
- [x] Google Drive integration
- [x] Blessings/messages section
- [x] 404 error page
- [x] PWA manifest

### Sprint 5: Optimization (Days 9-10)
- [x] Build verification
- [x] Error/warning fixes
- [x] Cost estimation
- [x] Documentation completion
- [x] Performance audit (Lighthouse 100 Perf)
- [ ] Mobile testing
- [ ] Final review

### Sprint 6: Routing & Performance (Days 11-12)
- [x] Routing fix — `trailingSlash: 'always'` for static file serving
- [x] WebP monogram — 54KB → 7.7KB (85.8% savings)
- [x] Font & image preloading (FCP: 5.1s → 1.7s)
- [x] Lighthouse BP/SEO fix (both back to 100)
- [x] OG meta tags for social sharing
- [x] Apple Maps link verification & URL fix (maps:// → https://)
- [x] Unused asset cleanup

### Sprint 7: PWA & Offline (Days 13-14)
- [x] SvelteKit-integrated service worker (`$service-worker` module)
- [x] Pre-cache all build assets + static files at install
- [x] Stale-while-revalidate for navigation, cache-first for assets
- [x] Network-first for API, last-resort fallback to cached home page
- [x] Cache auto-busting on deploy via version hash
- [x] SW auto-update on page reload

### Sprint 9: Gallery Photos (Day 17)
- [x] Google Drive API fetch — folder empty initially
- [x] Created 6 sample placeholder SVGs
- [x] Populated gallery-photos.ts for testing
- [x] User uploaded 2 real photos → re-ran fetch, removed placeholders

### Sprint 10: Lightbox Bug Fixes (Day 17)
- [x] **Bug fix**: Nav buttons (prev/next) were closing the lightbox due to event bubbling to overlay's `onclick={onclose}`. Added `e.stopPropagation()` to button handlers.
- [x] **Bug fix**: Gallery images showed as broken in lightbox — `uc?export=view` URL format returns a 303 warning page. Changed `fullUrl` to `thumbnail?sz=w1200`, verified serves real JPEG.
- [x] Verified both fixes in browser: images load, navigation works, lightbox stays open.

### Sprint 11: Security & Sitemap Audit
- [x] Tech stack security audit (Batch G): Kit 2.61.1 → 2.65.0, Svelte 5.56.0 → 5.56.3, Vite 8.0.15 → 8.0.16, svelte-check 4.4.8 → 4.6.0
- [x] robots.txt: Added `Disallow: /admin/` and `Disallow: /api/`
- [x] sitemap.xml: Auto-generated from route tree via `scripts/generate-sitemap.ts` + `prebuild` hook
- [x] E2E verification: All 6 pages verified for OG tags, canonicals, sitemap consistency (zero console errors)

### Sprint 12: Blessings Server API
- [x] Created `src/routes/api/blessings/+server.ts` — GET list + POST submit via Vercel Blob JSON
- [x] Created `src/lib/utils/blessings.ts` — fetch/submit with anti-spam timer
- [x] Rewrote blessings page to fetch from API on mount, fall back to localStorage
- [x] Added blessing count badge, extracted shared CSS

### Sprint 13: CSS Pattern Extraction & Token Audit
- [x] Extracted `.required`, `.photo-count-badge`, `.form-honeypot` to global app.css
- [x] Removed redundant `.hero-actions .btn:hover` rule
- [x] Replaced 4 hardcoded font-size values with design tokens (`--text-4xl`, `--text-5xl`)
- [x] Added `--color-*-rgb` CSS variables to app.css, replaced 16 rgba() across 8 files
- [x] Renamed Monogram's `@keyframes float` → `@keyframes monogramFloat` (resolved 8px vs 10px conflict)
- [x] Created `docs/CSS_CONVENTIONS.md` — animation keyframe placement rules

### Sprint 14: SW Dev-Mode Fix & Caching Audit
- [x] Fixed `__SVELTEKIT_APP_VERSION__` error — stale `.svelte-kit` types regenerated
- [x] Added `location.port !== '5173'` SW registration guard — Vite dev serves SW as ES module proxy
- [x] Updated `vercel.json` with caching headers: immutable 1yr for assets, no-cache for SW, security headers duplicated across 4 rules
- [x] Ran Lighthouse audit (13.4.0) — documented localhost metrics with CDN caveat
- [x] Ran fresh npm audit — 4 low findings (cookie CVE GHSA-pxg6-pf52-xh8x), all deps at latest
- [x] Updated SECURITY_REVIEW.md with Issue T8 (cookie), refreshed all version/audit data
- [x] Updated all docs: SESSION_CONTEXT, ARCHITECTURE, ROADMAP, TECH_STACK, SRS

### Sprint 15: Domain Migration & Deployment Docs
- [x] Updated all source files: `config.ts`, `app.html`, `generate-sitemap.ts`, `robots.txt` — `sakharpuda.in` → `hrishi.org.in`
- [x] Regenerated sitemap.xml with new domain
- [x] Updated `README.md`, `TASK_LIST.md` with new domain
- [x] Detailed GoDaddy DNS + Vercel domain config in `TASK_LIST.md`, `ROADMAP.md`
- [x] Updated `ARCHITECTURE.md` performance budget with localhost caveat
- [x] Updated `COST.md` with domain registration section (`hrishi.org.in`)

### Sprint 16: Docs Enhancement & New Guides
- [x] Created `docs/DEPLOYMENT.md` — standalone deployment guide (Git push → Vercel → GoDaddy DNS → SSL → Verification)
- [x] Created `docs/DEVELOPMENT.md` — local development setup (commands, structure, workflows)
- [x] Created `docs/MAINTENANCE.md` — ongoing maintenance (backups, updates, troubleshooting)
- [x] Enhanced `docs/CSS_CONVENTIONS.md` — added design tokens (colors, typography, spacing), responsive breakpoints, component patterns, best practices
- [x] Enhanced `docs/SRS.md` — added implementation status column to all functional requirements
- [x] Updated all doc footers and cross-reference links

### Sprint V: SonarQube Cloud Scan & Fixes
- [x] Installed `sonar-scanner` via Homebrew
- [x] Created `sonar-project.properties` for SonarCloud
- [x] First SonarCloud scan — 18 issues found, all resolved
- [x] SonarCloud cloud scan — 48 issues found across 8 files
- [x] Fixed 45 issues (`.replaceAll()`, `globalThis`, `.push()` consolidation, etc.)
- [x] Fixed 1 security hotspot (ReDoS in email regex)
- [x] 3 remaining issues accepted as tradeoffs
- [x] Created "Engagement Web Gate" quality gate (6 conditions)
- [x] Updated `sonar-project.properties` with quality gate reference
- [x] Final scan: **0 hotspots, 3 code smells** ✅

---

## 2. Milestones

| Milestone | Date | Deliverable | Status |
|-----------|------|-------------|--------|
| M1: Project Scaffolded | Day 1 | SvelteKit project with static adapter | ✅ Complete |
| M2: Design System | Day 2 | Global CSS, design tokens | ✅ Complete |
| M3: Landing Page | Day 3 | Home page with hero, invitation, countdown | ✅ Complete |
| M4: RSVP System | Day 4 | Form, validation, API endpoint | ✅ Complete |
| M5: Venue & Maps | Day 5 | Map deep links, venue details | ✅ Complete |
| M6: Gallery | Day 6 | Photo grid, lightbox, Drive integration | ✅ Complete |
| M7: Full Feature Set | Day 7 | All pages functional | ✅ Complete |
| M8: Production Ready | Day 8 | Build passes, documented, deployable | ✅ Complete |
| M9: Gallery Data | Day 17 | Real Drive photos + placeholders | ✅ Complete |
| M10: Lightbox Bugfixes | Day 17 | Image loading + navigation fix | ✅ Complete |

---

## 3. MVP Scope

### Included in MVP
- ✅ Landing page with invitation details
- ✅ Bilingual support (Marathi/English)
- ✅ Event details and schedule
- ✅ Venue location with map navigation (Google Maps, Apple Maps, MapMyIndia)
- ✅ Countdown timer to event date
- ✅ RSVP form with CSV storage
- ✅ Photo gallery with Google Drive integration
- ✅ Lightbox for full-size photo viewing
- ✅ Blessings/messages section
- ✅ Add to Calendar functionality
- ✅ PWA support (manifest, add to home screen)
- ✅ Mobile-first responsive design
- ✅ Custom 404 page

### Post-MVP Features (Future)
| Feature | Priority | Complexity | Notes |
|---------|----------|------------|-------|
| Service Worker for offline support | Medium | Medium | ✅ Done — SvelteKit-integrated SW with stale-while-revalidate + pre-cache all assets |
| Video gallery support | Low | Low | Embed YouTube/Drive videos |
| Guest count live counter | Low | Medium | WebSocket or polling |
| WhatsApp share button | Low | Low | Using Web Share API |
| QR code on invitation | Low | Low | Generate at build time |
| Carousel/slideshow on landing | Low | Medium | Auto-playing transitions |
| Admin dashboard for RSVP | Low | Medium | Simple protected page |
| Email notification on RSVP | Low | Medium | Via edge function |

---

## 4. Priority Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| Landing page | High | Low | P0 |
| RSVP form | High | Medium | P0 |
| Venue & maps | High | Low | P0 |
| Bilingual support | High | Low | P0 |
| Photo gallery | Medium | Medium | P1 |
| Countdown timer | Medium | Low | P1 |
| Mobile optimization | High | Medium | P0 |
| Add to Calendar | Medium | Low | P1 |
| Blessings section | Low | Low | P2 |
| PWA support | Medium | Medium | P1 |
| Offline support | Low | High | P3 |

---

## 5. Task Breakdown

### Completed Tasks

**Configuration & Setup**
- Initialize SvelteKit project
- Install and configure @sveltejs/adapter-static
- Configure TypeScript strict mode
- Create folder structure

**Data Layer**
- Create event configuration (event.ts)
- Create bilingual content data file (content.ts)
- Create gallery data utility (gallery.ts)

**Utilities**
- i18n utility for language switching
- Map deep link generator (Google, Apple, Mappls)
- Date formatting and countdown calculator
- RSVP API helper with validation

**Design System**
- Global CSS with design tokens (colors, spacing, typography)
- Component styles (buttons, cards, forms)
- Animations and transitions
- Responsive breakpoints
- Accessibility (focus, reduced motion, print)

**Layout Components**
- Header with responsive navigation and mobile menu
- Footer with event details

**Pages**
- Landing/Home page (hero, invitation, event details, countdown, contacts)
- RSVP page (form with validation, success state)
- Venue page (address, map deep links, schedule)
- Gallery page (photo grid, lightbox viewer, Drive link)
- Blessings page (form, messages list)
- 404 error page

**Interactive Components**
- Countdown timer
- Add to Calendar dropdown
- Photo lightbox viewer
- Language toggle

**API & Backend**
- RSVP API endpoint (POST)
- CSV storage format
- Anti-spam (honeypot, timing)
- CORS headers

**Configuration**
- PWA manifest
- SVG favicon
- SEO meta tags
- Open Graph tags
- JSON-LD structured data

**Routing & Performance**
- trailingSlash: 'always' routing fix (static file serving)
- WebP monogram conversion (85.8% smaller)
- Font & image preloading (FCP: 5.1s → 1.7s)
- Lighthouse BP/SEO fix (both 100)

**Service Worker & PWA**
- SvelteKit-integrated service worker (`$service-worker` module)
- Pre-cache all build + static assets at install
- Stale-while-revalidate for navigations
- Cache-first for assets, network-first for API
- Offline fallback to cached home page
- SW auto-update on page reload

**Accessibility**
- Touch targets: language toggle 32px → 48px
- Decorative ARIA: hero rings `aria-label` → `aria-hidden`
- Accessible names: nav logo `aria-label` removed
- Color contrast: `--color-text-muted` #7B837D → #6B726D (3.9:1 → 4.94:1)

**Documentation**
- README full rewrite with project-specific content
- SESSION_CONTEXT.md updated
- ROADMAP.md sprint plan expanded

---

## 6. Pre-Launch Checklist

- [x] All pages render correctly
- [x] RSVP form submits and validates
- [x] Language toggle works
- [x] Countdown timer shows correct time
- [x] Map links open correct apps
- [x] Gallery displays placeholder images
- [x] Mobile menu works
- [x] 404 page shows on unknown routes
- [x] SEO meta tags present
- [x] PWA manifest configured
- [x] Final content review (replace placeholders)
- [x] Gallery displays photos correctly (lightbox fixed ✅)
- [x] Performance audit (Lighthouse)
- [x] Cross-browser testing
- [ ] Real device testing
- [ ] Google Drive links configured (upload real photos & re-run fetch)
- [ ] Deploy to production

---

## 7. Deployment Runbook

### Deploy to Vercel

#### Option A: Git Import (Recommended)
```bash
# 1. Push code to GitHub
git remote add origin https://github.com/<username>/engagement-web.git
git push -u origin main

# 2. Import in Vercel
#    Go to https://vercel.com/new → Import Git Repo
#    → Select the repo → Framework preset: SvelteKit → Deploy
#
# 3. Set environment variables in Vercel Dashboard:
#    Project Settings → Environment Variables → Add:
#    - BLOB_READ_WRITE_TOKEN  (from Vercel Blob storage)
#    - RSVP_ADMIN_SECRET      (your chosen password)
#    - GOOGLE_DRIVE_API_KEY   (optional, for gallery builds)
```

#### Option B: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

### Configure Custom Domain (`hrishi.org.in`)

#### Step 1 — Add Domain in Vercel
1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Domains**
2. Enter `hrishi.org.in` and click **Add**
3. Also add `www.hrishi.org.in` for the www subdomain

#### Step 2 — Point DNS at GoDaddy (Choose One Method)

**Method A: A/CNAME Records (Keep DNS at GoDaddy)**
| Record Type | Name/Host | Value |
|-------------|-----------|-------|
| **A** | `@` (apex) | `76.76.21.21` (Vercel's IP) |
| **CNAME** | `www` | `cname.vercel-dns.com` |

✅ Simple. No DNS migration needed. Remove any old A/AAAA/CNAME records for `@` or `www` to avoid conflicts.

**Method B: Vercel Nameservers (for Wildcard Domains)**
Change GoDaddy nameservers to:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

⚠️ **Before switching:** Copy any existing GoDaddy records (MX for email, TXT for verification) to **Vercel DNS Dashboard** first to prevent downtime.

#### Step 3 — SSL & Propagation
- **SSL:** Vercel auto-provisions a Let's Encrypt TLS certificate — no manual action needed
- **Propagation:** DNS changes take minutes–48 hours. Vercel shows a green ✓ when verified
- **WWW redirect (optional):** Vercel → Domains → Configure redirect from `www.hrishi.org.in` → `hrishi.org.in`

### Post-Deploy Verification
- [ ] All 6 pages render (Home, RSVP, Venue, Gallery, Blessings, Admin)
- [ ] RSVP form submission works — data stored in Vercel Blob
- [ ] Blessings API — submit a blessing, verify persistence
- [ ] Geo-restriction — test from India IP (200) and non-India IP (403)
- [ ] Admin page — navigate to `/admin/`, enter secret, download CSV
- [ ] Custom domain — HTTPS works, no mixed content warnings
- [ ] Service worker — registered, works offline
- [ ] Production Lighthouse audit (expect >90 scores)
- [ ] Real mobile device testing (Android + iOS)

---

*End of Implementation Roadmap*
