import { useEffect, useState, useCallback } from 'react';
import { useCart } from '@/cart/CartContext';
import CartItemRow from '@/components/Cart/CartItemRow';
import CartSummary from '@/components/Cart/CartSummary';
import { initiateCheckout } from '@/services/checkout';

export default function SideCart(): React.JSX.Element {
  const { isDrawerOpen, closeDrawer, items, updateQty, removeItem, subtotal } = useCart();

  const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);

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

  const handleCheckout = useCallback(async (): Promise<void> => {
    if (!items || items.length === 0) {
      return;
    }

    setIsCheckoutLoading(true);
    try {
      await initiateCheckout(items);
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Checkout failed. Please try again.');
    } finally {
      setIsCheckoutLoading(false);
    }
  }, [items]);

  const hasItems = items.length > 0;

  return (
    <>
      <div
        className={`drawer__overlay ${isDrawerOpen ? 'is-open' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside
        className={`drawer ${isDrawerOpen ? 'is-open' : ''}`}
        aria-hidden={!isDrawerOpen}
        aria-label="Shopping cart"
      >
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
