<script lang="ts">
	import { getLangContext } from '$lib/utils/i18n';
	import { CONTENT } from '$lib/data/content';
	import type { GalleryPhoto } from '$lib/data/gallery';

	let lang = getLangContext();

	let { photos, index, onclose }: {
		photos: GalleryPhoto[];
		index: number;
		onclose: () => void;
	} = $props();

	let currentIndex = $state(0);

	$effect(() => {
		currentIndex = index;
	});

	let currentPhoto = $derived(photos[currentIndex]);

	function prev() {
		if (currentIndex > 0) currentIndex--;
	}

	function next() {
		if (currentIndex < photos.length - 1) currentIndex++;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
		if (e.key === 'ArrowLeft') prev();
		if (e.key === 'ArrowRight') next();
	}

	$effect(() => {
		document.addEventListener('keydown', handleKeydown);
		document.body.style.overflow = 'hidden';
		return () => {
			document.removeEventListener('keydown', handleKeydown);
			document.body.style.overflow = '';
		};
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="lightbox-overlay"
	role="dialog"
	aria-modal="true"
	aria-label="Photo viewer"
	tabindex="-1"
	onclick={onclose}
>
	<button
		class="lightbox-close"
		onclick={onclose}
		aria-label={CONTENT[$lang].gallery.close}
	>
		✕
	</button>

	{#if currentIndex > 0}
		<button
			class="lightbox-nav lightbox-prev"
			onclick={(e) => { e.stopPropagation(); prev(); }}
			aria-label="Previous photo"
		>
			‹
		</button>
	{/if}

	{#if currentIndex < photos.length - 1}
		<button
			class="lightbox-nav lightbox-next"
			onclick={(e) => { e.stopPropagation(); next(); }}
			aria-label="Next photo"
		>
			›
		</button>
	{/if}

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="lightbox-content"
		role="presentation"
		onclick={(e) => e.stopPropagation()}
	>
		<img
			src={currentPhoto.fullUrl}
			alt={currentPhoto.alt}
			class="lightbox-image"
			loading="lazy"
		/>
		<div class="lightbox-counter">
			{currentIndex + 1} / {photos.length}
		</div>
	</div>
</div>

<style>
	.lightbox-overlay {
		position: fixed;
		inset: 0;
		background: rgba(var(--color-text-rgb), 0.95);
		z-index: var(--z-modal);
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fadeIn 0.25s ease;
		cursor: pointer;
	}

	.lightbox-close {
		position: absolute;
		top: var(--space-md);
		right: var(--space-md);
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-xl);
		color: white;
		background: rgba(255, 255, 255, 0.12);
		border-radius: var(--radius-pill);
		z-index: 1;
		transition: all var(--transition-fast);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.lightbox-close:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: scale(1.1);
	}

	.lightbox-nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 50px;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-3xl);
		color: white;
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: var(--radius-pill);
		z-index: 1;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.lightbox-nav:hover {
		background: rgba(255, 255, 255, 0.15);
		transform: translateY(-50%) scale(1.1);
	}

	.lightbox-prev {
		left: var(--space-md);
	}

	.lightbox-next {
		right: var(--space-md);
	}

	.lightbox-content {
		position: relative;
		max-width: 90vw;
		max-height: 90vh;
		cursor: default;
		animation: scaleIn 0.3s ease;
	}

	.lightbox-image {
		max-width: 100%;
		max-height: 85vh;
		object-fit: contain;
		border-radius: var(--radius-lg);
		box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
	}

	.lightbox-counter {
		position: absolute;
		bottom: calc(-1 * var(--space-2xl));
		left: 50%;
		transform: translateX(-50%);
		color: rgba(255, 255, 255, 0.5);
		font-size: var(--text-sm);
		padding-top: var(--space-md);
	}

	@media (max-width: 640px) {
		.lightbox-nav {
			width: 40px;
			height: 40px;
			font-size: var(--text-2xl);
		}

		.lightbox-prev {
			left: var(--space-sm);
		}

		.lightbox-next {
			right: var(--space-sm);
		}
	}
</style>
