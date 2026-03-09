import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/cart/CartContext';
import { Link, useLocation } from 'react-router-dom';
import SideCart from '@/components/SideCart';

interface NavLink {
  path: string;
  label: string;
}

const NAVIGATION_LINKS: NavLink[] = [
  { path: '/shop', label: 'Shop' },
  { path: '/custom', label: 'Custom' },
];

export default function Header(): React.JSX.Element {
  const { openDrawer, itemsCount } = useCart();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const isActive = useCallback(
    (path: string): boolean => location.pathname === path,
    [location.pathname]
  );

  const isLandingPage: boolean = location.pathname === '/';

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClass = `header ${
    !isLandingPage || isScrolled ? 'header--solid' : ''
  }`;

  return (
    <header className={headerClass}>
      <div className="header__inner container">
        <Link className="logo" to="/">
          Kyndo.
        </Link>

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

      <SideCart />
    </header>
  );
}
