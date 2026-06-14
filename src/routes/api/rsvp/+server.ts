import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SITE_CONFIG } from '$lib/data/config';
import { put, head } from '@vercel/blob';
import { env } from '$env/dynamic/private';

const CSV_FILENAME = 'rsvp-data.csv';
const CSV_HEADERS = 'Timestamp,Name,Phone,Email,Guests,GuestNames,Response,Dietary,Message';

// CORS headers for cross-origin requests
// Origin is set dynamically after CSRF validation — not using '*' to avoid
// allowing arbitrary origins if the CSRF check is ever accidentally bypassed.
function getCorsHeaders(origin: string): Record<string, string> {
	return {
		'Access-Control-Allow-Origin': origin || '*',
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type'
	};
}

/**
 * Simple in-memory rate limiter (per function instance).
 * On Vercel, function instances are typically reused for multiple requests,
 * so this provides meaningful protection against rapid-fire abuse.
 *
 * Limits: 5 submissions per IP per hour.
 */
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const WINDOW_MS = 3_600_000; // 1 hour
	const MAX_REQUESTS = 5;

	const timestamps = rateLimitMap.get(ip) || [];
	// Prune expired entries
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

export const prerender = false;

export const OPTIONS: RequestHandler = async ({ request }) => {
	const origin = request.headers.get('origin') || '';
	return new Response(null, {
		headers: getCorsHeaders(origin)
	});
};

/**
 * Sanitize a CSV field to prevent injection.
 * Escape quotes, strip formula injection prefixes, and wrap in quotes
 * if contains comma, quote, or newline.
 */
function sanitizeCsvField(val: string): string {
	if (!val) return '';
	let escaped = String(val).replaceAll('"', '""');

	// Prevent CSV injection: fields starting with =, +, -, @ can execute
	// formulas when the CSV is opened in Excel or Google Sheets.
	// Prefix with a single quote to neutralize them.
	if (/^[=+\-@]/.test(escaped)) {
		escaped = "'" + escaped;
	}

	if (escaped.includes(',') || escaped.includes('"') || escaped.includes('\n') || escaped.includes('\r')) {
		return `"${escaped}"`;
	}
	return escaped;
}

/**
 * Append a row to the CSV stored in Vercel Blob.
 */
async function appendToCsv(row: string): Promise<void> {
	// Check if blob already exists
	let existingContent = '';
	try {
		const existingBlob = await head(CSV_FILENAME, { token: env.BLOB_READ_WRITE_TOKEN });
		if (existingBlob) {
			const downloadUrl = existingBlob.downloadUrl || existingBlob.url;
			const response = await fetch(downloadUrl);
			if (response.ok) {
				existingContent = await response.text();
			}
		}
	} catch {
		// Blob doesn't exist yet (404) — start fresh
	}

	// If file is empty, prepend headers
	const newContent = existingContent.length === 0
		? CSV_HEADERS + '\n' + row + '\n'
		: existingContent.trimEnd() + '\n' + row + '\n';

	await put(CSV_FILENAME, newContent, {
		token: env.BLOB_READ_WRITE_TOKEN,
		access: 'private',
		contentType: 'text/csv'
	});
}

export const POST: RequestHandler = async ({ request }) => {
	// Get validated origin for CORS (set dynamically, not '*')
	const origin = request.headers.get('origin');
	const referer = request.headers.get('referer');
	const requestOrigin = origin || (referer ? new URL(referer).origin : '');

	const headers = { ...getCorsHeaders(requestOrigin), 'Content-Type': 'application/json' };

	// Limit request body size to prevent abuse (RSVP forms are small)
	const contentLength = request.headers.get('content-length');
	if (contentLength && Number.parseInt(contentLength) > 10240) { // 10KB max
		return json(
			{ success: false, message: 'Request body too large.' },
			{ status: 413, headers }
		);
	}

	// CSRF protection: validate Origin / Referer header
	// (requestOrigin already extracted above for CORS headers)
	if (requestOrigin) {
		const isAllowed = (SITE_CONFIG.allowedOrigins as readonly string[]).includes(requestOrigin)
			// Allow Vercel preview deployments (e.g., project-name-123.vercel.app)
			|| requestOrigin.endsWith('.vercel.app');
		if (!isAllowed) {
			return json(
				{ success: false, message: 'Request origin not allowed.' },
				{ status: 403, headers }
			);
		}
	}

	// Rate limiting: max 5 submissions per IP per hour
	const clientIp = getClientIp(request);
	if (clientIp !== 'unknown' && isRateLimited(clientIp)) {
		console.warn('Rate limit hit for IP:', clientIp);
		return json(
			{ success: false, message: 'Too many submissions. Please try again later.' },
			{ status: 429, headers }
		);
	}

	try {
		const data = await request.json();

		// Validate required fields
		if (!data.name || !data.phone || !data.response) {
			return json(
				{ success: false, message: 'Name, phone, and response are required.' },
				{ status: 400, headers }
			);
		}

		// Anti-spam: honeypot check
		if (data.website) {
			// Silently accept but don't save
			return json({ success: true, message: 'RSVP recorded!' }, { headers });
		}

		// Build CSV row
		const timestamp = new Date().toISOString();
		const csvRow = [
			sanitizeCsvField(timestamp),
			sanitizeCsvField(data.name),
			sanitizeCsvField(data.phone),
			sanitizeCsvField(data.email || ''),
			Number.parseInt(data.guests) || 1,
			sanitizeCsvField(data.guestNames || ''),
			sanitizeCsvField(data.response),
			sanitizeCsvField(data.dietary || ''),
			sanitizeCsvField(data.message || '')
		].join(',');

		// Append to CSV in Vercel Blob
		// Falls back to console.log if BLOB_READ_WRITE_TOKEN is not set (local dev)
		if (env.BLOB_READ_WRITE_TOKEN) {
			await appendToCsv(csvRow);
		} else {
			console.log('RSVP received (dev mode):', csvRow);
		}

		return json(
			{ success: true, message: 'RSVP recorded successfully!' },
			{ headers }
		);
	} catch (error) {
		console.error('RSVP error:', error);
		return json(
			{ success: false, message: 'Server error. Please try again.' },
			{ status: 500, headers }
		);
	}
};
