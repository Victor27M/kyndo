import { useNavigate } from 'react-router-dom';
import { CATALOG_PRODUCTS } from '@/data/products';
import type { KeyboardEvent } from 'react';

export default function Catalog(): React.JSX.Element {
  const navigate = useNavigate();

  const handleProductClick = (route: string): void => {
    navigate(route);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, route: string): void => {
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
