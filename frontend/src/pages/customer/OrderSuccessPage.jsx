import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, PackageCheck, FileText, ArrowRight, Home, Calendar, Clock, MapPin } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import InvoiceModal from '../../components/InvoiceModal';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [showInvoice, setShowInvoice] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#DFBA73', '#C6923E', '#E68385', '#4A2818', '#2A170E']
      });
    } catch (e) {
      console.log('Confetti loaded');
    }
  }, []);

  // Fetch order if not passed via route state
  useEffect(() => {
    if (!order && orderId) {
      ordersAPI.getById(orderId)
        .then((res) => {
          setOrder(res.data.order);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [orderId, order]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #EFE8DE', borderTopColor: '#C6923E', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const orderData = order || {
    id: orderId || 'SWT-ORD-2026-001',
    orderNumber: orderId || 'SWT-ORD-2026-001',
    customerName: 'Valued Customer',
    deliveryDate: 'Tomorrow',
    deliveryTime: 'Evening (4 PM - 8 PM)',
    paymentStatus: 'Paid',
    total: 1289,
    items: []
  };

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', padding: '60px 0 100px' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        
        {/* Celebration Banner Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '28px',
          padding: '48px 40px',
          border: '1px solid #EFE8DE',
          boxShadow: '0 12px 40px rgba(42, 23, 14, 0.08)',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          {/* Animated Green / Gold Checkmark Icon */}
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16A34A',
            marginBottom: '20px',
            boxShadow: '0 8px 25px rgba(22, 163, 74, 0.25)'
          }}>
            <CheckCircle2 size={48} />
          </div>

          <h1 style={{ fontSize: '2.4rem', color: '#2A170E', marginBottom: '8px' }}>
            Order Placed Successfully!
          </h1>
          <p style={{ color: '#73645C', fontSize: '1.05rem', marginBottom: '24px' }}>
            Thank you, <strong>{orderData.customerName}</strong>! Our kitchen has received your ticket and the ovens are being pre-heated.
          </p>

          {/* Key Receipt Chips */}
          <div style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            background: '#FAF7F2',
            padding: '12px 24px',
            borderRadius: '999px',
            border: '1px solid #EFE8DE',
            marginBottom: '32px'
          }}>
            <span style={{ fontSize: '0.88rem', color: '#73645C' }}>
              Order No: <strong style={{ color: '#2A170E' }}>{orderData.orderNumber || orderData.id}</strong>
            </span>
            <span style={{ color: '#EFE8DE' }}>|</span>
            <span style={{ fontSize: '0.88rem', color: '#73645C' }}>
              Total: <strong style={{ color: '#C6923E' }}>₹{orderData.total}</strong>
            </span>
            <span style={{ color: '#EFE8DE' }}>|</span>
            <span style={{ fontSize: '0.88rem', color: '#16A34A', fontWeight: 700 }}>
              Payment: {orderData.paymentStatus}
            </span>
          </div>

          {/* Action Buttons: Track Order & Download Invoice */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            <Link
              to={`/track-order/${orderData.id || orderData.orderNumber}`}
              className="btn-gold"
              style={{ padding: '14px 28px', fontSize: '0.98rem' }}
            >
              <PackageCheck size={18} />
              <span>Track Live Order Status</span>
            </Link>

            <button
              onClick={() => setShowInvoice(true)}
              className="btn-outline"
              style={{ padding: '14px 28px', fontSize: '0.98rem' }}
            >
              <FileText size={18} />
              <span>Download Tax Invoice (PDF)</span>
            </button>
          </div>
        </div>

        {/* Order Details Preview Box */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid #EFE8DE'
        }}>
          <h3 style={{ fontSize: '1.25rem', color: '#2A170E', marginBottom: '18px' }}>
            Delivery Snapshot
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', fontSize: '0.9rem', color: '#73645C' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Calendar size={18} color="#8C532B" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#2A170E', display: 'block' }}>Delivery Date</strong>
                <span>{orderData.deliveryDate}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Clock size={18} color="#8C532B" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#2A170E', display: 'block' }}>Time Slot</strong>
                <span>{orderData.deliveryTime}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <MapPin size={18} color="#8C532B" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#2A170E', display: 'block' }}>Delivering to</strong>
                <span>{orderData.address?.street || 'Indiranagar'}, {orderData.address?.city || 'Bengaluru'}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '28px', textAlign: 'center' }}>
            <Link to="/" style={{ color: '#8C532B', fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Home size={16} />
              <span>Back to SweetCrumb Homepage</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <InvoiceModal
          order={orderData}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
}
