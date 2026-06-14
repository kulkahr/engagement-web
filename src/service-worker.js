// साखरपुडा — Service Worker
// Full offline support via SvelteKit integration.
// Pre-caches all build assets (hashed JS/CSS) + static files at install time.
// Cache-first for assets, network-first for navigations & API calls.

/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

const CACHE = `sakharpuda-${version}`;
const ASSETS = [
	...build,   // SvelteKit-generated JS/CSS (content-hashed, immutable)
	...files,   // static/ directory files
	'/'         // Root HTML (pre-cached for immediate offline access)
];

// ── Install: cache app shell + all assets ──────────────────
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE).then((cache) => {
			return cache.addAll(ASSETS);
		}).then(() => {
			return self.skipWaiting();
		})
	);
});

// ── Activate: clean old caches + notify clients ────────────
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(
				keys
					.filter((key) => key !== CACHE)
					.map((key) => caches.delete(key))
			);
		}).then(() => {
			return self.clients.claim();
		}).then(() => {
			// Notify all clients that a fresh deployment is active
			// so they can clear stale caches and reload
			return self.clients.matchAll().then((clients) => {
				clients.forEach((client) => {
					client.postMessage({ type: 'sw:activated', cache: CACHE });
				});
			});
		})
	);
});

// ── Fetch: intelligent caching strategy ────────────────────
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== 'GET') return;

	// Skip cross-origin requests
	if (url.origin !== location.origin) return;

	// API calls (RSVP): network-first (fresh data), cache fallback
	if (url.pathname.startsWith('/api/')) {
		event.respondWith(networkFirst(request));
		return;
	}

	// Navigation (HTML pages): stale-while-revalidate
	// Serve cached immediately, then fetch fresh version in background
	if (request.mode === 'navigate') {
		event.respondWith(staleWhileRevalidate(request));
		return;
	}

	// Everything else (JS, CSS, images, fonts): cache-first
	event.respondWith(cacheFirst(request));
});

// ── Strategies ─────────────────────────────────────────────

/** Cache-first: serve from cache, fall back to network */
async function cacheFirst(request) {
	const cached = await caches.match(request);
	if (cached) return cached;

	try {
		const response = await fetch(request);
		if (response.ok) {
			const cache = await caches.open(CACHE);
			cache.put(request, response.clone());
		}
		return response;
	} catch {
		return new Response('Offline', { status: 503 });
	}
}

/** Stale-while-revalidate: serve cached immediately, refresh in background */
async function staleWhileRevalidate(request) {
	const cached = await caches.match(request);

	// Fetch from network in background (don't block on it)
	const fetchPromise = fetch(request).then((response) => {
		if (response.ok) {
			const cache = caches.open(CACHE).then((cache) => {
				cache.put(request, response.clone());
			});
			return response;
		}
		return response;
	}).catch(() => {
		// Network failed — will fall back below
		return null;
	});

	// Return cached response immediately if available
	if (cached) {
		// Kick off background refresh
		fetchPromise.catch(() => {});
		return cached;
	}

	// No cache — try network, then fall back to home page
	const response = await fetchPromise;
	if (response) return response;

	const fallback = await caches.match('/');
	if (fallback) return fallback;
	return new Response('Offline', { status: 503 });
}

/** Network-first: try network, fall back to cache */
async function networkFirst(request) {
	try {
		const response = await fetch(request);
		if (response.ok) {
			const cache = await caches.open(CACHE);
			cache.put(request, response.clone());
		}
		return response;
	} catch {
		const cached = await caches.match(request);
		if (cached) return cached;

		// Last resort: fall back to cached home page
		const fallback = await caches.match('/');
		if (fallback) return fallback;

		return new Response('Offline', { status: 503 });
	}
}
