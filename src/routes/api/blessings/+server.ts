import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SITE_CONFIG } from '$lib/data/config';
import { put, head, getDownloadUrl } from '@vercel/blob';
import { env } from '$env/dynamic/private';

const BLOB_FILENAME = 'blessings-data.json';

interface StoredBlessing {
	name: string;
	text: string;
	date: string;
	timestamp: string;
}

// CORS headers — same pattern as RSVP endpoint
function getCorsHeaders(origin: string): Record<string, string> {
	return {
		'Access-Control-Allow-Origin': origin || '*',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type'
	};
}

/**
 * Simple in-memory rate limiter (per function instance).
 * More generous than RSVP — 20 submissions per hour since blessings
 * are public and we want to encourage participation.
 */
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const WINDOW_MS = 3_600_000; // 1 hour
	const MAX_REQUESTS = 20;

	const timestamps = rateLimitMap.get(ip) || [];
	const recent = timestamps.filter(t => now - t < WINDOW_MS);

	if (recent.length >= MAX_REQUESTS) {
		return true;
	}

	recent.push(now);
	rateLimitMap.set(ip, recent);
	return false;
}

function getClientIp(request: Request): string {
	return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
		|| request.headers.get('x-real-ip')
		|| 'unknown';
}

/**
 * Load all blessings from Vercel Blob.
 * Returns an empty array if blob doesn't exist or fails.
 */
async function loadBlessings(): Promise<StoredBlessing[]> {
	if (!env.BLOB_READ_WRITE_TOKEN) return [];

	try {
		const blob = await head(BLOB_FILENAME, { token: env.BLOB_READ_WRITE_TOKEN });
		if (!blob) return [];

		const signedUrl = await getDownloadUrl(blob.url);
		const response = await fetch(signedUrl);
		if (!response.ok) return [];

		const data = await response.json();
		if (Array.isArray(data)) return data as StoredBlessing[];
		return [];
	} catch {
		return [];
	}
}

/**
 * Save blessings array to Vercel Blob.
 */
async function saveBlessings(blessings: StoredBlessing[]): Promise<void> {
	await put(BLOB_FILENAME, JSON.stringify(blessings, null, '\t'), {
		token: env.BLOB_READ_WRITE_TOKEN,
		access: 'private',
		contentType: 'application/json',
		allowOverwrite: true
	});
}

export const prerender = false;

export const OPTIONS: RequestHandler = async ({ request }) => {
	const origin = request.headers.get('origin') || '';
	return new Response(null, {
		headers: getCorsHeaders(origin)
	});
};

// ── GET: List blessings ────────────────────────────────────
export const GET: RequestHandler = async ({ request, setHeaders }) => {
	const origin = request.headers.get('origin') || '';
	const referer = request.headers.get('referer');
	const requestOrigin = origin || (referer ? new URL(referer).origin : '');
	const headers = { ...getCorsHeaders(requestOrigin), 'Content-Type': 'application/json' };

	try {
		const blessings = await loadBlessings();

		setHeaders({
			'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
		});

		return json({ success: true, blessings }, { headers });
	} catch (error) {
		console.error('Failed to load blessings:', error);
		return json(
			{ success: false, message: 'Failed to load blessings.', blessings: [] },
			{ status: 500, headers }
		);
	}
};

// ── POST: Submit a blessing ────────────────────────────────
export const POST: RequestHandler = async ({ request }) => {
	const origin = request.headers.get('origin');
	const referer = request.headers.get('referer');
	const requestOrigin = origin || (referer ? new URL(referer).origin : '');
	const headers = { ...getCorsHeaders(requestOrigin), 'Content-Type': 'application/json' };

	// Limit request body size
	const contentLength = request.headers.get('content-length');
	if (contentLength && Number.parseInt(contentLength) > 10240) {
		return json(
			{ success: false, message: 'Blessing too large.' },
			{ status: 413, headers }
		);
	}

	// CSRF protection
	if (requestOrigin) {
		const isAllowed = (SITE_CONFIG.allowedOrigins as readonly string[]).includes(requestOrigin)
			|| requestOrigin.endsWith('.vercel.app');
		if (!isAllowed) {
			return json(
				{ success: false, message: 'Request origin not allowed.' },
				{ status: 403, headers }
			);
		}
	}

	// Rate limiting: 20 submissions per IP per hour
	const clientIp = getClientIp(request);
	if (clientIp !== 'unknown' && isRateLimited(clientIp)) {
		console.warn('Blessings rate limit hit for IP:', clientIp);
		return json(
			{ success: false, message: 'Too many submissions. Please try again later.' },
			{ status: 429, headers }
		);
	}

	try {
		const data = await request.json();

		// Anti-spam: honeypot check
		if (data.website) {
			return json({ success: true, message: 'Blessing sent! 🙏' }, { headers });
		}

		// Validate
		const text = (data.text || '').trim();
		const name = (data.name || '').trim() || 'Anonymous';

		if (text.length < 2) {
			return json(
				{ success: false, message: 'Blessing must be at least 2 characters.' },
				{ status: 400, headers }
			);
		}

		if (text.length > 500) {
			return json(
				{ success: false, message: 'Blessing must be under 500 characters.' },
				{ status: 400, headers }
			);
		}

		if (name.length > 100) {
			return json(
				{ success: false, message: 'Name must be under 100 characters.' },
				{ status: 400, headers }
			);
		}

		const blessing: StoredBlessing = {
			name: `— ${name}`,
			text,
			date: new Date().toLocaleDateString('en-IN', {
				year: 'numeric', month: 'long', day: 'numeric'
			}),
			timestamp: new Date().toISOString()
		};

		if (env.BLOB_READ_WRITE_TOKEN) {
			const existing = await loadBlessings();
			const updated = [blessing, ...existing];
			await saveBlessings(updated);
		} else {
			console.log('Blessing received (dev mode):', JSON.stringify(blessing));
		}

		return json(
			{ success: true, message: 'Blessing sent! 🙏', blessing },
			{ headers }
		);
	} catch (error) {
		console.error('Blessings error:', error);
		return json(
			{ success: false, message: 'Server error. Please try again.' },
			{ status: 500, headers }
		);
	}
};
