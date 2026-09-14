import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { categoriesAPI } from '../../services/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesAPI.getAll()
      .then((res) => {
        setCategories(res.data.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', padding: '50px 0 90px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'rgba(198, 146, 62, 0.12)',
            border: '1px solid rgba(198, 146, 62, 0.3)',
            color: '#8C532B',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '14px'
          }}>
            <Sparkles size={16} color="#C6923E" />
            <span>DISCOVER YOUR SWEET OBSESSION</span>
          </div>
          <h1 style={{ fontSize: '2.8rem', color: '#2A170E', marginBottom: '8px' }}>
            All Cake Categories
          </h1>
          <p style={{ color: '#73645C', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Browse through our 14 signature categories crafted for birthdays, anniversaries, weddings, and every everyday indulgence.
          </p>
        </div>

        {/* Categories Grid (Section 6 of Spec) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '28px'
        }}>
          {categories.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              to={`/cakes?category=${encodeURIComponent(cat.name)}`}
              className="luxury-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '20px',
                overflow: 'hidden',
                background: '#FFFFFF',
                textDecoration: 'none'
              }}
            >
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(255,255,255,0.92)',
                  color: '#8C532B',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backdropFilter: 'blur(4px)'
                }}>
                  {cat.productCount || 6}+ Products
                </span>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#2A170E', marginBottom: '6px' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#73645C', lineHeight: 1.5, marginBottom: '16px' }}>
                    {cat.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#C6923E', fontWeight: 700, fontSize: '0.88rem' }}>
                  <span>Explore Collection</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
