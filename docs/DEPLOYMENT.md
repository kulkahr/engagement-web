# Deployment Guide — hrishi.org.in

> **Domain:** `hrishi.org.in` (purchased via GoDaddy)
> **Hosting:** Vercel (Hobby — free tier)
> **Storage:** Vercel Blob (RSVP CSV + Blessings JSON)
> **Last updated:** 16 June 2026

---

## Prerequisites

| Item | Where to Get | Cost |
|------|-------------|------|
| GitHub account | [github.com](https://github.com/signup) | Free |
| Vercel account | [vercel.com](https://vercel.com/signup) | Free (Hobby) |
| GoDaddy account | [godaddy.com](https://godaddy.com) | Domain ~$10/yr |
| Node.js 18+ | [nodejs.org](https://nodejs.org) or `nvm` | Free |
| `BLOB_READ_WRITE_TOKEN` | Vercel Dashboard → Storage → Blob → Create token | Free |
| `RSVP_ADMIN_SECRET` | Choose a strong password yourself | — |
| `GOOGLE_DRIVE_API_KEY` | [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials | Free |

---

## Step 1: Push Code to GitHub

```bash
# 1. Create a new repository on GitHub (e.g., "engagement-web")
#    Do NOT initialize with README, .gitignore, or license.

# 2. In your local project directory:
git remote add origin git@github.com:<your-username>/engagement-web.git
git push -u origin main
```

---

## Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your `engagement-web` repo
4. Framework preset should auto-detect **SvelteKit** — if not, select it manually
5. Click **Deploy** — the first deploy will fail without env vars, that's expected
6. Once the project is created, go to **Project Settings → Environment Variables**

---

## Step 3: Set Environment Variables

Add these three variables in **Vercel Dashboard → Project Settings → Environment Variables**:

| Name | Value | Scope |
|------|-------|-------|
| `BLOB_READ_WRITE_TOKEN` | From Vercel Storage → Blob → Create token | Production |
| `RSVP_ADMIN_SECRET` | A strong password of your choice | Production |
| `GOOGLE_DRIVE_API_KEY` | From Google Cloud Console (optional, for gallery rebuilds) | Production |

After setting vars, redeploy: either push a commit, or go to **Deployments → ⋮ → Redeploy**.

---

## Step 4: Configure Custom Domain

### 4a — Add Domain in Vercel

1. Go to **Vercel Dashboard → Your Project → Settings → Domains**
2. Enter `hrishi.org.in` and click **Add**
3. Enter `www.hrishi.org.in` and click **Add**
4. Vercel will display the required DNS configuration

### 4b — Point DNS at GoDaddy

Choose **one** of the following methods:

#### Method A: A/CNAME Records (Recommended — Keep DNS at GoDaddy)

In **GoDaddy → My Products → Domains → hrishi.org.in → DNS Settings**:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `@` (apex) | `76.76.21.21` | 600s (default) |
| **CNAME** | `www` | `cname.vercel-dns.com` | 600s (default) |

**Remove** any existing A/AAAA/CNAME records for `@` or `www` to avoid conflicts.

#### Method B: Vercel Nameservers (For Wildcard Domains)

In **GoDaddy → My Products → Domains → hrishi.org.in → Nameservers**, change to:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

⚠️ **Before switching nameservers**: Copy existing GoDaddy DNS records (MX for email, TXT for domain verification) to **Vercel Dashboard → Domains → {your-domain} → DNS Records** first. Otherwise email or other services will break.

### 4c — SSL & Propagation

- **SSL:** Vercel auto-provisions a Let's Encrypt certificate — **no manual steps needed**
- **Propagation:** DNS changes take 5 minutes to 48 hours. Vercel shows a green ✓ when verified
- **WWW redirect (optional):** Vercel → Domains → `www.hrishi.org.in` → Configure → Redirect to `hrishi.org.in`

---

## Step 5: Post-Deploy Verification

### 🔴 Critical Checklist

- [ ] **Homepage** — `https://hrishi.org.in/` loads without errors
- [ ] **RSVP form** — Fill and submit; verify data appears in Vercel Blob
- [ ] **All pages** — Navigate `/rsvp/`, `/venue/`, `/gallery/`, `/blessings/`, `/admin/` — no 404s
- [ ] **Admin download** — Visit `/admin/`, enter `RSVP_ADMIN_SECRET`, download CSV

### 🟡 Important Checklist

- [ ] **Blessings API** — Submit a blessing, refresh page, verify it persists
- [ ] **Gallery** — Photos load, lightbox works (prev/next/close)
- [ ] **Language toggle** — Switch Marathi/English on all pages
- [ ] **Geo-restriction** — Test from India IP (200) and non-India IP (403)
- [ ] **Mobile** — Test navigation, form, and gallery on a real phone

### 🟢 Enhancement Checklist

- [ ] **Service worker** — Check Application → Service Workers in DevTools (registered)
- [ ] **Lighthouse audit** — Run Lighthouse on homepage (expect >90)
- [ ] **WhatsApp share** — Test share button on mobile
- [ ] **Map links** — Test Google Maps, Apple Maps, Mappls deep links

---

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Blank white page on navigation | Missing `trailingSlash: 'always'` | Verify `src/routes/+layout.ts` has it |
| RSVP submission returns 500 | Missing `BLOB_READ_WRITE_TOKEN` | Check env vars in Vercel dashboard |
| Admin page shows 403 | Wrong `RSVP_ADMIN_SECRET` | Re-enter the correct password |
| Service worker errors in console | Dev server on localhost (port 5173) | ✅ Normal — guarded by `location.port !== '5173'` |
| Gallery shows "No photos yet" | No photos in Drive folder or missing API key | Upload to Drive, re-run `build:photos` |
| Blessings API returns empty | Missing `BLOB_READ_WRITE_TOKEN` | Same fix as RSVP |
| Custom domain shows Vercel 404 | DNS not propagated yet | Wait and verify in Vercel Domains tab |
| `www.hrishi.org.in` doesn't load | Missing CNAME or redirect | Add CNAME record or configure redirect in Vercel |
| Mixed content warning (HTTP on HTTPS) | Hardcoded `http://` URL in code | All URLs should use `https://` or protocol-relative |

---

## Rollback

If something goes wrong after deployment:

1. **Vercel:** Go to **Deployments** → Find the last working deployment → **⋮ → Promote to Production**
2. **Domain:** DNS changes are reversible — just delete the A/CNAME records or restore old nameservers
3. **Code:** `git revert HEAD` and force push

---

## Related Documents

| Document | Description |
|----------|-------------|
| `docs/ROADMAP.md` | Sprint plan and deployment runbook |
| `docs/TASK_LIST.md` | All tasks with priority and status |
| `docs/DEVELOPMENT.md` | Local development setup guide |
| `docs/MAINTENANCE.md` | Ongoing maintenance guide |
| `docs/COST.md` | Cost estimation (free tier sufficient) |
| `docs/ARCHITECTURE.md` | System architecture and data flow |
| `docs/SECURITY_REVIEW.md` | Security audit and threat model |

---

*End of Deployment Guide — 16 June 2026*
