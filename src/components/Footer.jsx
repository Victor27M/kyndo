/**
 * Footer Component
 * Primary footer with branding and links
 */

const FOOTER_LINKS = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  // Added support link for contact/trust signal
  { label: 'Support', href: '/notify' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#', ariaLabel: 'Instagram' },
  { label: 'Twitter', href: '#', ariaLabel: 'Twitter' },
];

/**
 * Get current year for copyright
 * @returns {number} Current year
 */
const getCurrentYear = () => new Date().getFullYear();

/**
 * Divider component
 */
function Divider() {
  return <span className="footer__divider">•</span>;
}

export default function Footer() {
  const currentYear = getCurrentYear();

  return (
    <footer className="footer" id="contact">
      <div className="footer__wrapper">
        {/* Top section with links and social */}
        <div className="footer__secondary footer__secondary--top">
          {/* Privacy and Terms links */}
          <div className="footer__links">
            {FOOTER_LINKS.map((link, index) => (
              <span key={link.label}>
                {index > 0 && <Divider />}
                <a href={link.href} className="footer__link">
                  {link.label}
                </a>
              </span>
            ))}
          </div>

          {/* Social media links */}
          <div className="footer__social">
            {SOCIAL_LINKS.map((link, index) => (
              <span key={link.label}>
                {index > 0 && <Divider />}
                <a href={link.href} className="footer__link" aria-label={link.ariaLabel}>
                  {link.label}
                </a>
              </span>
            ))}
          </div>
        </div>

        {/* Branding section */}
        <div className="footer__brand">
          <h2 className="footer__logo">KYNDO.</h2>
        </div>

        {/* Copyright section */}
        <div className="footer__secondary footer__secondary--bottom">
          <p className="footer__copyright">© {currentYear} KYNDO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
