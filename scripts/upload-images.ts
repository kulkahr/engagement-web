/**
 * Upload monogram and OG images to Vercel Blob.
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=your_token_here npx tsx scripts/upload-images.ts
 *
 * After running, copy the printed env var values into your .env file
 * and redeploy. The images will load from Vercel Blob instead of
 * being served from the static directory.
 */

import { put } from '@vercel/blob';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!TOKEN) {
	console.error('❌ BLOB_READ_WRITE_TOKEN is required.');
	console.error('   Usage: BLOB_READ_WRITE_TOKEN=your_token npx tsx scripts/upload-images.ts');
	process.exit(1);
}

interface UploadSpec {
	file: string;
	path: string;
	contentType: string;
}

const FILES: UploadSpec[] = [
	{
		file: 'static/images/monogram.webp',
		path: 'images/monogram.webp',
		contentType: 'image/webp'
	},
	{
		file: 'static/images/monogram.png',
		path: 'images/monogram.png',
		contentType: 'image/png'
	},
	{
		file: 'static/images/og-image.svg',
		path: 'images/og-image.svg',
		contentType: 'image/svg+xml'
	}
];

async function main() {
	console.log('📤 Uploading images to Vercel Blob...\n');

	const results: { name: string; url: string }[] = [];

	for (const spec of FILES) {
		const filePath = resolve(import.meta.dirname, '..', spec.file);
		const buffer = readFileSync(filePath);
		const sizeKB = (buffer.length / 1024).toFixed(1);

		console.log(`   Uploading ${spec.file} (${sizeKB} KB)...`);

		const blob = await put(spec.path, buffer, {
			token: TOKEN,
			contentType: spec.contentType,
			access: 'public'
		});

		results.push({ name: spec.path, url: blob.url });
		console.log(`   ✅ ${spec.file} → ${blob.url}\n`);
	}

	console.log('═══════════════════════════════════════════════');
	console.log('  ✅ All images uploaded!\n');
	console.log('  Copy these into your .env file:\n');

	for (const r of results) {
		if (r.name.includes('og-image')) {
			console.log(`  PUBLIC_IMAGE_OG=${r.url}`);
		} else if (r.name.includes('monogram.webp')) {
			console.log(`  PUBLIC_IMAGE_MONOGRAM=${r.url}`);
		} else if (r.name.includes('monogram.png')) {
			console.log(`  PUBLIC_IMAGE_MONOGRAM_FALLBACK=${r.url}`);
		}
	}

	console.log('\n  Then delete the local files and remove from git:\n');
	console.log('  rm static/images/monogram.webp static/images/monogram.png static/images/og-image.svg');
	console.log('  git rm static/images/monogram.webp static/images/monogram.png static/images/og-image.svg');
	console.log('  git add -A && git commit -m "fix: move PII images from repo to Vercel Blob"');
	console.log('═══════════════════════════════════════════════');
}

main().catch((err) => {
	console.error('❌ Upload failed:', err);
	process.exit(1);
});
