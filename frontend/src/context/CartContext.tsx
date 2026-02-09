import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { ApiClient } from '../core/api/ApiClient';
import { getStorageKeyCart } from '../core/config';
import type { CartSummary } from '../types';

interface CartContextValue {
  cartId: string | null;
  itemCount: number;
  cartSummary: CartSummary | null;
  /** User-visible error from add/update (e.g. "Could not update cart"). Clear on retry or success. */
  cartError: string | null;
  /** Clear any displayed cart error. */
  clearCartError: () => void;
  /** Report a cart error (e.g. after failed quantity update on cart page). */
  setCartError: (message: string | null) => void;
  createCart: () => Promise<void>;
  addToCart: (sku: string, quantityDelta: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  /** Clear stored cart ID and summary (e.g. after 404 or "Start fresh") */
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(() => {
    try {
      const stored = sessionStorage.getItem(getStorageKeyCart());
      return stored ?? null;
    } catch {
      return null;
    }
  });
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);

  const clearCartError = useCallback(() => setCartError(null), []);

  const clearCart = useCallback(() => {
    try {
      sessionStorage.removeItem(getStorageKeyCart());
    } catch {
      // ignore
    }
    setCartId(null);
    setCartSummary(null);
    setCartError(null);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!cartId) {
      setCartSummary(null);
      return;
    }
    try {
      const summary = await ApiClient.getCart(cartId);
      setCartSummary(summary);
    } catch {
      setCartSummary(null);
      // Cart not found (404) or other error: clear stored cart so we can create a new one
      clearCart();
    }
  }, [cartId, clearCart]);

  const createCart = useCallback(async () => {
    if (cartId) return;
    try {
      const { cartId: newId } = await ApiClient.createCart();
      setCartId(newId);
      sessionStorage.setItem(getStorageKeyCart(), newId);
      const summary = await ApiClient.getCart(newId);
      setCartSummary(summary);
    } catch {
      // ignore
    }
  }, [cartId]);

  const addToCart = useCallback(
    async (sku: string, quantityDelta: number) => {
      let id = cartId;
      if (!id) {
        const { cartId: newId } = await ApiClient.createCart();
        setCartId(newId);
        sessionStorage.setItem(getStorageKeyCart(), newId);
        id = newId;
      }
      try {
        const summary = await ApiClient.updateCartItems(id, sku, quantityDelta);
        setCartSummary(summary);
        setCartError(null);
      } catch {
        setCartError('Could not update cart. Please try again.');
        await refreshCart();
      }
    },
    [cartId, refreshCart]
  );

  useEffect(() => {
    if (cartId) refreshCart();
  }, [cartId]); // eslint-disable-line react-hooks/exhaustive-deps

  const itemCount =
    cartSummary?.items.reduce((s, i) => s + i.quantity, 0) ?? 0;

  const value: CartContextValue = {
    cartId,
    itemCount,
    cartSummary,
    cartError,
    clearCartError,
    setCartError,
    createCart,
    addToCart,
    refreshCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
