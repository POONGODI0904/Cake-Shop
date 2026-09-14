import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const imageUrl = product.images?.front || (typeof product.images === 'string' ? product.images : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop');
  const defaultWeight = product.weights?.[0]?.weight || '500g';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, {
      weight: defaultWeight,
      price: product.price,
      quantity: 1
    });
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      className="luxury-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '18px'
      }}
    >
      {/* Top Badges & Wishlist */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', pointerEvents: 'auto' }}>
          {product.discountPercentage > 0 && (
            <span className="badge-discount">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.bestseller && (
            <span className="badge-gold">
              ★ Bestseller
            </span>
          )}
        </div>

        <button
          onClick={handleWishlist}
          style={{
            pointerEvents: 'auto',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            color: isFavorited ? '#E11D48' : '#73645C',
            transition: 'transform 0.2s'
          }}
        >
          <Heart size={18} fill={isFavorited ? '#E11D48' : 'transparent'} />
        </button>
      </div>

      {/* Image Gallery Link */}
      <Link to={`/cakes/${product.id}`} style={{ position: 'relative', overflow: 'hidden', height: '240px', display: 'block', background: '#F8F4EE' }}>
        <img
          src={imageUrl}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)'
          }}
        />

        {/* Quick View Button on Hover */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: isHovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(20px)',
          opacity: isHovered ? 1 : 0,
          transition: 'all 0.3s ease',
          pointerEvents: isHovered ? 'auto' : 'none'
        }}>
          <button
            onClick={handleQuickView}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#2A170E',
              fontSize: '0.82rem',
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              whiteSpace: 'nowrap'
            }}
          >
            <Eye size={15} color="#C6923E" />
            <span>Quick View</span>
          </button>
        </div>
      </Link>

      {/* Content Area */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Category & Egg Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#8C532B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {product.category}
            </span>
            <span className="badge-veg" title={product.eggType}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2E7D32', display: 'inline-block' }}></span>
              {product.eggType || 'Eggless'}
            </span>
          </div>

          {/* Name */}
          <Link to={`/cakes/${product.id}`}>
            <h3 style={{
              fontSize: '1.12rem',
              fontWeight: 700,
              color: '#2A170E',
              marginBottom: '8px',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.7em'
            }}>
              {product.name}
            </h3>
          </Link>

          {/* Ratings & Reviews */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: '#FEF3C7',
              color: '#B45309',
              padding: '2px 7px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700
            }}>
              <Star size={12} fill="#B45309" />
              <span>{product.rating || '4.9'}</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#73645C' }}>
              ({product.reviewsCount || 42} reviews)
            </span>
          </div>

          {/* Weight & Availability */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#73645C', marginBottom: '14px' }}>
            <span>Weight: <strong>{defaultWeight}</strong></span>
            <span>
              {product.stock > 0 ? (
                product.stock <= 5 ? (
                  <span style={{ color: '#D97706', fontWeight: 600 }}>Only {product.stock} left!</span>
                ) : (
                  <span style={{ color: '#16A34A', fontWeight: 600 }}>● In Stock</span>
                )
              ) : (
                <span style={{ color: '#DC2626', fontWeight: 600 }}>Sold Out</span>
              )}
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid #F4ECE1'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2A170E' }}>
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize: '0.88rem', color: '#A4978E', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#8C532B', fontWeight: 500 }}>
              Inclusive of all taxes
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              padding: '10px 18px',
              borderRadius: '999px',
              background: addedAnim
                ? '#16A34A'
                : 'linear-gradient(135deg, #4A2818 0%, #2A170E 100%)',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(42, 23, 14, 0.15)',
              transition: 'all 0.2s',
              opacity: product.stock === 0 ? 0.5 : 1
            }}
          >
            {addedAnim ? (
              <>
                <Check size={16} />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={15} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
