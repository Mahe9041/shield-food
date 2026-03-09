import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// Role colors — each role gets a distinct color throughout the UI
const ROLE_COLOR: Record<string, string> = {
  admin:   '#f97316',
  manager: '#3b82f6',
  member:  '#22c55e',
};

export default function Navbar() {
  const { user, logout, can } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login');
  };

  // Helper to check if a nav link is the current page
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  // Build nav links based on what the user can access
  const navLinks = [
    { to: '/restaurants', label: 'Restaurants' },
    { to: '/orders',      label: 'Orders' },
    // Only show Payments link to admins
    ...(can('update_payment') ? [{ to: '/payments', label: 'Payments' }] : []),
  ];

  const color = ROLE_COLOR[user?.role ?? 'member'];

  return (
    <nav style={{
      background: 'rgba(9,9,11,0.9)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        height: 60, display: 'flex', alignItems: 'center', gap: 24,
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #f97316, #c2560f)',
            borderRadius: 9, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontFamily: 'Bebas Neue, cursive',
            fontSize: 18, color: '#fff',
          }}>S</div>
          <span style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 20, letterSpacing: '0.06em', color: 'var(--text)' }}>
            SHIELD FOOD
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: 2, flex: 1 }}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '5px 13px', borderRadius: 7, fontSize: 13,
                fontWeight: 500, textDecoration: 'none',
                color: isActive(link.to) ? 'var(--accent)' : 'var(--text-2)',
                background: isActive(link.to) ? 'var(--accent-glow)' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Cart Icon */}
        <Link to="/cart" style={{ position: 'relative', textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            border: '1px solid var(--border)', background: 'var(--bg-raised)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
          }}>🛒</div>
          {itemCount > 0 && (
            <div className="pop-anim" style={{
              position: 'absolute', top: -5, right: -5,
              width: 17, height: 17, borderRadius: '50%',
              background: 'var(--accent)', color: '#fff',
              fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {itemCount}
            </div>
          )}
        </Link>

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 10px 4px 4px', borderRadius: 9,
              border: '1px solid var(--border)', background: 'var(--bg-raised)',
              cursor: 'pointer',
            }}
          >
            {/* Avatar circle with role color */}
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Bebas Neue, cursive', fontSize: 10, color: '#fff',
            }}>
              {user?.avatar}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>
                {user?.name}
              </div>
              <div style={{ fontSize: 10, color, lineHeight: 1.2, textTransform: 'capitalize' }}>
                {user?.role}{user?.country ? ` · ${user.country}` : ''}
              </div>
            </div>
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 6,
              background: 'var(--bg-raised)', border: '1px solid var(--border)',
              borderRadius: 10, padding: 8, minWidth: 160, zIndex: 200,
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            }}>
              <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>Signed in as</div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', padding: '7px 10px', textAlign: 'left',
                  borderRadius: 6, border: 'none', background: 'transparent',
                  cursor: 'pointer', fontSize: 12, color: 'var(--red)',
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}