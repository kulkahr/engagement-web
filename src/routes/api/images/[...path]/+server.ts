/**
 * Image proxy — serves monogram and OG images from Vercel Blob.
 *
 * This endpoint allows the site to use a private Vercel Blob store for
 * PII-containing images (monogram with couple names, OG image) without
 * exposing signed delegation URLs or committing images to git.
 *
 * The flow:
 *   1. Browser requests /api/images/monogram.webp
 *   2. Server uses @vercel/blob's head() to get the signed blob URL
 *   3. Server fetches the blob content and streams it back
 *   4. Response is cached at Vercel Edge for 1 year (immutable)
 *
 * The private blob URL/token never reaches the client.
 */

import { head, getDownloadUrl } from '@vercel/blob';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const prerender = false;

// Images are stored at blob root (e.g. 'monogram.webp', not 'images/monogram.webp')
const BLOB_DIR = '';

// Only allow known image files — prevents arbitrary blob access
const VALID_FILES = new Set([
	'monogram.webp',
	'monogram.png',
	'og-image.svg'
]);

const MIME_TYPES: Record<string, string> = {
	'.webp': 'image/webp',
	'.png': 'image/png',
	'.svg': 'image/svg+xml'
};

export const GET: RequestHandler = async ({ params }) => {
	const path = params.path;

	// Validate: only allow known image files
	if (!path || !VALID_FILES.has(path)) {
		return new Response('Not found', { status: 404 });
	}

	// Check Vercel Blob is configured
	if (!env.BLOB_READ_WRITE_TOKEN) {
		return new Response(
			'Image not available. Set BLOB_READ_WRITE_TOKEN to serve from Vercel Blob.',
			{ status: 503 }
		);
	}

	try {
		const blobPath = BLOB_DIR ? `${BLOB_DIR}/${path}` : path;

		// Step 1: Get the blob metadata (which includes the full blob URL)
		const blob = await head(blobPath, { token: env.BLOB_READ_WRITE_TOKEN });

		if (!blob) {
			return new Response('Image not found in blob storage.', { status: 404 });
		}

		// Step 2: Generate a fresh signed download URL from the blob URL
		// getDownloadUrl() requires the full blob URL, not just a pathname
		const downloadUrl = await getDownloadUrl(blob.url);

		// Step 3: Fetch the image using the signed download URL
		const response = await fetch(downloadUrl);

		if (!response.ok) {
			console.error(`Blob fetch failed for ${blobPath}: ${response.status}`);
			return new Response('Failed to fetch image.', { status: 502 });
		}

		// Determine content type from the original file extension
		const ext = path.slice(path.lastIndexOf('.'));
		const contentType = MIME_TYPES[ext] || response.headers.get('content-type') || 'application/octet-stream';

		// Cache aggressively — these images are immutable (re-upload to replace)
		return new Response(response.body, {
			status: response.status,
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=31536000, immutable',
				'X-Content-Type-Options': 'nosniff'
			}
		});
	} catch (error) {
		console.error(`Image proxy error for ${path}:`, error);
		return new Response('Internal server error.', { status: 500 });
	}
};
