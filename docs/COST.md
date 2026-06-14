# Cost Estimation
## Maharashtrian Engagement Invitation Web Application

---

## 1. Monthly Cost Summary

| Component | Free Tier | 100 Visitors | 1,000 Visitors | 10,000 Visitors | Viral Spike (50k) |
|-----------|-----------|-------------|----------------|-----------------|-------------------|
| Vercel Hobby | ✅ | $0 | $0 | $0 | $0 |
| Cloudflare Pages Free | ✅ | $0 | $0 | $0 | $0 |
| Netlify Free | ✅ | $0 | $0 | $0 | $0 |
| Domain (.com/.in) | ❌ | ~$0.83/mo | ~$0.83/mo | ~$0.83/mo | ~$0.83/mo |
| Google Drive | ✅ | $0 | $0 | $0 | $0 |
| **Total** | | **~$0.83/mo** | **~$0.83/mo** | **~$0.83/mo** | **~$0.83/mo** |

---

## 2. Free Tier Feasibility

### Vercel Hobby
| Limit | Value | Our Expected Usage |
|-------|-------|-------------------|
| Bandwidth | 100 GB/mo | ~500 MB at 1,000 visitors |
| Build minutes | 6,000 min/mo | ~1-2 min per build |
| Serverless functions | 100 GB-hrs/mo | Minimal (RSVP only) |
| Team members | 1 | 1 |
| **Verdict** | ✅ | **Well within limits** |

### Cloudflare Pages Free
| Limit | Value | Our Expected Usage |
|-------|-------|-------------------|
| Requests | Unlimited | N/A |
| Bandwidth | Unlimited | N/A |
| Build minutes | 500 min/mo | ~1-2 min per build |
| Workers requests | 100k/day | Minimal (RSVP only) |
| **Verdict** | ✅ | **Well within limits** |

---

## 3. Bandwidth Estimates

| Asset | Size | Per Page Load | 100 Visitors | 1,000 Visitors | 10,000 Visitors |
|-------|------|---------------|-------------|----------------|-----------------|
| HTML (per page) | ~15 KB | 15 KB | 1.5 MB | 15 MB | 150 MB |
| CSS | ~8 KB gzipped | 8 KB | 0.8 MB | 8 MB | 80 MB |
| JS | ~15 KB gzipped | 15 KB | 1.5 MB | 15 MB | 150 MB |
| Fonts | ~30 KB | 30 KB | 3 MB | 30 MB | 300 MB |
| Placeholder images | ~2 KB | 2 KB | 0.2 MB | 2 MB | 20 MB |
| Gallery images (per view) | ~500 KB | 500 KB* | 10 MB | 100 MB | 1 GB* |
| **Total (per visitor)** | **~570 KB** | **570 KB** | **~57 MB** | **~570 MB** | **~5.7 GB** |

*Gallery images only loaded when user views gallery page.

---

## 4. Google Drive Storage

| Type | Expected Size | Google Drive Free Tier (15 GB) |
|------|--------------|-------------------------------|
| Photos (~200) | ~1-2 GB | ✅ Available |
| Videos (optional) | ~500 MB | ✅ Available |
| **Total** | **~2.5 GB** | **16% of free tier** |

---

## 5. Annual Cost Breakdown

| Item | Cost | Frequency |
|------|------|-----------|
| Domain name (.in or .com) | ~$10/year | Yearly |
| Vercel Hobby | Free | Monthly |
| Google Drive | Free (up to 15GB) | Monthly |
| **Total Year 1** | **~$10** | |
| **Total Year 2+** | **~$10/year** | |

---

## 6. Cost at Scale

| Scenario | Visitors | Bandwidth | Cost | Notes |
|----------|----------|-----------|------|-------|
| Normal | 100 | ~57 MB | $0 | All free tier |
| Peak day (invitation sent) | 500 | ~285 MB | $0 | All free tier |
| WhatsApp viral | 5,000 | ~2.85 GB | $0 | Still within free tier |
| Major viral | 50,000 | ~28.5 GB | $0 | Vercel: within 100GB limit |
| Extreme spike | 100,000 | ~57 GB | $0 | Still within Vercel free tier |

---

## 7. Comparison: Paid vs Free

| Feature | Free Tier | Paid (Pro ~$20/mo) | Do We Need Paid? |
|---------|-----------|-------------------|-----------------|
| Bandwidth | 100 GB (Vercel) | 1 TB+ | ❌ No |
| Custom domain | ✅ Yes | ✅ Yes | ✅ Included in free |
| SSL/HTTPS | ✅ Yes | ✅ Yes | ✅ Included in free |
| CDN | ✅ Global | ✅ Global | ✅ Included in free |
| Analytics | ⚠️ Basic | ✅ Advanced | ❌ Basic enough |
| Team features | ❌ | ✅ | ❌ Single dev |
| **Verdict** | | | **Free tier sufficient** |

---

## 8. Currently Registered Domain

| Domain | Registry | Cost | SSL |
|--------|----------|------|-----|
| **`hrishi.org.in`** | GoDaddy | ~$10/year | ✅ Auto-provisioned by Vercel (Let's Encrypt) |

> The original development domain `sakharpuda.in` was replaced with `hrishi.org.in` on 16 June 2026. All source and documentation have been updated to reflect the new domain.

## 9. Optimization for Cost

1. **Image optimization:** Compress all gallery photos before uploading to Google Drive
2. **Cache strategy:** Long cache TTLs (1 year) for versioned assets
3. **CDN:** Built into hosting platform, zero additional cost
4. **No analytics:** Avoid costly analytics services
5. **No database:** Zero database cost
6. **Static hosting:** No server to maintain

---

*End of Cost Estimation — Updated 16 June 2026 — Domain: hrishi.org.in*
