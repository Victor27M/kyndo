/**
 * CartSummary Component
 * Displays subtotal, shipping, total, and checkout button
 */

/**
 * @param {Object} props
 * @param {number} props.subtotal - Cart subtotal amount
 * @param {Function} props.onCheckout - Callback when checkout is clicked
 * @param {boolean} [props.isLoading=false] - Whether checkout is in progress
 * @returns {React.ReactElement}
 */
export default function CartSummary({ subtotal, onCheckout, isLoading = false }) {
  return (
    <div className="drawer__summary">
      <div className="summary__rows">
        <div className="summary__row">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)} Lei</span>
        </div>
        <div className="summary__row">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="summary__row total">
          <span>Total</span>
          <span>{subtotal.toFixed(2)} Lei</span>
        </div>
      </div>
      <button
        className="checkout__btn"
        onClick={onCheckout}
        disabled={isLoading}
        aria-label="Proceed to checkout"
      >
        {isLoading ? 'Processing...' : 'Check out'}
      </button>
    </div>
  );
}
