import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ValidationService from '../services/ValidationService';
import Input from '../components/Input';
import Button from '../components/Button';
import FormError from '../components/FormError';
import RootsLogo from '../components/RootsLogo';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updatePassword } = useAuth();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    // Check if token exists
    if (!token) {
      setTokenError(true);
      setGeneralError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate password
    const passwordValidation = ValidationService.validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) {
      return;
    }
    
    if (!token) {
      setGeneralError('Invalid reset token. Please request a new password reset link.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updatePassword(token, formData.password);
      // Navigate to sign-in with success message
      navigate('/signin', { state: { message: 'Password reset successful! Please sign in with your new password.' } });
    } catch (err) {
      // Check if token expired
      if (err.message && (err.message.includes('expired') || err.message.includes('invalid'))) {
        setTokenError(true);
        setGeneralError('This password reset link has expired. Please request a new one.');
      } else {
        setGeneralError(err.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenError) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-card">
            <div className="reset-password-header">
              <RootsLogo width={80} height={80} />
              <h1>Link expired</h1>
              <p>
                This password reset link has expired or is invalid. 
                Please request a new password reset link.
              </p>
            </div>

            <div className="reset-password-error-actions">
              <Button 
                variant="primary" 
                size="large" 
                onClick={() => navigate('/forgot-password')}
                className="reset-password-submit-btn"
              >
                Request New Link
              </Button>
              
              <Button 
                variant="outline" 
                size="large" 
                onClick={() => navigate('/signin')}
              >
                Back to Sign In
              </Button>
            </div>
          </div>

          <div className="reset-password-links">
            <a href="/help">Help Center</a>
            <a href="/contact">Contact Support</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="reset-password-header">
            <RootsLogo width={80} height={80} />
            <h1>Create new password</h1>
            <p>
              Your new password must be different from previously used passwords 
              and meet our security requirements.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="reset-password-form">
            {generalError && <FormError message={generalError} />}
            
            <Input
              label="New password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(value) => handleChange('password', value)}
              error={errors.password}
              required
            />

            <Input
              label="Confirm new password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(value) => handleChange('confirmPassword', value)}
              error={errors.confirmPassword}
              required
            />

            <div className="reset-password-requirements">
              <p className="requirements-title">Password must contain:</p>
              <ul>
                <li className={formData.password.length >= 8 ? 'valid' : ''}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                  One uppercase letter
                </li>
                <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>
                  One lowercase letter
                </li>
                <li className={/[0-9]/.test(formData.password) ? 'valid' : ''}>
                  One number
                </li>
              </ul>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="large" 
              disabled={isSubmitting}
              className="reset-password-submit-btn"
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>

          <p className="reset-password-footer">
            Remember your password?{' '}
            <a href="/signin" onClick={(e) => { e.preventDefault(); navigate('/signin'); }}>
              Sign in
            </a>
          </p>
        </div>

        <div className="reset-password-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/help">Help Center</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
