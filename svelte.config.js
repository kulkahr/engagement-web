import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		// Ignore missing images that are now served via the /api/images/ proxy from Vercel Blob
		// These files were removed from static/ to avoid committing PII to git.
		prerender: {
			handleHttpError: ({ path, status }) => {
				// Only allow 404s for the specific files migrated to Vercel Blob
				if (status !== 404) throw new Error(`${status} ${path}`);
				const imagesServedViaApi = ['/images/monogram.webp', '/images/monogram.png', '/images/og-image.svg'];
				if (imagesServedViaApi.includes(path)) return;
				throw new Error(`404 ${path}`);
			}
		}
	}
};

export default config;
