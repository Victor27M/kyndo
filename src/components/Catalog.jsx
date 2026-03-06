// src/components/Catalog.jsx
import { useNavigate } from 'react-router-dom';
import { CATALOG_PRODUCTS } from '../data/products.js';

/**
 * Catalog Component
 * Displays main products side by side (centered)
 * Each product is clickable and navigates to dedicated product page
 */
export default function Catalog() {
  const navigate = useNavigate();

  /**
   * Handle product click and navigate to product page
   * @param {string} route - Product route path
   */
  const handleProductClick = (route) => {
    navigate(route);
  };

  /**
   * Handle keyboard navigation for accessibility
   * @param {React.KeyboardEvent} event - Keyboard event
   * @param {string} route - Product route path
   */
  const handleKeyDown = (event, route) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleProductClick(route);
    }
  };

  return (
    <section className="catalog__section">
      <div className="container">
        <h1 className="catalog__heading">Our Products</h1>
        <div className="catalog__grid">
          {CATALOG_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="catalog__item"
              onClick={() => handleProductClick(product.route)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => handleKeyDown(event, product.route)}
              aria-label={`View ${product.name}`}
            >
              <div className="catalog__image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="catalog__image"
                />
              </div>
              <div className="catalog__info">
                <h3 className="catalog__name">{product.name}</h3>
                <p className="catalog__price">From {product.price.toFixed(2)} Lei</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
