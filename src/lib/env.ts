/**
 * Central env config — loads all personal data from PUBLIC_ env vars at build time.
 *
 * Each env var is a JSON string that groups related data.
 * See .env.example for the expected schema.
 *
 * Falls back gracefully with placeholder values if env vars aren't set,
 * allowing the project to build and run (with visible indicators).
 */

import {
	PUBLIC_COUPLE,
	PUBLIC_VENUE,
	PUBLIC_EVENT,
	PUBLIC_TIMINGS,
	PUBLIC_CONTACTS,
	PUBLIC_DRIVE,
	PUBLIC_MAP_LINKS,
	PUBLIC_IMAGE_MONOGRAM,
	PUBLIC_IMAGE_MONOGRAM_FALLBACK,
	PUBLIC_IMAGE_OG,
	PUBLIC_RSVP_DEADLINE_MR,
	PUBLIC_RSVP_DEADLINE_EN,
	PUBLIC_FOOTER_HOSTS_MR,
	PUBLIC_FOOTER_HOSTS_EN,
	PUBLIC_PHONE_GROOM_FATHER,
	PUBLIC_PHONE_BRIDE_FATHER
} from '$env/static/public';

// ── Types ───────────────────────────────────────────────

export interface CouplePerson {
	name: string;   // Marathi
	nameEn: string; // English
	father: string;
	mother: string;
}

export interface CoupleData {
	groom: CouplePerson;
	bride: CouplePerson;
}

export interface MapLinksData {
	google: string;
	apple: string;
	mappls: string;
}

export interface VenueData {
	name: string;
	nameEn: string;
	address: string;
	addressEn: string;
	city: string;
	cityEn: string;
	pincode: string;
	coordinates: { lat: number; lng: number };
	whatsappLocation: string;
}

export interface EventData {
	type: string;
	typeEn: string;
	date: string;
	time: string;
	timeEn: string;
	panchang: string;
	panchangEn: string;
}

export interface TimingItem {
	label: string;
	labelEn: string;
	time: string;
	timeEn: string;
}

export interface ContactPerson {
	name: string;
	nameEn: string;
	relationship: string;
	relationshipEn: string;
	phone: string;
}

export interface DriveData {
	folderUrl: string;
	folderId: string;
}

// ── Helper: safely parse JSON with fallback ──────────────

function parseJson<T>(raw: string | undefined, fallback: T, label: string): T {
	if (typeof raw !== 'string' || !raw.trim()) {
		if (import.meta.env.DEV) {
			console.warn(`⚠️  ${label} not set in .env — using placeholder values. See .env.example.`);
		}
		return fallback;
	}
	try {
		return JSON.parse(raw) as T;
	} catch {
		if (import.meta.env.DEV) {
			console.warn(`⚠️  ${label} has invalid JSON — using placeholder values.`);
		}
		return fallback;
	}
}

// ── Fallback values (visible indicators to prompt config) ─

const FALLBACK_COUPLE: CoupleData = {
	groom: { name: '[GROOM_NAME_MR]', nameEn: '[GROOM_NAME_EN]', father: '[GROOM_FATHER_MR]', mother: '[GROOM_MOTHER_MR]' },
	bride: { name: '[BRIDE_NAME_MR]', nameEn: '[BRIDE_NAME_EN]', father: '[BRIDE_FATHER_MR]', mother: '[BRIDE_MOTHER_MR]' }
};

const FALLBACK_MAP_LINKS: MapLinksData = {
	google: '',
	apple: '',
	mappls: ''
};

const FALLBACK_VENUE: VenueData = {
	name: '[VENUE_NAME_MR]', nameEn: '[VENUE_NAME_EN]',
	address: '[VENUE_ADDRESS_MR]', addressEn: '[VENUE_ADDRESS_EN]',
	city: '[VENUE_CITY_MR]', cityEn: '[VENUE_CITY_EN]',
	pincode: '000000',
	coordinates: { lat: 0, lng: 0 },
	whatsappLocation: '[VENUE_NAME_EN]'
};

const FALLBACK_EVENT: EventData = {
	type: 'साखरपुडा', typeEn: 'Engagement',
	date: '2026-01-01', time: '00:00', timeEn: '12:00 AM',
	panchang: '[PANCHANG_MR]', panchangEn: '[PANCHANG_EN]'
};

const FALLBACK_TIMINGS: TimingItem[] = [
	{ label: '[TIMING_1_MR]', labelEn: '[TIMING_1_EN]', time: '--:--', timeEn: '--:--' },
	{ label: '[TIMING_2_MR]', labelEn: '[TIMING_2_EN]', time: '--:--', timeEn: '--:--' },
	{ label: '[TIMING_3_MR]', labelEn: '[TIMING_3_EN]', time: '--:--', timeEn: '--:--' }
];

const FALLBACK_CONTACTS: ContactPerson[] = [
	{ name: '[CONTACT_1_NAME_MR]', nameEn: '[CONTACT_1_NAME_EN]', relationship: '[CONTACT_1_REL_MR]', relationshipEn: '[CONTACT_1_REL_EN]', phone: '[PHONE_NOT_CONFIGURED]' },
	{ name: '[CONTACT_2_NAME_MR]', nameEn: '[CONTACT_2_NAME_EN]', relationship: '[CONTACT_2_REL_MR]', relationshipEn: '[CONTACT_2_REL_EN]', phone: '[PHONE_NOT_CONFIGURED]' }
];

const FALLBACK_DRIVE: DriveData = {
	folderUrl: '',
	folderId: ''
};

// ── Parsed exports ───────────────────────────────────────

export const ENV_IMAGE_MONOGRAM: string = typeof PUBLIC_IMAGE_MONOGRAM === 'string' && PUBLIC_IMAGE_MONOGRAM.trim() ? PUBLIC_IMAGE_MONOGRAM : '/images/monogram.webp';
export const ENV_IMAGE_MONOGRAM_FALLBACK: string = typeof PUBLIC_IMAGE_MONOGRAM_FALLBACK === 'string' && PUBLIC_IMAGE_MONOGRAM_FALLBACK.trim() ? PUBLIC_IMAGE_MONOGRAM_FALLBACK : '/images/monogram.png';
export const ENV_IMAGE_OG: string = typeof PUBLIC_IMAGE_OG === 'string' && PUBLIC_IMAGE_OG.trim() ? PUBLIC_IMAGE_OG : '/images/og-image.svg';
export const ENV_RSVP_DEADLINE_MR: string = typeof PUBLIC_RSVP_DEADLINE_MR === 'string' && PUBLIC_RSVP_DEADLINE_MR.trim() ? PUBLIC_RSVP_DEADLINE_MR : '१ ऑगस्ट २०२६';
export const ENV_RSVP_DEADLINE_EN: string = typeof PUBLIC_RSVP_DEADLINE_EN === 'string' && PUBLIC_RSVP_DEADLINE_EN.trim() ? PUBLIC_RSVP_DEADLINE_EN : 'August 1, 2026';
export const ENV_FOOTER_HOSTS_MR: string = typeof PUBLIC_FOOTER_HOSTS_MR === 'string' && PUBLIC_FOOTER_HOSTS_MR.trim() ? PUBLIC_FOOTER_HOSTS_MR : 'कुलकर्णी आणि काळे कुटुंब';
export const ENV_FOOTER_HOSTS_EN: string = typeof PUBLIC_FOOTER_HOSTS_EN === 'string' && PUBLIC_FOOTER_HOSTS_EN.trim() ? PUBLIC_FOOTER_HOSTS_EN : 'Kulkarni & Kale Families';

export const ENV_COUPLE = parseJson<CoupleData>(PUBLIC_COUPLE, FALLBACK_COUPLE, 'PUBLIC_COUPLE');
export const ENV_VENUE = parseJson<VenueData>(PUBLIC_VENUE, FALLBACK_VENUE, 'PUBLIC_VENUE');
export const ENV_MAP_LINKS = parseJson<MapLinksData>(PUBLIC_MAP_LINKS, FALLBACK_MAP_LINKS, 'PUBLIC_MAP_LINKS');
export const ENV_EVENT = parseJson<EventData>(PUBLIC_EVENT, FALLBACK_EVENT, 'PUBLIC_EVENT');
export const ENV_TIMINGS = parseJson<TimingItem[]>(PUBLIC_TIMINGS, FALLBACK_TIMINGS, 'PUBLIC_TIMINGS');
export const ENV_CONTACTS = parseJson<Omit<ContactPerson, 'phone'>[]>(PUBLIC_CONTACTS, FALLBACK_CONTACTS, 'PUBLIC_CONTACTS');
export const ENV_DRIVE = parseJson<DriveData>(PUBLIC_DRIVE, FALLBACK_DRIVE, 'PUBLIC_DRIVE');
export const ENV_PHONE_GROOM_FATHER: string = typeof PUBLIC_PHONE_GROOM_FATHER === 'string' ? PUBLIC_PHONE_GROOM_FATHER : '[PHONE_NOT_CONFIGURED]';
export const ENV_PHONE_BRIDE_FATHER: string = typeof PUBLIC_PHONE_BRIDE_FATHER === 'string' ? PUBLIC_PHONE_BRIDE_FATHER : '[PHONE_NOT_CONFIGURED]';

// ── Build contacts with phones merged in ─────────────────

export const ENV_CONTACTS_WITH_PHONES: ContactPerson[] = ENV_CONTACTS.map((c, i) => ({
	...c,
	phone: i === 0 ? ENV_PHONE_GROOM_FATHER : ENV_PHONE_BRIDE_FATHER
}));
