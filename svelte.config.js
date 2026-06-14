import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter(),
		// Ignore prerender errors for PII images removed from static/ and now served from Vercel Blob
		prerender: {
			handleHttpError: ({ path, status }) => {
				if (status !== 404) throw new Error(`${status} ${path}`);
				const imagesServedViaBlob = ['/images/monogram.webp', '/images/monogram.png', '/images/og-image.svg'];
				if (imagesServedViaBlob.includes(path)) return;
				throw new Error(`404 ${path}`);
			}
		}
	}
};

export default config;
