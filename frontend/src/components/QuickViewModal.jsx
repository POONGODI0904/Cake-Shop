import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [messageOnCake, setMessageOnCake] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [addedAnim, setAddedAnim] = useState(false);

  useEffect(() => {
    if (product) {
      const defaultWeight = product.weights?.[0] || { weight: '500g', price: product.price };
      setSelectedWeight(defaultWeight);
      const img = product.images?.front || (typeof product.images === 'string' ? product.images : '');
      setActiveImage(img);
      setQuantity(1);
      setMessageOnCake('');
    }
  }, [product]);

  if (!product) return null;

  const currentPrice = selectedWeight?.price || product.price;

  const handleAdd = () => {
    addToCart(product, {
      weight: selectedWeight?.weight || '500g',
      price: currentPrice,
      quantity,
      messageOnCake
    });
    setAddedAnim(true);
    setTimeout(() => {
      setAddedAnim(false);
      onClose();
    }, 1000);
  };

  const imagesList = typeof product.images === 'object' && product.images !== null
    ? Object.values(product.images).filter(Boolean)
    : [product.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2500,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '850px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        border: '1px solid #EFE8DE'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(42, 23, 14, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2A170E',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Left: Images */}
        <div style={{ padding: '24px', background: '#FAF7F2', borderRight: '1px solid #EFE8DE', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ height: '320px', borderRadius: '16px', overflow: 'hidden', background: '#FFFFFF' }}>
            <img
              src={activeImage}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
              {imagesList.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: activeImage === img ? '2px solid #C6923E' : '1px solid #EFE8DE',
                    padding: '2px',
                    flexShrink: 0
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#73645C', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={16} color="#8C532B" />
              <span>Free Delivery &gt; ₹1200</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#8C532B" />
              <span>100% Fresh Daily</span>
            </div>
          </div>
        </div>

        {/* Right: Details & Options */}
        <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#8C532B', fontWeight: 700, textTransform: 'uppercase' }}>
                {product.category}
              </span>
              <span className="badge-veg">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2E7D32', display: 'inline-block' }}></span>
                {product.eggType || 'Eggless'}
              </span>
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '10px', color: '#2A170E' }}>
              {product.name}
            </h2>

            {/* Ratings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FEF3C7', padding: '2px 8px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#B45309' }}>
                <Star size={13} fill="#B45309" />
                <span>{product.rating || '4.9'}</span>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#73645C' }}>
                {product.reviewsCount || 48} Customer Reviews
              </span>
            </div>

            {/* Dynamic Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2A170E' }}>
                ₹{currentPrice}
              </span>
              {product.discountPercentage > 0 && (
                <span className="badge-discount">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.88rem', color: '#73645C', lineHeight: 1.6, marginBottom: '20px' }}>
              {product.description}
            </p>

            {/* Dynamic Weight Selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#2A170E', marginBottom: '8px' }}>
                Select Cake Weight (Price adjusts dynamically):
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(product.weights || [{ weight: '500g', price: product.price }]).map((w) => (
                  <button
                    key={w.weight}
                    onClick={() => setSelectedWeight(w)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: selectedWeight?.weight === w.weight ? '2px solid #C6923E' : '1.5px solid #EFE8DE',
                      background: selectedWeight?.weight === w.weight ? 'rgba(198, 146, 62, 0.1)' : '#FFFFFF',
                      color: selectedWeight?.weight === w.weight ? '#8C532B' : '#2A170E',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <span>{w.weight}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>₹{w.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message on Cake */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#2A170E', marginBottom: '6px' }}>
                Custom Message on Cake (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Happy 21st Birthday Diya!"
                maxLength={35}
                value={messageOnCake}
                onChange={(e) => setMessageOnCake(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #EFE8DE',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Quantity & CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #EFE8DE',
                borderRadius: '999px',
                padding: '4px'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', fontWeight: 700, color: '#2A170E' }}
                >
                  -
                </button>
                <span style={{ width: '36px', textAlign: 'center', fontWeight: 700, fontSize: '0.92rem' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', fontWeight: 700, color: '#2A170E' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="btn-primary"
                style={{ flex: 1, padding: '12px 24px', background: addedAnim ? '#16A34A' : undefined }}
              >
                {addedAnim ? <Check size={18} /> : <ShoppingBag size={18} />}
                <span>{addedAnim ? 'Added to Cart!' : `Add to Cart • ₹${currentPrice * quantity}`}</span>
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <Link
              to={`/cakes/${product.id}`}
              onClick={onClose}
              style={{ fontSize: '0.85rem', color: '#C6923E', fontWeight: 600, textDecoration: 'underline' }}
            >
              View Full Product Page & Customer Reviews →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
