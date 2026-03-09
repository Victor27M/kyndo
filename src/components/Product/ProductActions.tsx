import type { FC } from 'react';
import type { ProductActionsProps } from '@/types';

const ProductActions: FC<ProductActionsProps> = ({
  onAddToCart,
  onNotify,
  isLoading = false,
  inStock = true,
  stockLabel = 'In Stock',
}): React.JSX.Element => {
  return (
    <div className="product__actions-wrap">
      <div className="product__stock">{stockLabel}</div>

      <div className="product__actions">
        {inStock ? (
          <button
            className="btn btn--solid"
            onClick={onAddToCart}
            disabled={isLoading}
            aria-label="Add product to cart"
          >
            Add to cart
          </button>
        ) : (
          <button
            className="btn btn--outline"
            onClick={onNotify}
            disabled={isLoading}
            aria-label="Get notified when product is available"
          >
            Sold Out — Notify Me
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductActions;
