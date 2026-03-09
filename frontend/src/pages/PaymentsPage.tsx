import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import type { PaymentMethod } from '../types';
import toast from 'react-hot-toast';

const USER_NAMES: Record<string, string> = {
  'user-1': 'Nick Fury (Admin)',
  'user-2': 'Captain Marvel (Manager · India)',
  'user-3': 'Captain America (Manager · America)',
  'user-4': 'Thanos (Member · India)',
  'user-5': 'Thor (Member · India)',
  'user-6': 'Travis (Member · America)',
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState<string | null>(null);
  const [form, setForm]         = useState<Partial<PaymentMethod>>({});
  const { can } = useAuth();

  const fetchPayments = () => {
    api.get('/payments')
      .then((res) => setPayments(res.data.paymentMethods))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleEdit = (pm: PaymentMethod) => {
    setEditing(pm.id);
    // Pre-fill form with current values
    setForm({ brand: pm.brand, last4: pm.last4, expiry: pm.expiry, type: pm.type });
  };

  const handleSave = async (id: string) => {
    try {
      await api.put(`/payments/${id}`, form);
      toast.success('Payment method updated');
      setEditing(null);
      fetchPayments();
    } catch (err: unknown) {
  const error = err as { response?: { data?: { error?: string } } };
  toast.error(error.response?.data?.error || 'Checkout failed');
}
  };

  // Access denied screen for non-admins
  if (!can('update_payment')) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <h2 style={{
          fontFamily: 'Bebas Neue, cursive', fontSize: 32,
          letterSpacing: '0.05em', marginBottom: 8,
        }}>
          ACCESS DENIED
        </h2>
        <p style={{ color: 'var(--text-3)', marginBottom: 8 }}>
          Only admins can manage payment methods.
        </p>
        <p style={{ color: 'var(--text-3)', fontSize: 12 }}>
          NestJS{' '}
          <code style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: 'var(--accent)', fontSize: 11,
          }}>
            @RequirePermission('update_payment')
          </code>{' '}
          guard rejected this request on the backend.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{
        fontFamily: 'Bebas Neue, cursive', fontSize: 40,
        letterSpacing: '0.03em', marginBottom: 6,
      }}>
        PAYMENT METHODS
      </h1>
      <p style={{ color: 'var(--text-3)', marginBottom: 24, fontSize: 14 }}>
        Admin view — all users · {payments.length} on file
      </p>

      {loading ? (
        <div style={{ color: 'var(--text-3)' }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {payments.map((pm) => (
            <div key={pm.id} className="card" style={{ padding: 18 }}>

              {editing === pm.id ? (
                /* Edit Form */
                <>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: 10, marginBottom: 12,
                  }}>
                    {(['brand', 'last4', 'expiry', 'type'] as const).map((field) => (
                      <div key={field}>
                        <label style={{
                          display: 'block', fontSize: 10,
                          color: 'var(--text-3)', marginBottom: 4,
                          textTransform: 'uppercase', letterSpacing: '0.08em',
                        }}>
                          {field}
                        </label>
                        <input
                          className="inp"
                          value={(form[field] as string) ?? ''}
                          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-orange"
                      style={{ padding: '7px 14px', fontSize: 12 }}
                      onClick={() => handleSave(pm.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '7px 14px', fontSize: 12 }}
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                /* Display Row */
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 5 }}>
                      {USER_NAMES[pm.userId] ?? pm.userId}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>💳</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>
                          {pm.brand} •••• {pm.last4}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                          Expires {pm.expiry} · {pm.type}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '7px 14px', fontSize: 12 }}
                    onClick={() => handleEdit(pm)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}