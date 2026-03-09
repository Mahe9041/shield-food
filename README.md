# 🛡️ SHIELD Food

> Enterprise food ordering platform built with **NestJS**, **React TypeScript**, and **JWT-based RBAC** — featuring country-scoped data isolation as a bonus feature.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

---

## 📸 Screenshots

| Login & Permission Matrix | Dashboard (Role-aware) | Restaurants (Country-scoped) |
|---|---|---|
| Role-based quick login | Permissions per role | Filtered by country |

---

## 🏗️ Architecture Overview

```
shield-food/
├── backend/    → NestJS REST API (port 3001)
└── frontend/   → React + TypeScript + Vite (port 3000)
```

The frontend and backend are fully independent applications. They communicate over HTTP — the frontend proxies `/api/*` requests to the NestJS backend via Vite's dev proxy (and environment variables in production).

---

## 👥 Users & Roles

| Name | Email | Role | Country | Password |
|------|-------|------|---------|----------|
| Nick Fury | nick@shield.com | Admin | Global | password |
| Captain Marvel | marvel@shield.com | Manager | India | password |
| Captain America | america@shield.com | Manager | America | password |
| Thanos | thanos@shield.com | Member | India | password |
| Thor | thor@shield.com | Member | India | password |
| Travis | travis@shield.com | Member | America | password |

---

## 🔐 RBAC Permission Matrix

| Permission | Admin | Manager | Member |
|---|:---:|:---:|:---:|
| View Restaurants | ✅ | ✅ | ✅ |
| Create Order (add to cart) | ✅ | ✅ | ✅ |
| Place Order (checkout) | ✅ | ✅ | ❌ |
| Cancel Order | ✅ | ✅ | ❌ |
| Update Payment Methods | ✅ | ❌ | ❌ |

### 🌍 Bonus: Country-Scoped Access

| Role | Data Access |
|------|-------------|
| Admin | Global — all countries |
| Manager | Own country only |
| Member | Own country only |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Run Locally

**1. Clone the repo**
```bash
git clone git@github.com:Mahe9041/shield-food.git
cd shield-food
```

**2. Start the backend**
```bash
cd backend
npm install
npm run start:dev
# → http://localhost:3001
```

**3. Start the frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

**4. Open the app**

Visit `http://localhost:3000` and login with any user from the table above. All passwords are `password`.

---

## 🧠 Key Technical Concepts

### NestJS Guards
Two guards protect every route:
- `JwtAuthGuard` — validates the Bearer token and attaches the user to `request.user`
- `PermissionGuard` — reads `@RequirePermission()` metadata via `Reflector` and checks `PERMISSION_MAP`

### Custom Decorators
```typescript
@RequirePermission('place_order')  // attaches metadata to the route
@CurrentUser()                     // extracts user from request.user
```

### Single Source of Truth
`PERMISSION_MAP` in `roles.enum.ts` is the only place where role-permission rules are defined. The frontend mirrors this map for UI purposes, but the backend is always the authoritative source.

### JWT Flow
```
Login → bcrypt.compare() → jwtService.sign({ sub, role }) → token
Request → JwtAuthGuard → JwtStrategy.validate() → request.user
```

---

## 📁 Repo Structure

```
shield-food/
├── backend/          → See backend/README.md
├── frontend/         → See frontend/README.md
└── README.md         → This file
```

---

## 🌐 Live Demo

- **Frontend**: [Deployed on Vercel](#)
- **Backend API**: [Deployed on Railway](#)

> Update these links after deployment.

---

## 📄 License

MIT
