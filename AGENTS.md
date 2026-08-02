# Repository Guidelines

## Project Structure & Module Organization

This is a static browser-based trip planner with Supabase-backed persistence. The root `index.html` is the app shell and loads generated runtime configuration from `config.js`. Browser modules live in `src/js/`; keep data access in `api.js` or `supabase-data-sdk.js`, state in `state.js`, rendering in `render.js`, event wiring in `events.js`, and app startup in `bootstrap.js`/`app.js`. Helper scripts live in `scripts/`, including environment config generation and Supabase schema setup. GitHub security scanning is configured in `.github/workflows/trivy.yml`.

## Build, Test, and Development Commands

- `npm install`: install Node dependencies from `package-lock.json`.
- `npm run build`: generate root `config.js` from `.env` using `scripts/build-config.js`.
- `npm run setup-supabase`: create/update the Supabase `trips` table, RLS policies, and privileges.
- `npx serve .`: serve the static app locally after running the build.
- `python -m http.server 8080`: alternate local static server.

There is no `npm start` script; do not open `index.html` directly because browser module and config loading should be tested through a local server.

## Coding Style & Naming Conventions

Use ES modules and browser-compatible JavaScript. Prefer `const`/`let`, small named functions, and clear object shapes for trip data. Use 2-space indentation in scripts and modular files. Keep filenames lowercase with hyphens where needed, matching examples such as `supabase-data-sdk.js`. Avoid broad rewrites of generated or dense legacy sections in `index.html`; place maintainable behavior in `src/js/` modules when possible.

## Testing Guidelines

No automated test framework is currently configured. For changes, run `npm run build`, serve locally, and manually verify trip creation, updates, deletion, filters, language switching, and Supabase sync behavior. If adding tests later, keep them near the related module and name them after the unit under test, for example `state.test.js`.

## Commit & Pull Request Guidelines

No repository-specific commit convention is documented. Use short, imperative commit subjects such as `Add Vercel env setup notes` or `Fix Supabase save retry`. Pull requests should include a clear summary, manual verification steps, linked issues when applicable, screenshots for UI changes, and notes for any required Supabase or Vercel environment updates.

## Security & Configuration Tips

Copy `.env.example` to `.env` for local setup. Never commit `.env`, generated `config.js`, database passwords, service role keys, or other secrets. Browser code must use only the public Supabase anon key; privileged database setup belongs in `scripts/setup-supabase.js`.
