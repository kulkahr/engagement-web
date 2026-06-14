<script lang="ts">
	import { getLangContext } from '$lib/utils/i18n';
	import { CONTENT } from '$lib/data/content';
	import { page } from '$app/stores';

	let lang = getLangContext();

	let status = $derived($page.status);
	let is404 = $derived(status === 404);
</script>

<svelte:head>
	<title>{is404 ? '404' : 'Error'} — {$lang === 'mr' ? 'पान सापडले नाही' : 'Page Not Found'}</title>
</svelte:head>

<section class="not-found">
	<div class="container-narrow text-center">
		<div class="not-found-content">
			<div class="not-found-icon">🪷</div>
			<h1 class="not-found-code">{status}</h1>
			{#if is404}
				<p class="not-found-text">
					{$lang === 'mr'
						? 'अरेरे! हे पान सापडले नाही. कृपया मुखपृष्ठावर परत जा.'
						: 'Oops! This page was not found. Please return to the home page.'}
				</p>
			{:else}
				<p class="not-found-text">
					{$lang === 'mr'
						? 'काहीतरी चूक झाली. कृपया परत प्रयत्न करा.'
						: 'Something went wrong. Please try again.'}
				</p>
			{/if}
			<a href="/" class="btn btn-primary btn-lg">
				← {CONTENT[$lang].nav.home}
			</a>
		</div>
	</div>
</section>

<style>
	.not-found {
		min-height: calc(100vh - 72px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-xl);
	}

	.not-found-content {
		animation: fadeInUp 0.5s ease;
	}

	.not-found-icon {
		font-size: var(--text-5xl);
		margin-bottom: var(--space-md);
	}

	.not-found-code {
		font-size: var(--text-5xl);
		font-weight: 800;
		color: var(--color-primary);
		line-height: 1;
		margin-bottom: var(--space-md);
	}

	.not-found-text {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		margin-bottom: var(--space-xl);
		max-width: 400px;
		margin-left: auto;
		margin-right: auto;
	}
</style>
