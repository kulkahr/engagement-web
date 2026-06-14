import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { head } from '@vercel/blob';
import { env } from '$env/dynamic/private';
import { createHmac, timingSafeEqual } from 'node:crypto';

const CSV_FILENAME = 'rsvp-data.csv';

export const prerender = false;

export const GET: RequestHandler = async ({ url }) => {
	// Check if Vercel Blob is configured
	if (!env.BLOB_READ_WRITE_TOKEN) {
		return json(
			{ success: false, message: 'RSVP storage not configured. Set BLOB_READ_WRITE_TOKEN in production.' },
			{ status: 501 }
		);
	}

	const adminSecret = env.RSVP_ADMIN_SECRET;

	if (!adminSecret) {
		return json(
			{ success: false, message: 'Admin secret not configured. Set RSVP_ADMIN_SECRET in production.' },
			{ status: 501 }
		);
	}

	// Token-based authentication (no raw password in URL)
	// Token is a short-lived HMAC signature obtained from POST /api/rsvp/auth
	// Format: "expiresAt:signature"
	const token = url.searchParams.get('token');

	if (!token) {
		return json(
			{ success: false, message: 'Authentication required. Token missing.' },
			{ status: 401 }
		);
	}

	// Parse token: "expiresAt:signature"
	const colonIndex = token.indexOf(':');
	if (colonIndex === -1) {
		return json(
			{ success: false, message: 'Invalid token format.' },
			{ status: 401 }
		);
	}

	const expiresAtStr = token.slice(0, colonIndex);
	const signature = token.slice(colonIndex + 1);
	const expiresAt = Number.parseInt(expiresAtStr, 10);

	if (Number.isNaN(expiresAt)) {
		return json(
			{ success: false, message: 'Invalid token.' },
			{ status: 401 }
		);
	}

	// Check expiry
	if (Date.now() > expiresAt) {
		return json(
			{ success: false, message: 'Token expired. Please log in again.' },
			{ status: 401 }
		);
	}

	// Verify HMAC signature
	const expectedPayload = `${expiresAt}:${adminSecret}`;
	const expectedSignature = createHmac('sha256', adminSecret).update(expectedPayload).digest('hex');

	if (signature.length !== expectedSignature.length || !timingSafeEqual(
		Buffer.from(signature),
		Buffer.from(expectedSignature)
	)) {
		return json(
			{ success: false, message: 'Invalid token.' },
			{ status: 401 }
		);
	}

	try {
		const existingBlob = await head(CSV_FILENAME, { token: env.BLOB_READ_WRITE_TOKEN });

		if (!existingBlob) {
			return new Response('Timestamp,Name,Phone,Email,Guests,GuestNames,Response,Dietary,Message\n', {
				status: 200,
				headers: {
					'Content-Type': 'text/csv; charset=utf-8',
					'Content-Disposition': 'attachment; filename="rsvp-data.csv"',
					'Cache-Control': 'no-store'
				}
			});
		}

		const downloadUrl = existingBlob.downloadUrl || existingBlob.url;
		const response = await fetch(downloadUrl);
		const csvContent = await response.text();

		return new Response(csvContent, {
			status: 200,
			headers: {
				'Content-Type': 'text/csv; charset=utf-8',
				'Content-Disposition': 'attachment; filename="rsvp-data.csv"',
				'Cache-Control': 'no-store'
			}
		});
	} catch (error) {
		console.error('Failed to read CSV blob:', error);
		return json(
			{ success: false, message: 'Failed to load RSVP data.' },
			{ status: 500 }
		);
	}
};
