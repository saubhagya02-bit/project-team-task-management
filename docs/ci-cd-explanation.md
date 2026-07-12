# CI/CD Workflow

The pipeline lives at [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) and
runs on every push and pull request targeting `main`. It has two independent jobs
that run in parallel.

## Job 1 — Backend: Lint & Test

1. **Checkout** the repository.
2. **Set up Node 20** with npm's dependency cache keyed to `backend/package-lock.json`.
3. **Spin up a real PostgreSQL 16 service container** (`postgres:16`), exposed on
   `localhost:5432`, with a health check so the job waits until the database
   actually accepts connections before running tests.
4. **`npm ci`** — clean, reproducible install from the lockfile.
5. **`npm run lint`** — ESLint over `backend/src`, catching unused vars, undefined
   globals, and other correctness issues before merge.
6. **`npm test`** — runs the Jest + Supertest suite (`tests/auth.test.js`,
   `tests/rbac.test.js`) against the live Postgres service container. The suite
   calls `sequelize.sync({ force: true })` before running, so it doesn't depend
   on migrations being pre-applied — it's a self-contained schema for test
   purposes. 15 tests cover registration, login, and the RBAC boundaries
   described in the brief (e.g. a team member cannot create a project or
   change a task's priority).

## Job 2 — Frontend: Lint & Build

1. **Checkout** and **set up Node 20** with the frontend's own npm cache.
2. **`npm ci`**.
3. **`npm run lint`** — `next lint` (ESLint with the Next.js config).
4. **`npm run build`** — a full production build (`next build`). This is the
   strongest signal a PR is safe to merge: it fails on type errors caught by
   Next's build-time checks, broken imports, and any page that fails to
   prerender.

## Why this shape

- **Real Postgres instead of mocks** — the backend uses Postgres-specific
  features (UUID columns, enums via `CREATE TYPE`), so testing against SQLite
  or an in-memory mock would hide real bugs. A GitHub Actions service
  container is the lightest way to get a real, disposable Postgres instance
  per run.
- **Split jobs, not one combined job** — backend and frontend have independent
  toolchains and failure modes; running them in parallel jobs means a frontend
  lint failure doesn't block backend test results from showing up (and vice
  versa), and the overall pipeline finishes faster.
- **`npm ci` over `npm install`** — guarantees the exact versions in
  `package-lock.json` are used, which is what a review/production environment
  should also install.
- **Build, not just lint, for the frontend** — linting alone would miss
  Next.js build-time failures (bad imports, invalid route exports), so a full
  `next build` is included despite being slower — it's the closest thing to a
  deploy dry-run.

## Running the same checks locally

```bash
# Backend
cd backend
npm ci
npm run lint
npm test          # requires a local Postgres — see README

# Frontend
cd frontend
npm ci
npm run lint
npm run build
```