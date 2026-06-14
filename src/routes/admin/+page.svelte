<script lang="ts">
	import { EVENT } from '$lib/data/event';

	let password = $state('');
	let downloadUrl = $state('');
	let error = $state('');
	let isSubmitting = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		isSubmitting = true;

		if (!password.trim()) {
			error = 'Please enter the admin password.';
			isSubmitting = false;
			return;
		}

		try {
			// POST the password to the auth endpoint (no raw secret in URL)
			const response = await fetch('/api/rsvp/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ secret: password.trim() })
			});

			const data = await response.json();

			if (!data.success || !data.token) {
				error = 'Invalid password. Please try again.';
				isSubmitting = false;
				return;
			}

			// Use the short-lived token for the download URL
			downloadUrl = `/api/rsvp/download?token=${encodeURIComponent(data.token)}`;
			isSubmitting = false;
		} catch {
			error = 'Network error. Please try again.';
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Admin — {EVENT.couple.groom.nameEn} × {EVENT.couple.bride.nameEn}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="section reveal">
	<div class="container-narrow">
		<div class="text-center">
			<div class="lotus-divider">
				<span class="lotus-divider-icon">🔐</span>
			</div>
			<h1 class="heading-2">Admin — RSVP Data</h1>
			<p class="body-text">
				Enter the admin password to view and download RSVP responses.
				Share this page only with family organizers.
			</p>
		</div>

		<div class="admin-card card card-elevated reveal delay-1">
			{#if !downloadUrl}
				<form onsubmit={handleSubmit} class="admin-form">
					<div class="form-group">
						<label for="password" class="form-label">Admin Password</label>
						<input
							id="password"
							type="password"
							class="form-input"
							placeholder="Enter admin password"
							bind:value={password}
							required
							autocomplete="off"
						/>
					</div>

					{#if error}
						<p class="form-error" role="alert">{error}</p>
					{/if}

					<button type="submit" class="btn btn-primary btn-lg" style="width: 100%" disabled={isSubmitting}>
						{isSubmitting ? '🔐 Verifying...' : '🔓 Unlock & Download'}
					</button>
				</form>
			{:else}
				<div class="admin-success text-center">
					<div class="success-icon">✅</div>
					<h2 class="heading-3" style="color: var(--color-success)">
						Access Granted
					</h2>
					<p class="body-text" style="margin: var(--space-md) 0 var(--space-lg)">
						Click the link below to download the RSVP data.
					</p>
					<a
						href={downloadUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-primary btn-lg"
					>
						📥 Download RSVP CSV
					</a>
					<p class="admin-note">
						Opens in a new tab. Save the file to your computer.
						This link expires in 5 minutes for security.
					</p>
					<button
						class="btn btn-secondary btn-sm"
						style="margin-top: var(--space-md)"
						onclick={() => { downloadUrl = ''; password = ''; error = ''; }}
					>
						← Try another password
					</button>
				</div>
			{/if}
		</div>

		<div class="admin-info card reveal delay-2">
			<h3 class="heading-3">📋 About RSVP Data</h3>
			<p class="body-text" style="margin-top: var(--space-sm)">
				The CSV file includes: Timestamp, Name, Phone, Email, Number of Guests,
				Guest Names, Response (Accept/Decline), Dietary Preferences, and Message.
			</p>
		</div>
	</div>
</section>

<style>
	.admin-card {
		max-width: 440px;
		margin: var(--space-xl) auto;
		padding: var(--space-xl);
	}

	.admin-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.admin-success {
		padding: var(--space-md) 0;
	}

	.success-icon {
		font-size: var(--text-4xl);
		margin-bottom: var(--space-sm);
		animation: scaleIn 0.3s ease;
	}

	.admin-note {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin-top: var(--space-md);
		font-weight: 500;
	}

	.admin-info {
		max-width: 440px;
		margin: var(--space-lg) auto;
		padding: var(--space-lg);
	}
</style>
