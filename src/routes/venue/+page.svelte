<script lang="ts">
	import { getLangContext } from '$lib/utils/i18n';
	import { CONTENT } from '$lib/data/content';
	import { renderContent } from '$lib/utils/content';
	import { EVENT } from '$lib/data/event';
	import { openGoogleMaps, openAppleMaps, openMappls, copyAddress } from '$lib/utils/maps';

	let lang = getLangContext();

	let copied = $state(false);

	async function handleCopyAddress() {
		const fullAddress = `${EVENT.venue.nameEn}, ${EVENT.venue.addressEn}, ${EVENT.venue.cityEn}, ${EVENT.venue.pincode}`;
		const success = await copyAddress(fullAddress);
		if (success) {
			copied = true;
			setTimeout(() => copied = false, 2000);
		}
	}

	let fullAddress = $derived(
		$lang === 'mr'
			? `${EVENT.venue.name}, ${EVENT.venue.address}, ${EVENT.venue.city} - ${EVENT.venue.pincode}`
			: `${EVENT.venue.nameEn}, ${EVENT.venue.addressEn}, ${EVENT.venue.cityEn} - ${EVENT.venue.pincode}`
	);
</script>

<svelte:head>
	<title>{CONTENT[$lang].venue.heading} — {EVENT.couple.groom.nameEn} × {EVENT.couple.bride.nameEn}</title>
	<meta name="description" content={renderContent(CONTENT[$lang].venue.description, $lang)} />
</svelte:head>

<section class="section reveal">
	<div class="container-narrow">
		<div class="text-center">
			<div class="lotus-divider">
				<span class="lotus-divider-icon">📍</span>
			</div>
			<h1 class="heading-2">{CONTENT[$lang].venue.heading}</h1>
		</div>

		<!-- Venue Card -->
		<div class="venue-card card card-elevated reveal delay-1">
			<div class="venue-header">
				<h2 class="venue-name">
					{$lang === 'mr' ? EVENT.venue.name : EVENT.venue.nameEn}
				</h2>
			</div>

			<div class="venue-address">
				<h3 class="venue-section-title">{CONTENT[$lang].venue.address}</h3>
				<p class="venue-address-text">{fullAddress}</p>
				<button class="btn btn-sm btn-secondary" onclick={handleCopyAddress}>
					{copied ? '✅ ' + CONTENT[$lang].venue.copied : '📋 ' + CONTENT[$lang].venue.copyAddress}
				</button>
			</div>

			<div class="divider"></div>

			<!-- Map Navigation Buttons -->
			<div class="venue-maps">
				<h3 class="venue-section-title">{CONTENT[$lang].venue.directions}</h3>
				<p class="venue-hint">
					{$lang === 'mr' ? 'तुमच्या आवडत्या नकाशा अ‍ॅपवर नेव्हिगेशन सुरू करा:' : 'Open navigation in your preferred map app:'}
				</p>

				<div class="map-buttons">
					<button
						class="map-btn map-btn-google"
						onclick={() => openGoogleMaps(EVENT.venue.coordinates, EVENT.venue.nameEn, EVENT.venue.mapLinks.google)}
					>
						<span class="map-btn-icon">🗺️</span>
						<span class="map-btn-text">
							<span class="map-btn-label">{CONTENT[$lang].venue.navigateGoogle}</span>
							<span class="map-btn-sub">Google Maps</span>
						</span>
					</button>

					<button
						class="map-btn map-btn-apple"
						onclick={() => openAppleMaps(EVENT.venue.coordinates, EVENT.venue.nameEn, EVENT.venue.mapLinks.apple)}
					>
						<span class="map-btn-icon">🍎</span>
						<span class="map-btn-text">
							<span class="map-btn-label">{CONTENT[$lang].venue.navigateApple}</span>
							<span class="map-btn-sub">Apple Maps</span>
						</span>
					</button>

					<button
						class="map-btn map-btn-mappls"
						onclick={() => openMappls(EVENT.venue.coordinates, EVENT.venue.nameEn, EVENT.venue.mapLinks.mappls)}
					>
						<span class="map-btn-icon">🗺️</span>
						<span class="map-btn-text">
							<span class="map-btn-label">{CONTENT[$lang].venue.navigateMappls}</span>
							<span class="map-btn-sub">MapMyIndia</span>
						</span>
					</button>
				</div>
			</div>

			<div class="divider"></div>

			<!-- Map Preview -->
			<div class="venue-map-preview">
				<a
					href={EVENT.venue.mapLinks.google}
					target="_blank"
					rel="noopener noreferrer"
					class="map-preview-link"
					aria-label="{$lang === 'mr' ? 'गूगल मॅप वर उघडा' : 'Open in Google Maps'}"
				>
					<iframe
						src={`https://www.openstreetmap.org/export/embed.html?bbox=73.0764,19.2075,73.1064,19.2275&layer=mapnik&marker=${EVENT.venue.coordinates.lat},${EVENT.venue.coordinates.lng}`}
						title={`Map showing ${EVENT.venue.nameEn}`}
						class="map-preview-iframe"
						loading="lazy"
					></iframe>
				</a>
			</div>
		</div>

		<!-- Event Timings Card -->
		<div class="card venue-timings reveal delay-2">
			<h3 class="heading-3 text-center">
				{$lang === 'mr' ? 'कार्यक्रम वेळापत्रक' : 'Event Schedule'}
			</h3>
			<div class="timings-list">
				{#each EVENT.timings as timing}
					<div class="timing-item">
						<span class="timing-dot"></span>
						<div class="timing-info">
							<span class="timing-name">{$lang === 'mr' ? timing.label : timing.labelEn}</span>
							<span class="timing-clock">{$lang === 'mr' ? timing.time : timing.timeEn}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.venue-card {
		margin-top: var(--space-xl);
		padding: var(--space-xl);
	}

	.venue-header {
		text-align: center;
		margin-bottom: var(--space-lg);
	}

	.venue-name {
		font-family: var(--font-marathi);
		font-size: var(--text-3xl);
		font-weight: 700;
		line-height: 1.3;
		color: var(--color-primary);
		margin-bottom: var(--space-sm);
	}

	.venue-section-title {
		font-size: var(--text-lg);
		margin-bottom: var(--space-sm);
		color: var(--color-text);
		font-weight: 600;
	}

	.venue-address {
		text-align: center;
		margin-bottom: var(--space-lg);
	}

	.venue-address-text {
		color: var(--color-text-secondary);
		margin-bottom: var(--space-md);
		line-height: 1.6;
	}

	.venue-maps {
		margin: var(--space-lg) 0;
		text-align: center;
	}

	.venue-hint {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		margin-bottom: var(--space-lg);
		font-weight: 500;
	}

	.map-buttons {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		max-width: 400px;
		margin: 0 auto;
	}

	.map-btn {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		width: 100%;
		padding: var(--space-md);
		border-radius: var(--radius-xl);
		border: 1.5px solid var(--color-border);
		background: var(--color-bg-card);
		cursor: pointer;
		transition: all var(--transition-base), transform var(--transition-fast);
		text-align: left;
		position: relative;
		overflow: hidden;
	}

	.map-btn::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.3) 50%,
			transparent 100%
		);
		transform: translateX(-100%);
		transition: transform 0.6s ease;
	}

	.map-btn:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	.map-btn:hover::after {
		transform: translateX(100%);
	}

	.map-btn:active {
		transform: translateY(-1px);
	}

	.map-btn-icon {
		font-size: var(--text-2xl);
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
		background: var(--color-bg-alt);
		flex-shrink: 0;
		transition: transform var(--transition-fast);
	}

	.map-btn:hover .map-btn-icon {
		transform: scale(1.1);
	}

	.map-btn-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.map-btn-label {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text);
	}

	.map-btn-sub {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		font-weight: 500;
	}

	.map-btn-google:hover {
		border-color: #4285F4;
		background: #f8fbff;
	}

	.map-btn-apple:hover {
		border-color: #555555;
		background: #f8f8f8;
	}

	.map-btn-mappls:hover {
		border-color: #e74c3c;
		background: #fdf5f5;
	}

	/* Map Preview */
	.venue-map-preview {
		margin-top: var(--space-lg);
		border-radius: var(--radius-xl);
		overflow: hidden;
		position: relative;
	}

	.map-preview-link {
		display: block;
	}

	.map-preview-iframe {
		width: 100%;
		height: 250px;
		border: 0;
		display: block;
		border-radius: var(--radius-xl);
	}

	/* Timings */
	.venue-timings {
		margin-top: var(--space-lg);
		padding: var(--space-xl);
	}

	.timings-list {
		margin-top: var(--space-lg);
		position: relative;
		padding-left: var(--space-lg);
	}

	.timings-list::before {
		content: '';
		position: absolute;
		left: 7px;
		top: 8px;
		bottom: 8px;
		width: 2px;
		background: var(--color-border-light);
	}

	.timing-item {
		display: flex;
		align-items: flex-start;
		gap: var(--space-md);
		padding: var(--space-sm) 0;
		position: relative;
	}

	.timing-dot {
		width: 16px;
		height: 16px;
		border-radius: var(--radius-pill);
		background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
		border: 3px solid var(--color-bg-card);
		flex-shrink: 0;
		margin-left: -30px;
		margin-top: 4px;
		z-index: 1;
		animation: dotPulse 2s ease-in-out infinite;
		box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb), 0.3);
	}

	.timing-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.timing-name {
		font-weight: 600;
		color: var(--color-text);
		transition: color var(--transition-fast);
	}

	.timing-item:hover .timing-name {
		color: var(--color-primary);
	}

	.timing-clock {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		font-weight: 500;
	}

	@media (max-width: 640px) {
		.venue-card {
			padding: var(--space-lg);
		}
	}
</style>
