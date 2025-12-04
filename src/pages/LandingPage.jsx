import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import RootsLogo from '../components/RootsLogo';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <header className="landing-header">
        <div className="landing-container">
          <div className="landing-nav">
            <div className="landing-logo">
              <RootsLogo width={32} height={32} />
              <span className="logo-text">Roots</span>
            </div>
            <nav className="landing-nav-center">
              <a href="#family-tree">Family Tree</a>
              <a href="#memories">Memories</a>
              <a href="#messages">Messages</a>
              <a href="#events">Events</a>
            </nav>
            <div className="landing-nav-actions">
              <Button variant="outline" size="small" onClick={() => navigate('/signin')}>
                Login
              </Button>
              <Button variant="primary" size="small" onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">🌳 PLANT YOUR FAMILY TREE</div>
              <h1 className="hero-title">
                Every family has a story.
                <br />
                What's yours?
              </h1>
              <p className="hero-description">
                Discover, preserve, and share your family history in a
                <br />
                beautiful, secure, and easy-to-use platform.
              </p>
              <div className="hero-buttons">
                <Button variant="primary" size="large" onClick={() => navigate('/signup')}>
                  Start Your Journey
                </Button>
                <Button variant="outline" size="large">
                  See How It Works
                </Button>
              </div>
            </div>
            <div className="hero-image">
              <img 
                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=600&fit=crop" 
                alt="Happy elderly couple" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="landing-stats">
        <div className="landing-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">2M+</div>
              <div className="stat-label">Families</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50M+</div>
              <div className="stat-label">Family Trees</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Countries</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">∞</div>
              <div className="stat-label">Memories Preserved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="landing-container">
          <div className="features-header">
            <h2>Features designed for connection.</h2>
            <p>We've reimagined family trees to help you connect in fun and dynamic ways—no matter where you are.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card feature-card-large">
              <div className="feature-content">
                <h3>Interactive Tree</h3>
                <p>Explore your family connections in a beautiful, interactive visualization that brings your ancestry to life.</p>
              </div>
              <div className="feature-image">
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop" 
                  alt="Interactive tree visualization" 
                />
              </div>
            </div>

            <div className="feature-card feature-card-dark">
              <div className="feature-content">
                <h3>Privacy First</h3>
                <p>Your family's stories are precious. We use bank-level encryption to keep your data secure and private.</p>
              </div>
              <div className="feature-icons">
                <div className="icon-circle">🔒</div>
                <div className="icon-circle">🛡️</div>
              </div>
            </div>

            <div className="feature-card feature-card-peach">
              <div className="feature-content">
                <h3>Collaborative Albums</h3>
                <p>Share photos, videos, and memories with your family. Everyone can contribute to your shared history.</p>
              </div>
              <div className="feature-image-circle">
                <img 
                  src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200&h=200&fit=crop" 
                  alt="Family memories" 
                />
              </div>
            </div>

            <div className="feature-card feature-card-light">
              <div className="feature-content">
                <h3>Audio Stories</h3>
                <p>Record and preserve the voices of your loved ones. Capture stories that can be passed down for generations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="landing-container">
          <div className="cta-card">
            <h2>Ready to plant your tree?</h2>
            <p>Join millions of families discovering their roots. Start building your family tree today—it's free to get started.</p>
            <Button variant="primary" size="large" onClick={() => navigate('/signup')}>
              Create Your Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="landing-logo">
                <RootsLogo width={36} height={36} />
                <span className="logo-text">Roots</span>
              </div>
              <p>Connecting families, preserving legacies.</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#security">Security</a>
              </div>
              
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#about">About Us</a>
                <a href="#blog">Blog</a>
                <a href="#careers">Careers</a>
              </div>
              
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#help">Help Center</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2024 Roots. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
