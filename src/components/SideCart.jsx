import { useEffect, useState, useCallback } from 'react';
import { useCart } from '../cart/CartContext.jsx';
import CartItemRow from './Cart/CartItemRow.jsx';
import CartSummary from './Cart/CartSummary.jsx';
import { initiateCheckout } from '../services/checkout.js';

/**
 * SideCart Component
 * Side drawer displaying shopping cart with items, summary, and checkout
 */
export default function SideCart() {
  const {
    isDrawerOpen,
    closeDrawer,
    items,
    updateQty,
    removeItem,
    subtotal,
  } = useCart();

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  /**
   * Handle checkout initiation
   * Communicates with Stripe API to create checkout session
   */
  const handleCheckout = useCallback(async () => {
    if (!items || items.length === 0) {
      return; // Guard: No items to checkout
    }

    setIsCheckoutLoading(true);
    try {
      await initiateCheckout(items);
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.message || 'Checkout failed. Please try again.');
    } finally {
      setIsCheckoutLoading(false);
    }
  }, [items]);

  const hasItems = items.length > 0;

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className={`drawer__overlay ${isDrawerOpen ? 'is-open' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Cart drawer panel */}
      <aside
        className={`drawer ${isDrawerOpen ? 'is-open' : ''}`}
        aria-hidden={!isDrawerOpen}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <header className="drawer__head">
          <h3 className="drawer__title">Your Cart</h3>
          <button
            className="btn--ghost"
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart drawer"
          >
            Close
          </button>
        </header>

        {/* Items body */}
        <div className="drawer__body">
          {hasItems ? (
            <ul className="drawer__list">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQty={updateQty}
                  onRemove={removeItem}
                />
              ))}
            </ul>
          ) : (
            <div className="drawer__empty">Your cart is empty.</div>
          )}
        </div>

        {/* Summary and checkout footer */}
        {hasItems && (
          <CartSummary
            subtotal={subtotal}
            onCheckout={handleCheckout}
            isLoading={isCheckoutLoading}
          />
        )}
      </aside>
    </>
  );
}
