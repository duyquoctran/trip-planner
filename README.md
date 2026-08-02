# Trip Planner

A Canva-generated frontend wired to Supabase for trip management. This repo includes a simple browser app, Supabase integration, helper scripts for configuration, and test coverage support.

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
  - Postgres connection string (only required for `npm run setup-supabase`)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example env file (Windows):

```bash
copy .env.example .env
```

Or PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Open `.env` and update the values:

- `SUPABASE_DB_URL` — your Supabase Postgres connection string (used by setup scripts)
- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_ANON_KEY` — your Supabase publishable anon key

4. Generate `config.js` from `.env`:

```bash
npm run build
```

This writes `config.js` into the repo root and is loaded by `index.html`.

5. Create the Supabase `trips` table and policies (if you have `SUPABASE_DB_URL`):

```bash
npm run setup-supabase
```

## Running locally

This app is a static site. Serve it from a local server instead of opening `index.html` directly.

Examples:

```bash
npx serve .
# or
python -m http.server 8080
```

Then open the local URL in your browser.

## Tests & Coverage (local)

This repository includes test cases and coverage reporting. The project expects a test runner to be available in `package.json` scripts. Commonly used commands:

- Run tests once:

```bash
npm test
```

- Run tests with coverage and generate an LCOV report:

```bash
npm run test:coverage
```

If `test` / `test:coverage` scripts are not present in your `package.json`, add them (example using Jest):

```json
"scripts": {
  "build": "node ./scripts/build-config.js",
  "setup-supabase": "node ./scripts/setup-supabase.js",
  "test": "jest",
  "test:coverage": "jest --coverage"
}
```

Install Jest and any test dependencies if not already installed:

```bash
npm install --save-dev jest @testing-library/dom @testing-library/jest-dom
```

When coverage runs, Jest will produce a `coverage/` directory and an `coverage/lcov.info` file that many CI tools and coverage services consume.

## Continuous Integration (GitHub Actions)

Add a CI workflow to run tests and publish coverage on push and pull requests. Create the file `.github/workflows/ci.yml` with the following example (uses Jest and uploads the coverage report as an artifact; optional Codecov step shown):

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build runtime config
        run: npm run build
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Upload coverage artifact
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/lcov.info

      # Optional: send coverage to Codecov (requires CODECOV_TOKEN secret)
      - name: Upload to Codecov
        if: env.CODECOV_TOKEN != ''
        uses: codecov/codecov-action@v4
        with:
          files: coverage/lcov.info
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
```

Notes on the workflow:

- `npm ci` installs dependencies from `package-lock.json` for reproducible installs.
- `npm run build` regenerates `config.js` using the Supabase env vars. Provide the `SUPABASE_URL` and `SUPABASE_ANON_KEY` as repository secrets in GitHub (Settings → Secrets → Actions). Use the anon key only — do not commit service role keys.
- The workflow uploads `coverage/lcov.info` as an artifact so you can download and inspect coverage results from the Actions run.
- If you prefer Codecov, add `CODECOV_TOKEN` to repository secrets and enable the Codecov step.

## Integrating coverage checks into PRs

Two common approaches:

1. Use a coverage service (Codecov/Coveralls) + GitHub checks: the service comments on PRs and can block merges via branch protection rules.
2. Add a lightweight coverage-check job in the workflow that fails the job if total coverage falls below a threshold. Example using `coveralls` or a simple node script that parses `coverage/coverage-summary.json`.

Example to fail the job when statements coverage < 80% (simple Node step):

```yaml
      - name: Fail if coverage below threshold
        run: |
          node -e "const s=require('./coverage/coverage-summary.json').total.statements.pct; if(s<80) { console.error('Coverage too low', s); process.exit(1); }"
```

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
- If you enabled GitHub CodeQL with an advanced configuration, ensure you do not have both the default setup and a custom CodeQL workflow enabled simultaneously — that will cause SARIF upload errors in Actions.
