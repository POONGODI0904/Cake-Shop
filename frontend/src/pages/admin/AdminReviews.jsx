import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Check, EyeOff, Trash2, ShieldCheck } from 'lucide-react';
import { reviewsAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchReviews = async () => {
    try {
      const res = await reviewsAPI.getAll();
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await reviewsAPI.updateStatus(id, status);
      showToast(`Review status updated to ${status}`, 'success');
      fetchReviews();
    } catch (err) {
      showToast('Failed to update review status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this customer review permanently?')) {
      try {
        await reviewsAPI.delete(id);
        showToast('Review deleted', 'info');
        fetchReviews();
      } catch (err) {
        showToast('Failed to delete review', 'error');
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', color: '#2A170E', marginBottom: '4px' }}>Customer Review Moderation</h1>
        <p style={{ color: '#73645C', fontSize: '0.9rem' }}>
          Approve or filter customer ratings, testimonials, and uploaded delivery photos.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {reviews.map((rev) => (
          <div
            key={rev.id}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #EFE8DE',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                    alt={rev.userName}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: '#2A170E' }}>{rev.userName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#8C532B', fontWeight: 600 }}>{rev.productName}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2px', color: '#B45309' }}>
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} fill="#B45309" />
                  ))}
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#73645C', lineHeight: 1.6, marginBottom: '16px' }}>
                "{rev.review}"
              </p>

              {rev.image && (
                <div style={{ marginBottom: '16px' }}>
                  <img
                    src={rev.image}
                    alt="Review attachment"
                    style={{ width: '100px', height: '100px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #F4ECE1',
              paddingTop: '14px'
            }}>
              <span style={{
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: rev.status === 'approved' ? '#E8F5E9' : '#FEF3C7',
                color: rev.status === 'approved' ? '#2E7D32' : '#B45309'
              }}>
                {rev.status || 'approved'}
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                {rev.status !== 'approved' && (
                  <button
                    onClick={() => handleStatus(rev.id, 'approved')}
                    className="btn-outline"
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                  >
                    <Check size={14} />
                    <span>Approve</span>
                  </button>
                )}
                {rev.status === 'approved' && (
                  <button
                    onClick={() => handleStatus(rev.id, 'hidden')}
                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #EFE8DE', fontSize: '0.78rem', color: '#73645C' }}
                  >
                    <EyeOff size={14} />
                    <span>Hide</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(rev.id)}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #FDA4AF', color: '#E11D48' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
