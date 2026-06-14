<script lang="ts">
	import { getLangContext } from '$lib/utils/i18n';
	import { CONTENT } from '$lib/data/content';
	import { renderContent } from '$lib/utils/content';
	import { EVENT } from '$lib/data/event';
	import { submitRsvp, validateRsvp, markFormLoaded, type RsvpData } from '$lib/utils/api';
	import { onMount } from 'svelte';

	let lang = getLangContext();

	let formData = $state<RsvpData>({
		name: '',
		phone: '',
		email: '',
		guests: 1,
		guestNames: '',
		response: 'accept',
		dietary: '',
		message: ''
	});

	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);
	let submitError = $state('');

	let hasInteracted = $state(false);

	let formKey = $state<object | null>(null);

	onMount(() => {
		formKey = markFormLoaded();
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		hasInteracted = true;

		const validationErrors = validateRsvp(formData);
		errors = validationErrors;

		if (Object.keys(validationErrors).length > 0) {
			return;
		}

		isSubmitting = true;
		submitError = '';

		// Anti-spam: honeypot check
		const honeypot = (e.target as HTMLFormElement).querySelector('[name="website"]') as HTMLInputElement;
		if (honeypot?.value) {
			// Bot detected — silently accept
			isSubmitting = false;
			isSubmitted = true;
			return;
		}

		submitRsvp(formData, formKey ?? undefined).then((response) => {
			isSubmitting = false;
			if (response.success) {
				isSubmitted = true;
			} else {
				submitError = response.message;
			}
		});
	}

	function handleInput(field: keyof RsvpData, value: string | number) {
		formData = { ...formData, [field]: value };
		if (hasInteracted && errors[field]) {
			const newErrors = { ...errors };
			delete newErrors[field];
			errors = newErrors;
		}
	}
</script>

<svelte:head>
	<title>{CONTENT[$lang].rsvp.heading} — {EVENT.couple.groom.nameEn} × {EVENT.couple.bride.nameEn}</title>
	<meta name="description" content={renderContent(CONTENT[$lang].rsvp.description, $lang)} />
</svelte:head>

<section class="section reveal">
	<div class="container-narrow">
		<div class="text-center">
			<div class="lotus-divider">
				<span class="lotus-divider-icon">💌</span>
			</div>
			<h1 class="heading-2">{CONTENT[$lang].rsvp.heading}</h1>
			<p class="body-text rsvp-subtitle">
				{renderContent(CONTENT[$lang].rsvp.subheading, $lang)}
			</p>
		</div>

		{#if isSubmitted}
			<!-- Success State -->
			<div class="rsvp-success-wrapper">
				<!-- Confetti particles -->
				<div class="confetti-container" aria-hidden="true">
					{#each Array(30) as _, i}
						{@const colors = ['#B08D57','#2F5A3D','#8A2E42','#C7A97A','#4D7259']}
						<span
							class="confetti-piece"
							style="--x: {Math.random() * 100}%; --d: {Math.random() * 2.5}s; --c: {colors[i % 5]}"
						></span>
					{/each}
				</div>

				<div class="rsvp-success card card-elevated text-center">
					<div class="success-checkmark">
						<svg class="checkmark-circle" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
							<circle class="checkmark-circle-bg" cx="26" cy="26" r="24" fill="none" />
							<circle class="checkmark-circle-ring" cx="26" cy="26" r="24" fill="none" />
							<path class="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
						</svg>
					</div>
					<h2 class="heading-3 success-title">
						{CONTENT[$lang].rsvp.form.success}
					</h2>
					<p class="body-text success-subtitle">{$lang === 'mr' ? 'आम्ही तुमची वाट पाहत आहोत!' : 'We look forward to celebrating with you!'}</p>
					<a href="/" class="btn btn-primary">
						← {CONTENT[$lang].nav.home}
					</a>
				</div>
			</div>
		{:else}
			<!-- RSVP Form -->
			<form class="rsvp-form card card-elevated reveal delay-1" onsubmit={handleSubmit} novalidate>
				<!-- Honeypot field (invisible to users) -->
				<div class="form-honeypot" aria-hidden="true">
					<label for="website">Website</label>
					<input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
				</div>

				<div class="form-group">
					<label for="name" class="form-label">
						{CONTENT[$lang].rsvp.form.name} <span class="required">*</span>
					</label>
					<input
						id="name"
						type="text"
						class="form-input {errors.name ? 'error' : ''}"
						placeholder={CONTENT[$lang].rsvp.form.namePlaceholder}
						value={formData.name}
						oninput={(e) => handleInput('name', (e.target as HTMLInputElement).value)}
						required
						aria-required="true"
					/>
					{#if errors.name}
						<p class="form-error" role="alert">{errors.name}</p>
					{/if}
				</div>

				<div class="form-row">
					<div class="form-group">
						<label for="phone" class="form-label">
							{CONTENT[$lang].rsvp.form.phone} <span class="required">*</span>
						</label>
						<input
							id="phone"
							type="tel"
							class="form-input {errors.phone ? 'error' : ''}"
							placeholder="+91-9876543210"
							value={formData.phone}
							oninput={(e) => handleInput('phone', (e.target as HTMLInputElement).value)}
							required
							aria-required="true"
						/>
						{#if errors.phone}
							<p class="form-error" role="alert">{errors.phone}</p>
						{/if}
					</div>

					<div class="form-group">
						<label for="email" class="form-label">
							{CONTENT[$lang].rsvp.form.email}
						</label>
						<input
							id="email"
							type="email"
							class="form-input {errors.email ? 'error' : ''}"
							placeholder="name@example.com"
							value={formData.email}
							oninput={(e) => handleInput('email', (e.target as HTMLInputElement).value)}
						/>
						{#if errors.email}
							<p class="form-error" role="alert">{errors.email}</p>
						{/if}
					</div>
				</div>

				<div class="form-group">
					<label for="response" class="form-label">
						{CONTENT[$lang].rsvp.form.response} <span class="required">*</span>
					</label>
					<select
						id="response"
						class="form-input form-select {errors.response ? 'error' : ''}"
						value={formData.response}
						onchange={(e) => handleInput('response', (e.target as HTMLSelectElement).value)}
						required
						aria-required="true"
					>
						<option value="accept">{CONTENT[$lang].rsvp.form.accept}</option>
						<option value="decline">{CONTENT[$lang].rsvp.form.decline}</option>
					</select>
					{#if errors.response}
						<p class="form-error" role="alert">{errors.response}</p>
					{/if}
				</div>

				<div class="form-group">
					<label for="guests" class="form-label">
						{CONTENT[$lang].rsvp.form.guests} <span class="required">*</span>
					</label>
					<input
						id="guests"
						type="number"
						class="form-input {errors.guests ? 'error' : ''}"
						placeholder={CONTENT[$lang].rsvp.form.guestsPlaceholder}
						value={formData.guests}
						oninput={(e) => handleInput('guests', parseInt((e.target as HTMLInputElement).value) || 1)}
						min="1"
						max="20"
						required
						aria-required="true"
					/>
					{#if errors.guests}
						<p class="form-error" role="alert">{errors.guests}</p>
					{/if}
				</div>

				<div class="form-group">
					<label for="guestNames" class="form-label">
						{CONTENT[$lang].rsvp.form.guestNames}
					</label>
					<textarea
						id="guestNames"
						class="form-input form-textarea"
						placeholder="e.g. Ananya Sharma, Vikram Sharma"
						value={formData.guestNames}
						oninput={(e) => handleInput('guestNames', (e.target as HTMLTextAreaElement).value)}
						rows="2"
					></textarea>
				</div>

				<div class="form-group">
					<label for="dietary" class="form-label">
						{CONTENT[$lang].rsvp.form.dietary}
					</label>
					<input
						id="dietary"
						type="text"
						class="form-input"
						placeholder={CONTENT[$lang].rsvp.form.dietaryPlaceholder}
						value={formData.dietary}
						oninput={(e) => handleInput('dietary', (e.target as HTMLInputElement).value)}
					/>
				</div>

				<div class="form-group">
					<label for="message" class="form-label">
						{CONTENT[$lang].rsvp.form.message}
					</label>
					<textarea
						id="message"
						class="form-input form-textarea"
						placeholder={CONTENT[$lang].rsvp.form.messagePlaceholder}
						value={formData.message}
						oninput={(e) => handleInput('message', (e.target as HTMLTextAreaElement).value)}
						rows="3"
					></textarea>
				</div>

				{#if submitError}
					<div class="form-error submit-error" role="alert">
						{submitError}
					</div>
				{/if}

				<button
					type="submit"
					class="btn btn-primary btn-lg rsvp-submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? CONTENT[$lang].rsvp.form.submitting : CONTENT[$lang].rsvp.form.submit}
				</button>
			</form>
		{/if}
	</div>
</section>

<style>
	.rsvp-subtitle {
		margin-top: var(--space-md);
		color: var(--color-text-muted);
	}

	.rsvp-form {
		margin-top: var(--space-xl);
		padding: var(--space-xl);
	}

	@media (max-width: 640px) {
		.rsvp-form {
			padding: var(--space-lg);
		}
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-md);
	}

	@media (max-width: 480px) {
		.form-row {
			grid-template-columns: 1fr;
		}
	}

	.rsvp-submit {
		width: 100%;
		margin-top: var(--space-md);
		border-radius: var(--radius-pill);
	}

	.rsvp-submit:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.submit-error {
		margin-bottom: var(--space-md);
		padding: var(--space-sm);
		background: rgba(var(--color-error-rgb), 0.08);
		border-radius: var(--radius-md);
	}

	/* ── Success State ─────────────────────────── */

	.rsvp-success-wrapper {
		position: relative;
		margin-top: var(--space-xl);
	}

	.rsvp-success {
		padding: var(--space-2xl) var(--space-xl);
		position: relative;
		z-index: 1;
		animation: successCardEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.success-title {
		color: var(--color-success);
		margin-bottom: var(--space-sm);
		animation: fadeInUp 0.5s ease 0.3s both;
	}

	.success-subtitle {
		animation: fadeInUp 0.5s ease 0.5s both;
	}

	.rsvp-success .btn {
		margin-top: var(--space-lg);
		animation: fadeInUp 0.5s ease 0.7s both;
	}

	/* ── Animated Checkmark ────────────────────── */

	.success-checkmark {
		width: 80px;
		height: 80px;
		margin: 0 auto var(--space-lg);
		position: relative;
		animation: scaleInBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
	}

	.checkmark-circle {
		width: 100%;
		height: 100%;
	}

	.checkmark-circle-bg {
		stroke: var(--color-bg-alt);
		stroke-width: 2;
	}

	.checkmark-circle-ring {
		stroke: var(--color-success);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-dasharray: 151;
		stroke-dashoffset: 151;
		animation: circleDraw 0.6s cubic-bezier(0.65, 0, 0.35, 1) 0.2s forwards;
		transform-origin: center;
		transform: rotate(-90deg);
	}

	.checkmark-check {
		stroke: var(--color-success);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 48;
		stroke-dashoffset: 48;
		animation: checkDraw 0.4s cubic-bezier(0.65, 0, 0.35, 1) 0.6s forwards;
	}

	@keyframes circleDraw {
		to { stroke-dashoffset: 0; }
	}

	@keyframes checkDraw {
		to { stroke-dashoffset: 0; }
	}

	@keyframes successCardEnter {
		from {
			opacity: 0;
			transform: translateY(30px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	/* ── Confetti ──────────────────────────────── */

	.confetti-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
	}

	.confetti-piece {
		position: absolute;
		top: -10px;
		left: var(--x, 50%);
		width: 8px;
		height: 8px;
		background: var(--c, var(--color-secondary));
		border-radius: 2px;
		animation: confettiFall 3s var(--d, 0s) ease-out infinite;
		opacity: 0;
	}

	.confetti-piece:nth-child(odd) {
		width: 6px;
		height: 10px;
		border-radius: 50%;
	}

	.confetti-piece:nth-child(3n) {
		width: 10px;
		height: 6px;
	}

	@keyframes confettiFall {
		0% {
			transform: translateY(-10px) rotate(0deg) scale(1);
			opacity: 1;
		}
		25% {
			transform: translateY(60px) rotate(90deg) scale(1.1);
			opacity: 1;
		}
		50% {
			transform: translateY(140px) rotate(180deg) scale(1);
			opacity: 0.8;
		}
		75% {
			transform: translateY(220px) rotate(270deg) scale(0.9);
			opacity: 0.4;
		}
		100% {
			transform: translateY(310px) rotate(360deg) scale(0.5);
			opacity: 0;
		}
	}

	@media (max-width: 640px) {
		.rsvp-success {
			padding: var(--space-xl) var(--space-lg);
		}

		.success-checkmark {
			width: 64px;
			height: 64px;
		}

		.confetti-piece {
			width: 6px;
			height: 6px;
		}
	}
</style>
