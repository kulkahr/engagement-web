<script lang="ts">
	import { getLangContext } from '$lib/utils/i18n';
	import { CONTENT, type Lang } from '$lib/data/content';
	import type { Countdown } from '$lib/utils/date';

	let lang = getLangContext();

	let { countdown }: { countdown: Countdown } = $props();

	const units = $derived.by(() => {
		const l = $lang;
		return [
			{ value: countdown.days, label: CONTENT[l].countdown.days },
			{ value: countdown.hours, label: CONTENT[l].countdown.hours },
			{ value: countdown.minutes, label: CONTENT[l].countdown.minutes },
			{ value: countdown.seconds, label: CONTENT[l].countdown.seconds }
		];
	});
</script>

{#if !countdown.isOver}
	<div class="countdown" role="timer" aria-label="Countdown to engagement">
		{#each units as unit}
			<div class="countdown-unit">
				<div class="countdown-circle">
					<span class="countdown-value">
						{String(unit.value).padStart(2, '0')}
					</span>
				</div>
				<span class="countdown-label">{unit.label}</span>
			</div>
			{#if unit !== units[units.length - 1]}
				<span class="countdown-sep">:</span>
			{/if}
		{/each}
	</div>
{:else}
	<div class="countdown-started">
		<div class="started-icon">🎊</div>
		<p class="started-text">{CONTENT[$lang].countdown.eventStarted}</p>
		<p class="started-sub">{$lang === 'mr' ? 'आजचा दिवस खास आहे!' : 'Today is the special day!'}</p>
	</div>
{/if}

<style>
	.countdown {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-md);
		margin: var(--space-2xl) 0;
		flex-wrap: wrap;
	}

	.countdown-unit {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-sm);
	}

	.countdown-circle {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: var(--color-bg-card);
		border: 2px solid var(--color-border-light);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--shadow-sm);
		position: relative;
		transition: border-color var(--transition-base), box-shadow var(--transition-base);
	}

	.countdown-circle:hover {
		border-color: var(--color-primary-light);
		box-shadow: var(--shadow-md);
	}

	.countdown-value {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-primary);
		line-height: 1;
		font-variant-numeric: tabular-nums;
		letter-spacing: 1px;
		font-family: var(--font-body);
	}

	.countdown-label {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 1.5px;
		font-weight: 600;
	}

	.countdown-sep {
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-border-decorative);
		margin-top: calc(-1 * var(--space-xl));
		animation: pulse 1s ease-in-out infinite;
		opacity: 0.5;
	}

	/* Event Started State */
	.countdown-started {
		margin: var(--space-2xl) 0;
		padding: var(--space-xl);
		text-align: center;
		animation: scaleInBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.started-icon {
		font-size: var(--text-5xl);
		margin-bottom: var(--space-md);
		animation: float 2s ease-in-out infinite;
	}

	.started-text {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-primary);
		margin-bottom: var(--space-sm);
		line-height: 1.3;
	}

	.started-sub {
		font-size: var(--text-base);
		color: var(--color-text-muted);
		font-weight: 500;
	}

	@media (max-width: 640px) {
		.countdown {
			gap: var(--space-sm);
		}

		.countdown-circle {
			width: 64px;
			height: 64px;
		}

		.countdown-value {
			font-size: var(--text-xl);
		}

		.countdown-sep {
			font-size: var(--text-lg);
			margin-top: calc(-1 * var(--space-lg));
		}
	}

	@media (max-width: 400px) {
		.countdown {
			gap: var(--space-xs);
		}

		.countdown-circle {
			width: 56px;
			height: 56px;
			border-width: 1.5px;
		}

		.countdown-value {
			font-size: var(--text-lg);
		}
	}
</style>
