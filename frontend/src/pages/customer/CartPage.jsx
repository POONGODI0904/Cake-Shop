import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  BookmarkPlus,
  ArrowRight,
  Tag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const {
    cartItems,
    savedForLater,
    updateQuantity,
    removeFromCart,
    saveForLaterItem,
    moveToCartFromSaved,
    removeSavedItem,
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
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setLoadingCoupon(true);
    await applyCoupon(couponCode.trim());
    setLoadingCoupon(false);
    setCouponCode('');
  };

  const freeDeliveryThreshold = 1200;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  if (cartItems.length === 0 && savedForLater.length === 0) {
    return (
      <div style={{ background: '#FAF7F2', minHeight: '80vh', padding: '80px 20px', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '520px' }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C6923E',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            marginBottom: '20px'
          }}>
            <ShoppingBag size={44} />
          </div>
          <h2 style={{ fontSize: '2.2rem', color: '#2A170E', marginBottom: '10px' }}>Your Cart is Empty</h2>
          <p style={{ color: '#73645C', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Looks like you haven't chosen your sweet celebration yet. Discover our award-winning cakes baked fresh daily.
          </p>
          <Link to="/cakes" className="btn-gold" style={{ padding: '15px 36px', fontSize: '1rem' }}>
            Browse Cakes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', color: '#2A170E' }}>Shopping Cart</h1>
            <p style={{ color: '#73645C', fontSize: '0.95rem' }}>
              Review your celebration cakes, apply promo discounts, and proceed to checkout.
            </p>
          </div>
          <Link to="/cakes" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8C532B', fontWeight: 600, fontSize: '0.9rem' }}>
            <ChevronLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Free Delivery Bar */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px 24px',
          border: '1px solid #EFE8DE',
          marginBottom: '32px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#2A170E' }}>
              <Truck size={18} color="#C6923E" />
              {remainingForFreeDelivery === 0 ? (
                <span style={{ color: '#16A34A' }}>🎉 Congratulations! You have unlocked FREE Express Delivery!</span>
              ) : (
                <span>Add <strong>₹{remainingForFreeDelivery}</strong> more to unlock <strong>FREE Delivery</strong></span>
              )}
            </div>
            <span style={{ fontWeight: 700, color: '#8C532B' }}>{progressPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', borderRadius: '999px', background: '#FAF7F2', overflow: 'hidden' }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #DFBA73 0%, #C6923E 100%)',
              borderRadius: '999px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* 2-Column Layout: Cart Items & Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '36px',
          alignItems: 'start'
        }}>
          {/* Left: Cart Items List */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
              {cartItems.map((item) => (
                <div
                  key={item.cartKey}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '20px',
                    border: '1px solid #EFE8DE',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                  }}
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'}
                    alt={item.name}
                    style={{ width: '100px', height: '100px', borderRadius: '14px', objectFit: 'cover' }}
                  />

                  <div style={{ flex: '1 1 200px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', color: '#2A170E', marginBottom: '4px' }}>
                          {item.name}
                        </h3>
                        <div style={{ fontSize: '0.82rem', color: '#8C532B', fontWeight: 600 }}>
                          Weight: {item.weight} • {item.eggType}
                        </div>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2A170E' }}>
                        ₹{item.price * item.quantity}
                      </div>
                    </div>

                    {item.messageOnCake && (
                      <div style={{ fontSize: '0.82rem', color: '#73645C', fontStyle: 'italic', marginTop: '4px' }}>
                        Sugar Piping: "{item.messageOnCake}"
                      </div>
                    )}

                    {/* Actions & Quantity */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1.5px solid #EFE8DE',
                        borderRadius: '999px',
                        padding: '2px 6px'
                      }}>
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                          style={{ padding: '2px 8px', fontWeight: 700, color: '#2A170E' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 8px', fontWeight: 700, fontSize: '0.92rem' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                          style={{ padding: '2px 8px', fontWeight: 700, color: '#2A170E' }}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '14px' }}>
                        <button
                          onClick={() => saveForLaterItem(item.cartKey)}
                          style={{
                            fontSize: '0.82rem',
                            color: '#73645C',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <BookmarkPlus size={14} />
                          <span>Save for later</span>
                        </button>
                        <button
                          onClick={() => removeFromCart(item.cartKey)}
                          style={{
                            fontSize: '0.82rem',
                            color: '#E11D48',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save For Later Section */}
            {savedForLater.length > 0 && (
              <div style={{ marginTop: '40px' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#2A170E', marginBottom: '16px' }}>
                  Saved For Later ({savedForLater.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {savedForLater.map((item) => (
                    <div
                      key={item.cartKey}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '16px',
                        border: '1px solid #EFE8DE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#2A170E' }}>{item.name}</div>
                          <div style={{ fontSize: '0.82rem', color: '#73645C' }}>
                            {item.weight} • ₹{item.price}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => moveToCartFromSaved(item.cartKey)}
                          className="btn-outline"
                          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                        >
                          Move to Cart
                        </button>
                        <button
                          onClick={() => removeSavedItem(item.cartKey)}
                          style={{ color: '#E11D48', padding: '6px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary Card (Section 13) */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid #EFE8DE',
            boxShadow: '0 8px 30px rgba(42, 23, 14, 0.06)',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{ fontSize: '1.35rem', color: '#2A170E', marginBottom: '20px' }}>
              Order Bill Summary
            </h3>

            {/* Coupon Code Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#2A170E', marginBottom: '8px' }}>
                Have a Promo Coupon?
              </label>
              {appliedCoupon ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: '#F0FDF4',
                  border: '1.5px solid #86EFAC',
                  fontSize: '0.88rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 700 }}>
                    <Tag size={16} />
                    <span>Coupon "{appliedCoupon.code}" Active</span>
                  </div>
                  <button onClick={removeCoupon} style={{ color: '#DC2626', fontWeight: 700, fontSize: '0.82rem' }}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. WELCOME10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #EFE8DE',
                      fontSize: '0.88rem',
                      outline: 'none',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loadingCoupon}
                    className="btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                  >
                    {loadingCoupon ? '...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            {/* Automatic Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem', color: '#73645C', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color: '#2A170E', fontWeight: 600 }}>₹{subtotal}</span>
              </div>

              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: 700 }}>
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <strong style={{ color: '#16A34A' }}>FREE</strong> : `₹${deliveryFee}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Estimated Tax (5% GST)</span>
                <span style={{ color: '#2A170E', fontWeight: 600 }}>₹{tax}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '2px solid #2A170E',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#2A170E'
              }}>
                <span>Grand Total:</span>
                <span style={{ color: '#C6923E' }}>₹{total}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="btn-gold"
              style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginBottom: '16px' }}
            >
              <span>Proceed to 4-Step Checkout</span>
              <ArrowRight size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.8rem', color: '#73645C' }}>
              <ShieldCheck size={16} color="#16A34A" />
              <span>Safe & Secure 256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
