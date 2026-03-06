/**
 * Footer Component
 * Primary footer with branding, social, newsletter signup
 */

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

const FOOTER_LINKS = [
  { label: 'Learn More', href: '/learn' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Support', href: '/notify' },
];

/**
 * Get current year for copyright
 * @returns {number} Current year
 */
const getCurrentYear = () => new Date().getFullYear();

export default function Footer() {
  const currentYear = getCurrentYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, page: 'footer-newsletter' }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer" id="contact">
      <div className="footer__wrapper">
        {/* Navigation links with Instagram icon */}
        <div className="footer__links">
          {FOOTER_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="footer__link">
              {link.label}
            </a>
          ))}
          <a 
            href="https://instagram.com/kyndo" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Follow us on Instagram"
            className="footer__link footer__link--icon"
          >
            <FontAwesomeIcon icon={faInstagram} className="footer__social-icon" />
          </a>
        </div>

        {/* Newsletter signup */}
        <div className="footer__newsletter">
          <form onSubmit={handleEmailSubmit} className="footer__newsletter-form">
            <input
              type="email"
              placeholder="Enter your email for updates"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="footer__newsletter-input"
              disabled={isSubmitting}
              required
            />
            <button 
              type="submit" 
              className="footer__newsletter-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {message && <p className="footer__newsletter-message">{message}</p>}
        </div>
        <div className="footer__brand">
          <h2 className="footer__logo">Kyndo.</h2>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">© {currentYear} Kyndo. All rights reserved.</p>
          <p className="footer__made-in">Made in Romania</p>
        </div>
        
      </div>
    </footer>
  );
}
