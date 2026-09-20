import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cake,
  Sparkles,
  ShoppingBag,
  Check,
  Upload,
  Layers,
  Heart,
  Square,
  Circle,
  HelpCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function CustomCakePage() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Custom cake builder state
  const [shape, setShape] = useState('Round');
  const [size, setSize] = useState('1kg');
  const [flavour, setFlavour] = useState('Chocolate Truffle');
  const [frostingColor, setFrostingColor] = useState('Warm Cocoa');
  const [toppings, setToppings] = useState(['French Macarons', 'Belgian Chocolate Curls']);
  const [messageOnCake, setMessageOnCake] = useState('Happy Celebration');
  const [photoReference, setPhotoReference] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [eggType, setEggType] = useState('Eggless');
  const [isAdding, setIsAdding] = useState(false);

  // Price Calculation Logic
  // Base shapes
  const shapeCosts = {
    Round: 0,
    Square: 100,
    Heart: 150,
    Rectangle: 120
  };

  // Sizes
  const sizeCosts = {
    '500g': 599,
    '1kg': 1099,
    '2kg': 2099,
    '3kg': 3099
  };

  // Flavours
  const flavourCosts = {
    'Chocolate Truffle': 150,
    'Vanilla Bean': 100,
    'Red Velvet': 180,
    'Wild Strawberry': 160,
    'Butterscotch Crunch': 140,
    'Black Forest': 150
  };

  // Toppings prices per item
  const toppingPrices = {
    'Belgian Chocolate Curls': 80,
    'Fresh Strawberries': 120,
    'French Macarons': 150,
    'Roasted Hazelnuts': 90,
    'Oreo Cookies': 60,
    'Ferrero Rocher': 180
  };

  const basePrice = sizeCosts[size] || 1099;
  const shapePrice = shapeCosts[shape] || 0;
  const flavourPrice = flavourCosts[flavour] || 0;
  const toppingsPrice = toppings.reduce((sum, t) => sum + (toppingPrices[t] || 0), 0);
  const photoPrintPrice = photoReference ? 200 : 0;

  const calculatedTotal = basePrice + shapePrice + flavourPrice + toppingsPrice + photoPrintPrice;

  const toggleTopping = (top) => {
    if (toppings.includes(top)) {
      setToppings(toppings.filter((t) => t !== top));
    } else {
      setToppings([...toppings, top]);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoReference(reader.result);
        showToast('Photo reference attached (+₹200 for edible print layer)', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    const customCakeProduct = {
      id: `custom-cake-${Date.now()}`,
      name: `Custom ${shape} ${flavour} Cake`,
      category: 'Custom Cakes',
      price: calculatedTotal,
      image: photoReference || (
        flavour === 'Red Velvet'
          ? 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?q=80&w=800&auto=format&fit=crop'
          : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'
      ),
      eggType
    };

    addToCart(customCakeProduct, {
      weight: size,
      price: calculatedTotal,
      quantity: 1,
      messageOnCake,
      isCustom: true,
      customDetails: {
        shape,
        size,
        flavour,
        frostingColor,
        toppings,
        photoReference: !!photoReference,
        specialInstructions
      }
    });

    setTimeout(() => {
      setIsAdding(false);
      navigate('/cart');
    }, 600);
  };

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
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
            <span>BESPOKE PÂTISSERIE STUDIO</span>
          </div>
          <h1 style={{ fontSize: '2.8rem', color: '#2A170E', marginBottom: '12px' }}>
            Custom Cake Builder
          </h1>
          <p style={{ color: '#73645C', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Craft your personalized cake step-by-step with real-time 3D style visualization and transparent instant pricing.
          </p>
        </div>

        {/* 2-Column Studio: Left Visualizer, Right Controls */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Left: Interactive Visualizer & Price Summary */}
          <div style={{
            position: 'sticky',
            top: '100px',
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid #EFE8DE',
            boxShadow: '0 12px 35px rgba(42, 23, 14, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#2A170E' }}>Live Cake Preview</h3>
              <span className="badge-gold">Interactive Preview</span>
            </div>

            {/* Visualizer Canvas Card */}
            <div style={{
              height: '300px',
              borderRadius: '20px',
              background: 'radial-gradient(circle, #F8EFE4 0%, #EFE4D6 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '2px solid rgba(198, 146, 62, 0.2)',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)',
              marginBottom: '24px'
            }}>
              {/* Stand / Plate */}
              <div style={{
                position: 'absolute',
                bottom: '30px',
                width: '240px',
                height: '16px',
                borderRadius: '50%',
                background: 'rgba(42, 23, 14, 0.15)',
                filter: 'blur(4px)'
              }} />

              {/* Dynamic Cake Visual */}
                         {/* Dynamic Cake Visual */}
              <div style={{
                position: 'relative',
                // Intha 3 line-a mattum maathu
width: shape === 'Heart' ? '200px' : '190px',
height: shape === 'Heart' ? '185px' : '170px',
                borderRadius: shape === 'Round' ? '50%' : shape === 'Square' ? '28px' : shape === 'Rectangle' ? '20px' : '0px',
                clipPath: shape === 'Heart' ? "path('M 100 30 C 90 10, 0 10, 10 70 C 20 110, 100 175, 100 175 C 100 175, 180 110, 190 70 C 200 10, 110 10, 100 30 Z')" : 'none',
                background: frostingColor === 'Velvet Red'
                  ? 'linear-gradient(135deg, #A82024 0%, #D44246 100%)'
                  : frostingColor === 'Pastel Pink'
                  ? 'linear-gradient(135deg, #F8BBD0 0%, #F48FB1 100%)'
                  : frostingColor === 'Bourbon Vanilla'
                  ? 'linear-gradient(135deg, #FFF8E7 0%, #F5E5C9 100%)'
                  : 'linear-gradient(135deg, #3E2723 0%, #5D4037 100%)',
                boxShadow: '0 16px 30px rgba(42, 23, 14, 0.25)',
                border: '4px solid rgba(255, 255, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                textAlign: 'center',
                transition: 'all 0.4s ease'
              }} className="float-animation">
            
                {/* Photo Reference Overlay if uploaded */}
                {photoReference ? (
                  <img
                    src={photoReference}
                    alt="Custom Photo"
                    style={{
                      width: '75px',
                      height: '75px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #DFBA73',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                      marginBottom: '8px'
                    }}
                  />
                ) : (
                  /* Custom Sugar Piping Message */
                  <div style={{
                    color: frostingColor === 'Bourbon Vanilla' ? '#3E2723' : '#FFFFFF',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    textShadow: frostingColor === 'Bourbon Vanilla' ? 'none' : '0 1px 3px rgba(0,0,0,0.6)',
                    maxWidth: '150px',
                    wordBreak: 'break-word',
                    lineHeight: 1.2
                  }}>
                    {messageOnCake || 'Your Name'}
                  </div>
                )}
              </div>

              {/* Toppings Badge on Cake */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.9)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#8C532B'
              }}>
                {toppings.length} Toppings Selected
              </div>
            </div>

            {/* Live Pricing Breakdown */}
            <div style={{
              background: '#FAF7F2',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #EFE8DE',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#73645C', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Base Sponge ({size})</span>
                  <span>₹{basePrice}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Shape ({shape})</span>
                  <span>{shapePrice === 0 ? 'FREE' : `+₹${shapePrice}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Gourmet Flavour ({flavour})</span>
                  <span>+₹{flavourPrice}</span>
                </div>
                {toppingsPrice > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Toppings ({toppings.length})</span>
                    <span>+₹{toppingsPrice}</span>
                  </div>
                )}
                {photoPrintPrice > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Edible Sugar Photo Print</span>
                    <span>+₹{photoPrintPrice}</span>
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid #EFE8DE',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#2A170E'
                }}>
                  <span>Calculated Total:</span>
                  <span style={{ color: '#C6923E' }}>₹{calculatedTotal}</span>
                </div>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="btn-gold"
              style={{ width: '100%', padding: '16px', fontSize: '1.05rem' }}
            >
              <ShoppingBag size={20} />
              <span>{isAdding ? 'Adding to Cart...' : `Add Custom Cake to Cart • ₹${calculatedTotal}`}</span>
            </button>
          </div>

          {/* Right: Customization Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Step 1: Shape */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #EFE8DE' }}>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: 800, color: '#2A170E', marginBottom: '14px' }}>
                1. Select Cake Shape
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { name: 'Round', icon: <Circle size={22} />, extra: 'Standard' },
                  { name: 'Square', icon: <Square size={22} />, extra: '+₹100' },
                  { name: 'Heart', icon: <Heart size={22} />, extra: '+₹150' },
                  { name: 'Rectangle', icon: <Layers size={22} />, extra: '+₹120' }
                ].map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setShape(s.name)}
                    style={{
                      padding: '16px 8px',
                      borderRadius: '14px',
                      border: shape === s.name ? '2px solid #C6923E' : '1.5px solid #EFE8DE',
                      background: shape === s.name ? 'rgba(198, 146, 62, 0.1)' : '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ color: shape === s.name ? '#C6923E' : '#73645C' }}>{s.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2A170E' }}>{s.name}</span>
                    <span style={{ fontSize: '0.72rem', color: '#8C532B' }}>{s.extra}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Size & Weight */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #EFE8DE' }}>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: 800, color: '#2A170E', marginBottom: '14px' }}>
                2. Select Weight / Tiers
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { wt: '500g', serves: '4-5 people', cost: 599 },
                  { wt: '1kg', serves: '8-10 people', cost: 1099 },
                  { wt: '2kg', serves: '16-18 (2 Tiers)', cost: 2099 },
                  { wt: '3kg', serves: '24-28 (3 Tiers)', cost: 3099 }
                ].map((s) => (
                  <button
                    key={s.wt}
                    onClick={() => setSize(s.wt)}
                    style={{
                      padding: '14px 8px',
                      borderRadius: '14px',
                      border: size === s.wt ? '2px solid #C6923E' : '1.5px solid #EFE8DE',
                      background: size === s.wt ? 'rgba(198, 146, 62, 0.1)' : '#FFFFFF',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#2A170E' }}>{s.wt}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8C532B', margin: '2px 0' }}>₹{s.cost}</div>
                    <div style={{ fontSize: '0.72rem', color: '#73645C' }}>{s.serves}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Gourmet Flavour */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #EFE8DE' }}>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: 800, color: '#2A170E', marginBottom: '14px' }}>
                3. Select Cake Flavour
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {[
                  'Chocolate Truffle',
                  'Vanilla Bean',
                  'Red Velvet',
                  'Wild Strawberry',
                  'Butterscotch Crunch',
                  'Black Forest'
                ].map((flv) => (
                  <button
                    key={flv}
                    onClick={() => {
                      setFlavour(flv);
                      if (flv === 'Red Velvet') setFrostingColor('Velvet Red');
                      else if (flv === 'Wild Strawberry') setFrostingColor('Pastel Pink');
                      else if (flv === 'Vanilla Bean') setFrostingColor('Bourbon Vanilla');
                      else setFrostingColor('Warm Cocoa');
                    }}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: flavour === flv ? '2px solid #C6923E' : '1.5px solid #EFE8DE',
                      background: flavour === flv ? 'rgba(198, 146, 62, 0.1)' : '#FAF7F2',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      color: '#2A170E'
                    }}
                  >
                    <span>{flv}</span>
                    <span style={{ fontSize: '0.78rem', color: '#8C532B' }}>+₹{flavourCosts[flv]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Artisanal Toppings */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #EFE8DE' }}>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: 800, color: '#2A170E', marginBottom: '14px' }}>
                4. Select Toppings & Garnishes (Multiple Allowed)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {Object.entries(toppingPrices).map(([name, price]) => {
                  const isSelected = toppings.includes(name);
                  return (
                    <button
                      key={name}
                      onClick={() => toggleTopping(name)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #16A34A' : '1.5px solid #EFE8DE',
                        background: isSelected ? '#F0FDF4' : '#FFFFFF',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: isSelected ? '#166534' : '#2A170E'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          border: isSelected ? 'none' : '1.5px solid #A4978E',
                          background: isSelected ? '#16A34A' : '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF'
                        }}>
                          {isSelected && <Check size={14} />}
                        </div>
                        <span>{name}</span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#8C532B' }}>+₹{price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Custom Message & Photo Reference */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #EFE8DE' }}>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: 800, color: '#2A170E', marginBottom: '14px' }}>
                5. Personalized Sugar Message & Photo
              </label>

              {/* Message */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#73645C', marginBottom: '6px' }}>
                  Text Piped on Cake:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Happy Birthday Santhosh"
                  maxLength={35}
                  value={messageOnCake}
                  onChange={(e) => setMessageOnCake(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #EFE8DE',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#73645C', marginBottom: '6px' }}>
                  Upload Photo for Edible Sugar Print (+₹200):
                </label>
                <div style={{
                  border: '2px dashed #C6923E',
                  borderRadius: '14px',
                  padding: '20px',
                  textAlign: 'center',
                  background: '#FAF7F2'
                }}>
                  <Upload size={24} color="#C6923E" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2A170E', marginBottom: '4px' }}>
                    Click to select photo or design reference
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#73645C', marginBottom: '12px' }}>
                    JPEG, PNG or WEBP up to 5MB
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ fontSize: '0.82rem' }}
                  />
                  {photoReference && (
                    <div style={{ marginTop: '10px', color: '#16A34A', fontSize: '0.8rem', fontWeight: 700 }}>
                      ✓ Photo attached successfully!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
