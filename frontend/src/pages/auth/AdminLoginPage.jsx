import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@sweetcrumb.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        showToast('Welcome to SweetCrumb Command Center, Administrator!', 'success');
        navigate('/admin');
      } else {
        showToast('Access denied: Customer accounts cannot access Admin Dashboard.', 'error');
      }
    }
  };

  return (
    <div style={{
      background: 'radial-gradient(circle at 50% 20%, #2A170E 0%, #150B06 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      color: '#FFFFFF'
    }}>
      <div style={{
        background: 'rgba(30, 18, 11, 0.92)',
        backdropFilter: 'blur(20px)',
        borderRadius: '28px',
        maxWidth: '460px',
        width: '100%',
        padding: '48px 40px',
        border: '1px solid rgba(198, 146, 62, 0.35)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
      }}>
        {/* Executive Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #DFBA73 0%, #C6923E 100%)',
            color: '#150B06',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 8px 25px rgba(198, 146, 62, 0.4)'
          }}>
            <ShieldCheck size={36} />
          </div>
          <span style={{ fontSize: '0.8rem', color: '#DFBA73', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Executive Control Portal
          </span>
          <h2 style={{ fontSize: '2rem', color: '#FFFFFF', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
            Admin Dashboard
          </h2>
          <p style={{ color: '#BCAFA4', fontSize: '0.88rem', marginTop: '6px' }}>
            Authorized personnel login for SweetCrumb operations & analytics
          </p>
        </div>

        {/* Demo Credentials Pill */}
        <div style={{
          background: 'rgba(198, 146, 62, 0.15)',
          border: '1px solid rgba(198, 146, 62, 0.3)',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '0.8rem',
          color: '#DFBA73',
          marginBottom: '24px'
        }}>
          <div><strong>Master Admin Email:</strong> admin@sweetcrumb.com</div>
          <div><strong>Password:</strong> Admin@123</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#DFBA73' }}>Admin Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-input"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(198, 146, 62, 0.3)',
                  color: '#FFFFFF',
                  paddingLeft: '40px'
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail size={18} color="#DFBA73" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#DFBA73' }}>Master Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-input"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(198, 146, 62, 0.3)',
                  color: '#FFFFFF',
                  paddingLeft: '40px'
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock size={18} color="#DFBA73" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{ width: '100%', padding: '16px', fontSize: '1rem', marginTop: '14px' }}
          >
            <span>{loading ? 'Authenticating Privileges...' : 'Enter Admin Panel'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '28px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <Link to="/" style={{ color: '#BCAFA4', fontSize: '0.85rem' }}>
            ← Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
