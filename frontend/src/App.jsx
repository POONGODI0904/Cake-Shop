import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Providers & Context
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import CakesPage from './pages/customer/CakesPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CustomCakePage from './pages/customer/CustomCakePage';
import CategoriesPage from './pages/customer/CategoriesPage';
import OffersPage from './pages/customer/OffersPage';
import CartPage from './pages/customer/CartPage';
import WishlistPage from './pages/customer/WishlistPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderSuccessPage from './pages/customer/OrderSuccessPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import UserDashboardPage from './pages/customer/UserDashboardPage';
import AboutPage from './pages/customer/AboutPage';
import ContactPage from './pages/customer/ContactPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';

// Admin Layout & Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminInventory from './pages/admin/AdminInventory';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminReviews from './pages/admin/AdminReviews';
import AdminBanners from './pages/admin/AdminBanners';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Protected Route Guard for Admin
function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #EFE8DE', borderTopColor: '#C6923E', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

// Protected Route Guard for Customer Account
function CustomerRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #EFE8DE', borderTopColor: '#C6923E', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Customer Storefront Layout Wrapper
function StorefrontLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>{children}</div>
      <CartDrawer />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Customer Storefront Routes */}
      <Route path="/" element={<StorefrontLayout><HomePage /></StorefrontLayout>} />
      <Route path="/cakes" element={<StorefrontLayout><CakesPage /></StorefrontLayout>} />
      <Route path="/cakes/:id" element={<StorefrontLayout><ProductDetailPage /></StorefrontLayout>} />
      <Route path="/categories" element={<StorefrontLayout><CategoriesPage /></StorefrontLayout>} />
      <Route path="/custom-cake" element={<StorefrontLayout><CustomCakePage /></StorefrontLayout>} />
      <Route path="/offers" element={<StorefrontLayout><OffersPage /></StorefrontLayout>} />
      <Route path="/cart" element={<StorefrontLayout><CartPage /></StorefrontLayout>} />
      <Route path="/wishlist" element={<StorefrontLayout><WishlistPage /></StorefrontLayout>} />
      <Route path="/checkout" element={<StorefrontLayout><CheckoutPage /></StorefrontLayout>} />
      <Route path="/order-success/:orderId" element={<StorefrontLayout><OrderSuccessPage /></StorefrontLayout>} />
      <Route path="/track-order/:orderId" element={<StorefrontLayout><OrderTrackingPage /></StorefrontLayout>} />
      <Route path="/about" element={<StorefrontLayout><AboutPage /></StorefrontLayout>} />
      <Route path="/contact" element={<StorefrontLayout><ContactPage /></StorefrontLayout>} />

      {/* Customer Protected Route */}
      <Route
        path="/account"
        element={
          <CustomerRoute>
            <StorefrontLayout><UserDashboardPage /></StorefrontLayout>
          </CustomerRoute>
        }
      />

      {/* Auth Routes */}
      <Route path="/login" element={<StorefrontLayout><LoginPage /></StorefrontLayout>} />
      <Route path="/register" element={<StorefrontLayout><RegisterPage /></StorefrontLayout>} />
      <Route path="/forgot-password" element={<StorefrontLayout><ForgotPasswordPage /></StorefrontLayout>} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
