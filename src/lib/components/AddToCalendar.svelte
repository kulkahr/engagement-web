<script lang="ts">
	import { getLangContext } from '$lib/utils/i18n';
	import { CONTENT } from '$lib/data/content';
	import { EVENT, EVENT_DATE } from '$lib/data/event';

	let lang = getLangContext();
	let isOpen = $state(false);

	function generateGoogleCalUrl() {
		const start = EVENT_DATE.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
		const end = new Date(EVENT_DATE.getTime() + 3 * 60 * 60 * 1000)
			.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
		const params = new URLSearchParams({
			action: 'TEMPLATE',
			text: `${EVENT.couple.groom.nameEn} & ${EVENT.couple.bride.nameEn} - ${EVENT.ceremony.typeEn}`,
			dates: `${start}/${end}`,
			details: `${EVENT.ceremony.typeEn} ceremony of ${EVENT.couple.groom.nameEn} and ${EVENT.couple.bride.nameEn}. Venue: ${EVENT.venue.nameEn}, ${EVENT.venue.addressEn}, ${EVENT.venue.cityEn}`,
			location: `${EVENT.venue.nameEn}, ${EVENT.venue.addressEn}, ${EVENT.venue.cityEn}, ${EVENT.venue.pincode}`
		});
		return `https://calendar.google.com/calendar/render?${params.toString()}`;
	}

	function generateIcsContent() {
		const start = EVENT_DATE.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
		const end = new Date(EVENT_DATE.getTime() + 3 * 60 * 60 * 1000)
			.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
		return [
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'PRODID:-//Engagement Invitation//EN',
			'BEGIN:VEVENT',
			`DTSTART:${start}`,
			`DTEND:${end}`,
			`SUMMARY:${EVENT.couple.groom.nameEn} & ${EVENT.couple.bride.nameEn} - ${EVENT.ceremony.typeEn}`,
			`DESCRIPTION:${EVENT.ceremony.typeEn} ceremony`,
			`LOCATION:${EVENT.venue.nameEn}, ${EVENT.venue.addressEn}, ${EVENT.venue.cityEn}`,
			'END:VEVENT',
			'END:VCALENDAR'
		].join('\n');
	}

	function downloadIcs() {
		const blob = new Blob([generateIcsContent()], { type: 'text/calendar;charset=utf-8' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'engagement.ics';
		link.click();
		URL.revokeObjectURL(link.href);
		isOpen = false;
	}
</script>

<div class="calendar-wrapper">
	<button
		class="btn btn-secondary"
		onclick={() => isOpen = !isOpen}
		aria-expanded={isOpen}
	>
		📅 {CONTENT[$lang].addToCalendar.button}
	</button>

	{#if isOpen}
		<div class="calendar-dropdown">
			<button class="calendar-option" onclick={() => { window.open(generateGoogleCalUrl(), '_blank', 'noopener,noreferrer'); isOpen = false; }}>
				<span class="calendar-option-icon">🔴</span>
				{CONTENT[$lang].addToCalendar.google}
			</button>
			<button class="calendar-option" onclick={downloadIcs}>
				<span class="calendar-option-icon">🔵</span>
				{CONTENT[$lang].addToCalendar.apple}
			</button>
			<button class="calendar-option" onclick={downloadIcs}>
				<span class="calendar-option-icon">🟠</span>
				{CONTENT[$lang].addToCalendar.outlook}
			</button>
		</div>
	{/if}
</div>

{#if isOpen}
	<!-- Backdrop to close dropdown -->
	<div class="calendar-backdrop" onclick={() => isOpen = false} role="presentation"></div>
{/if}

<style>
	.calendar-wrapper {
		position: relative;
		display: inline-block;
	}

	.calendar-dropdown {
		position: absolute;
		top: calc(100% + var(--space-sm));
		left: 50%;
		transform: translateX(-50%);
		background: var(--color-bg-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		overflow: hidden;
		z-index: var(--z-dropdown);
		min-width: 200px;
		animation: scaleIn 0.2s ease;
	}

	.calendar-option {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		width: 100%;
		padding: var(--space-sm) var(--space-md);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text);
		transition: background var(--transition-fast);
		text-align: left;
		border-radius: 0;
	}

	.calendar-option:hover {
		background: var(--color-bg-alt);
	}

	.calendar-option:not(:last-child) {
		border-bottom: 1px solid var(--color-border-light);
	}

	.calendar-option-icon {
		font-size: var(--text-base);
	}

	.calendar-backdrop {
		position: fixed;
		inset: 0;
		z-index: calc(var(--z-dropdown) - 1);
	}
</style>
