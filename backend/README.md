# 🛡️ SHIELD Food — Backend

> NestJS REST API with JWT authentication, custom Guards, Decorators, and role-based access control.

---

## 🗂️ Project Structure

```
src/
├── main.ts                          # Bootstrap — port 3001, global prefix /api
├── app.module.ts                    # Root module — imports all feature modules
├── data/
│   └── seed.ts                      # In-memory data + TypeScript interfaces
├── common/
│   ├── roles.enum.ts                # Role enum + PERMISSION_MAP (single source of truth)
│   ├── decorators/
│   │   └── decorators.ts            # @RequirePermission() + @CurrentUser()
│   ├── guards/
│   │   ├── jwt-auth.guard.ts        # Validates JWT Bearer token
│   │   ├── permission.guard.ts      # Checks role against PERMISSION_MAP
│   │   └── country.guard.ts        # validateCountryAccess() helper
│   └── filters/
│       └── http-exception.filter.ts # Global error response formatter
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts           # POST /auth/login, GET /auth/me
│   ├── auth.service.ts              # bcrypt.compare + jwtService.sign
│   ├── auth.dto.ts                  # LoginDto with class-validator
│   └── jwt.strategy.ts              # PassportStrategy — validates token payload
├── restaurants/
│   ├── restaurants.module.ts
│   ├── restaurants.controller.ts    # GET /restaurants, GET /restaurants/:id
│   └── restaurants.service.ts       # Country-filtered queries
├── orders/
│   ├── orders.module.ts
│   ├── orders.controller.ts         # CRUD + place + cancel
│   ├── orders.service.ts            # Role-scoped order access
│   └── orders.dto.ts                # CreateOrderDto + PlaceOrderDto
└── payments/
    ├── payments.module.ts
    ├── payments.controller.ts       # Admin-only write operations
    ├── payments.service.ts
    └── payments.dto.ts
```

---

## 🔐 Security Architecture

### Three Layers of Protection

```
Request
   ↓
JwtAuthGuard        → "Who are you?" — validates Bearer token
   ↓
PermissionGuard     → "Are you allowed?" — checks role vs PERMISSION_MAP
   ↓
validateCountryAccess() → "Is this your data?" — country isolation in service layer
   ↓
Controller / Service
```

### PERMISSION_MAP — Single Source of Truth

```typescript
export const PERMISSION_MAP: Record<string, Role[]> = {
  view_restaurants: [Role.ADMIN, Role.MANAGER, Role.MEMBER],
  create_order:     [Role.ADMIN, Role.MANAGER, Role.MEMBER],
  place_order:      [Role.ADMIN, Role.MANAGER],
  cancel_order:     [Role.ADMIN, Role.MANAGER],
  update_payment:   [Role.ADMIN],
};
```

### Custom Decorators in Action

```typescript
@Post(':id/place')
@RequirePermission('place_order')           // ← attaches metadata
place(@Param('id') id: string,
      @Body() dto: PlaceOrderDto,
      @CurrentUser() user: User) {          // ← extracts from request.user
  return this.ordersService.place(id, dto, user);
}
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login → returns JWT token |
| GET | `/api/auth/me` | Bearer | Get current user |

### Restaurants
| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/api/restaurants` | view_restaurants | List (country-scoped) |
| GET | `/api/restaurants/:id` | view_restaurants | Detail + menu |
| GET | `/api/restaurants/:id/menu` | view_restaurants | Menu items only |

### Orders
| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/api/orders` | All roles | List (role-scoped) |
| POST | `/api/orders` | create_order | Create pending order |
| POST | `/api/orders/:id/place` | place_order | Confirm + pay |
| POST | `/api/orders/:id/cancel` | cancel_order | Cancel order |

### Payments
| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/api/payments` | All roles | List (own only, admin sees all) |
| POST | `/api/payments` | update_payment | Add method (admin) |
| PUT | `/api/payments/:id` | update_payment | Edit method (admin) |

---

## 🚀 Running Locally

```bash
npm install
npm run start:dev     # development with hot reload → localhost:3001
npm run build         # production build
npm run start:prod    # run production build
```

---

## 🌐 Deployment (Railway)

1. Connect GitHub repo to Railway
2. Set root directory to `backend`
3. Add environment variable: `JWT_SECRET=your-secret-here`
4. Railway auto-detects NestJS and runs `npm run build && npm run start:prod`

---

## 🧪 Test the API

**Login:**
```bash
curl -X POST https://your-railway-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nick@shield.com","password":"password"}'
```

**Test RBAC — Thanos trying to place an order (should get 403):**
```bash
curl -X POST https://your-railway-url/api/orders/order-1/place \
  -H "Authorization: Bearer THANOS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paymentMethodId":"pay-4"}'
# → 403: "Your role "member" cannot perform: place_order"
```

**Test Country Isolation — Captain Marvel accessing America restaurant (should get 403):**
```bash
curl https://your-railway-url/api/restaurants/rest-4 \
  -H "Authorization: Bearer MARVEL_TOKEN"
# → 403: "Access denied: your account is scoped to India only"
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@nestjs/jwt` | JWT token creation and verification |
| `@nestjs/passport` + `passport-jwt` | JWT strategy integration |
| `bcryptjs` | One-way password hashing |
| `class-validator` | DTO validation decorators |
| `class-transformer` | JSON → class instance conversion |
| `uuid` | Unique ID generation for new orders |
