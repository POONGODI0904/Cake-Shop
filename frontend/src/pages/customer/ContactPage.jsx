import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Bespoke Cake Inquiry',
    message: ''
  });
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Inquiry sent! Our Master Concierge will respond within 1 hour.', 'success');
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length >= 6) {
      setPincodeResult({
        status: 'success',
        text: `✓ Pincode ${pincode} is eligible for Same-Day Express and Midnight 12 AM Delivery!`
      });
    } else {
      setPincodeResult({
        status: 'error',
        text: 'Please provide a valid 6-digit postal code.'
      });
    }
  };

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', padding: '50px 0 90px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <span style={{ color: '#8C532B', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
            We'd Love To Hear From You
          </span>
          <h1 style={{ fontSize: '2.6rem', color: '#2A170E', marginTop: '4px', marginBottom: '12px' }}>
            Contact SweetCrumb
          </h1>
          <p style={{ color: '#73645C', fontSize: '1rem', lineHeight: 1.6 }}>
            Have a custom wedding cake consultation, corporate inquiry, or delivery question? Reach our executive pâtisserie concierge.
          </p>
        </div>

        {/* 2-Column: Left Contact Info & Pincode Checker, Right Message Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Left Column: Direct Info */}
          <div>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '36px',
              border: '1px solid #EFE8DE',
              boxShadow: '0 8px 30px rgba(42, 23, 14, 0.04)',
              marginBottom: '28px'
            }}>
              <h3 style={{ fontSize: '1.35rem', color: '#2A170E', marginBottom: '20px' }}>Bakery Studio Details</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.92rem', color: '#73645C' }}>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <MapPin size={22} color="#C6923E" style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#2A170E', display: 'block' }}>Studio Flagship</strong>
                    <span>42 Heritage Boulevard, Indiranagar 100 Feet Road, Bengaluru, KA 560038</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <Phone size={22} color="#C6923E" style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#2A170E', display: 'block' }}>Phone & Support</strong>
                    <span>+91 98765 43210 / (080) 4122-CAKE</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <Mail size={22} color="#C6923E" style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#2A170E', display: 'block' }}>Email Concierge</strong>
                    <span>orders@sweetcrumb.com / support@sweetcrumb.com</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <Clock size={22} color="#C6923E" style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#2A170E', display: 'block' }}>Kitchen Hours</strong>
                    <span>Baking Daily: 8:00 AM – Midnight (Everyday)</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Order Button */}
              <div style={{ marginTop: '28px', borderTop: '1px solid #F4ECE1', paddingTop: '20px' }}>
                <a
                  href="https://wa.me/919876543210?text=Hi%20SweetCrumb!%20I%20would%20like%20to%20inquire%20about%20a%20cake."
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    background: '#25D366',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                  }}
                >
                  <MessageCircle size={20} />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>

            {/* Pincode Availability Checker Box */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px',
              border: '1px solid #EFE8DE'
            }}>
              <h4 style={{ fontSize: '1.15rem', color: '#2A170E', marginBottom: '8px' }}>Delivery Area Checker</h4>
              <p style={{ fontSize: '0.85rem', color: '#73645C', marginBottom: '14px' }}>
                Verify if your area qualifies for midnight or same-day dropoff:
              </p>
              <form onSubmit={handlePincodeCheck} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 560038"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '10px 18px' }}>
                  Check
                </button>
              </form>
              {pincodeResult && (
                <div style={{
                  marginTop: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: pincodeResult.status === 'success' ? '#F0FDF4' : '#FFF1F2',
                  color: pincodeResult.status === 'success' ? '#166534' : '#9F1239',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}>
                  {pincodeResult.text}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '36px',
            border: '1px solid #EFE8DE',
            boxShadow: '0 8px 30px rgba(42, 23, 14, 0.04)'
          }}>
            <h3 style={{ fontSize: '1.4rem', color: '#2A170E', marginBottom: '6px' }}>Send Us a Message</h3>
            <p style={{ color: '#73645C', fontSize: '0.88rem', marginBottom: '24px' }}>
              We'll review your celebration vision and provide custom tier recommendations.
            </p>

            {submitted ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: '#F0FDF4',
                borderRadius: '16px',
                border: '1px solid #86EFAC'
              }}>
                <CheckCircle2 size={48} color="#16A34A" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.25rem', color: '#166534', marginBottom: '6px' }}>Inquiry Received!</h4>
                <p style={{ color: '#166534', fontSize: '0.9rem' }}>
                  Our head concierge will contact you via WhatsApp and email within 1 hour.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-outline"
                  style={{ marginTop: '16px', borderColor: '#166534', color: '#166534' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Santhosh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      placeholder="santhosh@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Inquiry Subject</label>
                  <select
                    className="form-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="Bespoke Cake Inquiry">Bespoke Cake Inquiry</option>
                    <option value="Wedding Cake Consultation">Wedding Cake Consultation (Multi-tier)</option>
                    <option value="Corporate / Bulk Order">Corporate / Bulk Order</option>
                    <option value="Order Status & Delivery">Order Status & Delivery Question</option>
                    <option value="Feedback & Press">Feedback & Press</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message or Cake Vision</label>
                  <textarea
                    rows={4}
                    required
                    className="form-input"
                    placeholder="Tell us about the occasion, number of guests, desired flavours, or date..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>
                  <Send size={16} />
                  <span>Send Concierge Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
