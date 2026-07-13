# API Documentation

Base URL: `http://localhost:5000/api` (or `NEXT_PUBLIC_API_URL` in production)

A ready-to-import Postman collection is at [`postman_collection.json`]([./postman_collection.json](https://ushanisaubhagya.postman.co/workspace/Ushani-Saubhagya's-Workspace~e98db803-a71a-44ef-89ca-507bf7d34c30/collection/46038547-bfd4804f-0c36-4ea6-aaf5-2f0e8a1f2985?action=share&source=copy-link&creator=46038547)).

All responses share this envelope:

```json
{ "success": true, "message": "…", "data": { } }
{ "success": false, "message": "…", "errors": [ { "field": "email", "message": "…" } ] }
```

Authenticated requests need `Authorization: Bearer <accessToken>`.

---

## Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Self-registers as `team_member` |
| POST | `/auth/login` | Public | Returns `accessToken` + `refreshToken` |
| POST | `/auth/refresh` | Public | Exchanges `refreshToken` for a new `accessToken` |
| GET | `/auth/me` | Authenticated | Returns the current user |

**POST `/auth/register`**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "Password123" }
```

**POST `/auth/login`**
```json
{ "email": "jane@example.com", "password": "Password123" }
```
Response `data`: `{ user, accessToken, refreshToken }`

---

## Users — Admin only (except listing, shared with Project Managers)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin, PM | List users. `?role=team_member` filters by role |
| GET | `/users/:id` | Admin, PM | Get a single user |
| POST | `/users` | Admin | Create a user with any role |
| PATCH | `/users/:id` | Admin | Update `name`, `role`, `isActive`, `password` |
| DELETE | `/users/:id` | Admin | Deactivate (soft delete) a user |

**POST `/users`**
```json
{ "name": "Priya Manager", "email": "pm2@example.com", "password": "Password123", "role": "project_manager" }
```

---

## Projects

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/projects` | Any authenticated | Admin: all · PM: owned · Member: assigned |
| GET | `/projects/:id` | Members of the project | Get one project (with manager + members) |
| POST | `/projects` | Admin, PM | Create a project (PM becomes the manager) |
| PATCH | `/projects/:id` | Admin, owning PM | Update project fields |
| DELETE | `/projects/:id` | Admin, owning PM | Delete project (cascades tasks & memberships) |
| POST | `/projects/:id/members` | Admin, owning PM | Add a team member to the project |
| DELETE | `/projects/:id/members/:userId` | Admin, owning PM | Remove a team member |

**POST `/projects`**
```json
{
  "name": "Website Revamp",
  "description": "Rebuild the marketing site",
  "startDate": "2026-08-01",
  "endDate": "2026-09-30"
}
```

**POST `/projects/:id/members`**
```json
{ "userId": "b3f1c2a0-..." }
```

---

## Tasks

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/projects/:projectId/tasks` | Members of the project | List tasks in a project |
| POST | `/projects/:projectId/tasks` | Admin, owning PM | Create a task, optionally assigned |
| GET | `/tasks/my` | Any authenticated | Tasks assigned to the current user |
| GET | `/tasks/:id` | Assignee, project members, owning PM, admin | Get one task |
| PATCH | `/tasks/:id` | Admin/owning PM: any field. Assignee: `status` only | Update a task |
| DELETE | `/tasks/:id` | Admin, owning PM | Delete a task |

**POST `/projects/:projectId/tasks`**
```json
{
  "title": "Design homepage",
  "description": "New hero section",
  "priority": "high",
  "dueDate": "2026-08-15",
  "assignedToId": "b3f1c2a0-..."
}
```

**PATCH `/tasks/:id`** (as the assignee — only `status` is accepted)
```json
{ "status": "in_progress" }
```

**PATCH `/tasks/:id`** (as the owning PM/admin — any field)
```json
{ "priority": "low", "assignedToId": null, "status": "done" }
```

---

## Status codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 401 | Missing/invalid/expired token |
| 403 | Authenticated but not permitted (role or ownership check failed) |
| 404 | Resource not found |
| 409 | Conflict (duplicate email, already a member) |
| 422 | Validation failed — see `errors[]` for field-level messages |
| 500 | Unexpected server error |

## Demo accounts (after running the seeder)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@gmail.com` | `Admin@123` |
| Project Manager | `manager@gmail.com` | `Manager@123` |
| Team Member | `member@gmail.com` | `Member@123` |
