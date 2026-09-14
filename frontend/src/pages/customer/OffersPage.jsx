import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Sparkles, Copy, Check, Gift, ArrowRight } from 'lucide-react';
import { couponsAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function OffersPage() {
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    couponsAPI.getAll()
      .then((res) => setCoupons(res.data.coupons || []))
      .catch((err) => console.error(err));
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Promo code "${code}" copied!`, 'success');
    setTimeout(() => setCopiedCode(''), 2500);
  };

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', padding: '50px 0 90px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
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
            <span>EXCLUSIVE PROMOTIONAL SAVINGS</span>
          </div>
          <h1 style={{ fontSize: '2.8rem', color: '#2A170E', marginBottom: '8px' }}>
            Offers & Coupons
          </h1>
          <p style={{ color: '#73645C', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Enjoy handcrafted luxury cakes with seasonal celebration discounts. Copy your coupon code and apply it during checkout.
          </p>
        </div>

        {/* Coupons Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '56px' }}>
          {coupons.map((cpn) => (
            <div
              key={cpn.id || cpn.code}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '28px',
                border: '1.5px dashed #DFBA73',
                position: 'relative',
                boxShadow: '0 8px 25px rgba(42, 23, 14, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    background: 'rgba(198, 146, 62, 0.15)',
                    color: '#8C532B',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}>
                    {cpn.discountType === 'percentage' ? `${cpn.discountValue}% DISCOUNT` : `FLAT ₹${cpn.discountValue} OFF`}
                  </span>
                  <Gift size={20} color="#C6923E" />
                </div>

                <div style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: '#2A170E',
                  letterSpacing: '1px',
                  marginBottom: '6px',
                  fontFamily: 'var(--font-heading)'
                }}>
                  {cpn.code}
                </div>

                <p style={{ color: '#73645C', fontSize: '0.88rem', marginBottom: '16px' }}>
                  {cpn.discountType === 'percentage'
                    ? `Get ${cpn.discountValue}% off up to ₹${cpn.maximumDiscount || 500} on minimum order of ₹${cpn.minimumAmount}.`
                    : `Flat ₹${cpn.discountValue} discount on orders above ₹${cpn.minimumAmount}.`}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #F4ECE1', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#A4978E' }}>
                  Expires: {cpn.expiryDate || 'Dec 2027'}
                </span>

                <button
                  onClick={() => handleCopy(cpn.code)}
                  className="btn-gold"
                  style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                >
                  {copiedCode === cpn.code ? (
                    <>
                      <Check size={14} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #2A170E 0%, #4A2818 100%)',
          borderRadius: '24px',
          padding: '36px 40px',
          color: '#FFFFFF',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '6px' }}>Ready to use your savings?</h3>
            <p style={{ color: '#D5C7BD', fontSize: '0.92rem' }}>Browse our fresh collection of Belgian truffle, Red Velvet, and celebration cakes.</p>
          </div>
          <Link to="/cakes" className="btn-gold" style={{ padding: '12px 28px' }}>
            <span>Shop Cakes Now</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
