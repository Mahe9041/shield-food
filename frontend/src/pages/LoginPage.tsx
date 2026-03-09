import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Quick-select users for demo purposes
const DEMO_USERS = [
  { name: 'Nick Fury',       email: 'nick@shield.com',    role: 'Admin',   country: 'Global',   avatar: 'NF', color: '#f97316' },
  { name: 'Captain Marvel',  email: 'marvel@shield.com',  role: 'Manager', country: 'India',    avatar: 'CM', color: '#3b82f6' },
  { name: 'Captain America', email: 'america@shield.com', role: 'Manager', country: 'America',  avatar: 'CA', color: '#3b82f6' },
  { name: 'Thanos',          email: 'thanos@shield.com',  role: 'Member',  country: 'India',    avatar: 'TH', color: '#22c55e' },
  { name: 'Thor',            email: 'thor@shield.com',    role: 'Member',  country: 'India',    avatar: 'TR', color: '#22c55e' },
  { name: 'Travis',          email: 'travis@shield.com',  role: 'Member',  country: 'America',  avatar: 'TV', color: '#22c55e' },
];

// Permission matrix just for display on the login page
const MATRIX = [
  ['View Restaurants', true,  true,  true ],
  ['Create Order',     true,  true,  true ],
  ['Place Order',      true,  true,  false],
  ['Cancel Order',     true,  true,  false],
  ['Update Payment',   true,  false, false],
];

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('password');
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent browser default form submission (page reload)
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome to SHIELD Food!');
      navigate('/');
    } catch (err: unknown) {
  const error = err as { response?: { data?: { error?: string } } };
  toast.error(error.response?.data?.error || 'Checkout failed');
} finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="grid-tex"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      {/* Ambient glow effect */}
      <div style={{
        position: 'fixed', top: '15%', left: '50%',
        transform: 'translateX(-50%)',
        width: 700, height: 300,
        background: 'radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div
        className="fade-up"
        style={{
          width: '100%', maxWidth: 1000,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
        }}
      >
        {/* ── Left Panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>

          {/* Logo + Title */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44,
                background: 'linear-gradient(135deg, #f97316, #c2560f)',
                borderRadius: 11, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontFamily: 'Bebas Neue, cursive',
                fontSize: 22, color: '#fff',
              }}>S</div>
              <div>
                <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 24, letterSpacing: '0.05em', lineHeight: 1 }}>
                  SHIELD FOOD
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em' }}>
                  NESTJS · REACT · RBAC
                </div>
              </div>
            </div>

            <h1 style={{
              fontFamily: 'Bebas Neue, cursive', fontSize: 54,
              letterSpacing: '0.02em', lineHeight: 1, marginBottom: 10,
            }}>
              FUEL THE<br />
              <span style={{ color: 'var(--accent)' }}>MISSION</span>
            </h1>
            <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.6 }}>
              Enterprise food ordering with NestJS Guards, custom Decorators,
              and country-scoped data isolation.
            </p>
          </div>

          {/* Permission Matrix */}
          <div className="card" style={{
            padding: 16,
            background: 'rgba(249,115,22,0.04)',
            borderColor: 'rgba(249,115,22,0.15)',
          }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.12em',
              color: 'var(--accent)', fontWeight: 600, marginBottom: 10,
            }}>
              RBAC PERMISSION MATRIX
            </div>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--text-3)' }}>
                  <th style={{ textAlign: 'left', padding: '3px 8px 3px 0', fontWeight: 500 }}>Function</th>
                  {['Admin', 'Manager', 'Member'].map((r) => (
                    <th key={r} style={{ padding: '3px 6px', fontWeight: 500 }}>{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map(([fn, ...vals]) => (
                  <tr key={fn as string} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '5px 8px 5px 0', color: 'var(--text-2)' }}>{fn}</td>
                    {(vals as boolean[]).map((v, i) => (
                      <td key={i} style={{
                        textAlign: 'center', padding: '5px 6px',
                        color: v ? 'var(--green)' : 'var(--red)', fontSize: 15,
                      }}>
                        {v ? '✓' : '✗'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Quick Select Users */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.12em',
              color: 'var(--text-3)', fontWeight: 600, marginBottom: 12,
            }}>
              QUICK SELECT — CLICK TO LOGIN AS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {DEMO_USERS.map((u) => (
                <button
                  key={u.email}
                  onClick={() => setEmail(u.email)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${email === u.email ? u.color : 'var(--border)'}`,
                    background: email === u.email ? `${u.color}18` : 'var(--bg-raised)',
                    transition: 'all 0.15s', textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: 7,
                    background: u.color, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Bebas Neue, cursive', fontSize: 11, color: '#fff',
                  }}>
                    {u.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>
                      {u.name}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', lineHeight: 1.2 }}>
                      {u.role} · {u.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <div className="card" style={{ padding: 22 }}>
            <div style={{
              fontFamily: 'Bebas Neue, cursive', fontSize: 22,
              letterSpacing: '0.05em', marginBottom: 18,
            }}>
              SIGN IN
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{
                  display: 'block', fontSize: 11, color: 'var(--text-3)',
                  marginBottom: 5, letterSpacing: '0.08em', fontWeight: 600,
                }}>
                  EMAIL
                </label>
                <input
                  className="inp"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@shield.com"
                  required
                />
              </div>

              <div>
                <label style={{
                  display: 'block', fontSize: 11, color: 'var(--text-3)',
                  marginBottom: 5, letterSpacing: '0.08em', fontWeight: 600,
                }}>
                  PASSWORD
                </label>
                <input
                  className="inp"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                  Demo password:{' '}
                  <span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
                    password
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-orange"
                disabled={loading}
                style={{ width: '100%', padding: '12px', fontSize: 13, marginTop: 4 }}
              >
                {loading ? 'AUTHENTICATING...' : 'ACCESS SHIELD FOOD'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}