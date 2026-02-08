import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { getStorageKeyWishlist } from '../core/config';

function loadWishlist(): string[] {
  try {
    const raw = localStorage.getItem(getStorageKeyWishlist());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

function saveWishlist(skus: string[]) {
  try {
    localStorage.setItem(getStorageKeyWishlist(), JSON.stringify(skus));
  } catch {
    // ignore
  }
}

interface WishlistContextValue {
  wishlistSkus: string[];
  isInWishlist: (sku: string) => boolean;
  addToWishlist: (sku: string) => void;
  removeFromWishlist: (sku: string) => void;
  toggleWishlist: (sku: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistSkus, setWishlistSkus] = useState<string[]>(loadWishlist);

  useEffect(() => {
    saveWishlist(wishlistSkus);
  }, [wishlistSkus]);

  const isInWishlist = useCallback((sku: string) => wishlistSkus.includes(sku), [wishlistSkus]);

  const addToWishlist = useCallback((sku: string) => {
    setWishlistSkus((prev) => (prev.includes(sku) ? prev : [...prev, sku]));
  }, []);

  const removeFromWishlist = useCallback((sku: string) => {
    setWishlistSkus((prev) => prev.filter((s) => s !== sku));
  }, []);

  const toggleWishlist = useCallback((sku: string) => {
    setWishlistSkus((prev) =>
      prev.includes(sku) ? prev.filter((s) => s !== sku) : [...prev, sku]
    );
  }, []);

  const value: WishlistContextValue = {
    wishlistSkus,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
