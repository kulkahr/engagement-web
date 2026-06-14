<script lang="ts">
	import { getLangContext } from '$lib/utils/i18n';
	import { CONTENT } from '$lib/data/content';
	import { EVENT } from '$lib/data/event';
	import { renderContent } from '$lib/utils/content';

	let lang = getLangContext();

	let groomName = $derived($lang === 'en' ? EVENT.couple.groom.nameEn : EVENT.couple.groom.name);
	let brideName = $derived($lang === 'en' ? EVENT.couple.bride.nameEn : EVENT.couple.bride.name);
	let footerDate = $derived($lang === 'en' ? EVENT.ceremony.panchangEn : EVENT.ceremony.panchang);
	let footerCity = $derived($lang === 'en' ? EVENT.venue.cityEn : EVENT.venue.city);
</script>

<footer class="footer">
	<div class="container">
		<div class="lotus-divider">
			<span class="lotus-divider-icon">🪷</span>
		</div>

		<p class="footer-text">
			{CONTENT[$lang].footer.madeWith} ❤️ {renderContent(CONTENT[$lang].footer.hosts, $lang)}
		</p>

		<div class="footer-divider"></div>

		<div class="footer-details">
			<p>{groomName} × {brideName}</p>
			<p>• {footerDate} • {footerCity}</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-alt) 100%);
		padding: var(--space-3xl) 0;
		text-align: center;
		margin-top: var(--space-4xl);
		position: relative;
	}

	.footer::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 80px;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			var(--color-border-decorative),
			transparent
		);
	}

	.footer-text {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		font-weight: 500;
		transition: color var(--transition-fast);
		letter-spacing: 0.02em;
	}

	.footer-text:hover {
		color: var(--color-primary);
	}

	.footer-divider {
		width: 32px;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			var(--color-border),
			transparent
		);
		margin: var(--space-md) auto;
	}

	.footer-details {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		margin-top: var(--space-sm);
		font-weight: 500;
	}

	.footer-details p {
		margin: var(--space-xs) 0;
	}

	.footer-details p:first-child {
		color: var(--color-primary);
		font-weight: 700;
		font-size: var(--text-sm);
	}
</style>
