import { useState, useEffect, useCallback } from 'react';
import { useCart } from '../cart/CartContext.jsx';
import { Link, useLocation } from 'react-router-dom';
import SideCart from './SideCart.jsx';

const NAVIGATION_LINKS = [
  { path: '/shop', label: 'Shop' },
  { path: '/custom', label: 'Custom' },
  { path: '/learn', label: 'Learn' },
];

/**
 * Header Component
 * Sticky navigation with logo, nav links, and cart button
 * Shows background on scroll or when not on landing page
 */
export default function Header() {
  const { openDrawer, itemsCount } = useCart();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  /**
   * Check if current route is active
   * @param {string} path - Path to check
   * @returns {boolean} True if path matches current location
   */
  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  /**
   * Check if on landing page
   * @returns {boolean} True if on home page
   */
  const isLandingPage = location.pathname === '/';

  // Handle scroll event for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Header shows background when not on top of landing page or on different page
  const headerClass = `header ${
    !isLandingPage || isScrolled ? 'header--solid' : ''
  }`;

  return (
    <header className={headerClass}>
      <div className="header__inner container">
        {/* Logo */}
        <Link className="logo" to="/">
          Kyndo.
        </Link>

        {/* Navigation */}
        <nav className="header__nav">
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav__link ${isActive(link.path) ? 'is-active' : ''}`}
              aria-current={isActive(link.path) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Cart button */}
        <div className="header__actions">
          <button
            className="cartlink"
            onClick={openDrawer}
            aria-label="Open shopping cart"
          >
            Cart <span className="cartbadge">{itemsCount}</span>
          </button>
        </div>
      </div>

      {/* Cart drawer */}
      <SideCart />
    </header>
  );
}
