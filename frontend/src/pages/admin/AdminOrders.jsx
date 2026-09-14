import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw
} from 'lucide-react';
import { ordersAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import InvoiceModal from '../../components/InvoiceModal';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await ordersAPI.getAll({ status: statusFilter, search: searchTerm });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, { status: newStatus });
      showToast(`Order status updated to "${newStatus}"! Synced to customer timeline.`, 'success');
      fetchOrders();
    } catch (err) {
      showToast('Failed to update status: ' + err.message, 'error');
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#2A170E', marginBottom: '4px' }}>Order Management</h1>
          <p style={{ color: '#73645C', fontSize: '0.9rem' }}>
            Real-time kitchen order dispatching. Status transitions automatically update customer timelines!
          </p>
        </div>

        <button onClick={fetchOrders} className="btn-outline" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
          <RotateCcw size={15} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '16px 20px',
        border: '1px solid #EFE8DE',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '380px' }}>
          <input
            type="text"
            placeholder="Search by order ID, customer name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '9px 14px 9px 36px', borderRadius: '8px', border: '1.5px solid #EFE8DE', outline: 'none' }}
          />
          <Search size={16} color="#A4978E" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: '#73645C', fontWeight: 600 }}>Status:</span>
          {['all', 'Pending', 'Confirmed', 'Baking', 'Ready for Delivery', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: statusFilter === st ? '1.5px solid #C6923E' : '1px solid #EFE8DE',
                background: statusFilter === st ? 'rgba(198, 146, 62, 0.12)' : '#FAF7F2',
                color: statusFilter === st ? '#8C532B' : '#73645C'
              }}
            >
              {st === 'all' ? 'All Orders' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table (Section 28 of Spec) */}
      <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EFE8DE', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '2px solid #EFE8DE', textAlign: 'left', color: '#8C532B', fontSize: '0.78rem' }}>
                <th style={{ padding: '14px 16px' }}>ORDER ID</th>
                <th style={{ padding: '14px 16px' }}>CUSTOMER</th>
                <th style={{ padding: '14px 16px' }}>PRODUCT & QTY</th>
                <th style={{ padding: '14px 16px' }}>AMOUNT</th>
                <th style={{ padding: '14px 16px' }}>PAYMENT</th>
                <th style={{ padding: '14px 16px' }}>ORDER DATE</th>
                <th style={{ padding: '14px 16px' }}>DELIVERY SCHEDULE</th>
                <th style={{ padding: '14px 16px' }}>STATUS</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => (
                <tr key={ord.id} style={{ borderBottom: '1px solid #F4ECE1' }}>
                  {/* Order ID */}
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#2A170E' }}>
                    #{ord.orderNumber || ord.id}
                  </td>

                  {/* Customer */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#2A170E' }}>{ord.customerName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#73645C' }}>{ord.customerPhone}</div>
                  </td>

                  {/* Product & QTY */}
                  <td style={{ padding: '14px 16px' }}>
                    <div>
                      {ord.items?.[0]?.name} ({ord.items?.[0]?.weight}) x {ord.items?.[0]?.quantity}
                      {ord.items?.length > 1 && (
                        <span style={{ color: '#8C532B', fontSize: '0.78rem', display: 'block' }}>
                          +{ord.items.length - 1} more cake items
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Amount */}
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#2A170E' }}>
                    ₹{ord.total}
                  </td>

                  {/* Payment */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: ord.paymentStatus === 'Paid' ? '#E8F5E9' : '#FEF3C7',
                      color: ord.paymentStatus === 'Paid' ? '#2E7D32' : '#B45309'
                    }}>
                      {ord.paymentMethod} • {ord.paymentStatus}
                    </span>
                  </td>

                  {/* Order Date */}
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#73645C' }}>
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>

                  {/* Delivery Schedule */}
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem' }}>
                    <strong style={{ color: '#2A170E' }}>{ord.deliveryDate}</strong><br />
                    <span style={{ color: '#73645C' }}>{ord.deliveryTime}</span>
                  </td>

                  {/* Status Controller (Dynamic Sync) */}
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1.5px solid #EFE8DE',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        background: ord.orderStatus === 'Delivered'
                          ? '#E8F5E9'
                          : ord.orderStatus === 'Baking'
                          ? '#FEF3C7'
                          : ord.orderStatus === 'Cancelled'
                          ? '#FEE2E2'
                          : '#FFFFFF',
                        color: ord.orderStatus === 'Delivered'
                          ? '#2E7D32'
                          : ord.orderStatus === 'Cancelled'
                          ? '#DC2626'
                          : '#8C532B',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Baking">Baking</option>
                      <option value="Ready for Delivery">Ready for Delivery</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="btn-outline"
                        style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setInvoiceOrder(ord)}
                        style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #EFE8DE', background: '#FAF7F2', color: '#2A170E' }}
                        title="View invoice"
                      >
                        <FileText size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Inspection Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '36px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #EFE8DE'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#8C532B', fontWeight: 700 }}>ORDER INSPECTION</span>
                <h3 style={{ fontSize: '1.4rem', color: '#2A170E' }}>Order #{selectedOrder.orderNumber || selectedOrder.id}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="btn-outline" style={{ padding: '6px 14px' }}>
                Close
              </button>
            </div>

            {/* Address & Contact */}
            <div style={{ background: '#FAF7F2', borderRadius: '16px', padding: '18px', marginBottom: '20px', fontSize: '0.88rem' }}>
              <strong style={{ color: '#2A170E', display: 'block', marginBottom: '4px' }}>Delivery Address:</strong>
              <div>
                {selectedOrder.address?.name} • Phone: {selectedOrder.address?.phone}<br />
                {selectedOrder.address?.houseNo}, {selectedOrder.address?.street}<br />
                {selectedOrder.address?.area ? `${selectedOrder.address.area}, ` : ''}{selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '20px' }}>
              <strong style={{ color: '#2A170E', display: 'block', marginBottom: '10px' }}>Cakes Ordered:</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EFE8DE' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#2A170E' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#73645C' }}>
                        Weight: {item.weight} • Qty: {item.quantity} {item.messageOnCake ? `• Piped: "${item.messageOnCake}"` : ''}
                      </div>
                    </div>
                    <div style={{ fontWeight: 800 }}>₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.giftMessage && (
              <div style={{ background: '#FFF8E7', borderRadius: '12px', padding: '14px', marginBottom: '20px', fontSize: '0.85rem', color: '#8C532B' }}>
                <strong>Gift Card Note:</strong> "{selectedOrder.giftMessage}"
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #EFE8DE', paddingTop: '18px' }}>
              <button
                onClick={() => {
                  setInvoiceOrder(selectedOrder);
                  setSelectedOrder(null);
                }}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.85rem' }}
              >
                <FileText size={16} />
                <span>Open Printable Invoice</span>
              </button>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2A170E' }}>
                Total: ₹{selectedOrder.total}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
}
