import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, X, CheckCircle2, Clock } from 'lucide-react';
import { couponsAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minimumAmount: 499,
    maximumDiscount: 200,
    expiryDate: '2027-12-31',
    usageLimit: 500
  });

  const fetchCoupons = async () => {
    try {
      const res = await couponsAPI.getAll();
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await couponsAPI.create(formData);
      showToast(`Coupon "${formData.code}" created!`, 'success');
      setShowModal(false);
      fetchCoupons();
    } catch (err) {
      showToast('Error creating coupon: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Delete coupon "${code}"?`)) {
      try {
        await couponsAPI.delete(id);
        showToast('Coupon removed.', 'info');
        fetchCoupons();
      } catch (err) {
        showToast('Failed to delete coupon', 'error');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#2A170E', marginBottom: '4px' }}>Coupon Management</h1>
          <p style={{ color: '#73645C', fontSize: '0.9rem' }}>
            Create discount promo codes, configure minimum spends, usage limits, and expiration.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-gold" style={{ padding: '12px 24px' }}>
          <Plus size={18} />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Table (Section 31 of Spec) */}
      <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EFE8DE', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '2px solid #EFE8DE', textAlign: 'left', color: '#8C532B', fontSize: '0.78rem' }}>
                <th style={{ padding: '14px 16px' }}>CODE</th>
                <th style={{ padding: '14px 16px' }}>DISCOUNT</th>
                <th style={{ padding: '14px 16px' }}>MIN ORDER</th>
                <th style={{ padding: '14px 16px' }}>MAX DISCOUNT</th>
                <th style={{ padding: '14px 16px' }}>USAGE LIMIT</th>
                <th style={{ padding: '14px 16px' }}>EXPIRY DATE</th>
                <th style={{ padding: '14px 16px' }}>STATUS</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((cpn) => (
                <tr key={cpn.id} style={{ borderBottom: '1px solid #F4ECE1' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#2A170E', letterSpacing: '0.5px' }}>
                    {cpn.code}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#16A34A', fontWeight: 700 }}>
                    {cpn.discountType === 'percentage' ? `${cpn.discountValue}%` : `₹${cpn.discountValue} Flat`}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    ₹{cpn.minimumAmount}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    ₹{cpn.maximumDiscount || 500}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {cpn.usedCount || 0} / {cpn.usageLimit}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#73645C', fontSize: '0.82rem' }}>
                    {cpn.expiryDate}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, background: '#E8F5E9', color: '#2E7D32' }}>
                      Active
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(cpn.id, cpn.code)}
                      style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #FDA4AF', color: '#E11D48' }}
                      title="Delete coupon"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '520px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#2A170E' }}>Create Promotional Coupon</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE25"
                  className="form-input"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="form-label">Discount Type</label>
                  <select
                    className="form-input"
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Discount Value *</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="form-label">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.minimumAmount}
                    onChange={(e) => setFormData({ ...formData, minimumAmount: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="form-label">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.maximumDiscount}
                    onChange={(e) => setFormData({ ...formData, maximumDiscount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Usage Limit (Claims)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-gold" style={{ padding: '10px 24px' }}>
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
