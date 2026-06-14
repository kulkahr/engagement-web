<script lang="ts">
	import { getLangContext } from '$lib/utils/i18n';
	import { CONTENT } from '$lib/data/content';
	import { renderContent } from '$lib/utils/content';
	import { EVENT } from '$lib/data/event';
	import { GALLERY_PHOTOS, getGoogleDriveFolderUrl, type GalleryPhoto } from '$lib/data/gallery';
	import Lightbox from '$lib/components/Lightbox.svelte';

	let lang = getLangContext();

	let photos = $state<GalleryPhoto[]>([...GALLERY_PHOTOS]);
	let lightboxIndex = $state<number | null>(null);
</script>

<svelte:head>
	<title>{CONTENT[$lang].gallery.heading} — {EVENT.couple.groom.nameEn} × {EVENT.couple.bride.nameEn}</title>
	<meta name="description" content={renderContent(CONTENT[$lang].gallery.description, $lang)} />
</svelte:head>

<section class="section reveal">
	<div class="container">
		<div class="text-center">
			<div class="lotus-divider">
				<span class="lotus-divider-icon">📸</span>
			</div>
			<h1 class="heading-2">
				{CONTENT[$lang].gallery.heading}
				{#if photos.length > 0}
					<span class="photo-count-badge">{photos.length}</span>
				{/if}
			</h1>
			<p class="body-text">
				{CONTENT[$lang].gallery.subheading}
				{#if photos.length > 0}
					<span class="photo-count-text">— {photos.length} {$lang === 'mr' ? 'फोटो' : 'photo'}{photos.length !== 1 ? 's' : ''}</span>
				{/if}
			</p>
		</div>

		<div class="upload-section card reveal delay-1">
			<div class="upload-content">
				<span class="upload-icon">📸</span>
				<h2 class="heading-3">{CONTENT[$lang].gallery.uploadHeading}</h2>
				<p class="body-text upload-text">
					{CONTENT[$lang].gallery.uploadText}
				</p>
				<a
					href={getGoogleDriveFolderUrl()}
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-primary btn-lg"
				>
					{CONTENT[$lang].gallery.uploadButton}
				</a>
				<p class="upload-note">
					{$lang === 'mr' ? '🔗 लिंक कोणालाही शेअर करू शकता' : '🔗 Anyone with the link can upload'}
				</p>
			</div>
		</div>

		<div class="gallery-divider">
			<div class="lotus-divider">
				<span class="lotus-divider-icon">🖼️</span>
			</div>
		</div>

		{#if photos.length === 0}
			<div class="gallery-empty card text-center">
				<p>📷 {CONTENT[$lang].gallery.noPhotos}</p>
			</div>
		{:else}
			<div class="gallery-grid">
				{#each photos as photo, i}
					<button
						class="gallery-item"
						onclick={() => lightboxIndex = i}
						aria-label="{CONTENT[$lang].gallery.viewFull}: {photo.alt}"
					>
						<img
							src={photo.thumbnailUrl}
							alt={photo.alt}
							class="gallery-image"
							loading="lazy"
						/>
						<div class="gallery-item-overlay">
							<span class="gallery-item-icon">🔍</span>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</section>

{#if lightboxIndex !== null}
	<Lightbox
		photos={photos}
		index={lightboxIndex}
		onclose={() => lightboxIndex = null}
	/>
{/if}

<style>
	/* Upload section */
	.upload-section {
		max-width: 500px;
		margin: 0 auto var(--space-xl);
		padding: var(--space-xl);
		text-align: center;
		background: linear-gradient(135deg, var(--color-bg-card), var(--color-bg-alt));
		border: 2px dashed var(--color-border-decorative);
		border-radius: var(--radius-xl);
		transition: all var(--transition-base);
	}

	.upload-section:hover {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-md);
		transform: translateY(-2px);
	}

	.upload-icon {
		font-size: var(--text-3xl);
		display: block;
		margin-bottom: var(--space-md);
		animation: float 3s ease-in-out infinite;
	}

	.upload-text {
		margin: var(--space-md) 0 var(--space-lg);
		max-width: 380px;
		margin-left: auto;
		margin-right: auto;
	}

	.upload-note {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin-top: var(--space-md);
		font-weight: 500;
	}

	.gallery-divider {
		margin-bottom: var(--space-lg);
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: var(--space-md);
	}

	@media (max-width: 640px) {
		.gallery-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-sm);
		}
	}

	@media (max-width: 400px) {
		.gallery-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.gallery-item {
		position: relative;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		border-radius: var(--radius-xl);
		cursor: pointer;
		background: var(--color-bg-dark);
		transition: transform var(--transition-base), box-shadow var(--transition-base);
		box-shadow: var(--shadow-sm);
	}

	.gallery-item:hover {
		transform: scale(1.03) translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	.gallery-item:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.gallery-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--transition-slow);
	}

	.gallery-item:hover .gallery-image {
		transform: scale(1.08);
	}

	.gallery-item-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(var(--color-text-rgb), 0.3) 0%,
			transparent 50%
		);
		opacity: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity var(--transition-base);
	}

	.gallery-item:hover .gallery-item-overlay {
		opacity: 1;
	}

	.gallery-item-icon {
		font-size: var(--text-2xl);
		opacity: 0;
		transform: scale(0.8) translateY(10px);
		transition: all var(--transition-base);
		background: rgba(255, 255, 255, 0.9);
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		color: var(--color-text);
	}

	.gallery-item:hover .gallery-item-icon {
		opacity: 1;
		transform: scale(1) translateY(0);
	}

	/* Empty state */
	.gallery-empty {
		margin-top: var(--space-xl);
		padding: var(--space-2xl);
	}
</style>
