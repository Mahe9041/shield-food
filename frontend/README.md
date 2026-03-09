# 🛡️ SHIELD Food — Frontend

> React TypeScript SPA built with Vite, featuring context-based auth, cart state, and frontend RBAC mirroring the backend permission system.

---

## 🗂️ Project Structure

```
src/
├── types/
│   └── index.ts                  # Shared TypeScript interfaces (User, Order, Restaurant...)
├── utils/
│   └── api.ts                    # Axios instance with JWT interceptor + 401 auto-redirect
├── context/
│   ├── AuthContext.tsx            # JWT auth state + login/logout + can() RBAC helper
│   └── CartContext.tsx            # Cart state — add/remove items, total, count
├── components/
│   └── Navbar.tsx                 # Sticky nav — role-aware links, cart badge, user menu
└── pages/
    ├── LoginPage.tsx              # Quick-select users + permission matrix display
    ├── DashboardPage.tsx          # Role info + permissions + quick actions
    ├── RestaurantsPage.tsx        # Country-filtered grid (admin gets filter buttons)
    ├── RestaurantDetailPage.tsx   # Menu by category + add/remove cart controls
    ├── CartPage.tsx               # Order summary + payment selection + checkout
    ├── OrdersPage.tsx             # Role-scoped order list + cancel button
    └── PaymentsPage.tsx           # Admin-only — inline edit payment methods
```

---

## 🔐 Frontend RBAC

The `AuthContext` exposes a `can()` helper that mirrors the backend `PERMISSION_MAP`:

```typescript
const PERMISSION_MAP: Record<string, string[]> = {
  view_restaurants: ['admin', 'manager', 'member'],
  create_order:     ['admin', 'manager', 'member'],
  place_order:      ['admin', 'manager'],
  cancel_order:     ['admin', 'manager'],
  update_payment:   ['admin'],
};

const can = (permission: string): boolean =>
  PERMISSION_MAP[permission]?.includes(user?.role) ?? false;
```

Used throughout the UI to conditionally render elements:

```typescript
{can('place_order') && <button>Checkout</button>}
{can('cancel_order') && <button>Cancel Order</button>}
{can('update_payment') && <Link to="/payments">Payments</Link>}
```

> ⚠️ Frontend checks are UX only — real security is always enforced by the backend guards.

---

## 🌐 API Communication

All requests go through a central Axios instance at `src/utils/api.ts`:

```typescript
const api = axios.create({ baseURL: '/api' });

// Auto-attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401 (expired token)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
```

---

## 🛒 Cart State

CartContext handles cross-restaurant protection automatically:

```typescript
// Adding from a different restaurant resets the cart
if (prev.restaurantId && prev.restaurantId !== restaurant.id) {
  return { restaurantId: restaurant.id, restaurant, items: [{ ...item, quantity: 1 }] };
}
```

`total` and `itemCount` are derived values — calculated fresh from `cart.items` on every render rather than stored as separate state. This prevents state sync bugs.

---

## 🚀 Running Locally

```bash
npm install
npm run dev        # → http://localhost:3000
npm run build      # production build → dist/
npm run preview    # preview production build locally
```

---

## 🌐 Deployment (Vercel)

1. Connect GitHub repo to Vercel
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-backend-url.railway.app
   ```
4. Vercel auto-detects Vite — build command is `npm run build`, output is `dist/`

### Update `api.ts` for production

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
});
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `react-router-dom` | Client-side routing — SPA navigation |
| `axios` | HTTP client with interceptor support |
| `react-hot-toast` | Toast notifications for success/error feedback |
| `vite` | Build tool — near-instant hot reload via ES modules |

---

## 🎨 Design System

CSS custom properties in `index.css` power the entire dark theme:

```css
:root {
  --bg: #09090b;          /* Page background */
  --accent: #f97316;      /* Orange — primary brand color */
  --text: #fafafa;        /* Primary text */
  --text-2: #a1a1aa;      /* Secondary text */
  --green: #22c55e;       /* Success / allowed */
  --red: #ef4444;         /* Error / denied */
}
```

Role colors: Admin → Orange · Manager → Blue · Member → Green
