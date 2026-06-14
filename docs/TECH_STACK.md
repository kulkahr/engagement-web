# Technology Stack Analysis
## Maharashtrian Engagement Invitation Web Application

---

## 1. Final Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | **SvelteKit** | 2.x | Minimal JS, excellent DX, static export, Svelte 5 runes |
| Language | **TypeScript** | 6.x | Type safety, better DX, catches errors at build time |
| Styling | **Vanilla CSS** | — | Zero runtime, no build dependency, full control, smallest bundle |
| Adapter | **@sveltejs/adapter-auto** (adapter-vercel on Vercel) | 7.x | Auto-detects Vercel, serverless functions for API routes + static pages |
| Hosting | **Vercel** (Edge Middleware) | — | Free tier, global CDN, geo-restriction, Blob storage |
| RSVP Storage | **Vercel Blob** (CSV) | — | Serverless, append-only, easy download |
| Photo Source | **Google Drive** (API v3) | — | Free, already in user's ecosystem, build-time fetch |
| Fonts | **Noto Serif Devanagari** (self-hosted) | — | Zero external requests, privacy, offline-capable |
| Maps | **Universal Links** (https://) | — | Zero JS, native app UX, works offline, cross-platform |
| PWA | **SvelteKit Service Worker** ($service-worker) | — | Pre-caches all build assets, stale-while-revalidate |
| Blessings Storage | **Vercel Blob** (JSON) | — | Same blob token as RSVP, private access, rate-limited POST |
| Sitemap | **Auto-generated** (`scripts/generate-sitemap.ts`) | — | Prebuild hook scans routes, generates hreflang-aware sitemap.xml |
| Image Storage | **Vercel Blob** (public store) | — | Permanent public URLs, no proxy endpoint needed |

---

## 2. Frontend Framework Comparison

| Criteria | SvelteKit | Astro | Next.js | Vanilla |
|----------|-----------|-------|---------|---------|
| Bundle size | Tiny (~5KB runtime) | Minimal (zero JS islands) | Medium (~70KB React) | Minimal |
| Build speed | Fast | Fastest | Moderate | N/A (no build) |
| Static export | ✅ Excellent | ✅ Native | ✅ Good | ✅ Default |
| SW integration | ✅ Built-in ($service-worker) | ⚠️ Manual | ⚠️ Manual | ❌ |
| TypeScript support | ✅ Native | ✅ Native | ✅ Native | ⚠️ Manual |
| Component model | ⭐ Svelte 5 runes | ⭐ Multi-framework | ⭐ React | ❌ None |
| Learning curve | Low | Low | Medium | None |
| Community size | Medium | Fast growing | Largest | N/A |
| Hot module reload | ✅ Excellent | ✅ Good | ✅ Good | ❌ |
| SEO | ✅ Pre-rendered | ✅ Pre-rendered | ✅ Hybrid | ✅ Manual |

**Winner: SvelteKit** — chosen by user, excellent static export, tiny bundles, great DX with Svelte 5 runes, built-in SW support.

---

## 3. Backend/Storage Comparison

| Criteria | Vercel Blob + CSV | Supabase | Firebase | Cloudflare KV |
|----------|------------------|----------|----------|---------------|
| Cost | Free (10GB) | Free tier (500MB DB) | Free tier (1GB) | Free tier |
| Setup complexity | Minimal | Medium | Medium | Low |
| RSVP export | ✅ Direct CSV download | ✅ SQL query | ⚠️ JSON | ⚠️ KV export |
| Portability | ✅ Max | ⚠️ Vendor lock | ⚠️ Vendor lock | ⚠️ Vendor lock |
| Security | ✅ Origin validation + honeypot | ✅ Built-in | ✅ Built-in | ⚠️ Manual |

**Winner: Vercel Blob + CSV** — simplest, most portable, zero cost, directly downloadable.

---

## 4. Font Loading Comparison

| Criteria | Self-Hosted (chosen) | Google Fonts CDN | System Fonts |
|----------|---------------------|-----------------|--------------|
| External requests | ✅ **Zero** — served from own CDN | ❌ 2+ external requests | ✅ Zero |
| Privacy | ✅ **No data sent to Google** | ❌ User IP sent to Google | ✅ Private |
| Offline support | ✅ **Works offline via SW** | ❌ Requires network | ✅ Always available |
| Design control | ✅ **Full typographic control** | ✅ Good | ⚠️ Limited |
| Load time | ✅ **Preloaded in HTML** | ⚠️ Blocking render | ✅ Instant |
| Customization | ✅ **4 weights (400/500/600/700)** | ✅ Same selection | ❌ Fixed weights |

**Winner: Self-Hosted** — zero external requests, privacy, offline-capable, preloaded for fast FCP.

---

## 5. Service Worker Strategy Options

| Criteria | SvelteKit-integrated (chosen) | Static SW file | Workbox |
|----------|------------------------------|---------------|---------|
| Pre-cache hashed assets | ✅ **Yes** — via `$service-worker.build` | ❌ No — hash names unknown at authoring time | ✅ Yes — via manifest |
| Cache naming | ✅ **Auto-busts on deploy** via `version` | ⚠️ Manual versioning | ✅ Auto |
| Setup complexity | ✅ **Minimal** — just create file | ✅ Simple | ⚠️ Moderate |
| SvelteKit integration | ✅ **Native** | ❌ No integration | ⚠️ Manual config |

**Winner: SvelteKit-integrated** — native `$service-worker` module, auto-versioned, pre-caches all build assets.

---

## 6. Map Integration Comparison

| Criteria | Universal Links https:// (chosen) | Custom URL scheme maps:// | Embedded JS map |
|----------|----------------------------------|---------------------------|-----------------|
| iOS native app | ✅ **Opens Apple Maps app** | ⚠️ Legacy, deprecated | ❌ No |
| Android/Desktop | ✅ **Falls back to web** | ❌ Fails silently | ✅ Works everywhere |
| Cross-platform | ✅ **Works on all devices** | ❌ iOS-only | ✅ Works everywhere |
| JS overhead | ✅ **Zero** | ✅ Zero | ❌ Heavy (Leaflet, etc.) |
| Offline | ✅ **Via SW cached pages** | ✅ Via SW | ❌ Requires JS |

**Winner: Universal Links (https://)** — Apple's modern recommended format, works cross-platform, zero JS overhead.

---

## 7. Performance Budget

> Metrics measured via Lighthouse 13.4.0 on `vite preview` (localhost, no CDN/compression).
> Production on Vercel CDN will yield better FCP/LCP due to edge caching, HTTP/2, and Brotli compression.

| Metric | Target | Current Status |
|--------|--------|----------------|
| JS Bundle | < 50KB gzipped | ✅ ~30KB |
| CSS | < 20KB gzipped | ✅ Passes |
| FCP | < 1.0s | ⚠️ **4.3s** (localhost, no CDN; preloaded fonts) |
| LCP | < 1.5s | ⚠️ **6.9s** (monogram, localhost no CDN) |
| TTI | < 2.0s | ⚠️ **6.9s** (matches LCP, 0ms TBT) |
| CLS | < 0.05 | ✅ **0.000** (perfect, no layout shift) |
| TBT | < 50ms | ✅ **0ms** (no long tasks) |
| Bootup Time | — | ✅ **102ms** (minimal JS execution) |
| Total Byte Weight | < 1MB | ✅ **988KB** (passes, mostly fonts) |
| Server Response | < 200ms | ✅ **6ms** (vite preview) |
| Lighthouse Performance | ≥ 95 | ⚠️ **66** (localhost — no CDN, no cache headers) |
| Lighthouse Accessibility | ≥ 95 | ✅ **100** |
| Lighthouse Best Practices | ≥ 95 | ✅ **100** |
| Lighthouse SEO | ≥ 100 | ✅ **100** |

### Performance Observations

- **Fonts dominate byte weight**: Noto Serif Devanagari font files account for the bulk of the 988KB total. In production, Vercel CDN serves these with Brotli compression and `Cache-Control: immutable`.
- **No render-blocking resources**: All critical JS/CSS is inlined or preloaded. The 4.3s FCP is from font loading on a cold localhost connection.
- **Perfect CLS (0.000)**: No layout shift — images have explicit dimensions, fonts use `font-display: swap`.
- **Zero long tasks**: 0ms TBT confirms minimal client JS overhead.

> **Note**: The previous 100 Lighthouse score was from a production deployment with CDN. The current 66 score reflects local testing without CDN benefits. Re-audit after deploying to Vercel for production benchmarks.

## 8. Accessibility Baseline (WCAG 2.1 AA)

| Requirement | Status | Measure |
|-------------|--------|---------|
| Color contrast 4.5:1 | ✅ Passes | `--color-text-muted`: #6B726D (4.94:1 on white) |
| Touch targets 48×48px | ✅ Passes | Language toggle: 48×48, nav items: sufficient spacing |
| ARIA attributes | ✅ Correct | Decorative elements use `aria-hidden`, interactive elements have proper labels |
| Focus indicators | ✅ Passes | `:focus-visible` with 2px outline |
| Keyboard navigation | ✅ Passes | Ctrl+L shortcut, all links/buttons focusable |
| Screen reader | ✅ Passes | Semantic HTML, proper heading hierarchy, ARIA labels |
| Reduced motion | ✅ Passes | `prefers-reduced-motion` media query disables animations |

---

## 9. Key Technical Decisions

### Decision 1: Static Export over SSR
- **Why:** Zero server cost, CDN delivery, no cold starts, best performance
- **Trade-off:** RSVP requires separate edge function + storage

### Decision 2: Vanilla CSS over Tailwind
- **Why:** Zero build dependency, smaller bundle, complete control
- **Trade-off:** More manual CSS, no utility class convenience

### Decision 3: Google Drive over Cloudinary
- **Why:** Zero cost, already in user's ecosystem, no API limits for reading
- **Trade-off:** Build-time fetch (not real-time), no auto-compression

### Decision 4: CSV over Database
- **Why:** Simplicity, portability, human-readable, zero infrastructure
- **Trade-off:** No real-time querying, concurrent write considerations

### Decision 5: Universal Links over Custom URL Schemes
- **Why:** Apple's modern recommended format, works cross-platform
- **Trade-off:** iOS 15+ only for Universal Links (older devices fall back to web)

### Decision 6: Self-Hosted Fonts over Google Fonts CDN
- **Why:** Privacy, offline support, zero external requests, faster load
- **Trade-off:** Larger initial bundle (4 font weights), manual subsetting needed

### Decision 7: SvelteKit SW over Static SW
- **Why:** Auto-versioned, pre-caches hashed build assets, zero manual sync
- **Trade-off:** Requires SW in `src/` directory (processed by Vite), not `static/`

### Decision 8: Auto-generated Sitemap over Manual
- **Why:** Scans `src/routes/` for `+page.svelte` files, generates proper XML with hreflang alternates for Marathi/English. Zero manual sync when adding routes.
- **Trade-off:** Requires `tsx` dependency for script execution. Runs as `prebuild` hook so build fails if sitemap generation fails.

### Decision 9: Vercel Blob JSON for Blessings over Database
- **Why:** Same infrastructure as RSVP CSV (single `BLOB_READ_WRITE_TOKEN`), append-only pattern, no new dependencies. Blessings are public read, write is rate-limited.
- **Trade-off:** Not relational — cannot query by date or user. Full JSON blob is read and rewritten on each submission (acceptable for low traffic).
- **Private access:** Data blobs use `access: 'private'` to work with private blob stores. Reads use `getDownloadUrl()` for signed URLs.

### Decision 10: Public Blob Store for Images over Proxy
- **Why:** Images don't need authentication — permanent public URLs simplify architecture and eliminate the proxy endpoint.
- **Trade-off:** Requires separate public blob store. Two `BLOB_READ_WRITE_TOKEN` values in the project.
- **How it works:** Images are uploaded with `access: 'public'` to a public store. The resulting URLs are set as `PUBLIC_IMAGE_*` env vars and used directly in `<img>` tags.

---

*End of Tech Stack Analysis — Updated 14 June 2026 — Performance metrics measured on localhost (no CDN).*
