# SaasForge UI

Angular frontend for the **SaasForge** multi-tenant SaaS platform. Connects to a Spring Boot + PostgreSQL backend deployed on Railway.

**Live Backend:** `https://saas-forge-production-28b7.up.railway.app`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 18 (standalone components) |
| UI Library | Angular Material + custom SCSS |
| Auth | JWT (access + refresh token, auto-refresh interceptor) |
| State | Angular Signals |
| HTTP | Angular HttpClient with interceptors |
| Routing | Lazy-loaded routes with auth + admin guards |
| Deployment | Vercel |

---

## Features

### Authentication
- Login / Register (creates a new workspace + admin account)
- Forgot password → token-based reset flow
- Accept team invitation via token link
- JWT auto-refresh on 401 (transparent to user)

### User Management
- Paginated user table with live search
- Edit user name/status, delete user (admin only)

### Role Management
- Create / edit / delete roles with immutable role key
- Client-side search filter

### Tenant Management *(Admin only)*
- Paginated tenant table with live search
- Edit / delete tenants

### Profile
- View account info and workspace details
- Inline name editing + change password

### Dashboard
- Live stats: total users, total roles, tenant status
- Role-aware cards (admin sees counts, members see their info)

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # authGuard, adminGuard
│   │   ├── interceptors/    # JWT bearer header + auto-refresh on 401
│   │   ├── models/          # TypeScript interfaces
│   │   └── services/        # AuthService, UserService, RoleService, TenantService
│   ├── features/
│   │   ├── auth/            # login, register, forgot-password, reset-password, accept-invitation
│   │   ├── dashboard/
│   │   ├── users/           # table + edit/delete/confirm dialogs
│   │   ├── roles/
│   │   ├── tenants/
│   │   ├── profile/
│   │   └── invite/
│   └── shared/
│       └── layout/          # AppShell (sidebar + header)
└── environments/
    ├── environment.ts        # dev  → Railway backend
    └── environment.prod.ts   # prod → Railway backend
```

---

## Local Setup

```bash
# Install dependencies
npm install

# Start dev server
# No local backend needed — points directly at Railway-hosted Spring Boot API
ng serve
```

Open `http://localhost:4200`

---

## Backend API

All HTTP calls target `https://saas-forge-production-28b7.up.railway.app`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login, returns JWT pair |
| POST | `/api/tenants/register` | Public | Create workspace + admin account |
| POST | `/api/auth/refresh` | Public | Refresh access token |
| POST | `/api/auth/forgot-password` | Public | Request password reset token |
| POST | `/api/auth/reset-password` | Public | Reset password with token |
| PUT | `/api/auth/change-password` | Bearer | Change own password |
| GET | `/api/users` | Bearer | List users (paginated, search) |
| GET | `/api/users/{id}` | Bearer | Get user by ID |
| PUT | `/api/users/{id}` | Bearer | Update user name/status |
| DELETE | `/api/users/{id}` | Admin | Delete user |
| GET | `/api/roles` | Bearer | List all roles |
| POST | `/api/roles` | Admin | Create role |
| PUT | `/api/roles/{id}` | Admin | Update role name |
| DELETE | `/api/roles/{id}` | Admin | Delete role |
| GET | `/api/tenants` | Admin | List tenants (paginated, search) |
| GET | `/api/tenants/{id}` | Bearer | Get tenant by ID |
| PUT | `/api/tenants/{id}` | Admin | Update tenant |
| DELETE | `/api/tenants/{id}` | Admin | Delete tenant |
| POST | `/api/invitations/invite` | Admin | Send workspace invitation |
| POST | `/api/invitations/accept` | Public | Accept invitation with token |

---

## Deployment (Vercel)

`vercel.json` in this repo handles SPA routing so Angular's router works on direct URL access and page refresh.

### Steps

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import this repo
3. Build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/saasforge-ui/browser`
4. Click **Deploy**

---

## Backend Repository

Spring Boot backend source: *(add link here)*

**Backend stack:** Java 21 · Spring Boot 3 · Spring Security · JWT · JPA/Hibernate · PostgreSQL · Railway
