import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import FormError from '../components/FormError';
import RootsLogo from '../components/RootsLogo';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (error) {
      setError('');
    }
  };

  if (resetSent) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <div className="forgot-password-card">
            <div className="forgot-password-header">
              <RootsLogo width={48} height={48} />
              <h1>Check your email</h1>
              <p>
                We've sent a password reset link to <strong>{email}</strong>. 
                Click the link in the email to create a new password.
              </p>
            </div>

            <div className="forgot-password-success-actions">
              <Button 
                variant="primary" 
                size="large" 
                onClick={() => navigate('/signin')}
                className="forgot-password-submit-btn"
              >
                Back to Sign In
              </Button>
              
              <button 
                className="forgot-password-resend"
                onClick={() => setResetSent(false)}
              >
                Didn't receive the email? Try again
              </button>
            </div>
          </div>

          <div className="forgot-password-links">
            <a href="/help">Help Center</a>
            <a href="/contact">Contact Support</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <RootsLogo width={48} height={48} />
            <h1>Forgot your password?</h1>
            <p>
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            {error && <FormError message={error} />}
            
            <Input
              label="Email address"
              type="email"
              placeholder="alex.rivera@example.com"
              value={email}
              onChange={handleEmailChange}
              error={error}
              required
            />

            <Button 
              type="submit" 
              variant="primary" 
              size="large" 
              disabled={isSubmitting}
              className="forgot-password-submit-btn"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <p className="forgot-password-footer">
            Remember your password?{' '}
            <a href="/signin" onClick={(e) => { e.preventDefault(); navigate('/signin'); }}>
              Sign in
            </a>
          </p>
        </div>

        <div className="forgot-password-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/help">Help Center</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
