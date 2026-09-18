# Repository Guidelines

## Project Structure & Module Organization

This is the MUDREN forum frontend, using Vue 2, Vue Router 3, Vuex 3, and Vue CLI 3. The Laravel API is maintained separately.

- `src/main.js` initializes the app; `src/app.vue` provides the shared layout.
- `src/modules/` groups features: `auth`, `threads`, `users`, `nodes`, `notifications`, `search`, and `ai`. Modules expose routes through `routes.js` and `index.js`.
- `src/components/` contains reusable UI and the CodeMirror Markdown editor.
- `src/router/`, `src/vuex/`, and `src/utils/http/` handle navigation, state, and Axios requests.
- `src/assets/sass/` contains styles; `public/` contains static assets and the HTML template. Generated output goes to ignored `dist/`.
- `openspec/` contains specification scaffolding. No automated test directory exists.

## Build, Test, and Development Commands

The README specifies Node.js 14. Check your runtime before installing dependencies; the declared toolchain includes `node-sass` 4.

- `npm install`: install dependencies.
- `npm run serve`: start the development server on port 8081 and open a browser.
- `npm run build`: generate the production bundle in `dist/`.
- `npm run lint`: run Vue CLI ESLint; it can automatically fix files.
- `npm run lint -- --no-fix`: check lint without applying fixes.

## Coding Style & Naming Conventions

Follow `.editorconfig`: two-space indentation, UTF-8, LF endings, and final newlines for Vue, JavaScript, and SCSS. Use Vue 2 Options API, single-quoted JavaScript strings, and omit semicolons. ESLint uses Vue rules and `babel-eslint`.

Match neighboring filenames, typically lowercase or kebab-case components such as `user-card.vue`. Preserve existing capitalization exceptions. Use aliases such as `$components`, `$modules`, `$utils`, and `$sass`.

## Testing Guidelines

No test framework, `npm test` script, coverage threshold, or test naming convention is configured. For functional changes, run lint and build, then manually exercise affected routes against a configured API. Check relevant authenticated, guest, error, and mobile states. Record results and blockers in the PR.

## Commit & Pull Request Guidelines

History uses short Chinese descriptions and occasional `fix:` prefixes; no uniform format is enforced. Write focused messages describing changed behavior. PRs should explain purpose, affected modules, validation, related issues when applicable, and include screenshots for UI changes.

## Configuration

Copy `.env.example` to `.env.local`; configure the API URL, Passport client, and Tencent CAPTCHA IDs. Keep environment files untracked. Treat `VUE_APP_*` values as browser-visible; never place private service keys there.
