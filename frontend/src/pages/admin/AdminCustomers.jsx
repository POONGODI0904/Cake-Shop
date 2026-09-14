import React, { useState, useEffect } from 'react';
import { Users, Search, Ban, CheckCircle, Trash2, Eye, ShieldCheck, Mail, Phone } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { showToast } = useToast();

  const fetchCustomers = async () => {
    try {
      const res = await adminAPI.getCustomers();
      setCustomers(res.data.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (customer) => {
    const next = customer.status === 'blocked' ? 'active' : 'blocked';
    try {
      await adminAPI.toggleCustomerStatus(customer.id, next);
      showToast(`Customer status updated to ${next}`, 'success');
      fetchCustomers();
    } catch (err) {
      showToast('Failed to update status: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete customer "${name}"?`)) {
      try {
        await adminAPI.deleteCustomer(id);
        showToast('Customer account deleted.', 'info');
        fetchCustomers();
      } catch (err) {
        showToast('Failed to delete: ' + err.message, 'error');
      }
    }
  };

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#2A170E', marginBottom: '4px' }}>Customer Management</h1>
          <p style={{ color: '#73645C', fontSize: '0.9rem' }}>
            Registered customer directory, order volumes, spending analytics, and status control.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '16px 20px',
        border: '1px solid #EFE8DE',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ position: 'relative', width: '340px' }}>
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '9px 14px 9px 36px', borderRadius: '8px', border: '1.5px solid #EFE8DE', outline: 'none' }}
          />
          <Search size={16} color="#A4978E" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
        <span style={{ fontSize: '0.85rem', color: '#73645C', fontWeight: 600 }}>
          {filtered.length} Registered Accounts
        </span>
      </div>

      {/* Customers Table (Section 29 of Spec) */}
      <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EFE8DE', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '2px solid #EFE8DE', textAlign: 'left', color: '#8C532B', fontSize: '0.78rem' }}>
                <th style={{ padding: '14px 16px' }}>CUSTOMER</th>
                <th style={{ padding: '14px 16px' }}>CONTACT</th>
                <th style={{ padding: '14px 16px' }}>REGISTRATION DATE</th>
                <th style={{ padding: '14px 16px' }}>TOTAL ORDERS</th>
                <th style={{ padding: '14px 16px' }}>TOTAL SPENDING</th>
                <th style={{ padding: '14px 16px' }}>ACCOUNT STATUS</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cust) => (
                <tr key={cust.id} style={{ borderBottom: '1px solid #F4ECE1' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: '#FAF7F2',
                        border: '1px solid #EFE8DE',
                        color: '#8C532B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700
                      }}>
                        {cust.name?.[0] || 'C'}
                      </div>
                      <div style={{ fontWeight: 700, color: '#2A170E' }}>{cust.name}</div>
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ color: '#2A170E' }}>{cust.email}</div>
                    <div style={{ fontSize: '0.78rem', color: '#73645C' }}>{cust.phone || 'No phone'}</div>
                  </td>

                  <td style={{ padding: '14px 16px', color: '#73645C', fontSize: '0.82rem' }}>
                    {new Date(cust.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>

                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#2A170E' }}>
                    {cust.totalOrders || 0} orders
                  </td>

                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#C6923E' }}>
                    ₹{cust.totalSpending?.toLocaleString() || 0}
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: cust.status === 'blocked' ? '#FEE2E2' : '#E8F5E9',
                      color: cust.status === 'blocked' ? '#DC2626' : '#2E7D32'
                    }}>
                      {cust.status === 'blocked' ? 'Blocked' : 'Active'}
                    </span>
                  </td>

                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="btn-outline"
                        style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(cust)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: cust.status === 'blocked' ? '1px solid #86EFAC' : '1px solid #FDA4AF',
                          background: cust.status === 'blocked' ? '#F0FDF4' : '#FFF1F2',
                          color: cust.status === 'blocked' ? '#166534' : '#9F1239',
                          fontSize: '0.78rem',
                          fontWeight: 600
                        }}
                      >
                        {cust.status === 'blocked' ? 'Unblock' : 'Block'}
                      </button>
                      <button
                        onClick={() => handleDelete(cust.id, cust.name)}
                        style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #FDA4AF', color: '#E11D48' }}
                        title="Delete user"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Inspection Modal */}
      {selectedCustomer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
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
            maxWidth: '520px',
            width: '100%',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: '1.4rem', color: '#2A170E', marginBottom: '14px' }}>Customer Profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', marginBottom: '24px' }}>
              <div><strong>Name:</strong> {selectedCustomer.name}</div>
              <div><strong>Email:</strong> {selectedCustomer.email}</div>
              <div><strong>Phone:</strong> {selectedCustomer.phone || 'N/A'}</div>
              <div><strong>Lifetime Orders:</strong> {selectedCustomer.totalOrders || 0}</div>
              <div><strong>Lifetime Spend:</strong> ₹{selectedCustomer.totalSpending || 0}</div>
              <div><strong>Status:</strong> {selectedCustomer.status}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedCustomer(null)} className="btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
