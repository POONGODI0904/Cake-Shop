import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  ShieldCheck,
  Plus,
  ArrowRight,
  ArrowLeft,
  Lock,
  Gift
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ordersAPI } from '../../services/api';

export default function CheckoutPage() {
  const { cartItems, subtotal, deliveryFee, tax, total, appliedCoupon, couponDiscount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Address State
  const defaultSavedAddresses = user?.addresses || [
    {
      id: 'addr-default-1',
      name: user?.name || 'Pooja Sundaram',
      phone: user?.phone || '+91 91234 56789',
      houseNo: 'Flat 402, Rosewood Heights',
      street: 'Park Avenue Road',
      area: 'Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      landmark: 'Near Indiranagar Metro Station',
      isDefault: true
    }
  ];

  const [savedAddresses, setSavedAddresses] = useState(defaultSavedAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses[0]?.id || 'new');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New Address Form
  const [newAddress, setNewAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    houseNo: '',
    street: '',
    area: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    landmark: '',
    isDefault: false
  });

  // Step 2: Delivery Scheduling State
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [deliveryTime, setDeliveryTime] = useState('Evening (4:00 PM - 8:00 PM)');
  const [giftMessage, setGiftMessage] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Step 4: Payment State
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('pooja@okaxis');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  if (cartItems.length === 0) {
    return (
      <div style={{ background: '#FAF7F2', minHeight: '80vh', padding: '80px 20px', textAlign: 'center' }}>
        <h2>No items in checkout</h2>
        <p style={{ color: '#73645C', margin: '10px 0 20px' }}>Your cart is empty. Please select a cake to continue.</p>
        <button onClick={() => navigate('/cakes')} className="btn-primary">Browse Cakes</button>
      </div>
    );
  }

  const getSelectedAddress = () => {
    if (showNewAddressForm) return newAddress;
    return savedAddresses.find((a) => a.id === selectedAddressId) || newAddress;
  };

  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.phone || !newAddress.houseNo || !newAddress.pincode) {
      showToast('Please fill all required address fields', 'error');
      return;
    }
    const created = { id: `addr-${Date.now()}`, ...newAddress };
    setSavedAddresses([created, ...savedAddresses]);
    setSelectedAddressId(created.id);
    setShowNewAddressForm(false);
    showToast('New address saved successfully!', 'success');
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const chosenAddress = getSelectedAddress();
      const orderPayload = {
        items: cartItems,
        subtotal,
        discount: couponDiscount,
        deliveryFee,
        tax,
        total,
        couponApplied: appliedCoupon?.code || null,
        address: chosenAddress,
        deliveryDate,
        deliveryTime,
        paymentMethod: paymentMethod === 'COD' ? 'Cash on Delivery' : `${paymentMethod} (Online)`,
        giftMessage,
        customerNotes: deliveryInstructions,
        customerEmail: user?.email || 'customer@sweetcrumb.com',
        userId: user?.id || 'guest-' + Date.now()
      };

      const res = await ordersAPI.create(orderPayload);
      clearCart();
      showToast('🎉 Order placed successfully!', 'success');
      navigate(`/order-success/${res.data.order.id}`, { state: { order: res.data.order } });
    } catch (err) {
      showToast(err.response?.data?.message || 'Order placement failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1020px' }}>
        
        {/* Checkout Header & Progress Steps (Section 18) */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.4rem', color: '#2A170E', marginBottom: '8px' }}>
            Multi-Step Secure Checkout
          </h1>
          <p style={{ color: '#73645C', fontSize: '0.95rem' }}>
            Fast, encrypted, and seamless checkout in 4 simple steps.
          </p>

          {/* Stepper Wizard Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '620px',
            margin: '28px auto 0',
            position: 'relative'
          }}>
            {[
              { num: 1, label: 'Address' },
              { num: 2, label: 'Delivery Slot' },
              { num: 3, label: 'Order Summary' },
              { num: 4, label: 'Payment' }
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: currentStep >= step.num
                      ? 'linear-gradient(135deg, #4A2818 0%, #2A170E 100%)'
                      : '#FFFFFF',
                    color: currentStep >= step.num ? '#DFBA73' : '#A4978E',
                    border: currentStep >= step.num ? 'none' : '2px solid #EFE8DE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    boxShadow: currentStep === step.num ? '0 0 15px rgba(198, 146, 62, 0.4)' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    {currentStep > step.num ? <CheckCircle2 size={20} color="#16A34A" /> : step.num}
                  </div>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: currentStep === step.num ? 700 : 500,
                    color: currentStep >= step.num ? '#2A170E' : '#A4978E',
                    marginTop: '6px'
                  }}>
                    {step.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div style={{
                    flex: 1,
                    height: '3px',
                    background: currentStep > idx + 1 ? '#2A170E' : '#EFE8DE',
                    margin: '-18px 8px 0',
                    transition: 'background 0.3s'
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Wizard Step Containers */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '36px',
          border: '1px solid #EFE8DE',
          boxShadow: '0 8px 30px rgba(42, 23, 14, 0.05)',
          marginBottom: '32px'
        }}>
          
          {/* ============================================================
              STEP 1: ADDRESS MANAGEMENT (Section 17 & 18)
              ============================================================ */}
          {currentStep === 1 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: '#2A170E' }}>Step 1: Delivery Address</h3>
                  <p style={{ color: '#73645C', fontSize: '0.88rem' }}>Where should our chilled patisserie delivery van bring your cake?</p>
                </div>
                <button
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="btn-outline"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  <Plus size={16} />
                  <span>{showNewAddressForm ? 'Choose Saved' : 'Add New Address'}</span>
                </button>
              </div>

              {!showNewAddressForm ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      style={{
                        padding: '20px',
                        borderRadius: '16px',
                        border: selectedAddressId === addr.id ? '2px solid #C6923E' : '1.5px solid #EFE8DE',
                        background: selectedAddressId === addr.id ? 'rgba(198, 146, 62, 0.06)' : '#FAF7F2',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div style={{ fontWeight: 800, color: '#2A170E', fontSize: '1rem' }}>{addr.name}</div>
                        {addr.isDefault && (
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8C532B', background: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                            Default
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#73645C', lineHeight: 1.5 }}>
                        {addr.houseNo}, {addr.street}<br />
                        {addr.area ? `${addr.area}, ` : ''}{addr.city}, {addr.state} - <strong>{addr.pincode}</strong><br />
                        Phone: {addr.phone}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSaveNewAddress} style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label className="form-label">Recipient Full Name *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Pooja Sundaram"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        className="form-input"
                        placeholder="e.g. +91 91234 56789"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label className="form-label">House / Flat / Door No *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Flat 402, Rosewood"
                        value={newAddress.houseNo}
                        onChange={(e) => setNewAddress({ ...newAddress, houseNo: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Street / Building Name *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. 100 Feet Road"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label className="form-label">Area / Locality</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Indiranagar"
                        value={newAddress.area}
                        onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Postal Pincode *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        className="form-input"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-outline" style={{ marginRight: '10px' }}>
                    Save This Address
                  </button>
                </form>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #EFE8DE', paddingTop: '20px' }}>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="btn-gold"
                  style={{ padding: '12px 28px' }}
                >
                  <span>Continue to Delivery Slot</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 2: DELIVERY SCHEDULING (Section 18)
              ============================================================ */}
          {currentStep === 2 && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#2A170E' }}>Step 2: Delivery Date & Time Slot</h3>
                <p style={{ color: '#73645C', fontSize: '0.88rem' }}>When would you like your celebration cake to arrive?</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '28px' }}>
                {/* Date Picker */}
                <div>
                  <label className="form-label">Choose Delivery Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #EFE8DE',
                      fontSize: '0.95rem'
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#8C532B', marginTop: '6px', display: 'block' }}>
                    ✓ Fresh baking scheduled 3 hours prior to chosen slot
                  </span>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="form-label">Choose Delivery Time Slot</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { slot: 'Morning (9:00 AM - 12:00 PM)', label: 'Morning Slot (9 AM - 12 PM)' },
                      { slot: 'Afternoon (12:00 PM - 4:00 PM)', label: 'Afternoon Slot (12 PM - 4 PM)' },
                      { slot: 'Evening (4:00 PM - 8:00 PM)', label: 'Evening Slot (4 PM - 8 PM)' },
                      { slot: 'Midnight (11:00 PM - 12:00 AM)', label: 'Midnight Surprise Slot (11 PM - 12 AM) 🌙' }
                    ].map((item) => (
                      <label
                        key={item.slot}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: deliveryTime === item.slot ? '2px solid #C6923E' : '1px solid #EFE8DE',
                          background: deliveryTime === item.slot ? 'rgba(198, 146, 62, 0.08)' : '#FFFFFF',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.88rem'
                        }}
                      >
                        <input
                          type="radio"
                          name="timeSlot"
                          checked={deliveryTime === item.slot}
                          onChange={() => setDeliveryTime(item.slot)}
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gift Message Option */}
              <div style={{ marginBottom: '24px', padding: '18px', borderRadius: '16px', background: '#FAF7F2', border: '1px solid #EFE8DE' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#2A170E', marginBottom: '8px' }}>
                  <Gift size={18} color="#C6923E" />
                  <span>Complimentary Gift Card Message</span>
                </div>
                <textarea
                  rows={2}
                  placeholder="Enter a sweet message to be printed on an ivory luxury greeting card inside the box..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #EFE8DE',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #EFE8DE', paddingTop: '20px' }}>
                <button onClick={() => setCurrentStep(1)} className="btn-outline">
                  <ArrowLeft size={16} />
                  <span>Back to Address</span>
                </button>
                <button onClick={() => setCurrentStep(3)} className="btn-gold">
                  <span>Continue to Order Summary</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 3: ORDER SUMMARY (Section 18)
              ============================================================ */}
          {currentStep === 3 && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#2A170E' }}>Step 3: Review Order Summary</h3>
                <p style={{ color: '#73645C', fontSize: '0.88rem' }}>Please verify all cake specifications and delivery details.</p>
              </div>

              {/* Order Items Table */}
              <div style={{ marginBottom: '28px', border: '1px solid #EFE8DE', borderRadius: '16px', overflow: 'hidden' }}>
                {cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderBottom: idx < cartItems.length - 1 ? '1px solid #F4ECE1' : 'none',
                      background: idx % 2 === 0 ? '#FFFFFF' : '#FAF7F2'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#2A170E' }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#73645C' }}>
                          Weight: {item.weight} • Qty: {item.quantity} {item.messageOnCake ? `• "${item.messageOnCake}"` : ''}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: '#2A170E', fontSize: '1.05rem' }}>
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Info Snapshot */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                padding: '18px',
                borderRadius: '16px',
                background: '#FAF7F2',
                border: '1px solid #EFE8DE',
                marginBottom: '28px',
                fontSize: '0.85rem'
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#8C532B', marginBottom: '4px' }}>DELIVERY DESTINATION:</div>
                  <div style={{ color: '#2A170E' }}>
                    {getSelectedAddress().name} ({getSelectedAddress().phone})<br />
                    {getSelectedAddress().houseNo}, {getSelectedAddress().street}, {getSelectedAddress().city} - {getSelectedAddress().pincode}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: 700, color: '#8C532B', marginBottom: '4px' }}>SCHEDULED TIMING:</div>
                  <div style={{ color: '#2A170E' }}>
                    Date: <strong>{deliveryDate}</strong><br />
                    Slot: <strong>{deliveryTime}</strong>
                  </div>
                </div>
              </div>

              {/* Price Calculation */}
              <div style={{
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid #EFE8DE',
                maxWidth: '360px',
                marginLeft: 'auto',
                marginBottom: '28px',
                fontSize: '0.9rem',
                color: '#73645C',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {couponDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: 700 }}>
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Estimated Tax (5% GST)</span>
                  <span>₹{tax}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '2px solid #2A170E',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#2A170E'
                }}>
                  <span>Final Payable:</span>
                  <span style={{ color: '#C6923E' }}>₹{total}</span>
                </div>
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #EFE8DE', paddingTop: '20px' }}>
                <button onClick={() => setCurrentStep(2)} className="btn-outline">
                  <ArrowLeft size={16} />
                  <span>Back to Delivery Slot</span>
                </button>
                <button onClick={() => setCurrentStep(4)} className="btn-gold">
                  <span>Proceed to Payment</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 4: PAYMENT (Section 18)
              ============================================================ */}
          {currentStep === 4 && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#2A170E' }}>Step 4: Select Payment Method</h3>
                <p style={{ color: '#73645C', fontSize: '0.88rem' }}>
                  Choose your preferred payment method. Integrated with production payment gateways.
                </p>
              </div>

              {/* Payment Methods Tabs (UPI, Cards, Net Banking, COD) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '28px' }}>
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: <QrCode size={20} /> },
                  { id: 'Credit Card', label: 'Credit Card', icon: <CreditCard size={20} /> },
                  { id: 'Debit Card', label: 'Debit Card', icon: <CreditCard size={20} /> },
                  { id: 'Net Banking', label: 'Net Banking', icon: <Building2 size={20} /> },
                  { id: 'COD', label: 'Cash on Delivery', icon: <Banknote size={20} /> }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      padding: '16px 12px',
                      borderRadius: '14px',
                      border: paymentMethod === m.id ? '2px solid #C6923E' : '1.5px solid #EFE8DE',
                      background: paymentMethod === m.id ? 'rgba(198, 146, 62, 0.1)' : '#FAF7F2',
                      color: paymentMethod === m.id ? '#8C532B' : '#2A170E',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 700,
                      fontSize: '0.88rem'
                    }}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Specific Payment Inputs based on selected mode */}
              <div style={{
                background: '#FAF7F2',
                borderRadius: '18px',
                padding: '24px',
                border: '1px solid #EFE8DE',
                marginBottom: '28px'
              }}>
                {paymentMethod === 'UPI' && (
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#2A170E', marginBottom: '8px' }}>Pay via UPI App / VPA</h4>
                    <p style={{ fontSize: '0.82rem', color: '#73645C', marginBottom: '14px' }}>
                      Instant confirmation via Google Pay, PhonePe, Paytm or BHIM.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', maxWidth: '400px' }}>
                      <input
                        type="text"
                        placeholder="e.g. yourname@okaxis"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid #EFE8DE',
                          fontSize: '0.92rem'
                        }}
                      />
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 12px',
                        background: '#E8F5E9',
                        color: '#2E7D32',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}>
                        Verified
                      </span>
                    </div>
                  </div>
                )}

                {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <Lock size={16} color="#16A34A" />
                      <span style={{ fontSize: '0.85rem', color: '#16A34A', fontWeight: 600 }}>
                        256-Bit Encrypted Payment (Never stores raw card data)
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', maxWidth: '450px' }}>
                      <div>
                        <label className="form-label">Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          placeholder="4532 •••• •••• 8920"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                        <div>
                          <label className="form-label">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            maxLength={5}
                            placeholder="08/29"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label className="form-label">CVV</label>
                          <input
                            type="password"
                            maxLength={3}
                            placeholder="•••"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Net Banking' && (
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#2A170E', marginBottom: '8px' }}>Select Bank</h4>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1.5px solid #EFE8DE',
                        fontSize: '0.92rem',
                        maxWidth: '360px',
                        width: '100%'
                      }}
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'COD' && (
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#2A170E', marginBottom: '4px' }}>Cash on Delivery</h4>
                    <p style={{ fontSize: '0.85rem', color: '#73645C' }}>
                      Pay ₹{total} in cash or via UPI QR code directly to the delivery personnel upon delivery.
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation & Place Order CTA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #EFE8DE', paddingTop: '24px' }}>
                <button onClick={() => setCurrentStep(3)} className="btn-outline">
                  <ArrowLeft size={16} />
                  <span>Back to Summary</span>
                </button>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="btn-gold"
                  style={{ padding: '16px 36px', fontSize: '1.1rem' }}
                >
                  <ShieldCheck size={20} />
                  <span>{isSubmitting ? 'Securing Your Order...' : `Pay ₹${total} & Place Order`}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
