import React from 'react';
import { Link } from 'react-router-dom';
import { Cake, Award, Heart, Sparkles, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', padding: '60px 0 100px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ color: '#8C532B', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Our Heritage & Pâtisserie Passion
          </span>
          <h1 style={{ fontSize: '3rem', color: '#2A170E', marginTop: '6px', marginBottom: '16px' }}>
            About SweetCrumb
          </h1>
          <p style={{ color: '#73645C', fontSize: '1.15rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            "Making every celebration sweeter." Handcrafted European and contemporary cakes born from a deep devotion to pure chocolate, real fruit reductions, and artisan craftsmanship.
          </p>
        </div>

        {/* Hero Story Banner */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '28px',
          overflow: 'hidden',
          border: '1px solid #EFE8DE',
          boxShadow: '0 12px 35px rgba(42, 23, 14, 0.05)',
          marginBottom: '56px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
        }}>
          <img
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop"
            alt="SweetCrumb Artisan Chef"
            style={{ width: '100%', height: '100%', minHeight: '340px', objectFit: 'cover' }}
          />
          <div style={{ padding: '44px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="badge-gold" style={{ width: 'fit-content', marginBottom: '14px' }}>
              Est. 2018 • Indiranagar, Bengaluru
            </span>
            <h2 style={{ fontSize: '1.85rem', color: '#2A170E', marginBottom: '16px' }}>
              Pure Ingredients. Uncompromised Mastery.
            </h2>
            <p style={{ color: '#73645C', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '20px' }}>
              SweetCrumb was founded with a singular conviction: celebration cakes should taste even more spectacular than they look. We refuse shortcuts — sourcing authentic 54% and 70% Callebaut dark chocolate from Belgium, Grade-A Madagascar Bourbon vanilla pods, cultured butter, and farm-fresh organic strawberries.
            </p>
            <p style={{ color: '#73645C', fontSize: '0.95rem', lineHeight: 1.8 }}>
              Our kitchen operates round-the-clock so every single cake delivered for evening or midnight celebrations is baked from scratch only hours beforehand.
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          marginBottom: '56px'
        }}>
          <div style={{ background: '#FFFFFF', padding: '28px 20px', borderRadius: '20px', border: '1px solid #EFE8DE', textAlign: 'center' }}>
            <Clock size={32} color="#C6923E" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.1rem', color: '#2A170E', marginBottom: '6px' }}>Freshly Baked Daily</h4>
            <p style={{ fontSize: '0.85rem', color: '#73645C' }}>Zero pre-made frozen sponge layers. Baked to order every morning.</p>
          </div>

          <div style={{ background: '#FFFFFF', padding: '28px 20px', borderRadius: '20px', border: '1px solid #EFE8DE', textAlign: 'center' }}>
            <Award size={32} color="#8C532B" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.1rem', color: '#2A170E', marginBottom: '6px' }}>French Trained Chefs</h4>
            <p style={{ fontSize: '0.85rem', color: '#73645C' }}>Mastery of mirror glazes, sugar geode crystals, and velvety ganache.</p>
          </div>

          <div style={{ background: '#FFFFFF', padding: '28px 20px', borderRadius: '20px', border: '1px solid #EFE8DE', textAlign: 'center' }}>
            <ShieldCheck size={32} color="#2E7D32" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.1rem', color: '#2A170E', marginBottom: '6px' }}>100% Eggless Selection</h4>
            <p style={{ fontSize: '0.85rem', color: '#73645C' }}>Dedicated pure vegetarian stations with exceptionally moist textures.</p>
          </div>

          <div style={{ background: '#FFFFFF', padding: '28px 20px', borderRadius: '20px', border: '1px solid #EFE8DE', textAlign: 'center' }}>
            <Sparkles size={32} color="#E68385" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.1rem', color: '#2A170E', marginBottom: '6px' }}>Luxury Packaging</h4>
            <p style={{ fontSize: '0.85rem', color: '#73645C' }}>Food-grade golden satin ribbon gift boxes with complimentary candles.</p>
          </div>
        </div>

        {/* CTA Strip */}
        <div style={{
          background: 'linear-gradient(135deg, #2A170E 0%, #4A2818 100%)',
          borderRadius: '24px',
          padding: '40px',
          color: '#FFFFFF',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '8px' }}>
            Ready to Taste the SweetCrumb Difference?
          </h3>
          <p style={{ color: '#D5C7BD', fontSize: '0.95rem', marginBottom: '24px' }}>
            Order online now for same-day delivery or design your dream cake in our studio.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/cakes" className="btn-gold" style={{ padding: '12px 28px' }}>
              Explore Cakes
            </Link>
            <Link to="/custom-cake" className="btn-outline" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)', padding: '12px 28px' }}>
              Build Custom Cake
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
