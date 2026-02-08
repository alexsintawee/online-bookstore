import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiClient, getImageSrc } from '../core/api/ApiClient';
import type { Product } from '../types';
import {
  getBreadcrumbHome,
  getBreadcrumbSeparator,
  getBreadcrumbWishlist,
  getWishlistPageTitle,
  getEmptyWishlistMessage,
  getLoadingWishlist,
  getContinueShopping,
  getAddToCartBtn,
  getRemoveBtn,
  getRemoveFromWishlistAria,
  getProductMetaLabel,
  getBreadcrumbAriaLabel,
} from '../core/config';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { PriceDisplay } from '../components/product/PriceDisplay';
import styles from './WishlistPage.module.css';

export function WishlistPage() {
  const { wishlistSkus, removeFromWishlist } = useWishlist();
  const { addToCart, createCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    ApiClient.getProducts()
      .then((list) => setProducts(list))
      .catch(() => setProducts([]));
  }, []);

  const wishlistProducts = products.filter((p) => wishlistSkus.includes(p.sku));
  const isLoading = wishlistSkus.length > 0 && products.length === 0;

  const handleAddToCart = async (sku: string) => {
    await createCart();
    await addToCart(sku, 1);
  };

  if (wishlistSkus.length === 0) {
    return (
      <div className="container">
        <nav className={styles.breadcrumbs} aria-label={getBreadcrumbAriaLabel()}>
          <Link to="/">{getBreadcrumbHome()}</Link>
          <span className={styles.sep}>{getBreadcrumbSeparator()}</span>
          <span>{getBreadcrumbWishlist()}</span>
        </nav>
        <h1 className={styles.title}>{getWishlistPageTitle()}</h1>
        <div className={styles.empty}>
          <p>{getEmptyWishlistMessage()}</p>
          <Link to="/" className={styles.shopLink}>
            {getContinueShopping()}
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container">
        <nav className={styles.breadcrumbs} aria-label={getBreadcrumbAriaLabel()}>
          <Link to="/">{getBreadcrumbHome()}</Link>
          <span className={styles.sep}>{getBreadcrumbSeparator()}</span>
          <span>{getBreadcrumbWishlist()}</span>
        </nav>
        <h1 className={styles.title}>{getWishlistPageTitle()}</h1>
        <p className={styles.loading}>{getLoadingWishlist()}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <nav className={styles.breadcrumbs} aria-label={getBreadcrumbAriaLabel()}>
        <Link to="/">{getBreadcrumbHome()}</Link>
        <span className={styles.sep}>{getBreadcrumbSeparator()}</span>
        <span>{getBreadcrumbWishlist()}</span>
      </nav>
      <h1 className={styles.title}>{getWishlistPageTitle()}</h1>
      <ul className={styles.list}>
        {wishlistProducts.map((product) => {
          const imageUrl = product.imageUrl || `/api/images/${product.sku}.svg`;
          return (
            <li key={product.sku} className={styles.item}>
              <Link to={`/product/${product.sku}`} className={styles.imageLink}>
                <img
                  src={getImageSrc(imageUrl)}
                  alt={product.name}
                  className={styles.image}
                />
              </Link>
              <div className={styles.details}>
                <Link to={`/product/${product.sku}`} className={styles.name}>
                  {product.name}
                </Link>
                <p className={styles.meta}>{getProductMetaLabel()}</p>
                <PriceDisplay price={product.price} />
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => handleAddToCart(product.sku)}
                  >
                    {getAddToCartBtn()}
                  </button>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeFromWishlist(product.sku)}
                    aria-label={getRemoveFromWishlistAria()}
                  >
                    {getRemoveBtn()}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
