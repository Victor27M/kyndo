import type { FC } from 'react';
import type { CartSummaryProps } from '@/types';

const CartSummary: FC<CartSummaryProps> = ({
  subtotal,
  onCheckout,
  isLoading = false,
}): React.JSX.Element => {
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
};

export default CartSummary;
