import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { timingSafeEqual, createHmac } from 'node:crypto';

export const prerender = false;

/**
 * POST /api/rsvp/auth
 *
 * Accepts the admin password and returns a short-lived signed token.
 * The token expires after 5 minutes and is used to download the RSVP CSV.
 *
 * This avoids passing the raw admin password as a URL query parameter,
 * which would expose it in browser history, server logs, and the DOM.
 *
 * Request body: { "secret": "your-admin-password" }
 * Response:     { "success": true, "token": "expiresAt:hmac" }
 */
export const POST: RequestHandler = async ({ request }) => {
	const adminSecret = env.RSVP_ADMIN_SECRET;

	if (!adminSecret) {
		return json(
			{ success: false, message: 'Admin secret not configured.' },
			{ status: 501 }
		);
	}

	let body: { secret?: string };
	try {
		body = await request.json();
	} catch {
		return json(
			{ success: false, message: 'Invalid request body.' },
			{ status: 400 }
		);
	}

	const { secret } = body;

	// Constant-time comparison to prevent timing attacks
	if (!secret?.length || !adminSecret?.length || secret.length !== adminSecret.length) {
		return json(
			{ success: false, message: 'Invalid password.' },
			{ status: 401 }
		);
	}

	const pwBuffer = Buffer.from(secret);
	const secretBuffer = Buffer.from(adminSecret);
	if (!timingSafeEqual(pwBuffer, secretBuffer)) {
		return json(
			{ success: false, message: 'Invalid password.' },
			{ status: 401 }
		);
	}

	// Generate a short-lived token (5 minutes)
	// Format: "expiresAt:hmacSignature"
	const expiresAt = Date.now() + 5 * 60 * 1000;
	const payload = `${expiresAt}:${adminSecret}`;
	const signature = createHmac('sha256', adminSecret).update(payload).digest('hex');

	return json({
		success: true,
		token: `${expiresAt}:${signature}`
	});
};
