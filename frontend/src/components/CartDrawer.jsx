import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, BookmarkPlus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    saveForLaterItem,
    subtotal,
    deliveryFee,
    tax,
    total,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponCode.trim());
    setCouponLoading(false);
    setCouponCode('');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 3000,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'rgba(0, 0, 0, 0.55)',
      backdropFilter: 'blur(4px)'
    }}>
      {/* Click outside backdrop */}
      <div
        style={{ position: 'absolute', inset: 0 }}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        background: '#FFFFFF',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #EFE8DE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FAF7F2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="#8C532B" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Your Sweet Cart ({cartItems.length})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(42, 23, 14, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2A170E'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#FAF7F2',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C6923E',
                marginBottom: '16px'
              }}>
                <ShoppingBag size={40} />
              </div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Your Cart is Empty</h4>
              <p style={{ color: '#73645C', fontSize: '0.88rem', marginBottom: '24px' }}>
                Indulge your sweet cravings! Explore our artisanal cakes crafted fresh today.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cakes');
                }}
                className="btn-primary"
              >
                Browse Fresh Cakes
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => (
                <div
                  key={item.cartKey}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '14px',
                    borderRadius: '14px',
                    background: '#FAF7F2',
                    border: '1px solid #EFE8DE'
                  }}
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'}
                    alt={item.name}
                    style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '190px'
                      }}>
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartKey)}
                        style={{ color: '#E11D48', padding: '2px' }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#8C532B', fontWeight: 600, marginTop: '2px' }}>
                      Weight: {item.weight} • {item.eggType}
                    </div>

                    {item.messageOnCake && (
                      <div style={{ fontSize: '0.75rem', color: '#73645C', fontStyle: 'italic', marginTop: '2px' }}>
                        Piped: "{item.messageOnCake}"
                      </div>
                    )}

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '10px'
                    }}>
                      {/* Quantity Controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#FFFFFF',
                        border: '1px solid #EFE8DE',
                        borderRadius: '999px',
                        padding: '2px 6px'
                      }}>
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                          style={{ padding: '0 6px', fontWeight: 700, color: '#2A170E' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 6px' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                          style={{ padding: '0 6px', fontWeight: 700, color: '#2A170E' }}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ fontWeight: 800, color: '#2A170E', fontSize: '0.95rem' }}>
                        ₹{item.price * item.quantity}
                      </div>
                    </div>

                    <div style={{ marginTop: '6px' }}>
                      <button
                        onClick={() => saveForLaterItem(item.cartKey)}
                        style={{
                          fontSize: '0.74rem',
                          color: '#73645C',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <BookmarkPlus size={12} />
                        <span>Save for later</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #EFE8DE',
            background: '#FFFFFF',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)'
          }}>
            {/* Coupon Code Input */}
            <div style={{ marginBottom: '14px' }}>
              {appliedCoupon ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  fontSize: '0.82rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 600 }}>
                    <Tag size={14} />
                    <span>Coupon "{appliedCoupon.code}" applied (-₹{couponDiscount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{ color: '#DC2626', fontSize: '0.78rem', fontWeight: 700 }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. WELCOME10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #EFE8DE',
                      fontSize: '0.82rem',
                      outline: 'none',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: '#4A2818',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div style={{ fontSize: '0.85rem', color: '#73645C', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: 600 }}>
                  <span>Discount</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <strong style={{ color: '#16A34A' }}>FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Estimated Tax (5% GST)</span>
                <span>₹{tax}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid #EFE8DE',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#2A170E'
              }}>
                <span>Grand Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="btn-gold"
                style={{ width: '100%', padding: '14px' }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cart');
                }}
                style={{
                  fontSize: '0.84rem',
                  color: '#8C532B',
                  fontWeight: 600,
                  textAlign: 'center',
                  padding: '6px'
                }}
              >
                View Full Shopping Cart →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
