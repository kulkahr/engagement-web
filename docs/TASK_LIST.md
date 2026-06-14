# Task List — साखरपुडा Engagement Invitation Website

> Updated: 16 June 2026
> Status: **All 14 sprints complete.** Remaining: Deployment, Production testing, Gallery refresh.

---

## Priority Legend

| Icon | Priority | Description |
|------|----------|-------------|
| 🔴 | **Critical** | Bug, broken feature, or security issue |
| 🟡 | **Important** | Missing feature from SRS, UX gap, or technical debt |
| 🟢 | **Enhancement** | Improvement, polish, or nice-to-have |
| ⚪ | **Cleanup** | Housekeeping, outdated files, documentation |

---

## ✅ Completed Tasks (All 16 Sprints)

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

### Sprint W — Quality Gate Configuration ✅
- [x] Create custom quality gate via API
- [x] Add 6 conditions (security, reliability, maintainability, duplication, hotspots, vulnerabilities)
- [x] Associate with project (pending user UI action — free plan limitation)

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
- [x] Cleaned up `.gitignore` (Apple `.DS_Store`, `._*` files)
- [x] Deleted stale design system files and `._*` artifacts

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
- [x] E2E verification: all 6 pages, OG tags, canonicals

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
- [x] Broken image URL fix (303 warning → real JPEG thumbnail)

### Sprint M — SW Dev-Mode Fix ✅
- [x] `location.port !== '5173'` guard for SW registration
- [x] `__SVELTEKIT_APP_VERSION__` — killed stale dev server, regenerated `.svelte-kit` types

### Sprint N — Dependency & Caching Audit ✅
- [x] npm audit — 0 critical/high, 4 low (cookie CVE, not exploitable)
- [x] All 10 dependencies verified at latest npm registry versions
- [x] `vercel.json` — 4 header rules with duplicated security headers
- [x] Immutable 1yr for assets, no-cache for SW, default for HTML
- [x] Lighthouse 13.4.0 audit — localhost metrics documented
- [x] Added cookie CVE (T8) to SECURITY_REVIEW.md

---

## 📋 Remaining Tasks

### 🚀 Deployment

#### 5.1 — Push to GitHub & Import in Vercel
| # | Task | Priority | Notes |
|---|------|----------|-------|
| **5.1a** | Create GitHub repo | 🔴 High | e.g., `engagement-web`, private or public |
| **5.1b** | Push code | 🔴 High | `git remote add origin <url> && git push -u origin main` |
| **5.1c** | Import in Vercel | 🔴 High | [Vercel Dashboard](https://vercel.com/new) → Import Git Repo → Select repo → Framework preset: SvelteKit |
| **5.1d** | Set env vars in Vercel | 🔴 High | Settings → Environment Variables: `BLOB_READ_WRITE_TOKEN` (Vercel Blob), `RSVP_ADMIN_SECRET` (your choice), `GOOGLE_DRIVE_API_KEY` (optional, for gallery builds) |

#### 5.2 — Configure Custom Domain (`hrishi.org.in`)
| Step | Where | What To Do |
|------|-------|------------|
| **5.2a** | Vercel → Project Settings → Domains | Add `hrishi.org.in` and `www.hrishi.org.in` — Vercel will show the required DNS config |
| **5.2b** | GoDaddy → DNS Settings | **Choose ONE method below:** |
| | | |
| | **Option A: A/CNAME Records (simpler, keep DNS at GoDaddy)** | |
| | GoDaddy DNS: A Record | Point `@` (apex) → `76.76.21.21` (Vercel's IP) |
| | GoDaddy DNS: CNAME Record | Point `www` → `cname.vercel-dns.com` |
| | Remove any old A/AAAA/CNAME records for `@` or `www` | Avoid conflicts |
| | | |
| | **Option B: Vercel Nameservers (required for wildcard domains)** | |
| | GoDaddy → Domain Settings → Nameservers | Change to: `ns1.vercel-dns.com`, `ns2.vercel-dns.com` |
| | **⚠️ Before switching nameservers**, copy existing GoDaddy DNS records (MX, TXT, etc.) to Vercel DNS dashboard first | Prevents downtime for email, etc. |
| | | |
| **5.2c** | Wait for propagation | DNS can take minutes–48 hours; Vercel shows ✓ green when verified |
| **5.2d** | Vercel auto-provisions SSL | No manual action — Vercel issues TLS cert automatically via Let's Encrypt |
| **5.2e** | Configure redirects (optional) | Vercel → Domains → `www.hrishi.org.in` → Redirect to `hrishi.org.in` (or vice versa) |
| **5.2f** | Update `allowedOrigins` in config.ts if needed | Already updated to include both `hrishi.org.in` and `www.hrishi.org.in` ✅ |

#### 5.3 — Post-Deploy Verification
| # | Task | Priority | Notes |
|---|------|----------|-------|
| **5.3a** | Verify all pages render | 🔴 High | Navigate all 6 pages, check no 404s |
| **5.3b** | Test geo-restriction | 🟡 Medium | India IP works, non-India gets 403 |
| **5.3c** | Test RSVP form submission | 🔴 High | Fill form, submit, verify data in Vercel Blob |
| **5.3d** | Test Blessings API | 🟡 Medium | Submit a blessing, verify it persists |
| **5.3e** | Test admin page CSV download | 🟡 Medium | Navigate to `/admin/`, enter secret, download |
| **5.3f** | Run production Lighthouse audit | 🟢 Low | Should be significantly higher than localhost 66 |

### 🧪 Testing
| # | Task | Priority | Notes |
|---|------|----------|-------|
| **6.3** | Real device testing | 🟡 Medium | Mid-range Android + iPhone |
| **6.4** | RSVP end-to-end test | 🟡 Medium | Fill form, submit, verify stored data |
| **6.5** | Language toggle test | 🟢 Low | All pages both languages, localStorage persistence |
| **6.6** | Production Lighthouse re-audit | 🟢 Low | Current 66 is localhost; production should be higher |

### 📸 Gallery
| # | Task | Priority | Notes |
|---|------|----------|-------|
| **7.1** | Upload more photos | 🟢 Low | To shared Drive folder |
| **7.2** | Run `build:photos` | 🟢 Low | `GOOGLE_DRIVE_API_KEY=xxx npm run build:photos` |
| **7.3** | Rebuild | 🟢 Low | `npm run build` after fetching |

### 🔧 Local Setup
| # | Task | Priority | Notes |
|---|------|----------|-------|
| **8.1** | Create `.env` with `BLOB_READ_WRITE_TOKEN` | 🟢 Low | Required for blessings API in dev mode |
| **8.2** | Set `RSVP_ADMIN_SECRET` | 🟢 Low | Required for admin page access |

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
| `src/app.css` | Design system + @font-face + keyframes |
| `vercel.json` | Deployment config: CSP, HSTS, cache headers (4 rules) |
| `svelte.config.js` | Adapter-static with `trailingSlash: 'always'` |
| `docs/SRS.md` | Software requirements specification |
| `docs/ARCHITECTURE.md` | System architecture document |
| `docs/ROADMAP.md` | Sprint plan (1–14 complete) |
| `docs/SECURITY_REVIEW.md` | Security audit (17 fixes + T8 cookie CVE) |
| `docs/TECH_STACK.md` | Technology stack analysis with performance budget |
| `docs/CSS_CONVENTIONS.md` | Animation keyframe conventions |
| `docs/COST.md` | Cost estimation (free tier sufficient) |
| `docs/SESSION_CONTEXT.md` | Session tracking (all sprints documented) |

---

*End of Task List — 16 June 2026 — 14 sprints complete, 8 remaining tasks (deployment/testing/setup)*
