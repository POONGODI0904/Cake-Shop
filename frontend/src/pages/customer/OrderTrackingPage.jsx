import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  ChefHat,
  Sparkles,
  MapPin,
  Phone,
  FileText,
  AlertCircle
} from 'lucide-react';
import { ordersAPI } from '../../services/api';
import InvoiceModal from '../../components/InvoiceModal';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  const fetchOrder = async () => {
    setIsRefreshing(true);
    try {
      const res = await ordersAPI.getById(orderId);
      setOrder(res.data.order);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found or invalid tracking ID');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 8 seconds for live sync when Admin changes status
    const interval = setInterval(fetchOrder, 8000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #EFE8DE', borderTopColor: '#C6923E', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ background: '#FAF7F2', minHeight: '80vh', padding: '80px 20px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <AlertCircle size={48} color="#E11D48" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '2rem', color: '#2A170E', marginBottom: '8px' }}>Order Not Found</h2>
          <p style={{ color: '#73645C', marginBottom: '24px' }}>{error || 'Unable to locate order tracking data.'}</p>
          <Link to="/" className="btn-primary">Return Home</Link>
        </div>
      </div>
    );
  }

  // Section 20 Timeline definition
  const timelineStages = [
    { name: 'Order Placed', desc: 'Received ticket in SweetCrumb patisserie system', icon: <Package size={20} /> },
    { name: 'Order Confirmed', desc: 'Ingredients inspected & allocated to chef', icon: <CheckCircle2 size={20} /> },
    { name: 'Baking', desc: 'Master Chef is sponge-baking & whipping ganache', icon: <ChefHat size={20} /> },
    { name: 'Ready for Delivery', desc: 'Quality checked, boxed & golden ribbon sealed', icon: <Sparkles size={20} /> },
    { name: 'Out for Delivery', desc: 'In temperature-controlled refrigerated van', icon: <Truck size={20} /> },
    { name: 'Delivered', desc: 'Handed over fresh to celebration venue', icon: <CheckCircle2 size={20} /> }
  ];

  const currentStageIndex = timelineStages.findIndex(
    (s) => s.name.toLowerCase() === order.orderStatus.toLowerCase()
  );

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        
        {/* Header with Live Sync Status Indicator */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
              <span style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Live Tracking Sync Active
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', color: '#2A170E' }}>
              Order #{order.orderNumber || order.id}
            </h1>
            <p style={{ color: '#73645C', fontSize: '0.9rem' }}>
              Ordered on {new Date(order.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={fetchOrder}
              disabled={isRefreshing}
              className="btn-outline"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <RotateCcw size={15} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh Status'}</span>
            </button>

            <button
              onClick={() => setShowInvoice(true)}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <FileText size={16} />
              <span>View Invoice</span>
            </button>
          </div>
        </div>

        {/* Current Status Highlight Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #2A170E 0%, #4A2818 100%)',
          borderRadius: '24px',
          padding: '28px 36px',
          color: '#FFFFFF',
          marginBottom: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          boxShadow: '0 12px 30px rgba(42, 23, 14, 0.15)'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#DFBA73', fontWeight: 700, letterSpacing: '1px' }}>
              CURRENT KITCHEN & LOGISTICS STATUS:
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px', fontFamily: 'var(--font-heading)' }}>
              {order.orderStatus}
            </div>
            <p style={{ color: '#D5C7BD', fontSize: '0.88rem', marginTop: '4px' }}>
              Scheduled for <strong>{order.deliveryDate}</strong> during <strong>{order.deliveryTime}</strong>
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '14px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(223, 186, 115, 0.3)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.78rem', color: '#DFBA73' }}>Total Amount</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹{order.total}</div>
            <div style={{ fontSize: '0.78rem', color: '#86EFAC' }}>{order.paymentMethod} • {order.paymentStatus}</div>
          </div>
        </div>

        {/* Vertical Timeline Card (Section 20 of Spec) */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid #EFE8DE',
          boxShadow: '0 4px 20px rgba(42, 23, 14, 0.04)',
          marginBottom: '40px'
        }}>
          <h3 style={{ fontSize: '1.3rem', color: '#2A170E', marginBottom: '28px' }}>
            Preparation & Delivery Progress
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
            {timelineStages.map((stage, idx) => {
              const isPastOrCurrent = currentStageIndex >= idx;
              const isCurrent = currentStageIndex === idx;

              return (
                <div key={stage.name} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                  {/* Vertical connecting line */}
                  {idx < timelineStages.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: '21px',
                      top: '42px',
                      bottom: '-32px',
                      width: '3px',
                      background: currentStageIndex > idx ? '#16A34A' : '#EFE8DE',
                      transition: 'background 0.4s'
                    }} />
                  )}

                  {/* Circle Icon */}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: isPastOrCurrent
                      ? (isCurrent ? '#C6923E' : '#16A34A')
                      : '#FAF7F2',
                    color: isPastOrCurrent ? '#FFFFFF' : '#A4978E',
                    border: isPastOrCurrent ? 'none' : '2px solid #EFE8DE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    boxShadow: isCurrent ? '0 0 15px rgba(198, 146, 62, 0.4)' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    {stage.icon}
                  </div>

                  {/* Stage Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: isPastOrCurrent ? '#2A170E' : '#A4978E'
                      }}>
                        {stage.name}
                      </h4>
                      {isCurrent && (
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#C6923E',
                          background: 'rgba(198, 146, 62, 0.12)',
                          padding: '2px 10px',
                          borderRadius: '999px'
                        }}>
                          In Progress
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: isPastOrCurrent ? '#73645C' : '#C3B4A8', marginTop: '2px' }}>
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cake Items In This Order */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '28px',
          border: '1px solid #EFE8DE',
          marginBottom: '40px'
        }}>
          <h3 style={{ fontSize: '1.15rem', color: '#2A170E', marginBottom: '16px' }}>
            Cakes in this Celebration ({order.items?.length || 0})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(order.items || []).map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#FAF7F2'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: '#2A170E', fontSize: '0.92rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#73645C' }}>
                      {item.weight} • Qty: {item.quantity} {item.messageOnCake ? `• "${item.messageOnCake}"` : ''}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 800, color: '#2A170E', fontSize: '0.95rem' }}>
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <InvoiceModal
          order={order}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
}
