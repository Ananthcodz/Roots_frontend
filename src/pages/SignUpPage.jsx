import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import SSOButton from '../components/SSOButton';
import FormError from '../components/FormError';
import RootsLogo from '../components/RootsLogo';
import './SignUpPage.css';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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
    
    setIsSubmitting(true);
    
    try {
      await signUp(formData.email, formData.password, formData.fullName);
      navigate('/profile-setup');
    } catch (error) {
      setGeneralError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      navigate('/profile-setup');
    } catch (error) {
      setGeneralError(error.message || 'Failed to sign up with Google');
    }
  };

  const handleAppleSignUp = async () => {
    try {
      await signInWithApple();
      navigate('/profile-setup');
    } catch (error) {
      setGeneralError(error.message || 'Failed to sign up with Apple');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <RootsLogo width={48} height={48} />
            <h1>Create an account</h1>
            <p>Join your family network to discover, preserve, and share your history.</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            {generalError && <FormError message={generalError} />}
            
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Alex Rivera"
              value={formData.fullName}
              onChange={(value) => handleChange('fullName', value)}
              error={errors.fullName}
              required
            />

            <Input
              label="Email address"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(value) => handleChange('password', value)}
              error={errors.password}
              required
            />

            <Button 
              type="submit" 
              variant="primary" 
              size="large" 
              disabled={isSubmitting}
              className="signup-submit-btn"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>

            <p className="signup-terms">
              By clicking continue, you agree to our{' '}
              <a href="/terms">Terms of Service</a> and{' '}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </form>

          <div className="signup-divider">
            <span>Or register with</span>
          </div>

          <div className="signup-sso">
            <SSOButton provider="google" onClick={handleGoogleSignUp} />
            <SSOButton provider="apple" onClick={handleAppleSignUp} />
          </div>

          <p className="signup-footer">
            Already have an account?{' '}
            <a href="/signin" onClick={(e) => { e.preventDefault(); navigate('/signin'); }}>
              Sign in
            </a>
          </p>
        </div>

        <div className="signup-links">
          <a href="/help">Help Center</a>
          <a href="/about">About Us</a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
