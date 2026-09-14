import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cake, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = Request, 2 = Reset
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword({ email });
      setResetToken(res.data.resetToken);
      setStep(2);
      showToast('Verification code generated!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Email not found', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.resetPassword({ email, newPassword });
      showToast('Password reset successfully! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err.response?.data?.message || 'Reset failed', 'error');
    } finally {
      setLoading(false);
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
          <h2 style={{ fontSize: '1.8rem', color: '#2A170E', marginBottom: '4px' }}>Reset Password</h2>
          <p style={{ color: '#73645C', fontSize: '0.88rem' }}>
            {step === 1 ? 'Enter your registered email for instant recovery' : 'Set your new secure password'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestReset}>
            <div className="form-group">
              <label className="form-label">Account Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="e.g. customer@sweetcrumb.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Mail size={18} color="#A4978E" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', padding: '14px', marginTop: '12px' }}>
              <span>{loading ? 'Verifying...' : 'Send Reset Verification'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleCompleteReset}>
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #86EFAC',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '18px',
              fontSize: '0.82rem',
              color: '#166534'
            }}>
              Verification Code: <strong>{resetToken}</strong> (Verified for {email})
            </div>

            <div className="form-group">
              <label className="form-label">New Password (at least 6 characters)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Lock size={18} color="#A4978E" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '12px' }}>
              <span>{loading ? 'Updating Password...' : 'Save New Password & Login'}</span>
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem' }}>
          <Link to="/login" style={{ color: '#8C532B', fontWeight: 600 }}>
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
