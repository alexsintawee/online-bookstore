import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItemRow } from '../components/cart/CartItemRow';
import { SummaryCard } from '../components/cart/SummaryCard';
import { ApiClient } from '../core/api/ApiClient';
import {
  getBreadcrumbHome,
  getBreadcrumbSeparator,
  getBreadcrumbCart,
  getCartPageTitle,
  getLoadingCart,
  getClearCartHint,
  getEmptyCartMessage,
  getContinueShopping,
  getBreadcrumbAriaLabel,
} from '../core/config';
import type { Product } from '../types';
import styles from './CartPage.module.css';

export function CartPage() {
  const { cartId, cartSummary, refreshCart, createCart, clearCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    ApiClient.getProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (cartId) refreshCart();
  }, [cartId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleQuantityChange = async (sku: string, quantityDelta: number) => {
    if (!cartId) return;
    try {
      await ApiClient.updateCartItems(cartId, sku, quantityDelta);
      await refreshCart();
    } catch {
      // ignore
    }
  };

  const handleRemove = async (sku: string) => {
    if (!cartId) return;
    const item = cartSummary?.items.find((i) => i.sku === sku);
    if (!item) return;
    try {
      await ApiClient.updateCartItems(cartId, sku, -item.quantity);
      await refreshCart();
    } catch {
      // ignore
    }
  };

  if (!cartId) {
    return (
      <div className="container">
        <nav className={styles.breadcrumbs} aria-label={getBreadcrumbAriaLabel()}>
          <Link to="/">{getBreadcrumbHome()}</Link>
          <span className={styles.sep}>{getBreadcrumbSeparator()}</span>
          <span>{getBreadcrumbCart()}</span>
        </nav>
        <h1 className={styles.title}>{getCartPageTitle()}</h1>
        <div className={styles.empty}>
          <p>{getEmptyCartMessage()}</p>
          <Link to="/" className={styles.shopLink}>
            {getContinueShopping()}
          </Link>
        </div>
      </div>
    );
  }

  if (!cartSummary) {
    return (
      <div className="container">
        <p className={styles.loading}>{getLoadingCart()}</p>
        <p className={styles.clearHint}>
          <button type="button" onClick={clearCart} className={styles.clearLink}>
            {getClearCartHint()}
          </button>
        </p>
      </div>
    );
  }

  const { items } = cartSummary;
  const isEmpty = items.length === 0;

  return (
    <div className="container">
      <nav className={styles.breadcrumbs} aria-label={getBreadcrumbAriaLabel()}>
        <Link to="/">{getBreadcrumbHome()}</Link>
        <span className={styles.sep}>{getBreadcrumbSeparator()}</span>
        <span>{getBreadcrumbCart()}</span>
      </nav>
      <h1 className={styles.title}>{getCartPageTitle()}</h1>

      {isEmpty ? (
        <div className={styles.empty}>
          <p>{getEmptyCartMessage()}</p>
          <Link to="/" className={styles.shopLink}>
            {getContinueShopping()}
          </Link>
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.items}>
            {items.map((item) => {
              const product = products.find((p) => p.sku === item.sku);
              const imageUrl = item.imageUrl ?? product?.imageUrl;
              return (
                <CartItemRow
                  key={item.sku}
                  item={item}
                  imageUrl={imageUrl}
                  onQuantityChange={(sku, delta) => handleQuantityChange(sku, delta)}
                  onRemove={handleRemove}
                />
              );
            })}
          </div>
          <aside className={styles.summary}>
            <SummaryCard summary={cartSummary} onCheckout={() => {}} />
          </aside>
        </div>
      )}
    </div>
  );
}
