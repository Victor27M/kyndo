import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import type { FormEvent } from 'react';

interface FooterLink {
  label: string;
  href: string;
}

interface ApiResponse {
  ok?: boolean;
  error?: string;
}

const FOOTER_LINKS: FooterLink[] = [
  { label: 'Learn More', href: '/learn' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Support', href: '/notify' },
];

const getCurrentYear = (): number => new Date().getFullYear();

export default function Footer(): React.JSX.Element {
  const currentYear = getCurrentYear();
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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

      const data = (await response.json()) as ApiResponse;

      if (response.ok && data.ok) {
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer" id="contact">
      <div className="footer__wrapper">
        <div className="footer__links">
          {FOOTER_LINKS.map((link) => (
            link.href.startsWith('/') ? (
              <Link key={link.label} to={link.href} className="footer__link">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className="footer__link">
                {link.label}
              </a>
            )
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
