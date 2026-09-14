import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, moveWishlistToCart } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div style={{ background: '#FAF7F2', minHeight: '80vh', padding: '80px 20px', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#E68385',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            marginBottom: '20px'
          }}>
            <Heart size={40} />
          </div>
          <h2 style={{ fontSize: '2rem', color: '#2A170E', marginBottom: '10px' }}>Your Wishlist is Empty</h2>
          <p style={{ color: '#73645C', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Tap the heart icon on your favorite cakes to save them for upcoming birthdays, anniversaries, and parties!
          </p>
          <Link to="/cakes" className="btn-primary" style={{ padding: '14px 32px' }}>
            Explore Cakes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.4rem', color: '#2A170E' }}>My Wishlist ({wishlist.length})</h1>
          <p style={{ color: '#73645C', fontSize: '0.95rem' }}>
            Your curated collection of celebration cakes ready to be baked to perfection.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '28px'
        }}>
          {wishlist.map((cake) => (
            <div
              key={cake.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #EFE8DE',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(42, 23, 14, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ position: 'relative', height: '220px', background: '#F8F4EE' }}>
                <img
                  src={cake.images?.front || (typeof cake.images === 'string' ? cake.images : cake.image)}
                  alt={cake.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={() => removeFromWishlist(cake.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E11D48',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#8C532B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                    {cake.category}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#2A170E', marginBottom: '8px' }}>
                    {cake.name}
                  </h3>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2A170E', marginBottom: '16px' }}>
                    ₹{cake.price}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => moveWishlistToCart(cake)}
                    className="btn-gold"
                    style={{ flex: 1, padding: '10px 16px', fontSize: '0.88rem' }}
                  >
                    <ShoppingBag size={16} />
                    <span>Move to Cart</span>
                  </button>
                  <Link
                    to={`/cakes/${cake.id}`}
                    className="btn-outline"
                    style={{ padding: '10px 14px', fontSize: '0.88rem' }}
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
