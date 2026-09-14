import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  MessageSquare,
  Bell,
  Lock,
  LogOut,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ordersAPI, authAPI } from '../../services/api';
import InvoiceModal from '../../components/InvoiceModal';

export default function UserDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { user, logout, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Profile Edit
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Change Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Address
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: '',
    phone: '',
    houseNo: '',
    street: '',
    area: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '',
    landmark: ''
  });

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const res = await ordersAPI.getAll();
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchUserOrders();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await authAPI.updateProfile({ name: profileName, phone: profilePhone });
      await refreshProfile();
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      showToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await authAPI.addAddress(newAddr);
      await refreshProfile();
      showToast('Address added successfully!', 'success');
      setShowAddressModal(false);
      setNewAddr({ name: '', phone: '', houseNo: '', street: '', area: '', city: 'Bengaluru', state: 'Karnataka', pincode: '', landmark: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add address', 'error');
    }
  };

  const handleDeleteAddress = async (addrId) => {
    try {
      await authAPI.deleteAddress(addrId);
      await refreshProfile();
      showToast('Address deleted', 'info');
    } catch (err) {
      showToast('Failed to delete address', 'error');
    }
  };

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container">
        
        {/* User Top Welcome Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2A170E 0%, #4A2818 100%)',
          borderRadius: '24px',
          padding: '36px 40px',
          color: '#FFFFFF',
          marginBottom: '36px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#DFBA73',
              color: '#2A170E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 800
            }}>
              {user?.name?.[0] || 'C'}
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#DFBA73', fontWeight: 700, letterSpacing: '1px' }}>
                CUSTOMER DASHBOARD
              </span>
              <h1 style={{ fontSize: '2rem', color: '#FFFFFF', margin: '2px 0' }}>
                Welcome back, {user?.name || 'Sweet Lover'}!
              </h1>
              <p style={{ color: '#D5C7BD', fontSize: '0.88rem' }}>{user?.email} • {user?.phone || 'Member'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/cakes')}
              className="btn-gold"
              style={{ padding: '10px 22px', fontSize: '0.88rem' }}
            >
              Order New Cake
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="btn-outline"
              style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)', padding: '10px 18px', fontSize: '0.88rem' }}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* 2-Column Dashboard Layout (Section 16 of Spec) */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }} className="account-layout">
          
          {/* Dashboard Left Sidebar Tabs */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '16px',
            border: '1px solid #EFE8DE',
            height: 'fit-content'
          }}>
            {[
              { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
              { id: 'orders', label: 'My Orders', icon: <Package size={18} /> },
              { id: 'addresses', label: 'Saved Addresses', icon: <MapPin size={18} /> },
              { id: 'payments', label: 'Payment History', icon: <CreditCard size={18} /> },
              { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
              { id: 'security', label: 'Change Password', icon: <Lock size={18} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '0.92rem',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  background: activeTab === tab.id ? 'rgba(198, 146, 62, 0.12)' : 'transparent',
                  color: activeTab === tab.id ? '#8C532B' : '#2A170E',
                  marginBottom: '4px',
                  textAlign: 'left'
                }}
              >
                <span style={{ color: activeTab === tab.id ? '#C6923E' : '#73645C' }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Right Tab Contents */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '36px',
            border: '1px solid #EFE8DE'
          }}>
            
            {/* TAB 1: PROFILE */}
            {activeTab === 'profile' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#2A170E', marginBottom: '6px' }}>Personal Profile</h3>
                <p style={{ color: '#73645C', fontSize: '0.88rem', marginBottom: '24px' }}>
                  Manage your personal contact details and communication settings.
                </p>

                <form onSubmit={handleUpdateProfile} style={{ maxWidth: '480px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      disabled
                      className="form-input"
                      value={user?.email || ''}
                      style={{ background: '#FAF7F2', cursor: 'not-allowed' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#73645C', marginTop: '4px', display: 'block' }}>
                      Email address is linked to your account credentials.
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="btn-primary"
                    style={{ padding: '12px 28px' }}
                  >
                    <span>{isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Details'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: MY ORDERS */}
            {activeTab === 'orders' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', color: '#2A170E' }}>My Order History ({orders.length})</h3>
                    <p style={{ color: '#73645C', fontSize: '0.88rem' }}>Live tracking and downloadable invoices for all cakes.</p>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FAF7F2', borderRadius: '16px' }}>
                    <Package size={36} color="#C6923E" style={{ margin: '0 auto 10px' }} />
                    <h4 style={{ fontSize: '1.15rem', color: '#2A170E' }}>No Orders Found</h4>
                    <p style={{ color: '#73645C', fontSize: '0.88rem', margin: '6px 0 16px' }}>You haven't placed any cake orders yet.</p>
                    <Link to="/cakes" className="btn-primary" style={{ padding: '10px 24px' }}>Order Now</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        style={{
                          borderRadius: '16px',
                          border: '1px solid #EFE8DE',
                          padding: '24px',
                          background: '#FAF7F2'
                        }}
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '10px' }}>
                          <div>
                            <span style={{ fontSize: '0.78rem', color: '#8C532B', fontWeight: 700 }}>ORDER NUMBER</span>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2A170E' }}>
                              #{ord.orderNumber || ord.id}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#73645C' }}>
                              Placed on {new Date(ord.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                              padding: '6px 14px',
                              borderRadius: '999px',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              background: ord.orderStatus === 'Delivered' ? '#E8F5E9' : 'rgba(198, 146, 62, 0.15)',
                              color: ord.orderStatus === 'Delivered' ? '#2E7D32' : '#8C532B'
                            }}>
                              ● {ord.orderStatus}
                            </span>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2A170E' }}>
                              ₹{ord.total}
                            </div>
                          </div>
                        </div>

                        {/* Order items snapshot */}
                        <div style={{ borderTop: '1px solid #EFE8DE', borderBottom: '1px solid #EFE8DE', padding: '14px 0', margin: '14px 0' }}>
                          {(ord.items || []).map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                              <span>{item.name} ({item.weight}) x {item.quantity}</span>
                              <span style={{ fontWeight: 700 }}>₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontSize: '0.82rem', color: '#73645C' }}>
                            Delivery: <strong>{ord.deliveryDate}</strong> ({ord.deliveryTime})
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => setSelectedInvoiceOrder(ord)}
                              className="btn-outline"
                              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                            >
                              <FileText size={14} />
                              <span>Invoice</span>
                            </button>
                            <Link
                              to={`/track-order/${ord.id || ord.orderNumber}`}
                              className="btn-gold"
                              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                            >
                              Track Order →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', color: '#2A170E' }}>Saved Delivery Addresses</h3>
                    <p style={{ color: '#73645C', fontSize: '0.88rem' }}>Manage your home, office, and celebration addresses.</p>
                  </div>
                  <button onClick={() => setShowAddressModal(true)} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                    <Plus size={16} />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {(user?.addresses || []).map((addr) => (
                    <div
                      key={addr.id}
                      style={{
                        padding: '20px',
                        borderRadius: '16px',
                        background: '#FAF7F2',
                        border: '1px solid #EFE8DE',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 800, color: '#2A170E' }}>{addr.name}</div>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          style={{ color: '#E11D48', padding: '4px' }}
                          title="Delete address"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#73645C', lineHeight: 1.5 }}>
                        {addr.houseNo}, {addr.street}<br />
                        {addr.area ? `${addr.area}, ` : ''}{addr.city}, {addr.state} - <strong>{addr.pincode}</strong><br />
                        Phone: {addr.phone}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Address Modal Form */}
                {showAddressModal && (
                  <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    padding: '20px'
                  }}>
                    <div style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '32px',
                      maxWidth: '520px',
                      width: '100%',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
                    }}>
                      <h3 style={{ fontSize: '1.3rem', color: '#2A170E', marginBottom: '16px' }}>Add New Delivery Address</h3>
                      <form onSubmit={handleAddAddress}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                          <input
                            type="text"
                            required
                            placeholder="Recipient Name"
                            className="form-input"
                            value={newAddr.name}
                            onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                          />
                          <input
                            type="tel"
                            required
                            placeholder="Phone Number"
                            className="form-input"
                            value={newAddr.phone}
                            onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                          />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="House / Flat / Door No"
                          className="form-input"
                          style={{ marginBottom: '12px' }}
                          value={newAddr.houseNo}
                          onChange={(e) => setNewAddr({ ...newAddr, houseNo: e.target.value })}
                        />
                        <input
                          type="text"
                          required
                          placeholder="Street Address"
                          className="form-input"
                          style={{ marginBottom: '12px' }}
                          value={newAddr.street}
                          onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                          <input
                            type="text"
                            required
                            placeholder="City"
                            className="form-input"
                            value={newAddr.city}
                            onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                          />
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="Pincode (e.g. 560038)"
                            className="form-input"
                            value={newAddr.pincode}
                            onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <button
                            type="button"
                            onClick={() => setShowAddressModal(false)}
                            className="btn-outline"
                          >
                            Cancel
                          </button>
                          <button type="submit" className="btn-primary">
                            Save Address
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PAYMENT HISTORY */}
            {activeTab === 'payments' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#2A170E', marginBottom: '6px' }}>Payment History</h3>
                <p style={{ color: '#73645C', fontSize: '0.88rem', marginBottom: '24px' }}>Records of completed transactions.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '14px',
                        background: '#FAF7F2',
                        border: '1px solid #EFE8DE',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#2A170E' }}>Payment for Order #{ord.orderNumber || ord.id}</div>
                        <div style={{ fontSize: '0.8rem', color: '#73645C' }}>
                          {new Date(ord.createdAt).toLocaleDateString()} • Mode: {ord.paymentMethod}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: '#2A170E' }}>₹{ord.total}</div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A' }}>
                          ✓ {ord.paymentStatus || 'Successful'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#2A170E', marginBottom: '6px' }}>Notification Center</h3>
                <p style={{ color: '#73645C', fontSize: '0.88rem', marginBottom: '24px' }}>Real-time updates regarding your cake orders and exclusive coupons.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '16px', borderRadius: '12px', background: '#F0FDF4', border: '1px solid #86EFAC', display: 'flex', gap: '12px' }}>
                    <CheckCircle2 size={20} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#166534', display: 'block' }}>Order Successfully Received</strong>
                      <span style={{ fontSize: '0.85rem', color: '#166534' }}>Your cake order ticket has been assigned to our Indiranagar pastry chef.</span>
                    </div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '12px', background: '#FEF3C7', border: '1px solid #FCD34D', display: 'flex', gap: '12px' }}>
                    <Bell size={20} color="#B45309" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#B45309', display: 'block' }}>VIP Promo Code Available</strong>
                      <span style={{ fontSize: '0.85rem', color: '#B45309' }}>Use coupon code <strong>SWEETGOLD</strong> for 15% discount on all orders above ₹999.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: CHANGE PASSWORD */}
            {activeTab === 'security' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#2A170E', marginBottom: '6px' }}>Account Security</h3>
                <p style={{ color: '#73645C', fontSize: '0.88rem', marginBottom: '24px' }}>Update your password to keep your SweetCrumb account secure.</p>

                <form onSubmit={handleChangePassword} style={{ maxWidth: '420px' }}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      required
                      className="form-input"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password (at least 6 chars)</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      className="form-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      className="form-input"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Modal Preview */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {/* Mobile styling */}
      <style>{`
        @media (max-width: 820px) {
          .account-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
