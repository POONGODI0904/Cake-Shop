import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cake, Heart, Mail, Phone, MapPin, Send, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Welcome to the SweetCrumb VIP Club! Check your inbox for exclusive perks & 15% off.', 'success');
      setEmail('');
    }
  };

  return (
    <footer style={{
      background: '#1A0D08',
      color: '#E8DCCF',
      paddingTop: '64px',
      paddingBottom: '32px',
      borderTop: '3px solid #C6923E'
    }}>
      <div className="container">
        {/* Top Newsletter Strip */}
        <div style={{
          background: 'linear-gradient(135deg, #2A170E 0%, #361E13 100%)',
          borderRadius: '24px',
          padding: '36px 40px',
          marginBottom: '56px',
          border: '1px solid rgba(198, 146, 62, 0.25)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          <div style={{ maxWidth: '500px' }}>
            <span style={{
              color: '#DFBA73',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              Join Our VIP Sweet Club
            </span>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '1.75rem',
              marginTop: '4px',
              fontFamily: 'var(--font-heading)'
            }}>
              Unlock 15% Off Your Next Celebration Cake
            </h3>
            <p style={{ color: '#BCAFA4', fontSize: '0.9rem', marginTop: '6px' }}>
              Subscribe for secret seasonal recipes, midnight delivery priority, and VIP tasting events.
            </p>
          </div>

          <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '10px', flex: '1 1 320px', maxWidth: '440px' }}>
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '999px',
                border: '1px solid rgba(198, 146, 62, 0.4)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                fontSize: '0.92rem',
                outline: 'none'
              }}
            />
            <button type="submit" className="btn-gold" style={{ padding: '14px 24px', whiteSpace: 'nowrap' }}>
              <span>Join</span>
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* 4 Footer Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '56px'
        }}>
          {/* Col 1: Brand & Slogan */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#C6923E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1A0D08'
              }}>
                <Cake size={24} />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '-0.5px'
              }}>
                Sweet<span style={{ color: '#DFBA73' }}>Crumb</span>
              </span>
            </Link>
            <p style={{
              color: '#DFBA73',
              fontStyle: 'italic',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.05rem',
              marginBottom: '14px'
            }}>
              "Making every celebration sweeter."
            </p>
            <p style={{ color: '#A8998E', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Crafting premium European & artisanal cakes using 100% genuine ingredients, organic dairy, and pure Belgian chocolate.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DFBA73',
                  transition: 'background 0.2s'
                }}
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DFBA73',
                  transition: 'background 0.2s'
                }}
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DFBA73',
                  transition: 'background 0.2s'
                }}
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#25D366',
                  transition: 'background 0.2s'
                }}
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '18px', position: 'relative' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/about" style={{ color: '#BCAFA4', transition: 'color 0.2s' }}>About Our Pâtisserie</Link></li>
              <li><Link to="/cakes" style={{ color: '#BCAFA4', transition: 'color 0.2s' }}>Explore Cakes Catalog</Link></li>
              <li><Link to="/custom-cake" style={{ color: '#DFBA73', fontWeight: 600 }}>Custom Cake Builder</Link></li>
              <li><Link to="/categories" style={{ color: '#BCAFA4', transition: 'color 0.2s' }}>Occasion Categories</Link></li>
              <li><Link to="/offers" style={{ color: '#BCAFA4', transition: 'color 0.2s' }}>Special Promo Offers</Link></li>
              <li><Link to="/contact" style={{ color: '#BCAFA4', transition: 'color 0.2s' }}>Delivery Area Checker</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '18px' }}>
              Help & Policies
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/track-order/SWT-ORD-2026-001" style={{ color: '#BCAFA4' }}>Track Your Order</Link></li>
              <li><Link to="/contact" style={{ color: '#BCAFA4' }}>Privacy Policy</Link></li>
              <li><Link to="/contact" style={{ color: '#BCAFA4' }}>Terms & Conditions</Link></li>
              <li><Link to="/contact" style={{ color: '#BCAFA4' }}>Refund & Cancellation Policy</Link></li>
              <li><Link to="/account" style={{ color: '#BCAFA4' }}>Customer Dashboard</Link></li>
              <li><Link to="/admin/login" style={{ color: '#DFBA73' }}>Administrator Portal</Link></li>
            </ul>
          </div>

          {/* Col 4: Bakery Studio Details */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '18px' }}>
              Bakery Studio
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: '#BCAFA4' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={20} color="#DFBA73" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>42 Heritage Boulevard, Indiranagar 100 Feet Road, Bengaluru, KA 560038</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={18} color="#DFBA73" style={{ flexShrink: 0 }} />
                <span>+91 (80) 4122-CAKE / +91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={18} color="#DFBA73" style={{ flexShrink: 0 }} />
                <span>orders@sweetcrumb.com</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                <span style={{
                  padding: '4px 10px',
                  background: 'rgba(37, 211, 102, 0.15)',
                  color: '#25D366',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}>
                  ● Kitchen Open: 8:00 AM – Midnight Daily
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.82rem',
          color: '#8A7A70'
        }}>
          <div>
            © {new Date().getFullYear()} SweetCrumb Artisanal Bakery Pvt. Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Baked with</span>
            <Heart size={14} color="#E68385" fill="#E68385" />
            <span>for life's sweetest memories.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
