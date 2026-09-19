# Spec Delta

## Purpose

Provide a consistent MUDREN identity across forum pages while preserving each reader's choice of a dark or light appearance, including anonymous users and browsers where preference storage is unavailable.

## ADDED Requirements

### Requirement: Default branded dark appearance
The forum SHALL use the main site's near-black background, warm orange accents and off-white text by default, independent of the operating system theme.

#### Scenario: First visit or invalid preference
- **WHEN** the browser has no valid saved theme
- **THEN** the initial page and loaded forum display the dark theme

### Requirement: Accessible theme switching
The forum SHALL offer a labeled, keyboard-operable dark/light toggle in the navigation, visible on desktop and mobile for guests and signed-in users. Switching SHALL immediately update the current page without reloading or losing form input.

#### Scenario: Reader switches while composing
- **WHEN** a reader switches theme with a draft in a form
- **THEN** the page and editor update their appearance and retain the draft

#### Scenario: Mobile guest switches
- **WHEN** a guest opens the forum on a narrow screen
- **THEN** the theme control is available without login or expanding the navigation

### Requirement: Remember and synchronize preference
The forum SHALL restore a valid saved choice before the application renders, preserve it across routes and browser restarts, and synchronize changes between open tabs on the same origin. Unavailable storage SHALL not prevent the application or theme switching from working.

#### Scenario: Reload with light preference
- **WHEN** the reader selected light and reloads or visits another route
- **THEN** the page starts and remains light

#### Scenario: Storage is blocked
- **WHEN** preference storage throws on reading or writing
- **THEN** the page remains usable, defaults to dark, and switching works for the current document

#### Scenario: Another tab changes theme
- **WHEN** a valid preference change is received from another same-origin tab
- **THEN** the open forum and its toggle reflect that choice

### Requirement: Consistent readable forum surfaces
Both themes SHALL cover forum-owned navigation, home and thread lists, post body and code, categories, profiles, search, authentication and account forms, notifications, editor, menus and dialogs. Semantic error/success states SHALL remain distinct. Content images and external embeds SHALL not be inverted.

#### Scenario: Reader visits different forum pages
- **WHEN** a reader navigates through home, thread, categories, search, profile and authentication pages
- **THEN** backgrounds, text, borders and controls match the selected theme without unintended white panels in dark mode

#### Scenario: Post with formatted content
- **WHEN** a post contains code, quotes, a table and images
- **THEN** text and code remain readable in both themes and the original image colors are preserved
