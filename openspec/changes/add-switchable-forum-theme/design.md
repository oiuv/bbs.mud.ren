# Design

## Context

See proposal.md. Vue 2 / Bootstrap 4 uses global Sass, grayscale utilities and several component-scoped hardcoded colors. Element UI messages mount under body; CodeMirror and Prism load their own CSS. There is no existing theme preference. The main site was captured and its public home.css inspected on 2026-09-20.

## Goals / Non-Goals

**Goals:** switch colors at the document root without remounting views; make the selected theme available before Vue and lazy styles load; retain the forum's content density and responsive layout.

**Non-Goals:** new routes, backend account preference sync, a color picker or system-theme mode, theme control inside third-party CAPTCHA/Dify frames, redesigning user content or banner images.

## Decisions

- A small synchronous public theme script owns validated `dark`/`light` state, localStorage and cross-tab synchronization. The HTML head loads it before app bundles; the Vue navigation toggle subscribes to its change event. This avoids duplicated startup/runtime preference rules and a flash of the wrong background. Storage failures are caught.
- Use CSS custom properties, with dark defaults and a light attribute override. Main-site dark tokens: background #0b0d10, surface #141518, text #f0efec, muted #aaa7a5, accent #eea366, border #2d2d30. Light retains the existing pale background and white content surfaces, with a darker warm-orange accent for readable links.
- Keep the main site's system sans-serif and restrained mono utility typography. Copy the existing main-site brand mark, use fine borders and restrained warm glow in the shared shell; keep content panels opaque for long reading. Do not add a landing-page hero to the forum feed.
- Apply common Bootstrap, markdown, editor and Element UI adapters under `html[data-theme]` for predictable priority over lazy-loaded styles. Replace exceptional scoped literal colors directly with variables. Preserve warning/error/success meanings and original media colors rather than using inversion filters.
- Place the desktop toggle immediately before the publish button (before login/register for guests). Keep the mobile toggle outside the collapsed menu. Responsive visibility exposes only one control at a time; both subscribe to the same theme state. Its label describes the destination theme; current dark state is reflected in aria-pressed and an accessible label. Use existing icon components.

## Risks / Trade-offs

- Lazy scoped styles can override global rules → directly update exceptions, test routes in varied order and inspect computed colors.
- Many old Bootstrap utilities carry !important → adapt only the used utility families with root-scoped selectors; keep semantic colors distinct.
- Local choice does not follow users across devices → document browser-local persistence; no backend contract changes.
- Third-party frames have independent appearance → theme their forum-owned shell and state screens, leave embedded contents to their provider.

## Migration Plan

No database migration or new dependency. Build and deploy all dist assets together, including the theme bootstrap. Rollback restores the prior frontend build; the unused localStorage preference does not affect the previous version. Validate startup and persistence with isolated browser storage and mock all authenticated writes.
