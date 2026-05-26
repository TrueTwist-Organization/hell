import React, { useState } from 'react';

const Footer = ({ categories = [], onOpenPolicy, onOpenModal, onSelectCategory }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (e, policy) => {
    e.preventDefault();
    if (onOpenPolicy) {
      onOpenPolicy(policy);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email address is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email.');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  const copyCode = () => {
    navigator.clipboard.writeText('HELL10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="footer__newsletter">
        <h4>Join the style4cloth VIP Club</h4>
        <p>Subscribe for exclusive access to sales, new drops & get 10% off your next purchase!</p>
        
        {!subscribed ? (
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="newsletter-form__group">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className={error ? 'error' : ''}
              />
              <button type="submit">Subscribe</button>
            </div>
            {error && <span className="newsletter-error">{error}</span>}
          </form>
        ) : (
          <div className="newsletter-success">
            <div className="success-icon">🎉</div>
            <div className="success-text">
              <h5>You are on the VIP List!</h5>
              <p>Use code below at checkout to claim your 10% discount:</p>
              <div className="coupon-badge" onClick={copyCode}>
                <span className="code-text">HELL10</span>
                <span className="copy-label">{copied ? 'Copied! ✅' : 'Click to Copy 📋'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid Links Section */}
      <div className="footer__grid">
        <div className="footer__col">
          <h4>Shop Clothes</h4>
          <ul>
            {categories.map((cat) => (
              <li key={cat.id}>
                <a href="#" onClick={(e) => { e.preventDefault(); onSelectCategory(cat.id); }}>
                  {cat.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Quick Access</h4>
          <ul>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); onOpenModal('orders'); }}>
                📦 Track My Orders
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); onOpenModal('account'); }}>
                👤 My Profile Account
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); onOpenModal('offers'); }}>
                🔥 Active Offers
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); onOpenModal('cart'); }}>
                🛒 View Shopping Cart
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Customer Help</h4>
          <ul>
            <li>
              <a href="#" onClick={(e) => handleLinkClick(e, 'about')}>
                About style4cloth
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => handleLinkClick(e, 'faqs')}>
                FAQ Centre
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => handleLinkClick(e, 'contact')}>
                Get In Touch
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => handleLinkClick(e, 'returns')}>
                Returns Policy
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Our Policies</h4>
          <ul>
            <li>
              <a href="#" onClick={(e) => handleLinkClick(e, 'terms')}>
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => handleLinkClick(e, 'privacy')}>
                Privacy Protection
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => handleLinkClick(e, 'cookies')}>
                Cookie Rules
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => handleLinkClick(e, 'disclaimer')}>
                Disclaimer
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="footer__trust">
        <div className="trust-item">
          <span className="trust-icon">🚚</span>
          <div>
            <h5>Free Shipping</h5>
            <p>On all orders across India</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🔄</span>
          <div>
            <h5>7-Day Returns</h5>
            <p>Hassle-free exchange</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🤝</span>
          <div>
            <h5>COD Supported</h5>
            <p>Pay cash upon delivery</p>
          </div>
        </div>
      </div>

      {/* Support Details */}
      <div className="footer__support">
        <h4>Need Support? We're Here</h4>
        <div className="support-actions">
          <a href="mailto:contact@style4cloth.com" className="support-btn">
            ✉ Email: contact@style4cloth.com
          </a>
          <a href="tel:+919876543210" className="support-btn">
            📞 Call: +91 98765 43210
          </a>
        </div>
      </div>

      {/* Payment Badges & Bottom */}
      <div className="footer__bottom">
        <div className="payment-badges">
          <span className="payment-badge">COD</span>
          <span className="payment-badge">UPI</span>
          <span className="payment-badge">RuPay</span>
          <span className="payment-badge">Visa</span>
          <span className="payment-badge">Mastercard</span>
        </div>
        <div className="copyright-info">
          &copy; 2026 <strong>style4cloth</strong>. All Rights Reserved.
        </div>
        <div className="footer-credits">
          <p>Design by Truetwist</p>
          <p>Marketing by Truetwist</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
