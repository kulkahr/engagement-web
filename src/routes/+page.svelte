<script lang="ts">
	import { getLangContext } from '$lib/utils/i18n';
	import { CONTENT } from '$lib/data/content';
	import { EVENT, EVENT_DATE } from '$lib/data/event';
	import { SITE_CONFIG } from '$lib/data/config';
	import { getCountdown } from '$lib/utils/date';
	import CountdownTimer from '$lib/components/CountdownTimer.svelte';
	import AddToCalendar from '$lib/components/AddToCalendar.svelte';
	import Monogram from '$lib/components/Monogram.svelte';

	import { renderContent } from '$lib/utils/content';
	import { ENV_IMAGE_OG } from '$lib/env';

	let lang = getLangContext();

	let countdown = $state(getCountdown());

	async function handleShare() {
		const url = SITE_CONFIG.siteUrl;
		const text = $lang === 'mr'
			? `🎊 ${EVENT.couple.groom.name} × ${EVENT.couple.bride.name} — ${EVENT.ceremony.type}!\n\n📅 ${EVENT.ceremony.panchang}\n📍 ${EVENT.venue.name}, ${EVENT.venue.city}\n\n${CONTENT[$lang].invitation.body}\n${url}`
			: `🎊 ${EVENT.couple.groom.nameEn} × ${EVENT.couple.bride.nameEn} — ${EVENT.ceremony.typeEn}!\n\n📅 ${EVENT.ceremony.timeEn}, ${EVENT.ceremony.date}\n📍 ${EVENT.venue.nameEn}, ${EVENT.venue.cityEn}\n\n${CONTENT[$lang].invitation.body}\n${url}`;

		// Try Web Share API first (mobile)
		if (navigator.share) {
			try {
				await navigator.share({ title: 'साखरपुडा निमंत्रण', text, url });
				return;
			} catch {
				// User cancelled or API failed — fall through to WhatsApp
			}
		}

		// Fallback: WhatsApp share
		const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
		window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
	}

	$effect(() => {
		const interval = setInterval(() => {
			countdown = getCountdown();
		}, 1000);
		return () => clearInterval(interval);
	});

	let names = $derived({
		groom: EVENT.couple.groom.name,
		groomEn: EVENT.couple.groom.nameEn,
		bride: EVENT.couple.bride.name,
		brideEn: EVENT.couple.bride.nameEn
	});

	let nameParts = $derived({
		groom: ($lang === 'en' ? names.groomEn : names.groom).split(' '),
		bride: ($lang === 'en' ? names.brideEn : names.bride).split(' ')
	});
</script>

<svelte:head>
	<title>{renderContent(CONTENT[$lang].seo.title, $lang)}</title>
	<meta name="description" content={renderContent(CONTENT[$lang].seo.description, $lang)} />
	<meta property="og:title" content={renderContent(CONTENT[$lang].seo.title, $lang)} />
	<meta property="og:description" content={renderContent(CONTENT[$lang].seo.description, $lang)} />
	<meta property="og:image" content="{ENV_IMAGE_OG.startsWith('http') ? ENV_IMAGE_OG : SITE_CONFIG.siteUrl + ENV_IMAGE_OG}" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
{@html `<script type="application/ld+json">${JSON.stringify({
	"@context": "https://schema.org",
	"@type": "Event",
	"name": `${EVENT.couple.groom.nameEn} & ${EVENT.couple.bride.nameEn} - ${EVENT.ceremony.typeEn}`,
	"startDate": EVENT_DATE.toISOString(),
	"location": {
		"@type": "Place",
		"name": EVENT.venue.nameEn,
		"address": {
			"@type": "PostalAddress",
			"streetAddress": EVENT.venue.addressEn,
			"addressLocality": EVENT.venue.cityEn,
			"postalCode": EVENT.venue.pincode
		}
	},
	"description": renderContent(CONTENT[$lang].seo.description, $lang)
})}<\/script>`}
</svelte:head>

<!-- Hero Section - Botanical Ivory Paper -->
<section class="hero paper-texture">
	<!-- Decorative frame corners -->
	<div class="botanical-corner botanical-corner-tl"></div>
	<div class="botanical-corner botanical-corner-tr"></div>
	<div class="botanical-corner botanical-corner-bl"></div>
	<div class="botanical-corner botanical-corner-br"></div>

	<div class="hero-bg-pattern"></div>
	<div class="hero-content container-narrow">
		<!-- Sacred text -->
		<p class="sacred-text hero-sacred">|| श्री गणेशाय नमः ||</p>

		<div class="hero-monogram">
			<Monogram size="large" />
		</div>

		<p class="hero-suptitle">— {CONTENT[$lang].hero.title} —</p>

		<!-- Stacked couple names -->
		<h1 class="hero-title">
			<span class="hero-groom">
				<span class="hero-line-1">{nameParts.groom[0]}</span>
				<span class="hero-line-2">{nameParts.groom.slice(1).join(' ')}</span>
			</span>
			<span class="hero-symbol hero-rings" aria-hidden="true">
				<svg viewBox="0 0 64 48" width="64" height="48" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
					<!-- Left ring band -->
					<circle cx="24" cy="27" r="14" />
					<!-- Left diamond (wider gem shape) -->
					<polygon points="24,3 30,11 24,17 18,11" fill="currentColor" stroke="none" />
					<!-- Left diamond facet line -->
					<line x1="24" y1="3" x2="24" y2="17" stroke="var(--color-bg)" stroke-width="0.8" opacity="0.6" />
					<!-- Left prongs -->
					<line x1="20.5" y1="10" x2="19" y2="15" stroke-width="1.2" />
					<line x1="27.5" y1="10" x2="29" y2="15" stroke-width="1.2" />

					<!-- Right ring band -->
					<circle cx="40" cy="27" r="14" />
					<!-- Right diamond (wider gem shape) -->
					<polygon points="40,3 46,11 40,17 34,11" fill="currentColor" stroke="none" />
					<!-- Right diamond facet line -->
					<line x1="40" y1="3" x2="40" y2="17" stroke="var(--color-bg)" stroke-width="0.8" opacity="0.6" />
					<!-- Right prongs -->
					<line x1="36.5" y1="10" x2="35" y2="15" stroke-width="1.2" />
					<line x1="43.5" y1="10" x2="45" y2="15" stroke-width="1.2" />
				</svg>
			</span>
			<span class="hero-bride">
				<span class="hero-line-1">{nameParts.bride[0]}</span>
				<span class="hero-line-2">{nameParts.bride.slice(1).join(' ')}</span>
			</span>
		</h1>

		<p class="hero-verse">{CONTENT[$lang].hero.verse}</p>

		<div class="hero-details">
			<div class="hero-date">
				📅 {EVENT.ceremony.date} &nbsp;|&nbsp; 🕐 {EVENT.ceremony.time}
			</div>
		</div>

		<div class="hero-actions">
			<a href="/rsvp/" class="btn btn-primary btn-lg">
				{CONTENT[$lang].rsvp.heading} →
			</a>
			<a href="/venue/" class="btn btn-secondary btn-lg">
				{CONTENT[$lang].venue.heading}
			</a>
		</div>

		<div class="hero-share">
			<button class="btn btn-outline btn-lg share-btn" onclick={handleShare}>
				📤 {CONTENT[$lang].share.whatsapp}
			</button>
		</div>

		<div class="hero-scroll" aria-hidden="true">
			<span class="hero-scroll-text">{CONTENT[$lang].hero.scrollHint}</span>
			<span class="hero-scroll-arrow">↓</span>
		</div>
	</div>
</section>

<!-- Invitation Section -->
<section class="section section-alt reveal" id="invitation">
	<div class="container-narrow text-center">
		<div class="lotus-divider">
			<span class="lotus-divider-icon">🪷</span>
		</div>

		<h2 class="heading-2">{CONTENT[$lang].invitation.heading}</h2>
		<p class="invitation-body body-text">
			{CONTENT[$lang].invitation.body}
		</p>

		<div class="invitation-families">
			<div class="card card-elegant invitation-family reveal delay-1">
				<p class="invitation-label">{CONTENT[$lang].invitation.hostedBy}</p>
				<p class="invitation-name">{renderContent(CONTENT[$lang].invitation.family_groom, $lang)}</p>
				<p class="invitation-relation">({EVENT.couple.groom.father} × {EVENT.couple.groom.mother})</p>
			</div>
			<div class="card card-elegant invitation-family reveal delay-2">
				<p class="invitation-label">{CONTENT[$lang].invitation.hostedBy}</p>
				<p class="invitation-name">{renderContent(CONTENT[$lang].invitation.family_bride, $lang)}</p>
				<p class="invitation-relation">({EVENT.couple.bride.father} × {EVENT.couple.bride.mother})</p>
			</div>
		</div>
	</div>
</section>

<!-- Countdown Section -->
<section class="section reveal" id="countdown">
	<div class="container-narrow text-center">
		<div class="lotus-divider">
			<span class="lotus-divider-icon">⏱️</span>
		</div>

		<h2 class="heading-2">
			{$lang === 'mr' ? 'उलटी गिनती' : 'Countdown'}
		</h2>

		<CountdownTimer {countdown} />

		<AddToCalendar />
	</div>
</section>

<!-- Event Details Section -->
<section class="section section-alt reveal" id="event">
	<div class="container-narrow">
		<div class="text-center">
			<div class="lotus-divider">
				<span class="lotus-divider-icon">📋</span>
			</div>
			<h2 class="heading-2">{CONTENT[$lang].event.heading}</h2>
		</div>

		<div class="event-grid">
			<div class="card event-card reveal delay-1">
				<span class="event-icon">📅</span>
				<h3 class="heading-3 event-label">{CONTENT[$lang].event.date}</h3>
				<p class="event-value">
					{$lang === 'mr' ? EVENT.ceremony.panchang : EVENT.ceremony.panchangEn}
				</p>
			</div>

			<div class="card event-card reveal delay-2">
				<span class="event-icon">🕐</span>
				<h3 class="heading-3 event-label">{CONTENT[$lang].event.time}</h3>
				<div class="event-timings">
					{#each EVENT.timings as timing}
						<div class="timing-row">
							<span class="timing-label">{$lang === 'mr' ? timing.label : timing.labelEn}</span>
							<span class="timing-time">{$lang === 'mr' ? timing.time : timing.timeEn}</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="card event-card reveal delay-3">
				<span class="event-icon">📍</span>
				<h3 class="heading-3 event-label">{CONTENT[$lang].event.venue}</h3>
				<p class="event-value">{$lang === 'mr' ? EVENT.venue.name : EVENT.venue.nameEn}</p>
				<p class="event-sub">{$lang === 'mr' ? EVENT.venue.address : EVENT.venue.addressEn}</p>
				<p class="event-sub">{$lang === 'mr' ? EVENT.venue.city : EVENT.venue.cityEn}</p>
				<a href="/venue/" class="btn btn-primary btn-sm" style="margin-top: var(--space-sm)">
					{CONTENT[$lang].venue.openMaps} →
				</a>
			</div>

			<div class="card event-card reveal delay-4">
				<span class="event-icon">👔</span>
				<h3 class="heading-3 event-label">{CONTENT[$lang].event.dressCode}</h3>
				<p class="event-value">{$lang === 'mr' ? EVENT.dressCode.mr : EVENT.dressCode.en}</p>
			</div>
		</div>

		<!-- Contacts -->
		<div class="contacts-section">
			<h3 class="heading-3 text-center reveal">{CONTENT[$lang].event.contacts}</h3>
			<div class="contacts-grid">
				{#each EVENT.contacts as contact, i}
					<div class="card contact-card reveal delay-{(i+1) as number}">
						<p class="contact-name">{$lang === 'mr' ? contact.name : contact.nameEn}</p>
						<p class="contact-relation">{$lang === 'mr' ? contact.relationship : contact.relationshipEn}</p>
						<a href="tel:{contact.phone}" class="contact-phone">{contact.phone}</a>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	/* Hero */
	.hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		background: linear-gradient(
			180deg,
			var(--color-bg) 0%,
			var(--color-bg-alt) 50%,
			var(--color-bg) 100%
		);
		overflow: hidden;
		padding: var(--space-xl);
	}

	.hero-bg-pattern {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse at 50% 30%, rgba(var(--color-primary-rgb), 0.04) 0%, transparent 50%),
			radial-gradient(ellipse at 80% 70%, rgba(var(--color-secondary-rgb), 0.03) 0%, transparent 50%),
			radial-gradient(ellipse at 20% 60%, rgba(var(--color-accent-rgb), 0.02) 0%, transparent 50%);
		pointer-events: none;
	}

	/* Floating lotus watermark */
	.hero-bg-pattern::before {
		content: '🪷';
		position: absolute;
		font-size: 12rem;
		opacity: 0.04;
		top: 5%;
		right: -5%;
		transform: rotate(15deg);
		animation: lotusFloat 12s ease-in-out infinite;
		pointer-events: none;
	}

	.hero-bg-pattern::after {
		content: '🪷';
		position: absolute;
		font-size: 8rem;
		opacity: 0.03;
		bottom: 5%;
		left: -3%;
		transform: rotate(-10deg);
		animation: lotusFloat 10s ease-in-out infinite reverse;
		pointer-events: none;
	}

	.hero-content {
		position: relative;
		z-index: 1;
		color: var(--color-text);
		max-width: 600px;
	}

	@media (min-width: 740px) {
		.hero-content {
			max-width: 740px;
		}
	}

	.hero-sacred {
		margin-bottom: var(--space-xl);
		animation: sacredGlow 3s ease-in-out infinite;
		font-size: var(--text-sm);
	}

	.hero-monogram {
		margin-bottom: var(--space-lg);
		display: flex;
		justify-content: center;
		animation: fadeInUp 0.8s ease forwards;
	}

	.hero-monogram :global(.monogram-large) {
		display: block;
		margin: 0 auto;
	}

	.hero-suptitle {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 4px;
		margin-bottom: var(--space-lg);
		font-weight: 500;
		animation: fadeInUp 0.8s ease forwards;
	}

	.hero-title {
		font-size: var(--text-4xl);
		font-weight: 700;
		line-height: 1.15;
		margin-bottom: var(--space-lg);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-sm);
		animation: fadeInUp 0.8s ease 0.15s both;
	}

	.hero-groom {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.hero-bride {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	@media (min-width: 640px) {
		.hero-title {
			font-size: var(--text-5xl);
			display: grid;
			grid-template-columns: 1fr auto 1fr;
			align-items: center;
			gap: var(--space-lg);
			width: 100%;
		}

		.hero-groom {
			align-items: flex-end;
			text-align: right;
			justify-self: end;
		}

		.hero-groom .hero-line-2 {
			text-align: center;
			align-self: center;
		}

		.hero-bride {
			align-items: flex-start;
			text-align: left;
			justify-self: start;
		}

		.hero-bride .hero-line-2 {
			text-align: center;
			align-self: center;
		}
	}

	.hero-symbol {
		color: var(--color-secondary);
		font-weight: 300;
		font-size: var(--text-4xl);
		line-height: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	@media (min-width: 640px) {
		.hero-symbol {
			font-size: var(--text-5xl);
		}
	}

	.hero-verse {
		font-size: var(--text-base);
		font-style: italic;
		color: var(--color-text-muted);
		margin-bottom: var(--space-xl);
		line-height: 1.7;
		animation: fadeInUp 0.8s ease 0.3s both;
	}

	.hero-details {
		margin-bottom: var(--space-2xl);
		animation: fadeInUp 0.8s ease 0.45s both;
	}

	.hero-date {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		font-weight: 500;
		font-family: var(--font-body);
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
		justify-content: center;
		margin-bottom: var(--space-lg);
		animation: fadeInUp 0.8s ease 0.6s both;
	}

	/* Share */
	.hero-share {
		position: relative;
		display: flex;
		justify-content: center;
		animation: fadeInUp 0.8s ease 0.7s both;
	}

	.share-btn {
		border-color: rgba(255, 255, 255, 0.5);
		color: var(--color-text);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		background: rgba(255, 255, 255, 0.15);
		font-size: var(--text-sm);
		border-radius: var(--radius-pill);
		transition: all var(--transition-base);
		min-height: 40px;
		padding: var(--space-xs) var(--space-lg);
	}

	.share-btn:hover {
		background: rgba(255, 255, 255, 0.25);
		border-color: var(--color-secondary);
		transform: translateY(-2px);
	}

	@media (max-width: 640px) {
		.share-btn {
			font-size: var(--text-xs);
			padding: var(--space-xs) var(--space-md);
		}
	}

	.hero-scroll {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-sm);
		opacity: 0.5;
		margin-top: var(--space-2xl);
		padding-bottom: var(--space-md);
		transition: opacity var(--transition-base);
		animation: fadeInUp 0.8s ease 0.8s both;
	}

	.hero-scroll:hover {
		opacity: 0.8;
	}

	.hero-scroll-text {
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 2px;
		font-weight: 500;
		color: var(--color-text-muted);
	}

	.hero-scroll-arrow {
		font-size: var(--text-xl);
		color: var(--color-primary);
		animation: float 2s ease-in-out infinite;
	}

	/* Invitation */
	.invitation-body {
		max-width: 600px;
		margin: var(--space-lg) auto var(--space-2xl);
		font-size: var(--text-lg);
		line-height: 1.8;
	}

	.invitation-families {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-lg);
		margin-top: var(--space-xl);
	}

	@media (min-width: 640px) {
		.invitation-families {
			grid-template-columns: 1fr 1fr;
		}
	}

	.invitation-family {
		text-align: center;
	}

	.invitation-label {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		margin-bottom: var(--space-sm);
		text-transform: uppercase;
		letter-spacing: 1px;
		font-weight: 600;
	}

	.invitation-name {
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-primary);
		margin-bottom: var(--space-xs);
	}

	.invitation-relation {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		font-weight: 500;
	}

	/* Event Grid */
	.event-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-lg);
		margin-top: var(--space-xl);
	}

	@media (min-width: 640px) {
		.event-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.event-card {
		text-align: center;
		padding: var(--space-xl);
	}

	.event-icon {
		font-size: var(--text-3xl);
		margin-bottom: var(--space-sm);
		display: block;
	}

	.event-label {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 1px;
		margin-bottom: var(--space-sm);
		font-weight: 600;
	}

	.event-value {
		font-size: var(--text-lg);
		color: var(--color-text);
		font-weight: 500;
	}

	.event-sub {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin-top: var(--space-xs);
		font-weight: 500;
	}

	.event-timings {
		margin-top: var(--space-sm);
	}

	.timing-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-sm) 0;
		border-bottom: 1px solid var(--color-border-light);
	}

	.timing-row:last-child {
		border-bottom: none;
	}

	.timing-label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		font-weight: 500;
	}

	.timing-time {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-primary);
	}

	/* Contacts */
	.contacts-section {
		margin-top: var(--space-2xl);
	}

	.contacts-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-md);
		margin-top: var(--space-lg);
	}

	@media (min-width: 640px) {
		.contacts-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.contact-card {
		text-align: center;
		padding: var(--space-lg);
	}

	.contact-name {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-text);
	}

	.contact-relation {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin: var(--space-xs) 0 var(--space-sm);
		font-weight: 500;
	}

	.contact-phone {
		font-size: var(--text-lg);
		color: var(--color-primary);
		font-weight: 600;
		text-decoration: none;
	}

	.contact-phone:hover {
		text-decoration: underline;
	}
</style>
