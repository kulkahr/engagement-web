/**
 * Content rendering utility — replaces {placeholders} in content strings
 * with actual values from the EVENT config at render time.
 *
 * This allows content.ts to use templates like "{groom} & {bride}'s engagement"
 * without hardcoding personal names, dates, or locations.
 *
 * Usage:
 *   import { renderContent } from '$lib/utils/content';
 *   renderContent(CONTENT[$lang].rsvp.description, $lang)
 */

import { TEMPLATE_DATA } from '$lib/data/event';
import type { Lang } from '$lib/data/content';

/**
 * Replace {placeholders} in a template string with values from TEMPLATE_DATA.
 * For bilingual placeholders, appends _mr or _en suffix based on the current language.
 *
 * Example:
 *   template = "{groom} & {bride}'s engagement"
 *   lang = 'en'
 *   → "[Groom Name] & [Bride Name]'s engagement"
 *
 * @param template - String with {placeholder} tokens
 * @param lang - Current language ('mr' | 'en')
 * @returns The rendered string
 */	export function renderContent(template: string, lang: Lang): string {
	let result = template;

	// Replace bilingual placeholders — maps to Marathi or English values
	result = result.replaceAll('{groom}', lang === 'mr' ? TEMPLATE_DATA.groom : TEMPLATE_DATA.groom_en);
	result = result.replaceAll('{bride}', lang === 'mr' ? TEMPLATE_DATA.bride : TEMPLATE_DATA.bride_en);
	result = result.replaceAll('{venue}', TEMPLATE_DATA.venue);
	result = result.replaceAll('{location}', TEMPLATE_DATA.location);
	result = result.replaceAll('{date}', TEMPLATE_DATA.date);
	result = result.replaceAll('{panchang}', TEMPLATE_DATA.panchang);
	result = result.replaceAll('{groom_father}', TEMPLATE_DATA.groom_father);
	result = result.replaceAll('{bride_father}', TEMPLATE_DATA.bride_father);
	result = result.replaceAll('{groom_father_name}', TEMPLATE_DATA.groom_father_name);
	result = result.replaceAll('{bride_father_name}', TEMPLATE_DATA.bride_father_name);
	result = result.replaceAll('{deadline}', lang === 'mr' ? TEMPLATE_DATA.deadline_mr : TEMPLATE_DATA.deadline_en);
	result = result.replaceAll('{deadline_mr}', TEMPLATE_DATA.deadline_mr);
	result = result.replaceAll('{deadline_en}', TEMPLATE_DATA.deadline_en);
	result = result.replaceAll('{footer_hosts}', lang === 'mr' ? TEMPLATE_DATA.footer_hosts_mr : TEMPLATE_DATA.footer_hosts_en);

	return result;
}
