import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Cake,
  Search,
  Heart,
  ShoppingBag,
  User,
  MapPin,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  LogOut,
  PackageCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productsAPI } from '../services/api';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [pincodeModalOpen, setPincodeModalOpen] = useState(false);
  const [pincode, setPincode] = useState('560038');
  const [pincodeStatus, setPincodeStatus] = useState({ checked: true, deliverable: true, area: 'Indiranagar, Bengaluru' });

  const searchRef = useRef(null);

  // Live search debounced
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await productsAPI.getSuggestions(searchQuery.trim());
        setSuggestions(res.data.suggestions || []);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setSuggestions([]);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cakes?search=${encodeURIComponent(searchQuery.trim())}`);
      setSuggestions([]);
      setShowSearchBox(false);
    }
  };

  const checkPincode = (e) => {
    e.preventDefault();
    if (pincode.length >= 6) {
      setPincodeStatus({
        checked: true,
        deliverable: true,
        area: 'Available for Same-Day & Midnight Delivery'
      });
      setTimeout(() => setPincodeModalOpen(false), 1200);
    }
  };

  return (
    <>
      {/* Top Brand Notification Ribbon */}
      <div style={{
        background: 'linear-gradient(90deg, #2A170E 0%, #4A2818 50%, #2A170E 100%)',
        color: '#DFBA73',
        fontSize: '0.82rem',
        padding: '6px 16px',
        textAlign: 'center',
        fontWeight: 600,
        letterSpacing: '0.3px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span>✨ Handcrafted Luxury Cakes • Fresh Daily Delivery • Use code <strong>WELCOME10</strong> for 10% OFF</span>
        <button
          onClick={() => setPincodeModalOpen(true)}
          style={{
            background: 'rgba(223, 186, 115, 0.2)',
            color: '#FFFFFF',
            border: '1px solid rgba(223, 186, 115, 0.4)',
            padding: '2px 10px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <MapPin size={12} color="#DFBA73" />
          <span>Deliver to: {pincode}</span>
        </button>
      </div>

      {/* Main Sticky Navbar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #EFE8DE',
        boxShadow: '0 4px 20px rgba(42, 23, 14, 0.05)'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '78px' }}>
          
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4A2818 0%, #2A170E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DFBA73',
              boxShadow: '0 4px 12px rgba(42, 23, 14, 0.15)'
            }}>
              <Cake size={26} />
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.65rem',
                fontWeight: 700,
                color: '#2A170E',
                letterSpacing: '-0.5px',
                display: 'block',
                lineHeight: 1
              }}>
                Sweet<span style={{ color: '#C6923E' }}>Crumb</span>
              </span>
              <span style={{
                fontSize: '0.68rem',
                color: '#8C532B',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                fontWeight: 600
              }}>
                Artisanal Bakery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-menu">
            <Link
              to="/"
              style={{
                fontSize: '0.96rem',
                fontWeight: location.pathname === '/' ? 700 : 500,
                color: location.pathname === '/' ? '#C6923E' : '#2A170E',
                position: 'relative'
              }}
            >
              Home
            </Link>
            <Link
              to="/cakes"
              style={{
                fontSize: '0.96rem',
                fontWeight: location.pathname.startsWith('/cakes') ? 700 : 500,
                color: location.pathname.startsWith('/cakes') ? '#C6923E' : '#2A170E'
              }}
            >
              Cakes
            </Link>
            <Link
              to="/categories"
              style={{
                fontSize: '0.96rem',
                fontWeight: location.pathname === '/categories' ? 700 : 500,
                color: location.pathname === '/categories' ? '#C6923E' : '#2A170E'
              }}
            >
              Categories
            </Link>
            <Link
              to="/custom-cake"
              style={{
                fontSize: '0.96rem',
                fontWeight: 600,
                color: '#8C532B',
                background: 'rgba(198, 146, 62, 0.12)',
                padding: '6px 14px',
                borderRadius: '999px',
                border: '1px solid rgba(198, 146, 62, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>✨ Custom Cake</span>
            </Link>
            <Link
              to="/offers"
              style={{
                fontSize: '0.96rem',
                fontWeight: location.pathname === '/offers' ? 700 : 500,
                color: location.pathname === '/offers' ? '#C6923E' : '#2A170E'
              }}
            >
              Offers
            </Link>
            <Link
              to="/about"
              style={{
                fontSize: '0.96rem',
                fontWeight: location.pathname === '/about' ? 700 : 500,
                color: location.pathname === '/about' ? '#C6923E' : '#2A170E'
              }}
            >
              About
            </Link>
            <Link
              to="/contact"
              style={{
                fontSize: '0.96rem',
                fontWeight: location.pathname === '/contact' ? 700 : 500,
                color: location.pathname === '/contact' ? '#C6923E' : '#2A170E'
              }}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            
            {/* Search Bar / Trigger */}
            <div ref={searchRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSearchBox(!showSearchBox)}
                aria-label="Search cakes"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(42, 23, 14, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2A170E'
                }}
              >
                <Search size={20} />
              </button>

              {showSearchBox && (
                <div style={{
                  position: 'absolute',
                  top: '50px',
                  right: '0',
                  width: '340px',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  boxShadow: '0 12px 35px rgba(42, 23, 14, 0.18)',
                  border: '1px solid #EFE8DE',
                  padding: '14px',
                  zIndex: 1100
                }}>
                  <form onSubmit={handleSearchSubmit} style={{ position: 'relative', display: 'flex' }}>
                    <input
                      type="text"
                      placeholder="Search Chocolate, Red Velvet, Cheesecake..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '10px 38px 10px 14px',
                        borderRadius: '999px',
                        border: '1.5px solid #C6923E',
                        outline: 'none',
                        fontSize: '0.88rem'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#C6923E'
                      }}
                    >
                      <Search size={18} />
                    </button>
                  </form>

                  {/* Suggestions List */}
                  {suggestions.length > 0 && (
                    <div style={{ marginTop: '12px', borderTop: '1px solid #F4ECE1', paddingTop: '8px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8C532B', marginBottom: '6px' }}>
                        POPULAR SUGGESTIONS
                      </div>
                      {suggestions.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            navigate(`/cakes/${item.id}`);
                            setShowSearchBox(false);
                            setSuggestions([]);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '6px 8px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#FAF7F2'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2A170E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#73645C' }}>
                              {item.category} • ₹{item.price}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(42, 23, 14, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2A170E',
                position: 'relative'
              }}
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  background: '#E68385',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  width: '19px',
                  height: '19px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(230, 131, 133, 0.4)'
                }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(198, 146, 62, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8C532B',
                position: 'relative'
              }}
            >
              <ShoppingBag size={20} />
              {totalItemsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  background: '#2A170E',
                  color: '#DFBA73',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  width: '19px',
                  height: '19px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(42, 23, 14, 0.3)'
                }}>
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Account / Login */}
            <div style={{ position: 'relative' }}>
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      background: 'rgba(42, 23, 14, 0.05)',
                      color: '#2A170E',
                      fontWeight: 600,
                      fontSize: '0.88rem'
                    }}
                  >
                    <User size={18} color="#C6923E" />
                    <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} />
                  </button>

                  {userDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '46px',
                      right: '0',
                      width: '220px',
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      boxShadow: '0 12px 35px rgba(42, 23, 14, 0.15)',
                      border: '1px solid #EFE8DE',
                      padding: '8px',
                      zIndex: 1100
                    }}>
                      <div style={{ padding: '8px 12px', borderBottom: '1px solid #F4ECE1' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2A170E' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#73645C' }}>{user.email}</div>
                      </div>

                      <Link
                        to="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          fontSize: '0.88rem',
                          color: '#2A170E',
                          borderRadius: '8px'
                        }}
                      >
                        <User size={16} color="#8C532B" />
                        <span>My Account</span>
                      </Link>

                      <Link
                        to="/account?tab=orders"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          fontSize: '0.88rem',
                          color: '#2A170E',
                          borderRadius: '8px'
                        }}
                      >
                        <PackageCheck size={16} color="#8C532B" />
                        <span>My Orders</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            fontSize: '0.88rem',
                            color: '#8C532B',
                            fontWeight: 700,
                            background: 'rgba(198, 146, 62, 0.12)',
                            borderRadius: '8px',
                            margin: '4px 0'
                          }}
                        >
                          <ShieldCheck size={16} color="#C6923E" />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          fontSize: '0.88rem',
                          color: '#E11D48',
                          borderRadius: '8px',
                          textAlign: 'left'
                        }}
                      >
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link
                    to="/login"
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#2A170E',
                      padding: '8px 16px',
                      borderRadius: '999px',
                      border: '1px solid #EFE8DE'
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/admin/login"
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#C6923E',
                      background: 'rgba(198, 146, 62, 0.1)',
                      padding: '6px 12px',
                      borderRadius: '999px',
                      border: '1px solid rgba(198, 146, 62, 0.3)'
                    }}
                  >
                    Admin
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-hamburger"
              style={{
                width: '40px',
                height: '40px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2A170E'
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            background: '#FFFFFF',
            borderTop: '1px solid #EFE8DE',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <Link to="/" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2A170E' }}>Home</Link>
            <Link to="/cakes" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2A170E' }}>All Cakes</Link>
            <Link to="/categories" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2A170E' }}>Categories</Link>
            <Link to="/custom-cake" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#C6923E' }}>🎂 Custom Cake Studio</Link>
            <Link to="/offers" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2A170E' }}>Special Offers</Link>
            <Link to="/about" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2A170E' }}>About SweetCrumb</Link>
            <Link to="/contact" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2A170E' }}>Contact & Pincodes</Link>
            {isAdmin && (
              <Link to="/admin" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#8C532B' }}>🛡️ Admin Dashboard</Link>
            )}
          </div>
        )}
      </header>

      {/* Pincode Availability Checker Modal */}
      {pincodeModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '16px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '420px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            position: 'relative'
          }}>
            <button
              onClick={() => setPincodeModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', color: '#73645C' }}
            >
              <X size={20} />
            </button>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(198, 146, 62, 0.15)',
                color: '#C6923E',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
              }}>
                <MapPin size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>Check Delivery Area</h3>
              <p style={{ fontSize: '0.85rem', color: '#73645C' }}>
                Enter your 6-digit postal pincode to verify same-day and midnight cake delivery availability.
              </p>
            </div>

            <form onSubmit={checkPincode} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 560038"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid #EFE8DE',
                  fontSize: '1rem',
                  outline: 'none',
                  textAlign: 'center',
                  fontWeight: 600
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '12px 20px' }}>
                Verify
              </button>
            </form>

            {pincodeStatus.checked && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: '12px',
                background: '#F0FDF4',
                border: '1px solid #86EFAC',
                color: '#166534',
                fontSize: '0.85rem',
                textAlign: 'center',
                fontWeight: 600
              }}>
                🎉 Super Fast Delivery Available! (Indiranagar, Koramangala, Whitefield, HSR & Central Metro areas)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inline CSS Media Queries */}
      <style>{`
        @media (max-width: 992px) {
          .desktop-menu { display: none !important; }
          .mobile-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
