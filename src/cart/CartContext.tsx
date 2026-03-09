import { createContext, useContext, useMemo, useState, ReactNode, FC } from 'react';
import { CartItem, CartContextType } from '@/types';

const CartCtx = createContext<CartContextType | undefined>(undefined);

/**
 * Hook to access cart context
 * @throws {Error} If used outside CartProvider
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartCtx);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

/**
 * Utility to find item index in cart
 */
const findItemIndex = (items: CartItem[], itemId: string): number =>
  items.findIndex((item) => item.id === itemId);

/**
 * Utility to increment item quantity in cart
 */
const mergeCartItem = (items: CartItem[], newItem: CartItem): CartItem[] => {
  const index = findItemIndex(items, newItem.id);
  if (index === -1) {
    return [...items, newItem];
  }

  const updated = [...items];
  const existingItem = updated[index];
  if (existingItem) {
    updated[index] = {
      ...existingItem,
      qty: existingItem.qty + (newItem.qty || 1),
    };
  }
  return updated;
};

interface CartProviderProps {
  children: ReactNode;
}

/**
 * Provider component for cart state management
 */
export const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Cart actions
  const addItem = (newItem: CartItem): void => {
    setItems((prev) => mergeCartItem(prev, newItem));
  };

  const updateQty = (id: string, qty: number): void => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const removeItem = (id: string): void => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = (): void => {
    setItems([]);
  };

  const openDrawer = (): void => setDrawerOpen(true);
  const closeDrawer = (): void => setDrawerOpen(false);

  // Computed values
  const itemsCount = useMemo(
    () => items.reduce((total, item) => total + item.qty, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.qty * item.price, 0),
    [items]
  );

  const value: CartContextType = {
    items,
    itemsCount,
    subtotal,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    openDrawer,
    closeDrawer,
    isDrawerOpen,
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
};
