import { getContext, setContext } from 'svelte';
import { CONTENT, type Lang } from '$lib/data/content';
import { writable, type Writable } from 'svelte/store';

const LANG_KEY = Symbol('lang');

// Detect browser language, defaulting to Marathi for Indian users
function detectLanguage(): Lang {
	if (globalThis.window === undefined) return 'mr';
	const lang = navigator.language || navigator.languages?.[0] || '';
	// Marathi: mr, mr-IN - default to English for all other languages
	return lang.startsWith('mr') ? 'mr' : 'en';
}	export function createLangStore(): Writable<Lang> {
	const stored = globalThis.localStorage === undefined
		? null
		: localStorage.getItem('lang') as Lang | null;
	const initial = stored || detectLanguage();
	const store = writable<Lang>(initial);

	store.subscribe((value) => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('lang', value);
		}
		if (typeof document !== 'undefined') {
			document.documentElement.lang = value === 'mr' ? 'mr' : 'en';
			document.documentElement.dir = 'ltr';
		}
	});

	return store;
}

export function setLangContext(lang: Writable<Lang>) {
	setContext(LANG_KEY, lang);
}

export function getLangContext(): Writable<Lang> {
	return getContext<Writable<Lang>>(LANG_KEY);
}

// Type-safe text resolver with variable interpolation
export function t(key: string, lang: Lang, vars?: Record<string, string>): string {
	const keys = key.split('.');
	let value: unknown = CONTENT[lang];

	for (const k of keys) {
		if (value && typeof value === 'object' && k in value) {
			value = (value as Record<string, unknown>)[k];
		} else {
			return key;
		}
	}

	if (typeof value !== 'string') return key;

	if (vars) {
		return value.replace(/\{(\w+)\}/g, (_, v) => vars[v] || `{${v}}`);
	}

	return value;
}
