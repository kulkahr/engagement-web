/**
 * Event configuration — built from PUBLIC_ env vars at build time.
 *
 * All personal information (names, dates, locations, contacts) is loaded
 * from grouped JSON env vars via src/lib/env.ts. See .env.example.
 */

import {
	ENV_COUPLE,
	ENV_VENUE,
	ENV_EVENT,
	ENV_TIMINGS,
	ENV_CONTACTS_WITH_PHONES,
	ENV_DRIVE,
	ENV_MAP_LINKS,
	ENV_RSVP_DEADLINE_MR,
	ENV_RSVP_DEADLINE_EN,
	ENV_FOOTER_HOSTS_MR,
	ENV_FOOTER_HOSTS_EN
} from '$lib/env';

// ── Dress code (general guidance, not personal data) ─────
const DRESS_CODE = {
	mr: 'पारंपरिक वेशभूषा (साडी / पँट-शर्ट)',
	en: 'Traditional attire (Sari / Kurta-Pyjama or Formal)'
} as const;

// ── EVENT object — fully populated from env vars ─────────
export const EVENT = {
	couple: ENV_COUPLE,
	ceremony: ENV_EVENT,
	venue: {
		...ENV_VENUE,
		mapLinks: ENV_MAP_LINKS
	},
	timings: ENV_TIMINGS,
	contacts: ENV_CONTACTS_WITH_PHONES,
	dressCode: DRESS_CODE,
	googleDrive: ENV_DRIVE
};

// ── Computed exports ─────────────────────────────────────

export const EVENT_DATE = new Date(EVENT.ceremony.date + 'T' + EVENT.ceremony.time + ':00');

/**
 * Template data for rendering content strings with placeholders.
 * Used by renderContent() in $lib/utils/content.ts.
 */
export const TEMPLATE_DATA: Record<string, string> = {
	groom: EVENT.couple.groom.name,
	groom_en: EVENT.couple.groom.nameEn,
	groom_father: EVENT.couple.groom.father,
	groom_father_name: EVENT.contacts[0].nameEn,
	bride: EVENT.couple.bride.name,
	bride_en: EVENT.couple.bride.nameEn,
	bride_father: EVENT.couple.bride.father,
	bride_father_name: EVENT.contacts[1].nameEn,
	venue: EVENT.venue.nameEn,
	venue_city: EVENT.venue.cityEn,
	date: EVENT.ceremony.date,
	date_formatted: EVENT.ceremony.panchangEn,
	location: `${EVENT.venue.cityEn}`,
	panchang: EVENT.ceremony.panchangEn,
	deadline_mr: ENV_RSVP_DEADLINE_MR,
	deadline_en: ENV_RSVP_DEADLINE_EN,
	footer_hosts_mr: ENV_FOOTER_HOSTS_MR,
	footer_hosts_en: ENV_FOOTER_HOSTS_EN
};
