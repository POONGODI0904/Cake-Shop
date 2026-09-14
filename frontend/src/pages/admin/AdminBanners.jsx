import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Edit2, X, ExternalLink } from 'lucide-react';
import { bannersAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    heading: '',
    description: '',
    buttonText: 'Order Now',
    buttonLink: '/cakes',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop'
  });

  const fetchBanners = async () => {
    try {
      const res = await bannersAPI.getAll();
      setBanners(res.data.banners || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bannersAPI.create(formData);
      showToast('Banner published to homepage!', 'success');
      setShowModal(false);
      fetchBanners();
    } catch (err) {
      showToast('Failed to create banner: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this banner from homepage?')) {
      try {
        await bannersAPI.delete(id);
        showToast('Banner removed', 'info');
        fetchBanners();
      } catch (err) {
        showToast('Failed to delete banner', 'error');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#2A170E', marginBottom: '4px' }}>Banner Management</h1>
          <p style={{ color: '#73645C', fontSize: '0.9rem' }}>
            Configure homepage hero promotional banners, headlines, and call-to-action destinations.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-gold" style={{ padding: '12px 24px' }}>
          <Plus size={18} />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Grid of Banners (Section 32 of Spec) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {banners.map((ban) => (
          <div
            key={ban.id}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid #EFE8DE',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
              <img src={ban.image} alt={ban.heading} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#E8F5E9',
                color: '#2E7D32',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                Active Banner
              </span>
            </div>

            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#2A170E', marginBottom: '8px' }}>{ban.heading}</h3>
              <p style={{ fontSize: '0.85rem', color: '#73645C', lineHeight: 1.6, marginBottom: '16px' }}>
                {ban.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F4ECE1', paddingTop: '14px' }}>
                <span style={{ fontSize: '0.82rem', color: '#8C532B', fontWeight: 600 }}>
                  CTA: "{ban.buttonText}" → {ban.buttonLink}
                </span>
                <button
                  onClick={() => handleDelete(ban.id)}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #FDA4AF', color: '#E11D48' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Banner Modal */}
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
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '540px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#2A170E' }}>Create Homepage Banner</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Banner Heading *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.heading}
                  onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Banner Description</label>
                <textarea
                  rows={2}
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Banner Image URL *</label>
                <input
                  type="url"
                  required
                  className="form-input"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label">Button Text</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Button Link Destination</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-gold" style={{ padding: '10px 24px' }}>
                  Publish Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
