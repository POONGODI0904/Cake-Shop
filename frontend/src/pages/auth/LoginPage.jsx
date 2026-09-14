import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Cake, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('customer@sweetcrumb.com');
  const [password, setPassword] = useState('Customer@123');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    }
  };

  return (
    <div style={{
      background: 'radial-gradient(circle at 50% 30%, #F5EBE1 0%, #FAF7F2 100%)',
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '28px',
        maxWidth: '440px',
        width: '100%',
        padding: '44px 36px',
        border: '1px solid #EFE8DE',
        boxShadow: '0 16px 45px rgba(42, 23, 14, 0.08)'
      }}>
        {/* Brand Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4A2818 0%, #2A170E 100%)',
            color: '#DFBA73',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <Cake size={30} />
          </div>
          <h2 style={{ fontSize: '1.9rem', color: '#2A170E', marginBottom: '4px' }}>Welcome Back</h2>
          <p style={{ color: '#73645C', fontSize: '0.88rem' }}>Sign in to manage your orders, wishlist, and celebrations</p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div style={{
          background: 'rgba(198, 146, 62, 0.1)',
          border: '1px solid rgba(198, 146, 62, 0.3)',
          padding: '10px 14px',
          borderRadius: '12px',
          fontSize: '0.78rem',
          color: '#8C532B',
          marginBottom: '22px'
        }}>
          <strong>Demo Customer:</strong> customer@sweetcrumb.com / Customer@123<br />
          <strong>Demo Admin:</strong> admin@sweetcrumb.com / Admin@123
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address or Mobile</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="form-input"
                placeholder="customer@sweetcrumb.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <Mail size={18} color="#A4978E" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#8C532B', fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <Lock size={18} color="#A4978E" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{ width: '100%', padding: '14px', marginTop: '12px' }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to SweetCrumb'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: '#73645C' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: '#8C532B', fontWeight: 700 }}>
            Create Account
          </Link>
        </div>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #EFE8DE', textAlign: 'center' }}>
          <Link to="/admin/login" style={{ fontSize: '0.82rem', color: '#C6923E', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} />
            <span>Store Staff & Admin Portal →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
