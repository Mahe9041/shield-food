import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_COLOR: Record<string, string> = {
  admin:   '#f97316',
  manager: '#3b82f6',
  member:  '#22c55e',
};

const ROLE_ICON: Record<string, string> = {
  admin:   '👁️',
  manager: '🛡️',
  member:  '⚡',
};

const FLAG: Record<string, string> = {
  India:   '🇮🇳',
  America: '🇺🇸',
};

// All capabilities in the system
const CAPABILITIES = [
  { permission: 'view_restaurants', label: 'View Restaurants & Menus', icon: '🍽️', link: '/restaurants' },
  { permission: 'create_order',     label: 'Add Items to Cart',        icon: '🛒', link: '/restaurants' },
  { permission: 'place_order',      label: 'Checkout & Pay',           icon: '💳', link: '/cart'        },
  { permission: 'cancel_order',     label: 'Cancel Orders',            icon: '🚫', link: '/orders'      },
  { permission: 'update_payment',   label: 'Manage Payment Methods',   icon: '💰', link: '/payments'    },
];

export default function DashboardPage() {
  const { user, can } = useAuth();

  const color = ROLE_COLOR[user?.role ?? 'member'];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '36px 24px' }}>

      {/* Welcome Header */}
      <div style={{ marginBottom: 32 }}>
        <span className={`badge badge-${user?.role}`} style={{ marginBottom: 14, display: 'inline-flex' }}>
          {ROLE_ICON[user?.role ?? 'member']} {user?.role}
          {user?.country ? ` · ${user.country}` : ' · Global'}
        </span>

        <h1 style={{
          fontFamily: 'Bebas Neue, cursive', fontSize: 54,
          letterSpacing: '0.02em', lineHeight: 1, marginBottom: 10,
        }}>
          WELCOME,<br />
          <span style={{ color }}>{user?.name?.toUpperCase()}</span>
        </h1>

        <p style={{ color: 'var(--text-2)', fontSize: 15 }}>
          {user?.role === 'admin'
            ? 'Global admin — full access to all SHIELD Food operations worldwide.'
            : user?.role === 'manager'
            ? `Managing ${user?.country} operations. You can view, order, and cancel for your region.`
            : `Team member in ${user?.country}. You can browse restaurants and add items to cart.`
          }
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Your Permissions Card */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{
            fontSize: 10, letterSpacing: '0.12em',
            color: 'var(--text-3)', fontWeight: 600, marginBottom: 14,
          }}>
            YOUR PERMISSIONS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {CAPABILITIES.map((cap) => {
              const allowed = can(cap.permission);
              return (
                <div
                  key={cap.permission}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 8,
                    border: `1px solid ${allowed ? 'rgba(34,197,94,0.18)' : 'var(--border)'}`,
                    background: allowed ? 'rgba(34,197,94,0.05)' : 'transparent',
                  }}
                >
                  <span style={{ fontSize: 15 }}>{cap.icon}</span>
                  <span style={{
                    flex: 1, fontSize: 13,
                    color: allowed ? 'var(--text)' : 'var(--text-3)',
                  }}>
                    {cap.label}
                  </span>
                  <span style={{ color: allowed ? 'var(--green)' : 'var(--red)', fontSize: 14 }}>
                    {allowed ? '✓' : '✗'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Quick Actions */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.12em',
              color: 'var(--text-3)', fontWeight: 600, marginBottom: 14,
            }}>
              QUICK ACTIONS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

              <Link to="/restaurants" style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
                  background: 'linear-gradient(135deg, rgba(249,115,22,0.14), rgba(249,115,22,0.05))',
                  border: '1px solid rgba(249,115,22,0.2)',
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 14, marginBottom: 2 }}>
                    Browse Restaurants →
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    View menus and build your cart
                  </div>
                </div>
              </Link>

              <Link to="/orders" style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '14px 16px', borderRadius: 10,
                  background: 'var(--bg-raised)', border: '1px solid var(--border)',
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                    View Orders →
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    Track and manage orders
                  </div>
                </div>
              </Link>

              {can('update_payment') && (
                <Link to="/payments" style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '14px 16px', borderRadius: 10,
                    background: 'var(--bg-raised)', border: '1px solid var(--border)',
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                      Payment Methods →
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      Admin: manage all cards
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* NestJS Architecture Info */}
          <div className="card" style={{
            padding: 16,
            background: 'rgba(234,0,122,0.04)',
            borderColor: 'rgba(234,0,122,0.15)',
          }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.1em',
              color: '#e8006c', fontWeight: 600, marginBottom: 8,
            }}>
              NESTJS ARCHITECTURE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                ['Guards',     'JwtAuthGuard + PermissionGuard'],
                ['Decorators', '@RequirePermission() @CurrentUser()'],
                ['Modules',    'Auth · Restaurants · Orders · Payments'],
                ['Pipes',      'ValidationPipe + class-validator DTOs'],
              ].map(([key, val]) => (
                <div key={key} style={{ fontSize: 12 }}>
                  <span style={{ color: 'var(--text-3)' }}>{key}: </span>
                  <span style={{
                    color: 'var(--text-2)',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                  }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Country Restriction Notice */}
      {user?.country && (
        <div style={{
          marginTop: 16, padding: '14px 18px', borderRadius: 10,
          background: 'rgba(59,130,246,0.06)',
          border: '1px solid rgba(59,130,246,0.15)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>{FLAG[user.country]}</span>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--blue)', fontSize: 13, marginBottom: 2 }}>
              Country-Scoped Access Active
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
              Your account is scoped to{' '}
              <strong style={{ color: 'var(--text-2)' }}>{user.country}</strong>.
              Restaurants and orders from other countries are not accessible.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}