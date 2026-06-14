<script lang="ts">
	import { getLangContext } from '$lib/utils/i18n';
	import { CONTENT, type Lang } from '$lib/data/content';
	import { page } from '$app/stores';
	import Monogram from '$lib/components/Monogram.svelte';

	let lang = getLangContext();
	let isOpen = $state(false);
	let isScrolled = $state(false);

	function handleScroll() {
		isScrolled = window.scrollY > 50;
	}

	$effect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function toggleLang() {
		lang.update((l: Lang) => l === 'mr' ? 'en' : 'mr');
	}

	// Keyboard shortcut: Ctrl+L / Cmd+L to toggle language
	$effect(() => {
		function handleKeydown(e: KeyboardEvent) {
			if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
				e.preventDefault();
				toggleLang();
			}
		}
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});

	function closeNav() {
		isOpen = false;
	}

	const navItems = [
		{ key: 'home', href: '/' },
		{ key: 'venue', href: '/venue/' },
		{ key: 'rsvp', href: '/rsvp/' },
		{ key: 'gallery', href: '/gallery/' },
		{ key: 'blessings', href: '/blessings/' }
	];

	let currentPath = $derived($page.url.pathname);
</script>

<header class="header {isScrolled ? 'header-scrolled' : ''}">
	<nav class="nav container" aria-label="Main navigation">
		<a href="/" class="nav-logo">
			<Monogram size="small" />
			<span class="nav-logo-text">{CONTENT[$lang].hero.title}</span>
		</a>

		<!-- Desktop Nav -->
		<ul class="nav-links" role="list">
			{#each navItems as item}
				<li>
					<a
						href={item.href}
						class="nav-link {currentPath === item.href ? 'nav-link-active' : ''}"
					>
						{CONTENT[$lang].nav[item.key as keyof typeof CONTENT.mr.nav]}
					</a>
				</li>
			{/each}
			<li>
				<button
					class="lang-toggle"
					onclick={toggleLang}
					aria-label={$lang === 'mr' ? 'Switch to English' : 'मराठी वर स्विच करा'}
					title="{$lang === 'mr' ? 'Switch to English' : 'मराठी वर स्विच करा'} (Ctrl+L)"
				>
					{$lang === 'mr' ? 'EN' : 'मराठी'}
				</button>
			</li>
		</ul>

		<!-- Mobile Menu Button -->
		<div class="nav-mobile">
			<button
				class="btn btn-icon nav-hamburger"
				onclick={() => isOpen = !isOpen}
				aria-expanded={isOpen}
				aria-label={isOpen ? 'Close menu' : 'Open menu'}
			>
				<span class="hamburger-line {isOpen ? 'open' : ''}"></span>
				<span class="hamburger-line {isOpen ? 'open' : ''}"></span>
				<span class="hamburger-line {isOpen ? 'open' : ''}"></span>
			</button>
		</div>
	</nav>

	<!-- Mobile Nav Overlay -->
	{#if isOpen}
		<div class="nav-overlay" onclick={closeNav} role="presentation"></div>
		<nav class="mobile-nav" aria-label="Mobile navigation">
			<ul class="mobile-nav-links" role="list">
				{#each navItems as item}
					<li>
						<a
							href={item.href}
							class="mobile-nav-link {currentPath === item.href ? 'nav-link-active' : ''}"
							onclick={closeNav}
						>
							{CONTENT[$lang].nav[item.key as keyof typeof CONTENT.mr.nav]}
						</a>
					</li>
				{/each}
				<li>
					<button
						class="btn btn-primary mobile-lang-toggle"
						onclick={toggleLang}
					>
						{$lang === 'mr' ? 'English' : 'मराठी'}
					</button>
				</li>
			</ul>
		</nav>
	{/if}
</header>

<style>
	.header {
		position: fixed;
		top: var(--space-lg);
		left: var(--space-lg);
		right: var(--space-lg);
		z-index: var(--z-sticky);
		background: transparent;
		transition: all var(--transition-base);
		padding: var(--space-sm) 0;
		max-width: calc(var(--container-max) - var(--space-xl));
		margin: 0 auto;
		border-radius: var(--radius-pill);
	}

	.header-scrolled {
		background: rgba(var(--color-bg-rgb), 0.92);
		backdrop-filter: blur(12px) saturate(180%);
		-webkit-backdrop-filter: blur(12px) saturate(180%);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04);
		padding: var(--space-xs) 0;
		border: 1px solid var(--color-border-light);
	}

	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		padding: 0 var(--space-md);
	}

	.nav-logo {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		text-decoration: none;
		color: var(--color-text);
	}

	.nav-logo-text {
		font-size: var(--text-base);
		font-weight: 700;
		color: var(--color-primary);
		font-family: var(--font-marathi);
	}

	.nav-links {
		display: none;
		align-items: center;
		gap: var(--space-xs);
		list-style: none;
	}

	@media (min-width: 768px) {
		.nav-links {
			display: flex;
		}

		.nav-mobile {
			display: none;
		}
	}

	.nav-link {
		padding: var(--space-sm) var(--space-md);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text-secondary);
		border-radius: var(--radius-pill);
		transition: all var(--transition-fast);
		text-decoration: none;
		position: relative;
	}

	.nav-link:hover {
		color: var(--color-primary);
		background: rgba(var(--color-primary-rgb), 0.06);
	}

	.nav-link-active {
		color: var(--color-primary);
		background: rgba(var(--color-primary-rgb), 0.08);
		font-weight: 600;
	}

	/* Language toggle - pill outline style */
	.lang-toggle {
		margin-left: var(--space-sm);
		font-size: var(--text-xs);
		font-weight: 600;
		padding: var(--space-xs) var(--space-md);
		min-height: 48px;
		min-width: 48px;
		border-radius: var(--radius-pill);
		border: 1.5px solid var(--color-border);
		background: transparent;
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all var(--transition-fast);
		letter-spacing: 0.04em;
	}

	.lang-toggle:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
		background: rgba(var(--color-primary-rgb), 0.04);
	}

	/* Hamburger */
	.nav-hamburger {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 5px;
		position: relative;
		z-index: calc(var(--z-overlay) + 1);
		background: rgba(var(--color-bg-rgb), 0.8);
		backdrop-filter: blur(8px);
		border: 1px solid var(--color-border-light);
	}

	.hamburger-line {
		display: block;
		width: 20px;
		height: 2px;
		background: var(--color-text);
		border-radius: 2px;
		transition: all var(--transition-base);
		transform-origin: center;
	}

	.hamburger-line.open:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}

	.hamburger-line.open:nth-child(2) {
		opacity: 0;
		transform: translateX(-10px);
	}

	.hamburger-line.open:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}

	/* Overlay */
	.nav-overlay {
		position: fixed;
		inset: 0;
		background: rgba(var(--color-text-rgb), 0.3);
		z-index: var(--z-overlay);
		animation: fadeIn 0.2s ease;
	}

	/* Mobile Nav */
	.mobile-nav {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: 300px;
		max-width: 85vw;
		background: rgba(255, 255, 255, 0.98);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		z-index: var(--z-modal);
		padding: var(--space-3xl) var(--space-lg) var(--space-lg);
		box-shadow: -4px 0 25px rgba(0, 0, 0, 0.08);
		animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes slideIn {
		from { transform: translateX(100%); }
		to { transform: translateX(0); }
	}

	.mobile-nav-links {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		list-style: none;
	}

	.mobile-nav-link {
		display: block;
		padding: var(--space-sm) var(--space-md);
		font-size: var(--text-lg);
		font-weight: 500;
		color: var(--color-text);
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
		text-decoration: none;
	}

	.mobile-nav-link:hover {
		background: var(--color-bg-alt);
		color: var(--color-primary);
	}

	.mobile-lang-toggle {
		margin-top: var(--space-md);
		width: 100%;
	}
</style>
