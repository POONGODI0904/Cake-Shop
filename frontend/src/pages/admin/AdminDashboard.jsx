import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  Cake,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  Eye
} from 'lucide-react';
import { adminAPI, ordersAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchStats = async () => {
    try {
      const res = await adminAPI.getStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, { status: newStatus });
      showToast(`Order status updated to "${newStatus}"! Synced to Customer Tracking.`, 'success');
      fetchStats();
    } catch (err) {
      showToast('Failed to update status: ' + err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #EFE8DE', borderTopColor: '#C6923E', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#73645C' }}>Loading real-time executive metrics...</p>
      </div>
    );
  }

  const metrics = stats?.metrics || {
    totalSales: 0,
    todaySales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockCount: 0
  };

  return (
    <div>
      {/* Page Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', color: '#2A170E', marginBottom: '4px' }}>Dashboard Overview</h1>
        <p style={{ color: '#73645C', fontSize: '0.9rem' }}>Real-time sales, order fulfillment, and bakery analytics.</p>
      </div>

      {/* 8 Statistics Metric Cards (Section 24 of Spec) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        {/* Total Sales */}
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #EFE8DE', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: '#73645C', fontWeight: 600 }}>TOTAL SALES</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(198, 146, 62, 0.12)', color: '#C6923E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2A170E' }}>₹{metrics.totalSales.toLocaleString()}</div>
          <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: '4px' }}>
            <TrendingUp size={12} /> +18.4% this month
          </span>
        </div>

        {/* Today's Sales */}
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #EFE8DE', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: '#73645C', fontWeight: 600 }}>TODAY'S SALES</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(46, 125, 50, 0.12)', color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2A170E' }}>₹{metrics.todaySales.toLocaleString()}</div>
          <span style={{ fontSize: '0.75rem', color: '#73645C' }}>Fresh incoming orders</span>
        </div>

        {/* Total Orders */}
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #EFE8DE', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: '#73645C', fontWeight: 600 }}>TOTAL ORDERS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FAF7F2', color: '#8C532B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2A170E' }}>{metrics.totalOrders}</div>
          <span style={{ fontSize: '0.75rem', color: '#8C532B', fontWeight: 600 }}>Lifetime fulfillment</span>
        </div>

        {/* Pending Orders */}
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #EFE8DE', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: '#73645C', fontWeight: 600 }}>IN PROGRESS / PENDING</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D97706' }}>{metrics.pendingOrders}</div>
          <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700 }}>In Baking & Dispatch</span>
        </div>

        {/* Completed Orders */}
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #EFE8DE', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: '#73645C', fontWeight: 600 }}>DELIVERED ORDERS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16A34A' }}>{metrics.completedOrders}</div>
          <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600 }}>Successfully delivered</span>
        </div>

        {/* Total Customers */}
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #EFE8DE', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: '#73645C', fontWeight: 600 }}>TOTAL CUSTOMERS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FAF7F2', color: '#2A170E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2A170E' }}>{metrics.totalCustomers}</div>
          <span style={{ fontSize: '0.75rem', color: '#73645C' }}>Registered clientele</span>
        </div>

        {/* Total Products */}
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #EFE8DE', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: '#73645C', fontWeight: 600 }}>CATALOG CAKES</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FAF7F2', color: '#C6923E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cake size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2A170E' }}>{metrics.totalProducts}</div>
          <span style={{ fontSize: '0.75rem', color: '#8C532B', fontWeight: 600 }}>Active in storefront</span>
        </div>

        {/* Low Stock Products */}
        <div style={{
          background: metrics.lowStockCount > 0 ? '#FFF1F2' : '#FFFFFF',
          padding: '20px',
          borderRadius: '18px',
          border: metrics.lowStockCount > 0 ? '1.5px solid #FDA4AF' : '1px solid #EFE8DE',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: metrics.lowStockCount > 0 ? '#9F1239' : '#73645C', fontWeight: 700 }}>
              LOW STOCK CAKES
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFE4E6', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#E11D48' }}>{metrics.lowStockCount}</div>
          <Link to="/admin/inventory" style={{ fontSize: '0.75rem', color: '#E11D48', fontWeight: 700, textDecoration: 'underline' }}>
            Restock Inventory →
          </Link>
        </div>
      </div>

      {/* Animated Charts Section (Section 24 of Spec) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px', marginBottom: '36px' }}>
        
        {/* Monthly Revenue Graph */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #EFE8DE', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#2A170E' }}>Monthly Revenue Trends</h3>
              <p style={{ fontSize: '0.8rem', color: '#73645C' }}>Last 6 months revenue performance (₹)</p>
            </div>
            <span className="badge-gold">Revenue (₹)</span>
          </div>

          {/* Bar Chart Representation */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px' }}>
            {(stats?.monthlyRevenue || []).map((m, idx) => {
              const maxRev = 120000;
              const heightPercent = Math.min(100, Math.max(15, Math.round((m.revenue / maxRev) * 100)));
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8C532B' }}>
                    ₹{Math.round(m.revenue / 1000)}k
                  </div>
                  <div
                    style={{
                      width: '32px',
                      height: `${heightPercent}%`,
                      background: idx === 5
                        ? 'linear-gradient(180deg, #DFBA73 0%, #C6923E 100%)'
                        : 'linear-gradient(180deg, #4A2818 0%, #2A170E 100%)',
                      borderRadius: '8px 8px 0 0',
                      transition: 'height 0.6s ease'
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#73645C', fontWeight: 600 }}>{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Cakes Chart */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #EFE8DE', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#2A170E' }}>Top-Selling Cakes</h3>
              <p style={{ fontSize: '0.8rem', color: '#73645C' }}>Highest demand artisan flavours</p>
            </div>
            <span className="badge-gold">Top 5</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(stats?.topSelling || []).map((cake, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#2A170E' }}>{idx + 1}. {cake.name}</span>
                  <span style={{ color: '#8C532B', fontWeight: 700 }}>{cake.count} orders</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#FAF7F2', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(100, (cake.count / 30) * 100)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #DFBA73 0%, #C6923E 100%)',
                    borderRadius: '999px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders with Instant Status Updater (Section 28) */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid #EFE8DE',
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#2A170E' }}>Recent Orders (Instant Status Sync)</h3>
            <p style={{ fontSize: '0.82rem', color: '#73645C' }}>
              Changes made here immediately update the customer's live Order Tracking timeline!
            </p>
          </div>
          <Link to="/admin/orders" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <span>Manage All Orders</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EFE8DE', textAlign: 'left', color: '#8C532B', fontSize: '0.78rem' }}>
                <th style={{ padding: '12px 10px' }}>ORDER ID</th>
                <th style={{ padding: '12px 10px' }}>CUSTOMER</th>
                <th style={{ padding: '12px 10px' }}>ITEMS</th>
                <th style={{ padding: '12px 10px' }}>AMOUNT</th>
                <th style={{ padding: '12px 10px' }}>DELIVERY DATE</th>
                <th style={{ padding: '12px 10px' }}>STATUS CONTROLLER</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentOrders || []).map((ord) => (
                <tr key={ord.id} style={{ borderBottom: '1px solid #F4ECE1' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 700, color: '#2A170E' }}>
                    #{ord.orderNumber || ord.id}
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ fontWeight: 600 }}>{ord.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#73645C' }}>{ord.customerPhone}</div>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    {ord.items?.[0]?.name} {ord.items?.length > 1 ? `+${ord.items.length - 1} more` : ''}
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 800 }}>
                    ₹{ord.total}
                  </td>
                  <td style={{ padding: '12px 10px', fontSize: '0.82rem', color: '#73645C' }}>
                    {ord.deliveryDate}
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #EFE8DE',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        background: ord.orderStatus === 'Delivered'
                          ? '#E8F5E9'
                          : ord.orderStatus === 'Baking'
                          ? '#FEF3C7'
                          : '#FFFFFF',
                        color: ord.orderStatus === 'Delivered' ? '#2E7D32' : '#8C532B',
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
