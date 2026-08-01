# Trip Planner

A Canva-generated frontend wired to Supabase for trip management. This repo includes a simple browser app, Supabase integration, and helper scripts for configuration.

## What this project contains

- `index.html` — main app shell and UI
- `src/js/supabase-data-sdk.js` — Supabase CRUD adapter for the browser
- `scripts/setup-supabase.js` — creates `trips` table, enables RLS, and grants anon/auth privileges
- `scripts/build-config.js` — builds `config.js` from `.env`
- `.env.example` — example environment variables
- `.gitignore` — ignores `node_modules`, `.env`, and generated `config.js`

## Prerequisites

- Node.js installed
- A Supabase project with:
  - project URL
  - anon/public API key
  - Postgres connection string

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example env file:

```bash
copy .env.example .env
```

3. Open `.env` and update the values:

- `SUPABASE_DB_URL` — your Supabase Postgres connection string
- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_ANON_KEY` — your Supabase publishable anon key

4. Generate `config.js` from `.env`:

```bash
npm run build
```

This writes `config.js` into the repo root and is loaded by `index.html`.

5. Create the Supabase `trips` table and policies:

```bash
npm run setup-supabase
```

## Running locally

This app is a static site. Serve it from a local server instead of opening `index.html` directly.

Example:

```bash
npx serve .
```

or

```bash
python -m http.server 8080
```

Then open the local URL in your browser.

## Deployment to Vercel

1. Push the repository to a remote Git host.
2. Create a new Vercel project and import the repo.
3. Add environment variables in Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Set the build command to:

```bash
npm run build
```

5. Set the output directory to:

```bash
.
```

Vercel will generate `config.js` during build, so your anon key stays out of source control.

## Notes

- Never commit `.env` or `config.js` with real keys.
- Use the public/publishable anon key in the browser, not the secret/service_role key.
- If you change `.env`, rerun `npm run build` before reloading the app.
