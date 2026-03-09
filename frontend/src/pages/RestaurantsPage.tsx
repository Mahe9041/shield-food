import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import type { Restaurant } from '../types';
import toast from 'react-hot-toast';

const FLAG: Record<string, string> = { India: '🇮🇳', America: '🇺🇸' };

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState<string>('all');
  const { user } = useAuth();

  useEffect(() => {
    api.get('/restaurants')
      .then((res) => setRestaurants(res.data.restaurants))
      .catch(() => toast.error('Failed to load restaurants'))
      .finally(() => setLoading(false));
  }, []); // runs once when component mounts

  // Admin can filter by country, others only see their country anyway
  const shown = filter === 'all'
    ? restaurants
    : restaurants.filter((r) => r.country === filter);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{
            fontFamily: 'Bebas Neue, cursive', fontSize: 40,
            letterSpacing: '0.03em', margin: 0,
          }}>
            RESTAURANTS
          </h1>
          <p style={{ color: 'var(--text-3)', margin: '4px 0 0', fontSize: 14 }}>
            {user?.role === 'admin'
              ? `Global view · ${restaurants.length} total`
              : `${user?.country} only · ${restaurants.length} available`
            }
          </p>
        </div>

        {/* Country filter — only admins see this */}
        {user?.role === 'admin' && (
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'India', 'America'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="btn"
                style={{
                  padding: '6px 14px', fontSize: 12,
                  border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
                  background: filter === f ? 'var(--accent-glow)' : 'var(--bg-raised)',
                  color: filter === f ? 'var(--accent)' : 'var(--text-2)',
                }}
              >
                {f === 'all' ? '🌍 Global' : `${FLAG[f]} ${f}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Loading restaurants...</div>
      )}

      {/* Empty state */}
      {!loading && shown.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-2)' }}>
            No restaurants available
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-3)' }}>
            Your access is limited to {user?.country}
          </div>
        </div>
      )}

      {/* Restaurant Grid */}
      {!loading && shown.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 14,
        }}>
          {shown.map((r, i) => (
            <Link
              key={r.id}
              to={`/restaurants/${r.id}`}
              style={{
                textDecoration: 'none',
                animationDelay: `${i * 0.05}s`,
              }}
              className="fade-up"
            >
              <div
                className="card"
                style={{ padding: 20, transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.transform   = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow   = '0 8px 28px rgba(249,115,22,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform   = 'none';
                  e.currentTarget.style.boxShadow   = 'none';
                }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 40 }}>{r.image}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 6,
                      background: 'var(--accent-glow)', color: 'var(--accent)',
                      border: '1px solid rgba(249,115,22,0.2)',
                    }}>
                      ⭐ {r.rating}
                    </span>
                    <span style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 6,
                      background: 'var(--bg-raised)', color: 'var(--text-3)',
                      border: '1px solid var(--border)',
                    }}>
                      {FLAG[r.country]} {r.city}
                    </span>
                  </div>
                </div>

                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10, lineHeight: 1.5 }}>
                  {r.description}
                </div>
                <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-2)' }}>
                  <span>🕐 {r.deliveryTime}</span>
                  <span>🏷️ {r.cuisine}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}