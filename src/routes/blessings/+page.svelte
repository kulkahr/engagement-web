<script lang="ts">
	import { getLangContext } from '$lib/utils/i18n';
	import { CONTENT } from '$lib/data/content';
	import { renderContent } from '$lib/utils/content';
	import { EVENT } from '$lib/data/event';
	import { fetchBlessings, submitBlessing, markFormLoaded, type StoredBlessing, type BlessingData } from '$lib/utils/blessings';
	import { onMount } from 'svelte';

	let lang = getLangContext();

	let message = $state('');
	let senderName = $state('');
	let isSubmitted = $state(false);
	let isSubmitting = $state(false);
	let submitError = $state('');
	let isLoading = $state(true);

	const STORAGE_KEY = 'blessings-messages';

	interface BlessingMessage {
		name: string;
		text: string;
		date: string;
	}

	let messages = $state<BlessingMessage[]>([]);
	let formKey = $state<object | null>(null);

	// Load blessings from server on mount
	onMount(async () => {
		formKey = markFormLoaded();
		try {
			const serverBlessings = await fetchBlessings();
			if (serverBlessings.length > 0) {
				messages = serverBlessings.map(b => ({
					name: b.name,
					text: b.text,
					date: b.date
				}));
			} else {
				// No server data — try localStorage
				messages = loadFromLocalStorage();
			}
		} catch {
			// Server unavailable — fall back to localStorage
			messages = loadFromLocalStorage();
		} finally {
			isLoading = false;
		}
	});

	function loadFromLocalStorage(): BlessingMessage[] {
		if (typeof localStorage === 'undefined') return [];
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed) && parsed.length > 0) return parsed;
			}
		} catch {
			// Corrupted data — fall through to empty
		}
		return [];
	}

	async function handleSend(e: Event) {
		e.preventDefault();
		if (message.trim().length < 2) return;

		isSubmitting = true;
		submitError = '';

		const name = senderName.trim() || ($lang === 'mr' ? 'अनामिक' : 'Anonymous');

		// Anti-spam: honeypot check
		const honeypot = (e.target as HTMLFormElement).querySelector('[name="website"]') as HTMLInputElement;
		if (honeypot?.value) {
			// Bot detected — silently accept
			isSubmitting = false;
			isSubmitted = true;
			return;
		}

		const result = await submitBlessing(
			{ name, text: message.trim() },
			formKey ?? undefined
		);

		if (result.success) {
			// Optimistically add to local list
			const now = new Date();
			const dateStr = $lang === 'mr'
				? `${now.getDate()} ${['जाने','फेब्रु','मार्च','एप्रिल','मे','जून','जुलै','ऑगस्ट','सप्टें','ऑक्टो','नोव्हें','डिसें'][now.getMonth()]} ${now.getFullYear()}`
				: now.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

			const newMsg: BlessingMessage = {
				name: `— ${name}`,
				text: message.trim(),
				date: dateStr
			};

			messages = [newMsg, ...messages];
			isSubmitted = true;
		} else {
			submitError = result.message || 'Failed to send blessing. Please try again.';
		}

		isSubmitting = false;
	}
</script>

<svelte:head>
	<title>{CONTENT[$lang].blessings.heading} — {EVENT.couple.groom.nameEn} × {EVENT.couple.bride.nameEn}</title>
	<meta name="description" content={renderContent(CONTENT[$lang].blessings.description, $lang)} />
</svelte:head>

<section class="section reveal">
	<div class="container-narrow">
		<div class="text-center">
			<div class="lotus-divider">
				<span class="lotus-divider-icon">🙏</span>
			</div>
			<h1 class="heading-2">
				{CONTENT[$lang].blessings.heading}
				{#if !isLoading && messages.length > 0}
					<span class="photo-count-badge">{messages.length}</span>
				{/if}
			</h1>
			<p class="body-text">
				{CONTENT[$lang].blessings.subheading}
				{#if !isLoading && messages.length > 0}
					<span class="photo-count-text">— {messages.length} {$lang === 'mr' ? 'आशीर्वाद' : 'blessing'}{messages.length !== 1 ? 's' : ''}</span>
				{/if}
			</p>
		</div>

		<!-- Send Blessing -->
		<div class="blessing-form card reveal delay-1">
			{#if isSubmitted}
				<div class="blessing-sent text-center">
					<div class="blessing-sent-icon">🙏</div>
					<p>{CONTENT[$lang].blessings.sent}</p>
					<button class="btn btn-sm btn-secondary" onclick={() => { isSubmitted = false; message = ''; senderName = ''; }}>
						{$lang === 'mr' ? 'आणखी एक लिहा' : 'Write another'}
					</button>
				</div>
			{:else}
				<form onsubmit={handleSend} novalidate>
					<!-- Honeypot field (invisible to users) -->
					<div class="form-honeypot" aria-hidden="true">
						<label for="website">Website</label>
						<input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
					</div>

					<div class="form-group">
						<label for="senderName" class="form-label">
							{$lang === 'mr' ? 'तुमचे नाव' : 'Your Name'}
						</label>
						<input
							id="senderName"
							type="text"
							class="form-input"
							placeholder={$lang === 'mr' ? 'तुमचे नाव' : 'Your name'}
							value={senderName}
							oninput={(e) => senderName = (e.target as HTMLInputElement).value}
							maxlength="100"
						/>
					</div>
					<div class="form-group">
						<label for="blessingMessage" class="form-label">
							{CONTENT[$lang].blessings.heading} <span class="required">*</span>
						</label>
						<textarea
							id="blessingMessage"
							class="form-input form-textarea"
							placeholder={CONTENT[$lang].blessings.placeholder}
							value={message}
							oninput={(e) => message = (e.target as HTMLTextAreaElement).value}
							rows="3"
							maxlength="500"
							required
							aria-required="true"
						></textarea>
					</div>

					{#if submitError}
						<div class="form-error" style="margin-bottom: var(--space-md)" role="alert">
							{submitError}
						</div>
					{/if}

					<button
						type="submit"
						class="btn btn-primary"
						disabled={message.trim().length < 2 || isSubmitting}
					>
						{isSubmitting ? ($lang === 'mr' ? 'पाठवत आहे...' : 'Sending...') : CONTENT[$lang].blessings.send}
						{isSubmitting ? '' : '🙏'}
					</button>
				</form>
			{/if}
		</div>

		<!-- Messages List -->
		<div class="blessings-list reveal delay-2">
			{#if isLoading}
				<div class="text-center" style="padding: var(--space-xl)">
					<p class="body-text" style="color: var(--color-text-muted)">
						{$lang === 'mr' ? 'आशीर्वाद लोड होत आहेत...' : 'Loading blessings...'}
					</p>
				</div>
			{:else}
				{#each messages as msg, i}
					<div class="blessing-item card reveal delay-{(i+3) as number}">
						<p class="blessing-text">"{msg.text}"</p>
						<div class="blessing-meta">
							<span class="blessing-name">{msg.name}</span>
							<span class="blessing-date">{msg.date}</span>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</section>

<style>
	.blessing-form {
		margin-top: var(--space-xl);
		padding: var(--space-xl);
	}

	.blessing-sent {
		padding: var(--space-md) 0;
	}

	.blessing-sent-icon {
		font-size: var(--text-4xl);
		margin-bottom: var(--space-sm);
	}

	.blessing-sent p {
		margin-bottom: var(--space-md);
		color: var(--color-success);
		font-weight: 600;
	}

	.blessings-list {
		margin-top: var(--space-xl);
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.blessing-item {
		animation: fadeInUp 0.4s ease;
	}

	.blessing-text {
		font-style: italic;
		color: var(--color-text);
		line-height: 1.6;
		margin-bottom: var(--space-sm);
	}

	.blessing-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.blessing-name {
		font-weight: 600;
		color: var(--color-primary);
		font-size: var(--text-sm);
	}

	.blessing-date {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		font-weight: 500;
	}

</style>
