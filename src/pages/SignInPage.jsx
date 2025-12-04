import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import SSOButton from '../components/SSOButton';
import FormError from '../components/FormError';
import RootsLogo from '../components/RootsLogo';
import './SignInPage.css';

const SignInPage = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const [formData, setFormData] = useState({
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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      await signIn(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setGeneralError(error.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setGeneralError(error.message || 'Failed to sign in with Google');
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
      navigate('/dashboard');
    } catch (error) {
      setGeneralError(error.message || 'Failed to sign in with Apple');
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="signin-card">
          <div className="signin-header">
            <RootsLogo width={48} height={48} />
            <h1>Welcome back</h1>
            <p>Enter your credentials to access your family tree and connect with relatives.</p>
          </div>

          <form onSubmit={handleSubmit} className="signin-form">
            {generalError && <FormError message={generalError} />}
            
            <Input
              label="Email address"
              type="email"
              placeholder="alex.rivera@example.com"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(value) => handleChange('password', value)}
              error={errors.password}
              required
            />

            <div className="signin-forgot">
              <a href="/forgot-password" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>
                Forgot password?
              </a>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="large" 
              disabled={isSubmitting}
              className="signin-submit-btn"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="signin-divider">
            <span>Or continue with</span>
          </div>

          <div className="signin-sso">
            <SSOButton provider="google" onClick={handleGoogleSignIn} />
            <SSOButton provider="apple" onClick={handleAppleSignIn} />
          </div>

          <p className="signin-footer">
            Don't have an account?{' '}
            <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
              Sign up
            </a>
          </p>
        </div>

        <div className="signin-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/help">Help Center</a>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
