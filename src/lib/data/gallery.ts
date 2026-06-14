import { EVENT } from './event';
import { GALLERY_PHOTOS as GENERATED_PHOTOS } from './gallery-photos';

export interface GalleryPhoto {
	id: string;
	thumbnailUrl: string;
	fullUrl: string;
	alt: string;
	width: number;
	height: number;
}

/**
 * Gallery photos loaded from Google Drive via build-time script.
 *
 * To refresh:
 *   1. Upload photos to the shared Drive folder
 *   2. Run: GOOGLE_DRIVE_API_KEY=your_key npm run build:photos
 *   3. Run: npm run build
 *
 * Falls back to an empty array if the folder has no photos yet
 * (the gallery page shows a friendly empty state).
 */
export const GALLERY_PHOTOS: GalleryPhoto[] =
	GENERATED_PHOTOS.length > 0
		? GENERATED_PHOTOS
		: [];

/**
 * Generate Google Drive full-size image URL from file ID.
 * Uses the thumbnail API at w1200 for reliable cross-origin serving.
 */
export function getGoogleDriveImageUrl(fileId: string): string {
	return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
}

/**
 * Generate Google Drive thumbnail URL (smaller size for gallery grid).
 * Google provides a thumbnail for each file that can be used directly.
 */
export function getGoogleDriveThumbnailUrl(fileId: string): string {
	return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`;
}

/**
 * Helper to parse Google Drive file IDs from a shared folder URL.
 * Use this if you want to reference files by their shareable links.
 */
export function extractFileIdFromUrl(url: string): string | null {
	// Matches patterns like:
	// https://drive.google.com/file/d/FILE_ID/view
	// https://drive.google.com/open?id=FILE_ID
	const patterns = [
		/file\/d\/([a-zA-Z0-9_-]+)/,
		/[?&]id=([a-zA-Z0-9_-]+)/
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match) {
			return match[1];
		}
	}

	return null;
}

/**
 * Get the Google Drive folder link for sharing.
 */
export function getGoogleDriveFolderUrl(): string {
	return EVENT.googleDrive.folderUrl;
}
