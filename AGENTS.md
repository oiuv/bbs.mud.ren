# Repository Guidelines

## Project Structure & Module Organization

MUDREN is a Vue 2 forum frontend with Vue Router 3, Vuex 3, Vue CLI 5, Element UI, and Bootstrap 4. The Laravel API is maintained separately.

- `src/main.js` initializes the app; `src/app.vue` provides the shared layout.
- `src/modules/` groups features: `auth`, `home`, `threads`, `users`, `nodes`, `notifications`, `pages`, `search`, and `ai`. Modules expose routes through `routes.js` and `index.js`.
- `src/components/` contains reusable UI and the CodeMirror Markdown editor with attachment uploads.
- `src/router/`, `src/vuex/`, and `src/utils/http/` handle navigation, state, and Axios requests.
- `src/assets/sass/` contains styles; `public/` contains static assets and the HTML template. Generated output goes to ignored `dist/`.
- `openspec/` contains specification scaffolding.

## Build, Test, and Development Commands

Use Node.js 24 LTS (`.nvmrc`); builds use Webpack 5 and Dart Sass.

- `npm ci --include=dev`: install locked dependencies, including build tools.
- `npm run serve`: start the development server on port 8081 and open a browser.
- `npm run build`: generate the production bundle in `dist/`.
- `npm run lint`: run Vue CLI ESLint; it can automatically fix files.
- `npm run lint:check`: check lint without applying fixes.

## Coding Style & Naming Conventions

Follow `.editorconfig`: two-space indentation, UTF-8, LF endings, and final newlines for Vue, JavaScript, and SCSS. Use Vue 2 Options API, single-quoted JavaScript strings, and omit semicolons. ESLint uses Vue rules, `vue-eslint-parser`, and `@babel/eslint-parser`.

Match neighboring filenames, typically lowercase or kebab-case components such as `user-card.vue`. Preserve existing capitalization exceptions. Use aliases such as `$components`, `$modules`, `$utils`, and `$sass`.

## Testing Guidelines

No test framework, `npm test` script, coverage threshold, or test naming convention is configured. Run lint and build; manually check affected routes against a configured API. Check relevant authenticated, guest, error, and mobile states. Record results and blockers in the PR.

## Commit & Pull Request Guidelines

History uses short Chinese descriptions and occasional `fix:` prefixes; no uniform format is enforced. Write focused messages describing changed behavior. PRs should explain purpose, affected modules, validation, related issues when applicable, and include screenshots for UI changes.

## Configuration & Deployment

Copy `.env.example` to `.env.local`; configure the API URL, Passport client, and Tencent CAPTCHA IDs. Keep environment files untracked. Treat `VUE_APP_*` values as browser-visible; never place private service keys there.

In development, `/api` proxies to `https://api.mud.ren`, stripping the prefix. `deploy.php` uses Deployer to build on the server; publish `dist/` as static files.
