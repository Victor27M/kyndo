import { createContext, useContext, useMemo, useState } from 'react';

/**
 * @typedef {Object} CartItem
 * @property {string} id - Unique item identifier
 * @property {string} name - Product name
 * @property {number} price - Unit price
 * @property {number} qty - Quantity in cart
 * @property {string} image - Product image URL
 * @property {string} [cable] - Cable type variant
 * @property {string} [color] - Color variant
 */

/**
 * @typedef {Object} CartContextValue
 * @property {CartItem[]} items - Items in cart
 * @property {Function} addItem - Add item to cart
 * @property {Function} updateQty - Update item quantity
 * @property {Function} removeItem - Remove item from cart
 * @property {Function} clear - Clear entire cart
 * @property {number} itemsCount - Total quantity count
 * @property {number} subtotal - Cart subtotal
 * @property {boolean} isDrawerOpen - Cart drawer visibility state
 * @property {Function} openDrawer - Open cart drawer
 * @property {Function} closeDrawer - Close cart drawer
 */

const CartCtx = createContext(null);

/**
 * Hook to access cart context
 * @returns {CartContextValue} Cart context value
 * @throws {Error} If used outside CartProvider
 */
export const useCart = () => {
  const context = useContext(CartCtx);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

/**
 * Utility to find item index in cart
 * @param {CartItem[]} items - Cart items
 * @param {string} itemId - Item ID to find
 * @returns {number} Item index or -1 if not found
 */
const findItemIndex = (items, itemId) => items.findIndex((item) => item.id === itemId);

/**
 * Utility to increment item quantity in cart
 * @param {CartItem[]} items - Cart items
 * @param {CartItem} newItem - Item to add
 * @returns {CartItem[]} Updated items array
 */
const mergeCartItem = (items, newItem) => {
  const index = findItemIndex(items, newItem.id);
  if (index === -1) {
    return [...items, newItem];
  }

  const updated = [...items];
  updated[index] = {
    ...updated[index],
    qty: updated[index].qty + (newItem.qty || 1),
  };
  return updated;
};

/**
 * Provider component for cart state management
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Cart actions
  const addItem = (newItem) => {
    setItems((prev) => mergeCartItem(prev, newItem));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clear = () => {
    setItems([]);
  };

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  // Computed values
  const itemsCount = useMemo(
    () => items.reduce((total, item) => total + item.qty, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.qty * item.price, 0),
    [items]
  );

  const value = {
    items,
    addItem,
    updateQty,
    removeItem,
    clear,
    itemsCount,
    subtotal,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
