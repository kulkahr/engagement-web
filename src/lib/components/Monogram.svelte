<script lang="ts">
	import { ENV_IMAGE_MONOGRAM, ENV_IMAGE_MONOGRAM_FALLBACK } from '$lib/env';
	import { EVENT } from '$lib/data/event';

	let { size = 'small' }: { size?: 'small' | 'large' } = $props();

	let altText = $derived(`${EVENT.couple.groom.nameEn} × ${EVENT.couple.bride.nameEn}`);
</script>

<div
	class="monogram"
	class:monogram-small={size === 'small'}
	class:monogram-large={size === 'large'}
>
	<picture>
		<source srcset={ENV_IMAGE_MONOGRAM} type="image/webp" />
		<img
			src={ENV_IMAGE_MONOGRAM_FALLBACK}
			alt={altText}
			class="monogram-img"
			fetchpriority="high"
		/>
	</picture>
</div>

<style>
	.monogram {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.monogram-img {
		display: block;
		width: auto;
		max-width: 100%;
		object-fit: contain;
		transition: transform var(--transition-fast), filter var(--transition-fast);
	}

	.monogram-small {
		height: 34px;
	}

	.monogram-small .monogram-img {
		height: 34px;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.06));
	}

	.monogram-small:hover .monogram-img {
		transform: scale(1.08);
		filter: drop-shadow(0 2px 6px rgba(var(--color-primary-rgb), 0.25));
	}

	.monogram-large {
		height: 150px;
	}

	.monogram-large .monogram-img {
		height: 150px;
		filter: drop-shadow(0 3px 12px rgba(0, 0, 0, 0.1));
		animation: monogramFloat 3s ease-in-out infinite;
		animation-delay: 0.2s;
	}

	.monogram-large:hover .monogram-img {
		transform: scale(1.03);
	}

	@keyframes monogramFloat {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-8px); }
	}

	@media (max-width: 640px) {
		.monogram-large { height: 120px; }
		.monogram-large .monogram-img { height: 120px; }
	}

	@media (max-width: 480px) {
		.monogram-large { height: 100px; }
		.monogram-large .monogram-img { height: 100px; }
	}

	@media (max-width: 768px) {
		.monogram-small { height: 30px; }
		.monogram-small .monogram-img { height: 30px; }
	}
</style>
