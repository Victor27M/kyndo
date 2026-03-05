// src/components/Catalog.jsx
import { useNavigate } from 'react-router-dom';
import { CATALOG_PRODUCTS } from '../data/products.js';

/**
 * Catalog Component
 * Displays grid of products available for purchase
 * Each product is clickable and navigates to the product detail page
 */
export default function Catalog() {
  const navigate = useNavigate();

  /**
   * Handle product click and navigate to product detail
   * @param {number} productId - Product ID to navigate to
   */
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  /**
   * Handle keyboard navigation for accessibility
   * Allow Enter and Space keys to activate product selection
   * @param {React.KeyboardEvent} event - Keyboard event
   * @param {number} productId - Product ID to navigate to
   */
  const handleKeyDown = (event, productId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleProductClick(productId);
    }
  };

  return (
    <section className="catalog__section">
      <div className="container">
        <h1 className="catalog__heading">Our Collection</h1>
        <div className="catalog__grid">
          {CATALOG_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="catalog__item"
              onClick={() => handleProductClick(product.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => handleKeyDown(event, product.id)}
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
                <p className="catalog__price">{product.price.toFixed(2)} Lei</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
