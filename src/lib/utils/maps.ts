import { browser } from '$app/environment';

export interface Coordinates {
	lat: number;
	lng: number;
}

export interface MapLinks {
	google: string;
	apple: string;
	mappls: string;
	googleWeb: string;
}

export function getMapLinks(coords: Coordinates, placeName: string): MapLinks {
	const encodedPlace = encodeURIComponent(placeName);

	return {
		google: `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}&destination_place_id=${encodedPlace}`,
		apple: `https://maps.apple.com/?daddr=${coords.lat},${coords.lng}&q=${encodedPlace}`,
		mappls: `https://maps.mappls.com/?daddr=${coords.lat},${coords.lng}&name=${encodedPlace}`,
		googleWeb: `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
	};
}	export function openGoogleMaps(coords: Coordinates, placeName: string, directUrl?: string): void {
		if (!browser) return;

		if (directUrl) {
			window.open(directUrl, '_blank', 'noopener,noreferrer');
			return;
		}

		const links = getMapLinks(coords, placeName);
		
		// Try native app first
		const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
		const isAndroid = /Android/i.test(navigator.userAgent);

		if (isIOS) {
			window.open(links.apple, '_blank', 'noopener,noreferrer');
		} else if (isAndroid) {
			window.open(`intent://maps.google.com/maps?daddr=${coords.lat},${coords.lng}#Intent;scheme=https;package=com.google.android.apps.maps;end`, '_blank', 'noopener,noreferrer');
		} else {
			window.open(links.googleWeb, '_blank', 'noopener,noreferrer');
		}
	}

	export function openAppleMaps(coords: Coordinates, placeName: string, directUrl?: string): void {
		if (!browser) return;

		if (directUrl) {
			window.open(directUrl, '_blank', 'noopener,noreferrer');
			return;
		}

		const links = getMapLinks(coords, placeName);
		const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

		if (isIOS) {
			window.open(links.apple, '_blank', 'noopener,noreferrer');
		} else {
			window.open(links.googleWeb, '_blank', 'noopener,noreferrer');
		}
	}

	export function openMappls(coords: Coordinates, placeName: string, directUrl?: string): void {
		if (!browser) return;

		if (directUrl) {
			window.open(directUrl, '_blank', 'noopener,noreferrer');
			return;
		}

		const links = getMapLinks(coords, placeName);
		window.open(links.mappls, '_blank', 'noopener,noreferrer');
	}

	export function copyAddress(address: string): Promise<boolean> {
	if (!browser) return Promise.resolve(false);

	if (navigator.clipboard && navigator.clipboard.writeText) {
		return navigator.clipboard.writeText(address)
			.then(() => true)
			.catch(() => false);
	}

	// Fallback for older browsers
	try {
		const textarea = document.createElement('textarea');
		textarea.value = address;
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(textarea);
		return Promise.resolve(true);
	} catch {
		return Promise.resolve(false);
	}
}
