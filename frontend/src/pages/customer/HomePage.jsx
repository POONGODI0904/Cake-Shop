import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Star,
  ShoppingBag,
  Award,
  Truck,
  Clock,
  ShieldCheck,
  Heart,
  ChevronRight,
  Layers,
  MapPin,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { productsAPI, categoriesAPI, bannersAPI, reviewsAPI } from '../../services/api';
import ProductCard from '../../components/ProductCard';
import QuickViewModal from '../../components/QuickViewModal';
import { useToast } from '../../context/ToastContext';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [pincodeCheck, setPincodeCheck] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [copiedCoupon, setCopiedCoupon] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodRes, catRes, banRes, revRes] = await Promise.all([
          productsAPI.getAll(),
          categoriesAPI.getAll(),
          bannersAPI.getAll(),
          reviewsAPI.getAll()
        ]);
        setProducts(prodRes.data.products || []);
        setCategories(catRes.data.categories || []);
        setBanners(banRes.data.banners || []);
        setReviews(revRes.data.reviews || []);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      }
    };
    loadHomeData();
  }, []);

  const bestSellers = products.filter((p) => p.bestseller).slice(0, 4);
  const newArrivals = products.slice(4, 8);

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    showToast(`Coupon "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCoupon(''), 2500);
  };

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (pincodeCheck.trim().length >= 6) {
      setPincodeResult({
        available: true,
        message: 'Same-day & Midnight delivery available for pincode ' + pincodeCheck + '!'
      });
    } else {
      setPincodeResult({
        available: false,
        message: 'Please enter a valid 6-digit postal code.'
      });
    }
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* ============================================================
          SECTION 2: HERO SECTION
          ============================================================ */}
      <section style={{
        position: 'relative',
        minHeight: '88vh',
        background: 'radial-gradient(circle at 75% 30%, #F5EBE1 0%, #FAF7F2 60%, #FFFFFF 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '60px 0',
        overflow: 'hidden'
      }}>
        {/* Ambient floating decorative confectionery icons */}
        <div style={{
          position: 'absolute',
          top: '12%',
          left: '5%',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(198, 146, 62, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#C6923E'
        }} className="float-animation">
          ✨
        </div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '12%',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(230, 131, 133, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#E68385'
        }} className="float-reverse-animation">
          🍓
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '48px'
          }}>
            {/* Left Content */}
            <div>
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
                marginBottom: '20px',
                letterSpacing: '0.5px'
              }}>
                <Sparkles size={16} color="#C6923E" />
                <span>HANDCRAFTED PÂTISSERIE EXCELLENCE</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                fontWeight: 800,
                color: '#2A170E',
                lineHeight: 1.15,
                marginBottom: '20px'
              }}>
                Freshly Baked <br />
                <span style={{
                  background: 'linear-gradient(135deg, #8C532B 0%, #C6923E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Happiness
                </span> for Life's Special Moments
              </h1>

              <p style={{
                fontSize: '1.15rem',
                color: '#73645C',
                lineHeight: 1.6,
                marginBottom: '32px',
                maxWidth: '540px'
              }}>
                "Delicious cakes made with love for your special moments." Handcrafted daily with genuine Belgian chocolate, fresh seasonal berries, and 100% vegetarian artisan sponges.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                <Link to="/cakes" className="btn-primary" style={{ padding: '15px 34px', fontSize: '1rem' }}>
                  <span>Order Now</span>
                  <ArrowRight size={18} />
                </Link>

                <Link to="/cakes" className="btn-outline" style={{ padding: '14px 30px', fontSize: '1rem' }}>
                  <span>Explore Cakes</span>
                </Link>

                <Link
                  to="/custom-cake"
                  className="btn-gold"
                  style={{ padding: '14px 28px', fontSize: '0.95rem' }}
                >
                  <Layers size={18} />
                  <span>Build Custom Cake</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                marginTop: '40px',
                paddingTop: '28px',
                borderTop: '1px solid #EFE8DE'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#FAF7F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8C532B'
                  }}>
                    <Truck size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2A170E' }}>Same-Day Delivery</div>
                    <div style={{ fontSize: '0.75rem', color: '#73645C' }}>Within 2 Hours</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#FAF7F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C6923E'
                  }}>
                    <Award size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2A170E' }}>100% Eggless</div>
                    <div style={{ fontSize: '0.75rem', color: '#73645C' }}>Pure Vegetarian Available</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#FAF7F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E68385'
                  }}>
                    <Star size={18} fill="#E68385" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2A170E' }}>4.9 / 5 Stars</div>
                    <div style={{ fontSize: '0.75rem', color: '#73645C' }}>12,000+ Happy Celebrations</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Floating Masterpiece Cake Showcase */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '520px',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Glowing halo behind cake */}
                <div style={{
                  position: 'absolute',
                  width: '90%',
                  height: '90%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(198, 146, 62, 0.22) 0%, rgba(253, 242, 242, 0.6) 50%, transparent 80%)',
                  filter: 'blur(30px)'
                }} />

                {/* Hero Cake Image with Floating Animation */}
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop"
                  alt="Belgian Chocolate Truffle Luxury Cake"
                  className="float-animation"
                  style={{
                    width: '92%',
                    height: '92%',
                    objectFit: 'cover',
                    borderRadius: '32px',
                    boxShadow: '0 25px 60px rgba(42, 23, 14, 0.25)',
                    border: '8px solid rgba(255, 255, 255, 0.9)'
                  }}
                />

                {/* Floating Price / Chef Badge */}
                <div style={{
                  position: 'absolute',
                  top: '8%',
                  right: '-10px',
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(8px)',
                  padding: '12px 18px',
                  borderRadius: '16px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                  border: '1px solid rgba(198, 146, 62, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }} className="float-reverse-animation">
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#C6923E',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800
                  }}>
                    ★
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#73645C', fontWeight: 600 }}>Master Pâtissier Choice</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2A170E' }}>Belgian Truffle • ₹699</div>
                  </div>
                </div>

                {/* Midnight Delivery Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '6%',
                  left: '-10px',
                  background: 'rgba(42, 23, 14, 0.9)',
                  color: '#DFBA73',
                  backdropFilter: 'blur(8px)',
                  padding: '12px 20px',
                  borderRadius: '16px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                  border: '1px solid rgba(198, 146, 62, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Clock size={20} color="#DFBA73" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#FFFFFF' }}>Celebrate Tonight!</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Midnight Slot Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: CAKE CATEGORIES (14 categories with hover)
          ============================================================ */}
      <section style={{ padding: '80px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 48px' }}>
            <span style={{ color: '#8C532B', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Explore By Occasion & Taste
            </span>
            <h2 style={{ fontSize: '2.4rem', color: '#2A170E', marginTop: '6px' }}>
              Curated Cake Collections
            </h2>
            <p style={{ color: '#73645C', fontSize: '0.98rem', marginTop: '8px' }}>
              From grand multi-tier wedding centerpieces to intimate velvety birthday creations.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
            gap: '20px'
          }}>
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                to={`/cakes?category=${encodeURIComponent(cat.name)}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '18px 14px',
                  borderRadius: '18px',
                  background: '#FAF7F2',
                  border: '1px solid #EFE8DE',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 25px rgba(42, 23, 14, 0.08)';
                  e.currentTarget.style.borderColor = '#C6923E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#EFE8DE';
                }}
              >
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginBottom: '12px',
                  border: '3px solid #FFFFFF',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2A170E', marginBottom: '4px' }}>
                  {cat.name}
                </h4>
                <span style={{ fontSize: '0.78rem', color: '#8C532B', fontWeight: 600 }}>
                  {cat.productCount || 8}+ Flavours
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: BEST SELLERS
          ============================================================ */}
      <section style={{ padding: '80px 0', background: '#FAF7F2' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ color: '#8C532B', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Most Loved By Customers
              </span>
              <h2 style={{ fontSize: '2.4rem', color: '#2A170E', marginTop: '4px' }}>
                Signature Bestsellers
              </h2>
            </div>
            <Link to="/cakes?sort=popular" className="btn-outline" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
              <span>View All Bestsellers</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '28px'
          }}>
            {bestSellers.map((cake) => (
              <ProductCard
                key={cake.id}
                product={cake}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: SPECIAL OFFERS & COUPONS BANNER
          ============================================================ */}
      <section style={{ padding: '60px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #2A170E 0%, #4A2818 100%)',
            borderRadius: '28px',
            padding: '48px',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(42, 23, 14, 0.2)'
          }}>
            {/* Background glow & art */}
            <div style={{
              position: 'absolute',
              top: '-40%',
              right: '-10%',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(198, 146, 62, 0.3) 0%, transparent 70%)',
              filter: 'blur(40px)'
            }} />

            <div style={{
              position: 'relative',
              zIndex: 2,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              alignItems: 'center',
              gap: '36px'
            }}>
              <div>
                <span style={{
                  color: '#DFBA73',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase'
                }}>
                  Festive Celebration Deals
                </span>
                <h3 style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                  color: '#FFFFFF',
                  margin: '8px 0 14px',
                  fontFamily: 'var(--font-heading)'
                }}>
                  Exclusive Sweet Discounts
                </h3>
                <p style={{ color: '#D5C7BD', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  Apply coupon code at checkout to enjoy instant savings on handcrafted cakes and custom photo creations!
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                  {/* Coupon 1 */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1.5px dashed #DFBA73',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#DFBA73', fontWeight: 600 }}>FLAT 10% OFF</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '1px' }}>WELCOME10</div>
                    </div>
                    <button
                      onClick={() => copyCoupon('WELCOME10')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: copiedCoupon === 'WELCOME10' ? '#16A34A' : '#DFBA73',
                        color: '#2A170E',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      {copiedCoupon === 'WELCOME10' ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>

                  {/* Coupon 2 */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1.5px dashed #DFBA73',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#DFBA73', fontWeight: 600 }}>FLAT 15% OFF &gt; ₹999</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '1px' }}>SWEETGOLD</div>
                    </div>
                    <button
                      onClick={() => copyCoupon('SWEETGOLD')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: copiedCoupon === 'SWEETGOLD' ? '#16A34A' : '#DFBA73',
                        color: '#2A170E',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      {copiedCoupon === 'SWEETGOLD' ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <img
                  src="https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?q=80&w=800&auto=format&fit=crop"
                  alt="Red Velvet Offer Cake"
                  style={{
                    maxWidth: '340px',
                    width: '100%',
                    borderRadius: '20px',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                    border: '4px solid rgba(223, 186, 115, 0.4)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 6: NEW ARRIVALS
          ============================================================ */}
      <section style={{ padding: '80px 0', background: '#FAF7F2' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ color: '#8C532B', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Just Added To Our Ovens
              </span>
              <h2 style={{ fontSize: '2.4rem', color: '#2A170E', marginTop: '4px' }}>
                New Culinary Arrivals
              </h2>
            </div>
            <Link to="/cakes?sort=newest" className="btn-outline" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
              <span>View All New</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '28px'
          }}>
            {newArrivals.map((cake) => (
              <ProductCard
                key={cake.id}
                product={cake}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 7: CUSTOM CAKE BUILDER TEASER
          ============================================================ */}
      <section style={{
        padding: '90px 0',
        background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EBE1 100%)',
        position: 'relative'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '48px'
          }}>
            <div>
              <span style={{
                color: '#8C532B',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                Interactive Cake Studio
              </span>
              <h2 style={{ fontSize: '2.6rem', color: '#2A170E', margin: '8px 0 16px' }}>
                Design Your Dream Cake In Real-Time
              </h2>
              <p style={{ color: '#73645C', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
                Can't find the exact cake you imagined? Use our proprietary <strong>Custom Cake Builder</strong> to choose base shape, flavours, toppings, edible gold accents, personalized name piping, and reference photo uploads with real-time automatic pricing.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: '#2A170E', fontWeight: 600 }}>
                  <CheckCircle2 size={20} color="#16A34A" />
                  <span>Shapes: Round, Square, Heart, and Rectangle</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: '#2A170E', fontWeight: 600 }}>
                  <CheckCircle2 size={20} color="#16A34A" />
                  <span>Flavours: Belgian Truffle, Vanilla Bean, Red Velvet, Black Forest</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: '#2A170E', fontWeight: 600 }}>
                  <CheckCircle2 size={20} color="#16A34A" />
                  <span>Toppings: Macarons, Ferrero Rocher, Fresh Berries & Edible Gold</span>
                </div>
              </div>

              <Link to="/custom-cake" className="btn-gold" style={{ padding: '15px 34px', fontSize: '1.02rem' }}>
                <span>Launch Custom Cake Studio</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                position: 'relative',
                display: 'inline-block',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(42, 23, 14, 0.18)',
                border: '6px solid #FFFFFF'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop"
                  alt="Custom Cake Designer"
                  style={{ width: '100%', maxWidth: '460px', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(8px)',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  textAlign: 'left'
                }}>
                  <div style={{ fontSize: '0.78rem', color: '#8C532B', fontWeight: 700 }}>LIVE CUSTOMIZATION</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2A170E' }}>
                    Heart Shape • 2kg • Ferrero & Macaron Toppings
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 8: WHY CHOOSE US
          ============================================================ */}
      <section style={{ padding: '80px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 56px' }}>
            <span style={{ color: '#8C532B', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Our Promise
            </span>
            <h2 style={{ fontSize: '2.4rem', color: '#2A170E', marginTop: '6px' }}>
              Why Celebrate With SweetCrumb
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px'
          }}>
            <div style={{
              padding: '32px 24px',
              borderRadius: '20px',
              background: '#FAF7F2',
              textAlign: 'center',
              border: '1px solid #EFE8DE'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(198, 146, 62, 0.15)',
                color: '#C6923E',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <Clock size={30} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#2A170E' }}>Baked Fresh Daily</h3>
              <p style={{ fontSize: '0.88rem', color: '#73645C', lineHeight: 1.6 }}>
                Every cake is baked on the morning of delivery from scratch, never frozen or pre-stored.
              </p>
            </div>

            <div style={{
              padding: '32px 24px',
              borderRadius: '20px',
              background: '#FAF7F2',
              textAlign: 'center',
              border: '1px solid #EFE8DE'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(230, 131, 133, 0.15)',
                color: '#E68385',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <Award size={30} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#2A170E' }}>Belgian Chocolate</h3>
              <p style={{ fontSize: '0.88rem', color: '#73645C', lineHeight: 1.6 }}>
                Authentic 54% and 70% Callebaut dark chocolate and Madagascar Bourbon vanilla beans.
              </p>
            </div>

            <div style={{
              padding: '32px 24px',
              borderRadius: '20px',
              background: '#FAF7F2',
              textAlign: 'center',
              border: '1px solid #EFE8DE'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(198, 146, 62, 0.15)',
                color: '#8C532B',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <Truck size={30} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#2A170E' }}>Midnight Delivery</h3>
              <p style={{ fontSize: '0.88rem', color: '#73645C', lineHeight: 1.6 }}>
                Chilled temperature-controlled vans guarantee flawless midnight surprise arrival.
              </p>
            </div>

            <div style={{
              padding: '32px 24px',
              borderRadius: '20px',
              background: '#FAF7F2',
              textAlign: 'center',
              border: '1px solid #EFE8DE'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(46, 125, 50, 0.12)',
                color: '#2E7D32',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <ShieldCheck size={30} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#2A170E' }}>Luxury Box Packaging</h3>
              <p style={{ fontSize: '0.88rem', color: '#73645C', lineHeight: 1.6 }}>
                Food-grade golden satin ribbon presentation boxes ready for immediate gifting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: CUSTOMER REVIEWS & TESTIMONIALS
          ============================================================ */}
      <section style={{ padding: '80px 0', background: '#FAF7F2' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 48px' }}>
            <span style={{ color: '#8C532B', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Real Celebrations
            </span>
            <h2 style={{ fontSize: '2.4rem', color: '#2A170E', marginTop: '6px' }}>
              Stories From Sweet Moments
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px'
          }}>
            {reviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '28px',
                  boxShadow: '0 8px 24px rgba(42, 23, 14, 0.05)',
                  border: '1px solid #EFE8DE',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '4px', color: '#B45309', marginBottom: '14px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#B45309" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.94rem', color: '#2A170E', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '20px' }}>
                    "{rev.review}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #F4ECE1', paddingTop: '16px' }}>
                  <img
                    src={rev.userAvatar}
                    alt={rev.userName}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#2A170E' }}>{rev.userName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#8C532B', fontWeight: 600 }}>Verified Customer • {rev.productName}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 10: INSTAGRAM GALLERY
          ============================================================ */}
      <section style={{ padding: '80px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
            <span style={{ color: '#8C532B', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Follow @SweetCrumbBakery
            </span>
            <h2 style={{ fontSize: '2.4rem', color: '#2A170E', marginTop: '6px' }}>
              Fresh From Our Instagram
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px'
          }}>
            {[
              'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=600&auto=format&fit=crop'
            ].map((img, i) => (
              <div
                key={i}
                style={{
                  height: '220px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={img}
                  alt={`SweetCrumb creation ${i}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 12: PINCODE CHECKER & CONTACT STRIP
          ============================================================ */}
      <section style={{ padding: '60px 0', background: '#FAF7F2', borderTop: '1px solid #EFE8DE' }}>
        <div className="container">
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '36px 40px',
            border: '1px solid #EFE8DE',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '28px'
          }}>
            <div style={{ maxWidth: '450px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C6923E', fontWeight: 700, fontSize: '0.85rem' }}>
                <MapPin size={18} />
                <span>CITYWIDE EXPRESS COVERAGE</span>
              </div>
              <h3 style={{ fontSize: '1.6rem', color: '#2A170E', marginTop: '4px' }}>
                Check Delivery To Your Doorstep
              </h3>
              <p style={{ color: '#73645C', fontSize: '0.88rem', marginTop: '4px' }}>
                We serve over 150+ postal pincodes across the metro area daily with dedicated chilled fleets.
              </p>
            </div>

            <div style={{ flex: '1 1 320px', maxWidth: '420px' }}>
              <form onSubmit={handlePincodeSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincodeCheck}
                  onChange={(e) => setPincodeCheck(e.target.value.replace(/\D/g, ''))}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '999px',
                    border: '1.5px solid #EFE8DE',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>
                  Verify
                </button>
              </form>

              {pincodeResult && (
                <div style={{
                  marginTop: '10px',
                  fontSize: '0.85rem',
                  color: pincodeResult.available ? '#16A34A' : '#DC2626',
                  fontWeight: 600
                }}>
                  {pincodeResult.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
