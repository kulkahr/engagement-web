/**
 * Vercel Edge Middleware — India-only geo-restriction
 *
 * This middleware runs at the Vercel edge before any request reaches the static site.
 * It checks the `x-vercel-ip-country` header (set automatically by Vercel) and blocks
 * traffic from outside India with a 403 response.
 *
 * If the country header is unavailable (e.g. local dev, preview deployments),
 * access is allowed by default.
 */

export const config = {
	matcher: ['/:path*']
};

export default function middleware(request: Request): Response | undefined {
	const country = request.headers.get('x-vercel-ip-country');

	// If country header is available and is NOT India, block access
	if (country && country !== 'IN') {
		return new Response(
			'Sorry, this website is accessible only from India.\n' +
			'क्षमस्व, ही वेबसाइट केवळ भारतातून प्रवेश करण्यायोग्य आहे.\n',
			{
				status: 403,
				headers: {
					'Content-Type': 'text/plain; charset=utf-8',
					'Cache-Control': 'no-store'
				}
			}
		);
	}

	// Allow the request to proceed
	return undefined;
}
