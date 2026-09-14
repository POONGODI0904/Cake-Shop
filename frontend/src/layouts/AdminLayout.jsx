import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Cake,
  FolderTree,
  ShoppingBag,
  Users,
  Boxes,
  Tag,
  MessageSquare,
  Image as ImageIcon,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out of Admin Portal.', 'info');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/admin/products', label: 'Products', icon: <Cake size={18} /> },
    { path: '/admin/categories', label: 'Categories', icon: <FolderTree size={18} /> },
    { path: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
    { path: '/admin/customers', label: 'Customers', icon: <Users size={18} /> },
    { path: '/admin/inventory', label: 'Inventory', icon: <Boxes size={18} /> },
    { path: '/admin/coupons', label: 'Coupons', icon: <Tag size={18} /> },
    { path: '/admin/reviews', label: 'Reviews', icon: <MessageSquare size={18} /> },
    { path: '/admin/banners', label: 'Banners', icon: <ImageIcon size={18} /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F5F0', color: '#2A170E' }}>
      
      {/* Admin Sidebar (Section 41 of Spec) */}
      <aside
        className="admin-sidebar"
        style={{
          width: '260px',
          background: '#1E120B',
          color: '#E8DCCF',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(198, 146, 62, 0.2)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 100,
          overflowY: 'auto'
        }}
      >
        {/* Brand Header */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(198, 146, 62, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #DFBA73 0%, #C6923E 100%)',
            color: '#1E120B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cake size={22} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1 }}>
              Sweet<span style={{ color: '#DFBA73' }}>Crumb</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#DFBA73', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>
              Admin Console
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 20px',
                  margin: '2px 12px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#DFBA73' : '#BCAFA4',
                  background: isActive ? 'rgba(198, 146, 62, 0.18)' : 'transparent',
                  borderLeft: isActive ? '3px solid #C6923E' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ color: isActive ? '#DFBA73' : '#8A7A70' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Storefront Link & Logout */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(198, 146, 62, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <Link
            to="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#DFBA73',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            <span>View Customer Store</span>
            <ExternalLink size={14} />
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '8px',
              color: '#F87171',
              fontSize: '0.82rem',
              fontWeight: 600,
              width: '100%',
              textAlign: 'left'
            }}
          >
            <LogOut size={16} />
            <span>Admin Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Executive Header */}
        <header style={{
          height: '68px',
          background: '#FFFFFF',
          borderBottom: '1px solid #EFE8DE',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(22, 163, 74, 0.1)',
              color: '#16A34A',
              fontSize: '0.78rem',
              fontWeight: 700
            }}>
              ● Database Active & Synchronized
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: '#FAF7F2',
              border: '1px solid #EFE8DE'
            }}>
              <ShieldCheck size={16} color="#C6923E" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2A170E' }}>
                {user?.name || 'Administrator'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main style={{ padding: '32px', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
