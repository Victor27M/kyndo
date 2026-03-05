/**
 * ProductActions Component
 * Displays action button and stock status for the product
 * Shows only one button based on stock availability
 */

/**
 * @param {Object} props
 * @param {Function} props.onAddToCart - Callback when "Add to cart" is clicked
 * @param {Function} props.onNotify - Callback when "Notify me" is clicked
 * @param {boolean} [props.isLoading=false] - Whether buttons should be disabled
 * @param {boolean} [props.inStock=true] - Stock availability state
 * @param {string} [props.stockLabel='In Stock'] - Stock status label text
 * @returns {React.ReactElement}
 */
export default function ProductActions({
  onAddToCart,
  onNotify,
  isLoading = false,
  inStock = true,
  stockLabel = 'In Stock',
}) {
  return (
    <div className="product__actions-wrap">
      {/* Stock status indicator */}
      <div className="product__stock">{stockLabel}</div>

      {/* Conditional action button - only one shows at a time */}
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
}
