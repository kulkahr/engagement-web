import { EVENT_DATE } from '$lib/data/event';

export interface Countdown {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	total: number;
	isOver: boolean;
}

export function getCountdown(targetDate: Date = EVENT_DATE): Countdown {
	const now = new Date();
	const total = targetDate.getTime() - now.getTime();

	if (total <= 0) {
		return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, isOver: true };
	}

	const seconds = Math.floor((total / 1000) % 60);
	const minutes = Math.floor((total / (1000 * 60)) % 60);
	const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
	const days = Math.floor(total / (1000 * 60 * 60 * 24));

	return { days, hours, minutes, seconds, total, isOver: false };
}

export function formatDate(dateStr: string, lang: 'mr' | 'en'): string {
	const date = new Date(dateStr);

	if (lang === 'mr') {
		const marathiMonths = [
			'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल',
			'मे', 'जून', 'जुलै', 'ऑगस्ट',
			'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
		];
		const marathiDays = [
			'रविवार', 'सोमवार', 'मंगळवार', 'बुधवार',
			'गुरुवार', 'शुक्रवार', 'शनिवार'
		];
		return `${marathiDays[date.getDay()]}, ${date.getDate()} ${marathiMonths[date.getMonth()]} ${date.getFullYear()}`;
	}

	return date.toLocaleDateString('en-IN', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

export function formatTime(time24: string, lang: 'mr' | 'en'): string {
	if (lang === 'mr') return time24; // Keep as is for Marathi

	const [h, m] = time24.split(':').map(Number);
	const period = h >= 12 ? 'PM' : 'AM';
	const h12 = h % 12 || 12;
	return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}
