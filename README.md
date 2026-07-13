# TaskFlow - Project & Team Task Management Platform

A full-stack project and task management platform with three roles -
**Administrator**, **Project Manager**, and **Team Member** - each with a
distinct dashboard and permission set enforced on the backend.

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Node.js, Express, Sequelize
- **Database**: PostgreSQL
- **Auth**: JWT (access + refresh tokens), bcrypt password hashing
- **CI**: GitHub Actions - lint + test (backend), lint + build (frontend)

## Contents

```
.
├── backend/            Express API (Node.js + PostgreSQL)
├── frontend/            Next.js app
├── docs/
│   ├── erd.md                     Entity Relationship Diagram
│   ├── use-case-diagram.md        Use Case Diagram
│   ├── architecture.md            System architecture + sequence diagram
│   ├── api-documentation.md       Full REST API reference
│   ├── postman_collection.json    Importable Postman collection
│   ├── feature-completion-report.md
│   └── ci-cd-explanation.md
└── .github/workflows/ci.yml       CI pipeline
```

## Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 14 (running locally, or a connection string to a hosted instance)
- npm

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and point it at your PostgreSQL instance (`DB_HOST`, `DB_PORT`,
`DB_NAME`, `DB_USER`, `DB_PASSWORD`), then set real values for `JWT_SECRET`
and `JWT_REFRESH_SECRET` (any long random string).

Create the database, then run migrations and the demo seeder:

```bash
# using psql
createdb pmt_db

npm run migrate
npm run seed
```

Start the API:

```bash
npm run dev      # nodemon, http://localhost:5000
# or
npm start
```

`GET http://localhost:5000/api/health` should return `{"status":"ok"}`.

### Demo accounts (created by the seeder)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@gmail.com` | `Admin@123` |
| Project Manager | `manager@gmail.com` | `Manager@123` |

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

By default `NEXT_PUBLIC_API_URL=http://localhost:5000/api`, matching the
backend's default port.

```bash
npm run dev       # http://localhost:3000
```

Open `http://localhost:3000`, sign in with one of the demo accounts above (or
register a new Team Member account), and you'll land on the dashboard for
your role.

## 3. Running tests

The backend test suite runs against a real PostgreSQL database (not a mock).
Create a second database for it:

```bash
createdb pmt_db_test
```

Make sure `DB_NAME_TEST` in `backend/.env` matches, then:

```bash
cd backend
npm test
```

This runs 15 tests covering the full auth flow (register/login/validation)
and the role-based access boundaries (e.g. a team member cannot create a
project or change a task's priority — only its status).

## 4. Linting

```bash
cd backend && npm run lint
cd frontend && npm run lint
```

## How roles work

| | Administrator | Project Manager | Team Member |
|---|---|---|---|
| Manage user accounts & roles | ✅ | ❌ | ❌ |
| View all projects | ✅ | Own projects only | Projects they're a member of |
| Create / edit / delete a project | ✅ (any) | ✅ (own) | ❌ |
| Add / remove project members | ✅ (any) | ✅ (own) | ❌ |
| Create / edit / delete tasks | ✅ (any) | ✅ (own projects) | ❌ |
| Update status of an assigned task | ✅ | ✅ | ✅ |

New self-registrations are always created as **Team Member**. An Admin
promotes accounts to Project Manager (or Admin) from the admin dashboard, or
via `POST /api/users` with a `role`.

## Documentation

- [Entity Relationship Diagram](./docs/erd.md)
- [Use Case Diagram](./docs/use-case-diagram.md)
- [System Architecture](./docs/architecture.md)
- [API Documentation](./docs/api-documentation.md) / [Postman Collection](./docs/postman_collection.json)
- [Feature Completion Report](./docs/feature-completion-report.md)
- [CI/CD Explanation](./docs/ci-cd-explanation.md)


## License

MIT - feel free to reuse for learning purposes.
