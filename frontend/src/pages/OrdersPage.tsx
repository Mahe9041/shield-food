import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import type { Order } from '../types';
import toast from 'react-hot-toast';

const FLAG: Record<string, string> = { India: '🇮🇳', America: '🇺🇸' };
const CUR:  Record<string, string> = { India: '₹',   America: '$'  };

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, can } = useAuth();
  const navigate = useNavigate();

  const fetchOrders = () => {
    api.get('/orders')
      .then((res) => setOrders(res.data.orders))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId: string) => {
    // Confirm before cancelling
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await api.post(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled');
      // Refresh the list
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to cancel');
    }
  };

  // Describes what the user is seeing based on their role
  const viewLabel = user?.role === 'admin'
    ? 'All orders globally'
    : user?.role === 'manager'
    ? `All ${user.country} orders`
    : 'Your orders';

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 26 }}>
        <h1 style={{
          fontFamily: 'Bebas Neue, cursive', fontSize: 40,
          letterSpacing: '0.03em', margin: 0,
        }}>
          ORDERS
        </h1>
        <p style={{ color: 'var(--text-3)', margin: '4px 0 0', fontSize: 14 }}>
          {viewLabel} · {orders.length} total
        </p>
      </div>

      {loading && (
        <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Loading orders...</div>
      )}

      {/* Empty state */}
      {!loading && orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-2)', marginBottom: 12 }}>
            No orders yet
          </div>
          <button
            className="btn btn-orange"
            onClick={() => navigate('/restaurants')}
          >
            Browse Restaurants
          </button>
        </div>
      )}

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {orders.map((order, i) => (
          <div
            key={order.id}
            className="card fade-up"
            style={{ padding: 18, animationDelay: `${i * 0.04}s` }}
          >
            {/* Order Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 8, marginBottom: 12,
            }}>
              <div>
                {/* Order ID + Status + Country */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 10, color: 'var(--text-3)',
                  }}>
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                  <span className={`s-${order.status}`}>
                    {order.status}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    {FLAG[order.country]} {order.country}
                  </span>
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  {new Date(order.createdAt).toLocaleString()}
                </div>

                {/* Admins and managers see which user placed the order */}
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <div style={{
                    fontSize: 11, color: 'var(--text-3)',
                    marginTop: 2, fontFamily: 'JetBrains Mono, monospace',
                  }}>
                    uid: {order.userId}
                  </div>
                )}
              </div>

              {/* Order Total */}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'Bebas Neue, cursive', fontSize: 24,
                  color: 'var(--accent)', letterSpacing: '0.05em',
                }}>
                  {CUR[order.country]}{order.total.toFixed(2)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  {order.items.length} item(s)
                </div>
              </div>
            </div>

            {/* Items Breakdown */}
            <div style={{
              background: 'var(--bg-raised)', borderRadius: 8,
              padding: '8px 12px', marginBottom: 12,
            }}>
              {order.items.map((item) => (
                <div
                  key={item.itemId}
                  style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 12, padding: '3px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span style={{ color: 'var(--text-2)' }}>
                    {item.name} × {item.quantity}
                  </span>
                  <span style={{ color: 'var(--text-3)' }}>
                    {CUR[order.country]}{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cancel Button — only for admins and managers on active orders */}
            {can('cancel_order') && ['pending', 'confirmed'].includes(order.status) && (
              <button
                className="btn btn-red"
                onClick={() => handleCancel(order.id)}
              >
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}