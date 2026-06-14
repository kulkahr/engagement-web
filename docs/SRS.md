# Software Requirements Specification (SRS)
## Maharashtrian "साखरपुडा" (Engagement) Invitation Web Application

---

**Document Version:** 1.1  
**Last Updated:** 16 June 2026  
**Status:** ✅ **All functional requirements implemented**  
**Prepared for:** Engagement Invitation Project  

---

## 1. Executive Summary

This document defines the software requirements for a lightweight, production-ready engagement invitation web application for a Maharashtrian "साखरपुडा" ceremony. The application is designed to be a static-first, serverless-deployable web platform that elegantly displays invitation details, manages RSVPs via CSV storage, integrates venue maps, and displays a photo gallery sourced from Google Shared Drive.

The primary goal is to deliver a premium user experience with extremely low hosting costs, minimal operational complexity, and excellent performance on Indian mobile networks. The system uses SvelteKit with static export, deploys to platforms like Vercel/Cloudflare Pages, and has zero traditional database dependency.

---

## 2. Product Vision

To create the most elegant, performant, and cost-effective digital engagement invitation platform that respects Maharashtrian cultural aesthetics while providing modern digital convenience for guests and the hosting family.

**Core Values:**
- Cultural authenticity without compromising modern UX
- Zero operational friction for the hosting family
- Delightful experience for every guest, regardless of technical proficiency
- Sustainable low-cost operation

---

## 3. User Personas

### 3.1. Primary Guest (Aajoba / Kaki / Cousin)
- **Age:** 18–75
- **Device:** Smartphone (Android/iOS), often mid-range
- **Network:** Jio/Airtel 4G, sometimes slow/unstable
- **Tech skills:** Can use WhatsApp, Google Maps. May not understand complex web interactions
- **Goals:** View invitation details, find venue location, RSVP, see event photos
- **Pain points:** Slow loading pages, complex navigation, Marathi language not supported

### 3.2. Tech-Savvy Guest (NRI Cousin / Friend)
- **Device:** Latest smartphone or laptop
- **Network:** High-speed broadband or 5G
- **Goals:** Quick RSVP, share gallery with family, navigate venue easily
- **Expectations:** Smooth animations, instant loading, premium feel

### 3.3. Event Host (Family Organizer)
- **Device:** Smartphone + Laptop
- **Techno-graphic:** Basic technical literacy
- **Goals:** Simple RSVP management (CSV export), easy photo moderation, zero maintenance
- **Pain points:** Complex admin panels, database management, technical troubleshooting

### 3.4. Event Photographer
- **Device:** Professional camera + Smartphone
- **Goals:** Upload high-quality photos to Google Drive shared folder
- **Needs:** Simple upload workflow, no additional account setup

---

## 4. Functional Requirements — Implementation Status

| ID | Requirement | Status | Notes |
|----|------------|--------|-------|
| **FR-01** | **Invitation Landing Page** | ✅ Complete | |
| FR-01a | Couple's names in Marathi and English | ✅ | `content.ts` bilingual data |
| FR-01b | Ceremony date, time, venue | ✅ | Event details in `event.ts` |
| FR-01c | Marathi invitation verse (श्लोक/ओवी) | ✅ | Displayed in hero section |
| FR-01d | Family names and host details | ✅ | Contact section in footer |
| FR-01e | Countdown timer | ✅ | `CountdownTimer.svelte` with celebration state |
| FR-01f | "Add to Calendar" button | ✅ | `AddToCalendar.svelte` (Google, Apple, Outlook) |
| FR-01g | Responsive design | ✅ | Mobile-first, all breakpoints |
| | | | |
| **FR-02** | **Event Details Page** | ⚠️ Merged into Home page | Event schedule + venue is on homepage |
| FR-02a | Complete event schedule | ✅ | Displayed on landing page |
| FR-02b | Venue address with map buttons | ✅ | `/venue/` page with deep links |
| FR-02c | Dress code information | ✅ | In event details |
| FR-02d | Contact information | ✅ | Footer with phone/email |
| | | | |
| **FR-03** | **Venue & Maps** | ✅ Complete | `/venue/` page |
| FR-03a | Google Maps deep link | ✅ | `maps.ts` → `https://www.google.com/maps/dir/` |
| FR-03b | Apple Maps deep link | ✅ | `https://maps.apple.com/` (Universal Links) |
| FR-03c | Mappls/MapMyIndia deep link | ✅ | `https://maps.mappls.com/` |
| FR-03d | Fallback to web view | ✅ | Universal Links fall back on desktop |
| FR-03e | Address with copy-to-clipboard | ✅ | Venue address display |
| FR-03f | Static map thumbnail | ✅ | Embedded Google Maps static view |
| | | | |
| **FR-04** | **RSVP Management** | ✅ Complete | `/rsvp/` page + `/api/rsvp` endpoint |
| FR-04a | Form fields (Name, Phone, Email, Guests, Message) | ✅ | India phone validation |
| FR-04b | Guest name entry per person | ✅ | Dynamic guest list |
| FR-04c | Accept/Decline options | ✅ | Radio buttons |
| FR-04d | Dietary preferences (optional) | ✅ | Message field |
| FR-04e | CSV storage | ✅ | Vercel Blob append |
| FR-04f | Animated success confirmation | ✅ | Confetti + success card |
| FR-04g | Anti-spam (honeypot, rate limit, timestamp) | ✅ | 5/hr/IP, 2s min, honey pot |
| FR-04h | Deadline enforcement | ✅ | August 1, 2026 |
| | | | |
| **FR-05** | **Photo Gallery** | ✅ Complete | `/gallery/` page |
| FR-05a | Google Drive photo loading | ✅ | Build-time fetch via Drive API v3 |
| FR-05b | Thumbnail grid with lazy loading | ✅ | CSS grid + `loading="lazy"` |
| FR-05c | Lightbox viewer | ✅ | `Lightbox.svelte` (prev/next/close) |
| FR-05d | Responsive grid | ✅ | CSS grid with `auto-fill` |
| FR-05e | Auto-refresh on new photos | ⚠️ Partial | Re-run `build:photos` → rebuild |
| FR-05f | EXIF data stripped | ✅ | Google Drive thumbnails strip EXIF |
| | | | |
| **FR-06** | **Blessings / Messages** | ✅ Complete | `/blessings/` page + `/api/blessings` |
| FR-06a | Display well-wishes | ✅ | Server API + localStorage fallback |
| FR-06b | Simple message board | ✅ | Card layout with count badge |
| | | | |
| **FR-07** | **Admin Features** | ✅ Complete | `/admin/` page |
| FR-07a | RSVP CSV export | ✅ | Download via `/api/rsvp/download` |
| FR-07b | Password-protected admin | ✅ | POST token-based auth (HMAC, 5-min expiry) |

---

## 5. Non-Functional Requirements

### NFR-01: Performance
- Lighthouse Performance score: ≥ 95
- First Contentful Paint (FCP): < 1.5 seconds on 3G
- Largest Contentful Paint (LCP): < 2.5 seconds
- Cumulative Layout Shift (CLS): < 0.05
- Time to Interactive (TTI): < 3.5 seconds on 3G
- Total bundle JavaScript: < 50KB (gzipped)
- Total CSS: < 20KB (gzipped)

### NFR-02: Availability
- Uptime: ≥ 99.9% (via CDN static hosting)
- No single point of failure in the serving path
- Global CDN distribution

### NFR-03: Scalability
- Handle 100 concurrent visitors with zero degradation
- Handle 10,000 visitors in a day (viral spike) efficiently
- Zero backend server scaling concerns

### NFR-04: Reliability
- Graceful degradation if Google Drive API is unavailable
- RSVP form local validation before submission
- Offline-capable display of previously loaded content

### NFR-05: Mobile Optimization
- Touch-friendly tap targets (minimum 44x44px)
- Mobile-first responsive design (320px to 768px optimized)
- No horizontal scrolling
- Font sizes: minimum 16px on mobile inputs to prevent zoom

### NFR-06: Browser Compatibility
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Samsung Internet (latest 2 versions)
- iOS Safari (latest 2 versions)

### NFR-07: Accessibility
- WCAG 2.1 AA compliance
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels on interactive elements
- Sufficient color contrast (4.5:1 for normal text, 3:1 for large text)
- Keyboard navigable
- Screen reader friendly
- Focus indicators visible

### NFR-08: Internationalization
- Primary language: Marathi (मराठी)
- Secondary language: English
- Script: Devanagari for Marathi
- Language toggle available in UI
- Date/time formatting per Indian locale

---

## 6. Performance Targets

| Metric | Target | Measurement Tool |
|--------|--------|-----------------|
| Lighthouse Performance | ≥ 95 | Lighthouse CLI/DevTools |
| Lighthouse Accessibility | ≥ 95 | Lighthouse CLI/DevTools |
| Lighthouse Best Practices | ≥ 95 | Lighthouse CLI/DevTools |
| Lighthouse SEO | ≥ 100 | Lighthouse CLI/DevTools |
| First Contentful Paint | < 1.0s (lab), < 1.5s (field) | WebPageTest, RUM |
| Largest Contentful Paint | < 1.5s (lab), < 2.5s (field) | WebPageTest, RUM |
| Cumulative Layout Shift | < 0.05 | Lighthouse |
| Total Blocking Time | < 50ms | Lighthouse |
| Time to Interactive | < 2.0s | Lighthouse |
| JS Bundle Size | < 50KB gzipped | bundlephobia, source-map-explorer |
| CSS Bundle Size | < 20KB gzipped | source-map-explorer |
| Total Page Weight | < 500KB (including images) | WebPageTest |
| Image Load Time | < 2s on 3G | Network throttle testing |

---

## 7. Security Requirements

### SEC-01: Upload Abuse Prevention
- No direct upload support (photos from Google Drive only)
- RSVP form: honeypot field detection
- RSVP form: rate limiting via session timestamp

### SEC-02: Spam Protection (RSVP)
- Hidden honeypot field (invisible to real users)
- Minimum time threshold between form render and submission (2 seconds)
- Maximum submission rate per IP (via edge-level rate limiting if available)
- CAPTCHA-free approach to minimize friction

### SEC-03: Data Privacy
- No tracking cookies (GDPR-friendly)
- Minimal data collection (only what's needed for RSVP)
- Phone numbers not displayed publicly
- No third-party analytics (optional privacy-focused analytics)
- HTTPS enforced at CDN level

### SEC-04: Content Security
- Strict CSP headers configured at CDN level
- XSS prevention via output encoding
- No inline scripts (use nonces or hashes)
- Subresource Integrity for external scripts

### SEC-05: CSRF Prevention
- Form origin validation (check Referer/Origin header)
- Double-submit cookie pattern for RSVP form
- State-changing requests require unpredictable values

---

## 8. Hosting Constraints

- Must deploy on free-tier static hosting: Vercel (Hobby), Cloudflare Pages (Free), or Netlify (Free)
- No server-side runtime (fully static export)
- Build output to /build or /dist directory
- Zero cold starts (static files served from CDN)
- Maximum build output size: < 250MB (well under free tier limits)
- CDN edge caching for all assets with long cache TTLs

---

## 9. Scalability Requirements

### SC-01: Traffic Handling
- Base load: ~100 unique visitors over event duration
- Expected peak: ~500 visitors on invitation send day
- Spike scenario: ~5,000–10,000 visitors (viral on WhatsApp)
- Architecture must handle 100x normal load without degradation

### SC-02: Cost Scaling
- Near-zero cost at all expected traffic levels
- No per-request pricing dependency
- No concurrent connection limits

---

## 10. Mobile UX Requirements

### MUX-01: Touch Optimization
- Minimum tap target: 44x44px (Apple HIG / Material Design)
- Touch feedback (visual on tap)
- Swipe gestures for gallery navigation
- No hover-dependent UI elements

### MUX-02: Network Resilience
- Skeleton loading states for gallery images
- Graceful failure messages for RSVP submission
- Retry mechanism for failed submissions

### MUX-03: Mobile Features
- "Add to Home Screen" (PWA manifest)
- Share button for WhatsApp sharing
- Click-to-call for contact numbers
- Native map app deep links

---

## 11. Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Google Chrome | 90+ |
| Mozilla Firefox | 90+ |
| Apple Safari | 15+ |
| Samsung Internet | 17+ |
| iOS Safari | 15+ |
| Android WebView | 90+ |

Polyfills required: None (modern SvelteKit output targets es2017+)

---

## 12. Accessibility Requirements

### A11Y-01: Semantic HTML
- Use proper landmark elements (`<main>`, `<nav>`, `<footer>`)
- Heading levels in correct order
- Form inputs with associated `<label>` elements
- Use `<button>` for actions, `<a>` for navigation

### A11Y-02: ARIA
- `aria-label` on icon-only buttons
- `aria-live` for dynamic content updates
- `role="alert"` for error messages
- `aria-expanded` for collapsible sections

### A11Y-03: Visual
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text
- Focus visible outlines (not just browser defaults)
- Text resizing up to 200% without loss of functionality
- Support prefers-reduced-motion

---

## 13. Internationalization Considerations

### I18N-01: Language Support
- Default: Marathi (Devanagari script)
- Toggle to English
- All static text in both languages
- Dates: Indian format (DD/MM/YYYY) and Marathi calendar references

### I18N-02: Typography
- Marathi: Noto Sans Devanagari or similar
- English: System font stack for performance
- Proper font-display: swap or optional
- Subset fonts to include only Devanagari + Latin characters needed

---

## 14. Architecture Constraints

- **Static-first:** All pages pre-rendered at build time
- **No database:** RSVP stored as CSV file (appended via edge function or API)
- **No authentication** for guest users
- **Minimal JavaScript:** Use Svelte's compile-time optimization
- **Zero runtime dependencies** beyond Svelte
- **CDN as application server:** All assets static, served from edge

---

## 15. Cost Optimization Strategy

| Component | Strategy | Estimated Monthly Cost |
|-----------|----------|----------------------|
| Hosting | Vercel Hobby / Cloudflare Pages Free | $0 |
| Domain | .com/.in domain (~$10/year) | ~$0.83/mo |
| RSVP Storage | CSV file in repo or Cloudflare KV | $0 |
| Photo Storage | Google Drive (15GB free) | $0 |
| CDN | Built-in to hosting platform | $0 |
| **Total** | | **~$0.83/mo** |

---

## 16. Privacy Requirements

- No analytics scripts that fingerprint users
- No third-party tracking
- Google Drive embeds use minimal scope
- RSVP data: name, phone, guest count, message (no unnecessary collection)
- Data retention: RSVP data accessible to host during and after event
- Right to deletion: Contact host to remove data
- No cookies except essential (session-less architecture)

---

## 17. Image Loading Flow (Google Drive)

```
[Photographer uploads to Google Drive Shared Folder]
     |
     v
[Google Drive Shared Folder contains event photos]
     |
     v
[Build-time or runtime fetch via Google Drive API / Direct Links]
     |
     v
[Photos displayed in gallery with lazy loading]
     |
     v
[Thumbnails generated via imgproxy or Google Drive thumbnail API]
     |
     v
[CDN cached on first request]
```

**Implementation options:**
1. **Static approach:** Download photos at build time, process thumbnails, ship with static export
2. **Runtime approach:** Use Google Drive API (read-only) with client-side fetching
3. **Hybrid:** Pre-generate metadata at build, fetch images on-demand from Drive

---

## 18. RSVP Workflow

```
[Guest visits /rsvp page]
     |
     v
[Guest fills form: Name, Phone, Guests, Response, Message]
     |
     v
[Client-side validation]
     |--- Validation fails → Show inline errors
     |--- Validation passes → Continue
     v
[Anti-spam checks (honeypot, timing)]
     |--- Failed → Silent failure / redirect
     |--- Passed → Continue
     v
[Form submission to edge function / API]
     |
     v
[Append to CSV file in storage / KV]
     |
     v
[Return success confirmation to guest]
     |
     v
[Host can download RSVP CSV anytime]
```

---

## 19. Admin Workflow

- **No admin panel** to keep complexity minimal
- Host accesses RSVP data via:
  - Direct CSV download from repository / storage
  - Cloudflare KV dashboard (if using Workers)
  - Simple password-protected page to trigger CSV download

---

## 20. CDN Strategy

| Asset Type | Cache TTL | CDN Headers |
|------------|-----------|-------------|
| HTML pages | Vercel default | No explicit Cache-Control (CDN caches ~1hr) |
| JS/CSS bundles | 1 year (content-hashed) | `Cache-Control: public, max-age=31536000, immutable` |
| Images, fonts, SVG, WebP | 1 year (content-hashed) | `Cache-Control: public, max-age=31536000, immutable` |
| `/service-worker.js` | Never cached | `Cache-Control: no-cache` (always check for updates) |
| `/sitemap.xml`, `/robots.txt`, `/manifest.json` | Vercel default | No explicit Cache-Control |
| Blessings API | 60s | `Cache-Control: public, max-age=60, stale-while-revalidate=300` (set via server) |
| RSVP/download API | No cache | `Cache-Control: no-store` (set via server) |

---

## 21. API Strategy

| Endpoint | Method | Purpose | Implementation |
|----------|--------|---------|---------------|
| `/api/rsvp` | POST | Submit RSVP | Edge function or form handler |
| `/api/gallery` | GET | Fetch photo metadata | Static JSON or Drive API proxy |
| `/api/rsvp/download` | GET | Download CSV | Protected edge function |

---

## 22. Cache Strategy

### Browser Cache
- Long max-age for versioned assets (JS/CSS/fonts)
- ETag/Last-Modified for HTML
- Service Worker for offline support (optional)

### CDN Cache
- Static assets: immutable caching
- HTML: revalidate on each deploy (new build = new URLs)
- Gallery images: CDN caches with short TTL for freshness

### Memory Cache
- No server-side memory needed (static deployment)
- Browser memory cache for images

---

## 23. Error Handling Strategy

### Frontend Errors
- RSVP form: inline validation messages in Marathi + English
- Gallery: placeholder image on load failure
- Network errors: retry button with friendly message
- 404 page: culturally themed error page with navigation links

### Backend/Edge Errors
- RSVP submission failure: client-side retry (3 attempts)
- CSV write failure: log and return error to client
- Rate limit exceeded: friendly message with retry-after header

### Edge Cases
- JavaScript disabled: Core content visible (invitation details, venue)
- Offline mode: Cached content displayed
- Very old browser: Basic HTML content with graceful CSS degradation

---

## 24. Disaster Recovery

| Scenario | Recovery Strategy | RTO | RPO |
|----------|-------------------|-----|-----|
| RSVP data loss | CSV backed up in repo + periodic manual exports | 1 hour | 1 day |
| Hosting outage | Redeploy to alternate platform (DNS change) | 30 minutes | N/A |
| Google Drive unavailability | Static fallback images bundled at build time | Immediate | N/A |
| Domain expiration | Auto-renew configured, 30-day grace period | 30 days | N/A |

---

## 25. Analytics Strategy

### Approach: Privacy-first, minimal

1. **Cloudflare Web Analytics** (free, privacy-focused, no cookies) — optional
2. **No Google Analytics** (too heavy, privacy concerns)
3. **Manual tracking:** Server access logs to count visits
4. **Event tracking:** Google Drive download counts for RSVP file

**Data collected:** Page views (anonymized), no personal data tracked

---

## 26. Deployment Strategy

### Build Pipeline
```
1. Developer pushes to main branch
2. CI/CD triggers (Vercel/GitHub Actions)
3. npm ci → npm run build
4. Static export generated in /build
5. Deployed to CDN edge
```

### Environments
- **Production:** Main branch → auto-deploy
- **Preview:** PR branches → preview URL

### Deployment Rollback
- Vercel: Instant rollback to previous deployment
- Cloudflare Pages: Version history with rollback
- Netlify: Deploy with instant rollback

---

## 27. SEO Strategy

- Pre-rendered HTML for every page (static export)
- Semantic HTML structure
- Meta tags: title, description, OG tags, Twitter cards
- Structured data (JSON-LD) for event schema
- Sitemap.xml generated at build
- Robots.txt configured
- Canonical URLs
- Open Graph images for WhatsApp sharing
- Hreflang tags for Marathi/English versions

---

## 28. Future Expansion Possibilities

| Feature | Complexity | Priority | Notes |
|---------|------------|----------|-------|
| Wedding day live stream | Medium | Post-MVP | Embed YouTube/Instagram live |
| Online wedding shop / gifts | High | Future | UPI payment links |
| Guest book with messages | Low | Nice-to-have | Form → CSV storage |
| Photo booth / instant upload | Medium | Future | Requires upload endpoint |
| Family tree / wedding party | Low | Nice-to-have | Static data page |
| Multi-event support | Medium | Future | Pre-wedding, wedding, reception |
| PWA offline support | Medium | Nice-to-have | Service Worker caching |
| Custom Marathi e-card generator | High | Future | Canvas-based card creator |
| Live guest count feed | Low | Nice-to-have | WebSocket on edge |
| QR code seat assignment | Medium | Future | CSV → QR generation |

---

## 29. Threat Modeling

### T01: RSVP Form Spam
- **Threat:** Automated bots submit fake RSVPs
- **Mitigation:** Honeypot field, time threshold, rate limiting
- **Severity:** Low

### T02: CSV Data Injection
- **Threat:** Malicious payload in form fields
- **Mitigation:** Output encoding, CSV escaping, field length limits
- **Severity:** Medium

### T03: Google Drive Link Abuse
- **Threat:** Direct link to Drive shared folder shared beyond intended audience
- **Mitigation:** Drive folder shared with link-only access, not publicly indexed
- **Severity:** Low

### T04: XSS via Gallery Metadata
- **Threat:** Image filenames with script injection
- **Mitigation:** Output encoding of all dynamic text
- **Severity:** Low

### T05: CSRF on RSVP Endpoint
- **Threat:** Cross-site request forgery submits RSVP on behalf of user
- **Mitigation:** Origin header validation
- **Severity:** Low

---

## 30. Technical Tradeoff Analysis

| Decision | Option A | Option B | Winner | Rationale |
|----------|----------|----------|--------|-----------|
| Framework | SvelteKit | Astro | SvelteKit | Chosen by user: good static export, reactive UI for gallery, excellent DX |
| Styling | Tailwind CSS | Vanilla CSS | Vanilla CSS | Zero build dependency, smaller bundle, full control over design system |
| Photo storage | Google Drive | Cloudinary | Google Drive | Zero cost, already in user's ecosystem, no API limits for viewing |
| RSVP storage | CSV file | Cloudflare KV | CSV file | Simplicity, easy export, human-readable, no platform lock-in |
| Map integration | Leaflet | Deep links | Deep links | Zero JS overhead, lighter pages, native app UX |
| Deployment | Vercel | Cloudflare Pages | Vercel (or user choice) | Excellent SvelteKit support, generous free tier |
| I18n approach | Static JSON | Dynamic loader | Static JSON | Zero runtime overhead, pre-compiled at build |
| Font loading | Self-hosted | Google Fonts CDN | Self-hosted | Privacy, no external requests, offline-capable |

---

*End of SRS Document — Updated 16 June 2026*
