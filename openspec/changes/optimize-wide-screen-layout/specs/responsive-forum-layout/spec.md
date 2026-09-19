# Spec Delta

## Purpose

Let forum readers use desktop screen space effectively while keeping discussion lists, long articles and narrow-screen navigation readable and usable in both themes.

## ADDED Requirements

### Requirement: Bounded wide-screen layout
The forum SHALL expand its centered outer layout beyond the existing 1190px cap on wide desktops, up to 1680px, with aligned navigation and content. At a 1920px viewport the outer layout SHALL be 1680px wide with approximately 120px margins.

#### Scenario: Full HD desktop
- **WHEN** a reader opens the forum at 1920×1080 with default browser zoom
- **THEN** the forum uses the wider centered layout and header and content align

#### Scenario: Ultrawide display
- **WHEN** the viewport is wider than 1920px
- **THEN** the layout remains capped at 1680px

### Requirement: Balanced discussion and reading areas
Wide desktop feeds SHALL give additional space to the discussion column while retaining a bounded sidebar. Titles and row spacing SHALL scale for desktop reading. Thread body lines and the editor SHALL remain bounded independently of the outer layout.

#### Scenario: Browsing discussions
- **WHEN** a reader views the home, node or user feed on a wide desktop
- **THEN** titles and counters remain legible without overlapping, and the sidebar does not grow in proportion to the viewport

#### Scenario: Reading and composing
- **WHEN** a reader opens a thread or editor on a wide desktop
- **THEN** the thread content block is no wider than 1040px and the editor column no wider than 1200px, with all existing actions usable

### Requirement: Responsive and theme compatibility
The forum SHALL retain its existing layout below 1360px and support both themes without page-level horizontal overflow from the new layout. Nested containers SHALL avoid repeated wide-screen side gutters.

#### Scenario: Narrow screen
- **WHEN** a reader opens the forum at 320px or 390px wide
- **THEN** the list fits the viewport and the theme control and collapsed navigation remain usable

#### Scenario: Theme and route changes
- **WHEN** a reader switches themes or visits node, search and thread pages
- **THEN** the width rules remain consistent with the viewport and content stays inside the page
