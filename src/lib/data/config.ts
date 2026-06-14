/**
 * Site-wide configuration constants.
 * Update SITE_URL to match your production domain before deploying.
 */

export const SITE_CONFIG = {
	/** The production URL of the site (no trailing slash) */
	siteUrl: 'https://hrishi.org.in',

	/** Allowed origins for CSRF protection on the RSVP endpoint */
	allowedOrigins: [
		'https://hrishi.org.in',
		'https://www.hrishi.org.in',
		'http://localhost:5173',
		'http://localhost:4173'
	]
} as const;
