import React from 'react';
import { X, Printer, Download, Cake, CheckCircle2 } from 'lucide-react';

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 4000,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        maxWidth: '750px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        padding: '36px',
        border: '1px solid #EFE8DE'
      }}>
        {/* Top Control Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          borderBottom: '1px solid #EFE8DE',
          paddingBottom: '16px'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <Printer size={16} />
              <span>Print / Save as PDF</span>
            </button>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#FAF7F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2A170E'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Invoice Printable Area */}
        <div id="printable-invoice">
          {/* Brand Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#2A170E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DFBA73'
                }}>
                  <Cake size={22} />
                </div>
                <h2 style={{ fontSize: '1.6rem', color: '#2A170E', margin: 0 }}>
                  Sweet<span style={{ color: '#C6923E' }}>Crumb</span>
                </h2>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#73645C' }}>
                Artisanal Luxury Bakery Pvt. Ltd.<br />
                42 Heritage Boulevard, Indiranagar, Bengaluru 560038<br />
                GSTIN: 29AABCS9824C1ZT | FSSAI: 11221334000452
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{
                background: '#FAF7F2',
                color: '#8C532B',
                padding: '4px 12px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'inline-block',
                marginBottom: '6px'
              }}>
                TAX INVOICE
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2A170E' }}>
                #{order.orderNumber || order.id}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#73645C' }}>
                Date: {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            padding: '16px',
            borderRadius: '12px',
            background: '#FAF7F2',
            marginBottom: '24px',
            fontSize: '0.85rem'
          }}>
            <div>
              <div style={{ fontWeight: 700, color: '#8C532B', marginBottom: '4px' }}>BILLED & DELIVERED TO:</div>
              <div style={{ fontWeight: 700, color: '#2A170E', fontSize: '0.95rem' }}>
                {order.customerName || order.address?.name}
              </div>
              <div style={{ color: '#73645C' }}>
                {order.address?.houseNo}, {order.address?.street}<br />
                {order.address?.area ? `${order.address.area}, ` : ''}{order.address?.city}, {order.address?.state} - {order.address?.pincode}<br />
                Phone: {order.customerPhone || order.address?.phone}<br />
                Email: {order.customerEmail}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, color: '#8C532B', marginBottom: '4px' }}>DELIVERY & PAYMENT:</div>
              <div style={{ color: '#2A170E' }}>
                <strong>Scheduled Date:</strong> {order.deliveryDate}<br />
                <strong>Time Slot:</strong> {order.deliveryTime}<br />
                <strong>Payment Mode:</strong> {order.paymentMethod}<br />
                <strong>Payment Status:</strong>{' '}
                <span style={{ color: order.paymentStatus === 'Paid' ? '#16A34A' : '#D97706', fontWeight: 700 }}>
                  {order.paymentStatus || 'Paid'}
                </span>
                <br />
                <strong>Order Status:</strong> {order.orderStatus}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EFE8DE', textAlign: 'left', color: '#8C532B', fontSize: '0.8rem' }}>
                <th style={{ padding: '10px 8px' }}>ITEM & SPECIFICATIONS</th>
                <th style={{ padding: '10px 8px', textAlign: 'center' }}>WEIGHT</th>
                <th style={{ padding: '10px 8px', textAlign: 'center' }}>QTY</th>
                <th style={{ padding: '10px 8px', textAlign: 'right' }}>UNIT PRICE</th>
                <th style={{ padding: '10px 8px', textAlign: 'right' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F4ECE1' }}>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ fontWeight: 700, color: '#2A170E' }}>{item.name}</div>
                    {item.messageOnCake && (
                      <div style={{ fontSize: '0.78rem', color: '#73645C', fontStyle: 'italic' }}>
                        Message: "{item.messageOnCake}"
                      </div>
                    )}
                    {item.isCustom && item.customDetails && (
                      <div style={{ fontSize: '0.75rem', color: '#8C532B' }}>
                        Shape: {item.customDetails.shape} • Flavour: {item.customDetails.flavour} • Toppings: {item.customDetails.toppings?.join(', ')}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>{item.weight || '500g'}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 700 }}>{item.quantity}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>₹{item.price}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 700 }}>₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pricing Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
            <div style={{ width: '280px', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#73645C' }}>
                <span>Subtotal:</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: 600 }}>
                  <span>Coupon Discount ({order.couponApplied || 'PROMO'}):</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#73645C' }}>
                <span>Delivery Fee:</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#73645C' }}>
                <span>Estimated Tax (GST 5%):</span>
                <span>₹{order.tax}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '2px solid #2A170E',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#2A170E'
              }}>
                <span>Total Amount:</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Thank You note */}
          <div style={{
            borderTop: '1px dashed #EFE8DE',
            paddingTop: '18px',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: '#73645C'
          }}>
            <p style={{ fontWeight: 600, color: '#8C532B', marginBottom: '4px' }}>
              Thank you for celebrating with SweetCrumb!
            </p>
            <p>
              Cakes are freshly crafted with perishable gourmet dairy ingredients. Please refrigerate upon delivery and consume within 48 hours for optimal taste and texture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
