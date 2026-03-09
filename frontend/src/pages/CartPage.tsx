import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { PaymentMethod } from '../types';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CUR: Record<string, string> = { India: '₹', America: '$' };

export default function CartPage() {
  const { cart, addItem, removeItem, clearCart, total } = useCart();
  const { user, can } = useAuth();
  const navigate = useNavigate();

  const [payments, setPayments]     = useState<PaymentMethod[]>([]);
  const [selectedPay, setSelectedPay] = useState<string>('');
  const [loading, setLoading]       = useState(false);

  // Load user's payment methods when page opens
  useEffect(() => {
    api.get('/payments')
      .then((res) => {
        // Only show THIS user's payment methods
        const mine = res.data.paymentMethods.filter(
          (p: PaymentMethod) => p.userId === user?.id
        );
        setPayments(mine);
        // Auto-select the first one
        if (mine.length > 0) setSelectedPay(mine[0].id);
      })
      .catch(() => toast.error('Failed to load payment methods'));
  }, []);

  const handleCheckout = async () => {
    if (!selectedPay) {
      toast.error('Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create the order (status = pending)
      const { data: created } = await api.post('/orders', {
        restaurantId: cart.restaurantId,
        items: cart.items.map((i) => ({
          itemId: i.id,
          quantity: i.quantity,
        })),
      });

      // Step 2: Place the order (status = confirmed)
      await api.post(`/orders/${created.order.id}/place`, {
        paymentMethodId: selectedPay,
      });

      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');

    } catch (err: unknown) {
  const error = err as { response?: { data?: { error?: string } } };
  toast.error(error.response?.data?.error || 'Checkout failed');
}finally {
      setLoading(false);
    }
  };

  const cur = CUR[cart.restaurant?.country ?? 'America'];

  // Empty cart state
  if (cart.items.length === 0) {
    return (
      <div style={{
        maxWidth: 500, margin: '80px auto',
        textAlign: 'center', padding: '0 24px',
      }}>
        <div style={{ fontSize: 60, marginBottom: 14 }}>🛒</div>
        <h2 style={{
          fontFamily: 'Bebas Neue, cursive', fontSize: 32,
          letterSpacing: '0.05em', marginBottom: 10,
        }}>
          CART IS EMPTY
        </h2>
        <p style={{ color: 'var(--text-3)', marginBottom: 24 }}>
          Browse restaurants and add some items first
        </p>
        <button
          className="btn btn-orange"
          onClick={() => navigate('/restaurants')}
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{
        fontFamily: 'Bebas Neue, cursive', fontSize: 36,
        letterSpacing: '0.03em', marginBottom: 6,
      }}>
        YOUR ORDER
      </h1>
      <p style={{ color: 'var(--text-3)', marginBottom: 22, fontSize: 14 }}>
        From {cart.restaurant?.name}
      </p>

      {/* Order Items */}
      <div className="card" style={{ marginBottom: 14, overflow: 'hidden' }}>
        {cart.items.map((item, i) => (
          <div
            key={item.id}
            style={{
              padding: '13px 18px',
              borderBottom: i < cart.items.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                {cur}{item.price} each
              </div>
            </div>

            {/* Quantity controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  width: 24, height: 24, borderRadius: 6,
                  border: '1px solid var(--border)', background: 'var(--bg-raised)',
                  cursor: 'pointer', fontSize: 13, color: 'var(--text)',
                }}
              >−</button>
              <span style={{
                fontSize: 13, fontWeight: 700,
                color: 'var(--accent)', minWidth: 20, textAlign: 'center',
              }}>
                {item.quantity}
              </span>
              <button
                onClick={() => addItem(cart.restaurant!, item)}
                style={{
                  width: 24, height: 24, borderRadius: 6,
                  border: '1px solid var(--accent)', background: 'var(--accent-glow)',
                  cursor: 'pointer', fontSize: 13, color: 'var(--accent)',
                }}
              >+</button>
            </div>

            {/* Line total */}
            <div style={{
              fontSize: 14, fontWeight: 700,
              minWidth: 58, textAlign: 'right',
            }}>
              {cur}{(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}

        {/* Order Total */}
        <div style={{
          padding: '13px 18px', background: 'var(--bg-raised)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontWeight: 600 }}>Total</span>
          <span style={{
            fontFamily: 'Bebas Neue, cursive', fontSize: 24,
            color: 'var(--accent)', letterSpacing: '0.05em',
          }}>
            {cur}{total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="card" style={{ padding: 18, marginBottom: 14 }}>
        <div style={{
          fontSize: 10, letterSpacing: '0.1em',
          color: 'var(--text-3)', fontWeight: 600, marginBottom: 10,
        }}>
          PAYMENT METHOD
        </div>

        {payments.length === 0 ? (
          <div style={{ color: 'var(--text-3)', fontSize: 14 }}>
            No payment method on file. Contact your admin.
          </div>
        ) : (
          payments.map((pm) => (
            <label
              key={pm.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
                marginBottom: 7,
                border: `1px solid ${selectedPay === pm.id ? 'var(--accent)' : 'var(--border)'}`,
                background: selectedPay === pm.id ? 'var(--accent-glow)' : 'var(--bg-raised)',
                transition: 'all 0.15s',
              }}
            >
              <input
                type="radio"
                name="payment"
                value={pm.id}
                checked={selectedPay === pm.id}
                onChange={() => setSelectedPay(pm.id)}
                style={{ accentColor: 'var(--accent)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>
                  {pm.brand} •••• {pm.last4}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  Expires {pm.expiry}
                </div>
              </div>
              <span style={{ fontSize: 16 }}>💳</span>
            </label>
          ))
        )}
      </div>

      {/* Member Warning */}
      {!can('place_order') && (
        <div style={{
          padding: '11px 14px', borderRadius: 8, marginBottom: 14,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          fontSize: 13, color: 'var(--red)',
        }}>
          ⚠️ Members cannot place orders directly.
          Ask your Manager or Admin to complete checkout.
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="btn btn-ghost"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <button
          className="btn btn-orange"
          onClick={handleCheckout}
          disabled={loading || !can('place_order')}
          style={{
            flex: 1, padding: '12px',
            opacity: can('place_order') ? 1 : 0.4,
          }}
        >
          {loading ? 'Placing Order...' : `Place Order · ${cur}${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}