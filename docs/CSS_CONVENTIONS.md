# CSS Conventions — Design System Patterns

> **Stack:** Vanilla CSS (custom properties)
> **Last updated:** 16 June 2026

---

## 1. Animation Keyframes

### Rule of Thumb

**Define `@keyframes` in `src/app.css`** unless the animation is exclusively used by a single component AND intentionally differs from the global version of the same name.

| Location | Scope | When to use |
|----------|-------|-------------|
| `src/app.css` | **Global** — all pages & components | Shared animations used in 2+ places (`fadeInUp`, `scaleIn`, `float`, `pulse`, etc.) |
| Component `<style>` | **Scoped** — component only | One-off animation names that are unique to that component (`confettiFall`, `circleDraw`, `checkDraw`, `slideIn`, `successCardEnter`) |

### Naming Rules

#### Global keyframes (app.css)
- Use generic, reusable names: `fadeIn`, `fadeInUp`, `scaleIn`, `pulse`, `float`, `shimmer`
- These are the **canonical** versions — all pages/components that reference these names will resolve to the app.css definition.

#### Component keyframes
- Use **component-specific** names to avoid shadowing global keyframes:
  - ✅ `monogramFloat`, `headerSlideIn`, `confettiFall`
  - ❌ `float` (conflicts with global `@keyframes float`)
- Prefix with the component name for clarity.

### Why This Matters

CSS keyframes in `src/app.css` are globally available. If a component defines `@keyframes float` in its scoped `<style>`, it **shadows** the global `@keyframes float` for that component only. This causes two problems:

1. **Subtle visual inconsistency** — the component's version may have different values (e.g., 8px vs 10px translateY)
2. **Confusion** — a reader sees `animation: float` and assumes it matches the app.css definition

### Current Keyframe Inventory

#### Global keyframes in `src/app.css`
| Name | Purpose |
|------|---------|
| `fadeIn` | Generic fade + 10px slide-up |
| `fadeInUp` | Scroll-triggered content reveal |
| `fadeInDown` | Drop-down entrance |
| `fadeInLeft` | Left entrance |
| `fadeInRight` | Right entrance |
| `scaleIn` | Subtle scale entrance |
| `scaleInBounce` | Bouncy scale entrance (success states) |
| `slideDown` | Slide-down entrance |
| `pulse` | Gentle scale pulse |
| `pulseGlow` | Glowing pulse |
| `shimmer` | Loading skeleton shimmer |
| `float` | Gentle vertical hover (10px) |
| `lotusFloat` | Lotus watermark drift |
| `sacredGlow` | Sacred text opacity pulse |
| `dotPulse` | Timeline dot ring pulse |

#### Component-specific keyframes
| Name | Component | Purpose |
|------|-----------|---------|
| `monogramFloat` | `Monogram.svelte` | Subtler float (8px) for the monogram |
| `circleDraw` | `rsvp/+page.svelte` | SVG circle stroke animation |
| `checkDraw` | `rsvp/+page.svelte` | SVG checkmark stroke animation |
| `successCardEnter` | `rsvp/+page.svelte` | Card entrance on RSVP success |
| `confettiFall` | `rsvp/+page.svelte` | Falling confetti particles |
| `slideIn` | `Header.svelte` | Mobile nav panel slide-in |

---

## 2. Design Tokens

All design tokens are defined as CSS custom properties on `:root` in `src/app.css`. Use these tokens instead of hardcoded values.

### Color Tokens

```css
/* Primary — Warm gold/saffron palette */
--color-primary: #C8A45C;
--color-primary-dark: #A8883C;
--color-primary-light: #E0C88A;

/* Text */
--color-text: #2C2C2C;
--color-text-muted: #6B726D;   /* WCAG AA 4.94:1 on white */
--color-text-inverse: #FFFFFF;
--color-text-accent: #C8A45C;

/* Backgrounds */
--color-bg: #FDFBF7;
--color-bg-card: #FFFFFF;
--color-bg-alt: #F5F0E8;

/* Decorations */
--color-border: #E8E0D0;
--color-success: #4A7C59;
--color-error: #C44A4A;

/* RGB variants (for rgba() usage) */
--color-primary-rgb: 200, 164, 92;
--color-text-rgb: 44, 44, 44;
--color-bg-rgb: 253, 251, 247;
--color-error-rgb: 196, 74, 74;
--color-success-rgb: 74, 124, 89;
```

**Usage:** `color: var(--color-text-muted);` or `background: rgba(var(--color-primary-rgb), 0.1);`

### Typography Tokens

```css
/* Font families */
--font-marathi: 'Noto Serif Devanagari', serif;
--font-english: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Font sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
--text-5xl: 3rem;
--text-6xl: 3.75rem;
```

**Usage:** `font-size: var(--text-xl);`

### Spacing Tokens

```css
--spacing-xs: 0.25rem;    /* 4px */
--spacing-sm: 0.5rem;     /* 8px */
--spacing-md: 1rem;       /* 16px */
--spacing-lg: 1.5rem;     /* 24px */
--spacing-xl: 2rem;       /* 32px */
--spacing-2xl: 3rem;      /* 48px */
--spacing-3xl: 4rem;      /* 64px */
```

**Usage:** `padding: var(--spacing-lg);` or `gap: var(--spacing-md);`

### Border Radius Tokens

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

---

## 3. Responsive Breakpoints

Use these breakpoints consistently across all components:

```css
/* Mobile-first — base styles target 320px+ */

/* Tablet */
@media (min-width: 768px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }

/* Large desktop */
@media (min-width: 1280px) { ... }
```

**Conventions:**
- Always use `min-width` (mobile-first)
- Avoid `max-width` unless overriding a specific mobile concern
- Group breakpoint overrides at the bottom of each component `<style>`

---

## 4. Component CSS Patterns

### Scoped Component Styles

Each component stylesheet follows this structure:

```css
<style>
  /* 1. Host element */
  .component-name { }

  /* 2. Layout & structure */
  .component-name__inner { }

  /* 3. Typography */

  /* 4. Visual (colors, backgrounds) */

  /* 5. Interactive states (:hover, :focus) */

  /* 6. Animations */

  /* 7. Responsive overrides */
  @media (min-width: 768px) { }
</style>
```

### Naming Convention

- Use class names (not IDs)
- Use kebab-case for CSS classes
- Prefix component classes: `.header-nav`, `.footer-links`
- Global utility classes (in `app.css`): `.btn`, `.btn-primary`, `.card`, `.required`

### Extracted Global Utilities

These classes are defined in `src/app.css` and available everywhere:

| Class | Purpose |
|-------|---------|
| `.btn` | Base button styles |
| `.btn-primary` | Primary gold button |
| `.btn-outline` | Ghost/outline button |
| `.card` | Card container with shadow + radius |
| `.required` | Red asterisk on required form fields |
| `.photo-count-badge` | Photo/blessing count badge |
| `.form-honeypot` | Hidden anti-spam field wrapper |
| `.sr-only` | Screen-reader only text |
| `.section` | Page section wrapper |
| `.container` | Max-width centered content |

---

## 5. Best Practices

### Do ✅
- Use design tokens (`var(--color-primary)`) instead of hardcoded values
- Define shared animations in `app.css`
- Prefix component keyframes with component name
- Use `min-width` breakpoints (mobile-first)
- Extract repeated patterns to `app.css` as utility classes
- Use `:focus-visible` for keyboard focus indicators

### Don't ❌
- Use hardcoded colors, font-sizes, or spacing values
- Define `@keyframes float` or other generic names in component scope
- Use `!important` (except for utility overrides)
- Nest selectors deeper than 3 levels
- Use IDs for styling (`#my-element`)
- Rely on `max-width` breakpoints unless necessary

---

*Maintained as part of the design system — update when adding new tokens, animations, or patterns.*
