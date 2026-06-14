# Task List — साखरपुडा Engagement Invitation Website

> Updated: 14 June 2026
> Status: **Deployment complete — site live on hrishi.org.in.** Remaining: Production testing, Gallery refresh.

---

## Priority Legend

| Icon | Priority | Description |
|------|----------|-------------|
| 🔴 | **Critical** | Bug, broken feature, or security issue |
| 🟡 | **Important** | Missing feature from SRS, UX gap, or technical debt |
| 🟢 | **Enhancement** | Improvement, polish, or nice-to-have |
| ⚪ | **Cleanup** | Housekeeping, outdated files, documentation |

---

## ✅ Completed Tasks (All 17 Sprints)

### Sprint V — SonarQube Cloud Scan & Fixes ✅
- [x] Install `sonar-scanner` via Homebrew
- [x] Create `sonar-project.properties` for SonarCloud
- [x] Run initial SonarCloud scan — 18 issues found
- [x] Fix all 18 issues (commit `f83bdf3`)
- [x] Run SonarCloud cloud scan — 48 issues found
- [x] Fix 45 of 48 issues across 8 files
- [x] Fix 1 security hotspot (ReDoS in email regex)
- [x] 3 remaining issues accepted as tradeoffs
- [x] Create "Engagement Web Gate" quality gate (6 conditions)
- [x] Update `sonar-project.properties`
- [x] Final scan: **0 hotspots, 3 code smells**

### Sprint W — Quality Gate + Image Proxy ✅
- [x] Create custom quality gate via API
- [x] Add 6 conditions (security, reliability, maintainability, duplication, hotspots, vulnerabilities)
- [x] Associate with project (pending user UI action — free plan limitation)
- [x] Create image proxy endpoint `src/routes/api/images/[...path]/+server.ts`
- [x] Remove PII images from git + update `.gitignore`
- [x] Fix blob path (root level, not `images/` subdirectory)

### Sprint X — Adapter Switch & Domain Deploy ✅
- [x] Switch from `@sveltejs/adapter-static` → `@sveltejs/adapter-auto`
- [x] Add `hrishi.org.in` + `www.hrishi.org.in` in Vercel
- [x] Point DNS at GoDaddy (A + CNAME records)
- [x] Both domains verified, SSL auto-provisioned

### Sprint Y — Private Blob Store Fixes ✅
- [x] `access: 'public'` → `'private'` in Blessings + RSVP put() calls
- [x] Add `allowOverwrite: true` for blessings JSON overwrite
- [x] Replace all `fetch(blob.url)` with `getDownloadUrl(blob.url)` for signed URLs
- [x] Delete image proxy endpoint (no longer needed)
- [x] Re-upload images to public blob store for permanent URLs
- [x] Fix `og:image` meta tags — handle full blob URLs (ternary)
- [x] Update CSP — add `blob.vercel-storage.com` to `img-src`
- [x] Update `app.html` preload to full public blob URL

### Sprint A — Foundation ✅
- [x] SvelteKit project with static adapter
- [x] Project structure, TypeScript strict mode
- [x] SRS, Architecture, Tech Stack docs
- [x] Design system CSS (custom properties, typography, components)
- [x] RSVP backend — Vercel Blob CSV storage + admin download
- [x] RSVP deadline set to August 1, 2026
- [x] Page-specific meta descriptions (both languages)

### Sprint B — Core Pages ✅
- [x] Landing page with hero, invitation, countdown, contacts
- [x] Navigation header with mobile menu, Footer
- [x] RSVP form with validation + success animation (confetti)
- [x] Venue page with map deep links (Google, Apple, Mappls)
- [x] Gallery page with photo grid + Lightbox viewer
- [x] Blessings/messages section (localStorage + API)
- [x] 404 error page

### Sprint C — Interactive Features ✅
- [x] Countdown timer component (with Event Started celebration)
- [x] Add to Calendar (Google, Apple, Outlook)
- [x] Language toggle (Marathi/English) + i18n
- [x] WhatsApp share button (Web Share API)
- [x] Ctrl+L keyboard shortcut for language toggle

### Sprint D — Routing & Performance ✅
- [x] `trailingSlash: 'always'` — directory routes for static serving
- [x] WebP monogram: 54KB → 7.7KB (85.8% smaller)
- [x] Font & image preloading (FCP: 5.1s → 1.7s)
- [x] Lighthouse BP/SEO fix (both back to 100)
- [x] OG meta tags + Twitter cards

### Sprint E — Maps & Asset Cleanup ✅
- [x] Apple Maps Universal Links URL fix
- [x] Removed unused logo (15KB)

### Sprint F — Security Audit (Batch A-G) ✅
- [x] Server hardening (10 fixes): CORS, CSP, rate limiting, body size, HSTS
- [x] Admin auth: POST token-based (no password in URL)
- [x] CSRF origin validation + CORS restrict
- [x] CSV injection prevention + honeypot anti-spam
- [x] Created `docs/SECURITY_REVIEW.md`

### Sprint G — Robots.txt & Sitemap ✅
- [x] `robots.txt` — `Disallow: /admin/`, `/api/`
- [x] Auto-generated sitemap via `scripts/generate-sitemap.ts`
- [x] `prebuild` hook in package.json

### Sprint H — Blessings Server API ✅
- [x] `src/routes/api/blessings/+server.ts` — GET/POST
- [x] `src/lib/utils/blessings.ts` — client with anti-spam timer
- [x] Page fetches from API, falls back to localStorage
- [x] Honeypot, rate limiting (20/hr), body size limits

### Sprint I — CSS Token Audit & Pattern Extraction ✅
- [x] Extracted `.required`, `.photo-count-badge`, `.form-honeypot` to global CSS
- [x] Replaced hardcoded font-sizes with `--text-4xl`, `--text-5xl`
- [x] Added `--color-*-rgb` variables, replaced 16 hardcoded rgba()
- [x] Renamed Monogram `@keyframes float` → `monogramFloat`
- [x] Created `docs/CSS_CONVENTIONS.md`

### Sprint J — PWA & Service Worker ✅
- [x] SvelteKit-integrated SW (`$service-worker` module)
- [x] Pre-cache all build + static assets at install
- [x] Stale-while-revalidate for navigations, cache-first for assets
- [x] Network-first for API, offline fallback to home page
- [x] SW auto-update + stale cleanup guard + update toast

### Sprint K — Accessibility Fixes ✅
- [x] Language toggle: 48×48px touch target
- [x] Decorative ARIA fix (`aria-hidden` vs `aria-label`)
- [x] Nav logo accessible name fix
- [x] Color contrast: `#7B837D` → `#6B726D` (4.94:1)

### Sprint L — Gallery & Lightbox ✅
- [x] Google Drive API fetch script
- [x] 2 real photos from Drive (replaced sample SVGs)
- [x] Lightbox event propagation fix (nav buttons closing)

### Sprint M — SW Dev-Mode Fix ✅
- [x] `location.port !== '5173'` guard for SW registration
- [x] `__SVELTEKIT_APP_VERSION__` fix

### Sprint N — Dependency & Caching Audit ✅
- [x] npm audit — 0 critical/high, 4 low (cookie CVE, not exploitable)
- [x] All deps verified at latest npm registry versions
- [x] `vercel.json` — 4 header rules with duplicated security headers

### Sprint O — Deployment ✅
- [x] GitHub repo created, code pushed
- [x] Vercel import + env vars configured
- [x] Domain `hrishi.org.in` configured, DNS pointed
- [x] Adapter switched to adapter-auto
- [x] Images migrated to Vercel Blob
- [x] Private blob store fixes complete

---

## 📋 Remaining Tasks

### 🧪 Testing
| # | Task | Priority | Notes |
|---|------|----------|-------|
| **6.3** | Real device testing | 🟡 Medium | Mid-range Android + iPhone |
| **6.4** | RSVP end-to-end test | 🟡 Medium | Fill form, submit, verify stored data |
| **6.6** | Production Lighthouse re-audit | 🟢 Low | Current 66 is localhost; production should be higher |

### 📸 Gallery
| # | Task | Priority | Notes |
|---|------|----------|-------|
| **7.1** | Upload more photos | 🟢 Low | To shared Drive folder |
| **7.2** | Run `build:photos` | 🟢 Low | `GOOGLE_DRIVE_API_KEY=xxx npm run build:photos` |
| **7.3** | Rebuild | 🟢 Low | `npm run build` after fetching |

---

## 🎯 Lighthouse Scores (Latest)

Measured on localhost with Lighthouse 13.4.0 (no CDN, no compression). Production scores expected higher.

| Page | Perf | A11y | BP | SEO |
|------|:----:|:----:|:--:|:---:|
| Home | **66** | **100** | **100** | **100** |

---

## 📁 Project Files

| File | Description |
|------|-------------|
| `src/service-worker.js` | SvelteKit-integrated SW (pre-caches, stale-while-revalidate) |
| `src/app.html` | HTML shell: OG tags, preloads, SW registration, cleanup, toast |
| `svelte.config.js` | Adapter-auto (Vercel) with `trailingSlash: 'always'`, `handleHttpError` |
| `vercel.json` | Deployment config: CSP, HSTS, cache headers (4 rules) |

---

*End of Task List — 14 June 2026 — 17 sprints complete, 3 remaining tasks (testing)*
