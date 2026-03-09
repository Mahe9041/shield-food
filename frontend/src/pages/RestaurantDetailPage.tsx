import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { Restaurant, MenuItem } from '../types';
import toast from 'react-hot-toast';

const FLAG: Record<string, string> = { India: '🇮🇳', America: '🇺🇸' };
const CUR:  Record<string, string> = { India: '₹',   America: '$' };

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { cart, addItem, removeItem, itemCount } = useCart();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu]             = useState<MenuItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    api.get(`/restaurants/${id}`)
      .then((res) => {
        setRestaurant(res.data.restaurant);
        setMenu(res.data.menu);
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || 'Access denied');
        navigate('/restaurants');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ padding: 40, color: 'var(--text-3)' }}>Loading...</div>
  );

  if (!restaurant) return null;

  const categories = ['all', ...new Set(menu.map((m) => m.category))];
  const shown      = activeCategory === 'all' ? menu : menu.filter((m) => m.category === activeCategory);
  const cur        = CUR[restaurant.country];

  // Get quantity of an item currently in the cart
  const getQty = (itemId: string) =>
    cart.items.find((i) => i.id === itemId)?.quantity ?? 0;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

      {/* Restaurant Header */}
      <div className="card" style={{ padding: 22, marginBottom: 22 }}>
        <button
          onClick={() => navigate('/restaurants')}
          style={{
            background: 'none', border: 'none', color: 'var(--text-3)',
            cursor: 'pointer', fontSize: 13, marginBottom: 14,
          }}
        >
          ← Back to Restaurants
        </button>

        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <span style={{ fontSize: 52 }}>{restaurant.image}</span>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 7, marginBottom: 7, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 6,
                background: 'var(--accent-glow)', color: 'var(--accent)',
                border: '1px solid rgba(249,115,22,0.2)',
              }}>
                ⭐ {restaurant.rating}
              </span>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 6,
                background: 'var(--bg-raised)', color: 'var(--text-3)',
                border: '1px solid var(--border)',
              }}>
                {FLAG[restaurant.country]} {restaurant.city}
              </span>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 6,
                background: 'var(--bg-raised)', color: 'var(--text-3)',
                border: '1px solid var(--border)',
              }}>
                {restaurant.cuisine}
              </span>
            </div>

            <h1 style={{
              fontFamily: 'Bebas Neue, cursive', fontSize: 34,
              letterSpacing: '0.03em', marginBottom: 5,
            }}>
              {restaurant.name}
            </h1>
            <p style={{ color: 'var(--text-3)', fontSize: 13 }}>{restaurant.description}</p>

            <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 13, color: 'var(--text-2)' }}>
              <span>🕐 {restaurant.deliveryTime}</span>
              <span>💰 Min order: {cur}{restaurant.minOrder}</span>
            </div>
          </div>

          {/* View cart button — only shows when cart has items */}
          {itemCount > 0 && (
            <button
              className="btn btn-orange pop-anim"
              onClick={() => navigate('/cart')}
            >
              View Cart ({itemCount}) →
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex', gap: 7, marginBottom: 20,
        overflowX: 'auto', paddingBottom: 4,
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="btn"
            style={{
              padding: '5px 14px', borderRadius: 20,
              fontSize: 12, whiteSpace: 'nowrap',
              border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
              background: activeCategory === cat ? 'var(--accent-glow)' : 'var(--bg-raised)',
              color: activeCategory === cat ? 'var(--accent)' : 'var(--text-2)',
            }}
          >
            {cat === 'all' ? 'All Items' : cat}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: 10,
      }}>
        {shown.map((item) => {
          const qty = getQty(item.id);

          return (
            <div
              key={item.id}
              className="card"
              style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: item.veg ? 'var(--green)' : 'var(--red)' }}>
                    {item.veg ? '🟢 Veg' : '🔴 Non-veg'}
                  </span>
                  {item.popular && (
                    <span style={{ fontSize: 10, color: 'var(--accent)' }}>🔥 Popular</span>
                  )}
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 7, lineHeight: 1.4 }}>
                  {item.description}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>
                  {cur}{item.price}
                </div>
              </div>

              {/* Add/Remove controls — only for users who can create orders */}
              {can('create_order') && (
                qty === 0 ? (
                  <button
                    className="btn btn-orange"
                    style={{ padding: '7px 14px', fontSize: 12, flexShrink: 0 }}
                    onClick={() => {
                      addItem(restaurant, item);
                      toast.success(`Added ${item.name}`);
                    }}
                  >
                    ADD
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        width: 26, height: 26, borderRadius: 6,
                        border: '1px solid var(--border)', background: 'var(--bg-raised)',
                        color: 'var(--text)', cursor: 'pointer', fontSize: 15,
                      }}
                    >−</button>
                    <span style={{
                      fontSize: 13, fontWeight: 700, color: 'var(--accent)',
                      minWidth: 18, textAlign: 'center',
                    }}>
                      {qty}
                    </span>
                    <button
                      onClick={() => addItem(restaurant, item)}
                      style={{
                        width: 26, height: 26, borderRadius: 6,
                        border: '1px solid var(--accent)', background: 'var(--accent-glow)',
                        color: 'var(--accent)', cursor: 'pointer', fontSize: 15,
                      }}
                    >+</button>
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}