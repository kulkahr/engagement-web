# Maintenance Guide — Keeping the Site Healthy

> **Domain:** `hrishi.org.in`
> **Hosting:** Vercel (Hobby — free tier)
> **Last updated:** 14 June 2026

---

## Overview

This guide covers ongoing maintenance tasks for the engagement invitation website. Most tasks are quick (under 5 minutes) and can be done from a phone or laptop.

---

## Routine Tasks

### Weekly (During Active Use)

| Task | Time | How |
|------|------|-----|
| Check RSVP submissions | 2 min | Visit `/admin/`, enter secret, download CSV to view new entries |
| Review blessings | 1 min | Visit `/blessings/` — new submissions appear automatically |
| Check for broken pages | 2 min | Quick scroll through all 6 pages on your phone |

### Monthly

| Task | Time | How |
|------|------|-----|
| Run `npm audit` | 2 min | `cd engagement-web && npm audit` — check for vulnerabilities |
| Review Vercel dashboard | 3 min | Check usage, bandwidth, build minutes |
| Backup RSVP data | 2 min | Download CSV from `/admin/` and save to Google Drive/Dropbox |
| Backup blessings data | 3 min | Visit Vercel → Storage → Blob → Download `blessings-data.json` |

### After Each Deploy

| Task | How |
|------|-----|
| Verify all pages load | Navigate all 6 routes in a browser |
| Test RSVP form | Submit a test entry, then delete from CSV |
| Check service worker | DevTools → Application → Service Workers → should be registered |
| Clear browser cache | Hard reload (Cmd+Shift+R) to see fresh content |

---

## Gallery Photo Updates

When you have new photos from the photographer or guests:

```bash
# 1. Upload photos to the shared Google Drive folder:
#    https://drive.google.com/drive/folders/1lYNRwhI8HTnjMQr3hvNgF2JEZn806FFt

# 2. On your computer with the project cloned:
cd engagement-web
GOOGLE_DRIVE_API_KEY=your_api_key npm run build:photos

# 3. Rebuild the site:
npm run build

# 4. Preview locally:
npm run preview

# 5. Commit and push to deploy:
git add -A
git commit -m "Update gallery photos"
git push
```

> **Note:** You need `GOOGLE_DRIVE_API_KEY` to run `build:photos`. Get it from [Google Cloud Console](https://console.cloud.google.com).

---

## Dependency Updates

### Check for Updates

```bash
cd engagement-web
npm audit                   # Check for vulnerabilities
npm outdated                # Check for newer versions
```

### Update Safely

```bash
# Update patch + minor versions (safe):
npm update

# Update to latest major version (risky — check changelogs first):
npm install <package>@latest

# Verify build still works:
npm run build && npm run check
```

### Current Version Baseline (16 June 2026)

| Package | Version | Status |
|---------|---------|--------|
| `svelte` | 5.56.3 | ✅ Latest |
| `@sveltejs/kit` | 2.65.0 | ✅ Latest |
| `@sveltejs/adapter-auto` | 7.0.1 | ✅ Latest |
| `@sveltejs/adapter-vercel` | — | ✅ Installed |
| `vite` | 8.0.16 | ✅ Latest |
| `svelte-check` | 4.6.0 | ✅ Latest |
| `typescript` | 6.0.3 | ✅ Latest |
| `@vercel/blob` | 2.4.0 | ✅ Latest |
| `cookie` (transitive) | 0.6.0 | ⏳ Kit pins `^0.6.0` — see Security Review T8 |

---

## Domain Renewal

| Task | When | How |
|------|------|-----|
| **Renew `hrishi.org.in`** | ~10 months after purchase | GoDaddy → My Products → Domains → Renew |
| **Enable auto-renew** | Immediately after purchase | GoDaddy → Domain Settings → Auto-Renew On |
| **Update contact info** | If email changes | GoDaddy → Domain Settings → Contact Info |

> ⏰ Set a calendar reminder for 1 month before expiry (typically ~$10/year).

---

## Vercel Limits (Free Tier)

| Limit | Value | Our Expected Usage | Buffer |
|-------|-------|-------------------|--------|
| Bandwidth | 100 GB/mo | ~500 MB at 1k visitors | **200x** |
| Build minutes | 6,000 min/mo | ~2 min per build | **3000x** |
| Serverless functions | 100 GB-hrs/mo | ~0.5 GB-hr/mo | **200x** |
| Team members | 1 | 1 | Exact |
| Blob storage | 10 GB | ~1 MB (CSV + JSON) | **10,000x** |

You are unlikely to hit any limits at expected traffic levels.

---

## Backup Procedures

### What to Back Up

| Data | Location | Backup Method | Frequency |
|------|----------|--------------|-----------|
| RSVP CSV | Vercel Blob | Download from `/admin/` | Weekly during active use |
| Blessings JSON | Vercel Blob | Vercel → Storage → Blob → Download | Monthly |
| Source code | GitHub | Git push (auto-backup) | Every commit |
| Gallery photos | Google Drive | Already in Drive | N/A |

### Disaster Recovery

| Scenario | Recovery Steps |
|----------|---------------|
| **Lost RSVP data** | Restore from last CSV backup. If no backup, data is unrecoverable (Vercel Blob has versioning in Pro plan). |
| **Broken deploy** | Vercel → Deployments → Find working deploy → Promote to Production |
| **Accidental git delete** | `git reflog` to find lost commits, `git reset --hard <hash>` |
| **Domain hijack** | Contact GoDaddy support immediately, verify account security |

---

## Performance Monitoring

### Quick Checks

```bash
# Check if the site is responding
curl -s -o /dev/null -w "%{http_code}" https://hrishi.org.in/
# Should return 200

# Check SSL certificate (14 days before expiry)
curl -vI https://hrishi.org.in/ 2>&1 | grep "expire date"
```

### Lighthouse Scores

Run Lighthouse after each major deploy:

```bash
# Using Lighthouse CLI
npx lighthouse https://hrishi.org.in/ --view
```

Expected scores: Performance >90, A11y 100, BP 100, SEO 100.

---

## Troubleshooting Common Issues

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| "Service Worker failed to register" | Viewing on localhost:5173 | ✅ Normal — dev-mode guard. Use `npm run preview` to test SW |
| RSVP submit returns 500 | Missing BLOB_READ_WRITE_TOKEN | Add to Vercel env vars and redeploy |
| Blank page on route navigation | Build missing trailing slash | Ensure `+layout.ts` has `trailingSlash: 'always'` |
| Gallery shows empty/placeholder | No photos or Google Drive API key missing | Upload photos, run `build:photos`, rebuild |
| Blessings not loading in dev | Missing BLOB_READ_WRITE_TOKEN locally | Create `.env` file with token |
| CSS not updating after changes | Browser cache | Hard refresh (Cmd+Shift+R) or use `npm run dev` |

---

## When to Deploy

Deploy when:
- ✅ Content changes (event details, dates, names)
- ✅ New gallery photos added
- ✅ Dependency security patches applied
- ✅ Bug fixes or feature improvements
- ❌ Do NOT deploy on event day (unnecessary risk)

---

## Related Documents

| Document | Description |
|----------|-------------|
| `docs/DEPLOYMENT.md` | Production deployment guide |
| `docs/DEVELOPMENT.md` | Local development setup |
| `docs/SECURITY_REVIEW.md` | Security audit and vulnerability tracking |
| `docs/COST.md` | Cost estimation and free tier analysis |
| `docs/TASK_LIST.md` | All tasks with priority and status |

---

*End of Maintenance Guide — 16 June 2026*
