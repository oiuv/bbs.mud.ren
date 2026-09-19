# Design

## Context

See proposal.md. Bootstrap 4 containers cap at 1190px, with 9/3 columns on home, thread and node pages. Some pages provide their own or nested containers. The thread's floating tools extend 80px left of its main column.

## Goals / Non-Goals

**Goals:** use large screens with a shared alignment grid, legible list typography and a restrained sidebar; preserve article reading comfort.

**Non-Goals:** changing theme colors, banners or copy, new data/widgets, business logic, dependencies, mobile redesign or deployment.

## Decisions

- Add a layout partial after theme styles. From 1360px, outer containers use `calc(100% - 160px)` capped at 1680px; nested containers use their parent's full available width. This yields 120px outer margins at 1920px, leaves space for thread tools, and avoids a full-bleed or unbounded ultrawide layout. Existing smaller breakpoints stay intact.
- Make carousel links fill the expanded slide so their images scale proportionally to the full banner width; the existing artwork and carousel behavior stay intact.
- Mark main/sidebar columns explicitly on home, node, thread and public user feeds. At the wide breakpoint, the sidebar's outer width is 350px (320px content plus existing gutters); the main column grows. Keep Bootstrap's existing grid below that breakpoint.
- Preserve the near-black #0b0d10, surface #141518, warm orange #eea366 and off-white #f0efec identity and light-theme tokens. The system sans-serif remains the reading face; existing monospace stays reserved for code. At wide sizes, list titles become 16px with 40px avatars and larger row padding; metadata stays secondary. The signature is the broad, aligned discussion list with a quiet resource rail.
- Limit the thread-content block to 1040px including padding, and the editor column to 1200px. Forms already use fractional columns; the 1680px cap keeps their width bounded. Enlarge navigation type slightly on wide screens without changing its order.

## Risks / Trade-offs

- Nested containers could receive double gutters → reset their width to 100% and measure node/search/thread layouts.
- Long titles or large counters could squeeze a flex row → allow the summary to shrink/wrap, keep the statistics together, verify a long-title fixture.
- Floating thread tools could overlap at smaller wide sizes → preserve at least 80px outer space; check 1366, 1440 and 1920px.
- A wide article can hurt reading → separate article line length from the overall layout width. Ultrawide screens retain larger margins by design.

## Migration Plan

Build and publish the frontend through the normal process; no runtime configuration or data migration. Rollback restores the previous frontend bundle. Capture both themes at 1920×1080 and check 2560, 1440, 1366, 1280, 768, 390 and 320px with read-only API access or mocked writes.
