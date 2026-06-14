<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { createLangStore, setLangContext } from '$lib/utils/i18n';
	import { page } from '$app/stores';
	import { SITE_CONFIG } from '$lib/data/config';
	import { ENV_IMAGE_OG } from '$lib/env';

	let { children } = $props();

	let lang = createLangStore();
	setLangContext(lang);

	// Scroll-triggered reveal animations
	// Re-runs on every page navigation ($page.url.pathname is the dependency)
	$effect(() => {
		// Force re-run on URL change so new page's .reveal elements are observed
		$page.url.pathname;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
		);

		// Observe all elements with the 'reveal' class
		const elements = document.querySelectorAll('.reveal');
		if (elements.length === 0) {
			observer.disconnect();
			return;
		}
		elements.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<!-- Social & SEO tags (dynamic — uses siteUrl from config) -->
	<meta property="og:url" content="{SITE_CONFIG.siteUrl}{$page.url.pathname}" />
	<meta property="og:title" content="हृषिकेश × वेदांगी — साखरपुडा निमंत्रण" />
	<meta property="og:description" content="हृषिकेश आणि वेदांगीच्या साखरपुडा समारंभात आपले सादर सप्रेम निमंत्रण | दि. ८ ऑगस्ट २०२६, डोंबिवली" />
	<meta property="og:image" content="{SITE_CONFIG.siteUrl}{ENV_IMAGE_OG}" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:type" content="image/svg+xml" />
	<meta name="twitter:card" content="summary_large_image" />
	<!-- Hreflang & canonical -->
	<link rel="alternate" hreflang="mr" href="{SITE_CONFIG.siteUrl}{$page.url.pathname}" />
	<link rel="alternate" hreflang="en" href="{SITE_CONFIG.siteUrl}{$page.url.pathname}" />
	<link rel="alternate" hreflang="x-default" href="{SITE_CONFIG.siteUrl}{$page.url.pathname}" />
	<link rel="canonical" href="{SITE_CONFIG.siteUrl}{$page.url.pathname}" />
</svelte:head>

<Header />

<main id="main-content">
	{@render children()}
</main>

<Footer />

<style>
	#main-content {
		min-height: 100vh;
		padding-top: 72px;
	}
</style>
