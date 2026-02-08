import type {
  Product,
  CartSummary,
  CreateCartResponse,
} from '../../types';
import { getApiBaseUrl, getApiPathPrefix, getErrorRequestFailed } from '../config';

function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const prefix = getApiPathPrefix().replace(/\/$/, '') || '/api';
  const fullPath = path.startsWith('/') ? path : `/${path}`;
  const pathWithPrefix = fullPath.startsWith(prefix) ? fullPath : `${prefix}${fullPath}`;
  return base ? `${base.replace(/\/$/, '')}${pathWithPrefix}` : pathWithPrefix;
}

/** Full URL for product images served by the backend (e.g. /api/images/{sku}.svg). */
export function getImageSrc(imagePath: string | undefined): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const base = getApiBaseUrl();
  return base ? `${base.replace(/\/$/, '')}${imagePath}` : imagePath;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(url), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? getErrorRequestFailed());
  }
  return res.json() as Promise<T>;
}

export const ApiClient = {
  getProducts(): Promise<Product[]> {
    return fetchJson<Product[]>(`/products`);
  },

  createCart(): Promise<CreateCartResponse> {
    return fetchJson<CreateCartResponse>(`/cart`, {
      method: 'POST',
    });
  },

  getCart(cartId: string): Promise<CartSummary> {
    return fetchJson<CartSummary>(`/cart/${encodeURIComponent(cartId)}`);
  },

  updateCartItems(
    cartId: string,
    sku: string,
    quantityDelta: number
  ): Promise<CartSummary> {
    return fetchJson<CartSummary>(`/cart/${encodeURIComponent(cartId)}/items`, {
      method: 'POST',
      body: JSON.stringify({ sku, quantityDelta }),
    });
  },
};
