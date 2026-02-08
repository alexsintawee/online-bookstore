import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ApiClient } from '../core/api/ApiClient';
import type { Product } from '../types';
import {
  getBreadcrumbHome,
  getBreadcrumbSeparator,
  getCategoryLabel,
  getHomePageTitle,
  getHomePageSubtitle,
  getSortByLabel,
  getSortOptionTitle,
  getSortOptionPrice,
  getLoadingProducts,
  getErrorRetryHint,
  getErrorRetryCode,
  getErrorLoadProductsDefault,
  getRetryBtn,
  getBreadcrumbAriaLabel,
} from '../core/config';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductCard } from '../components/product/ProductCard';
import styles from './HomePage.module.css';

type SortOption = 'title' | 'price';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<SortOption>('title');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(() => {
    setError(null);
    setLoading(true);
    ApiClient.getProducts()
      .then((data) => {
        setProducts(data);
        setError(null);
      })
      .catch((err) => {
        setProducts([]);
        setError(err instanceof Error ? err.message : getErrorLoadProductsDefault());
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'title') return a.name.localeCompare(b.name);
    return a.price - b.price;
  });

  return (
    <div className="container">
      <nav className={styles.breadcrumbs} aria-label={getBreadcrumbAriaLabel()}>
        <Link to="/">{getBreadcrumbHome()}</Link>
        <span className={styles.breadcrumbSep}>{getBreadcrumbSeparator()}</span>
        <span>{getCategoryLabel()}</span>
      </nav>
      <header className={styles.header}>
        <h1 className={styles.title}>{getHomePageTitle()}</h1>
        <p className={styles.subtitle}>
          {getHomePageSubtitle()}
        </p>
        <div className={styles.controls}>
          <label htmlFor="sort" className={styles.sortLabel}>
            {getSortByLabel()}
          </label>
          <select
            id="sort"
            className={styles.sortSelect}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="title">{getSortOptionTitle()}</option>
            <option value="price">{getSortOptionPrice()}</option>
          </select>
        </div>
      </header>
      {loading ? (
        <p className={styles.loading}>{getLoadingProducts()}</p>
      ) : error ? (
        <div className={styles.error}>
          <p className={styles.errorMessage}>{error}</p>
          <p className={styles.errorHint}>
            {getErrorRetryHint()} <code>{getErrorRetryCode()}</code>
          </p>
          <button type="button" className={styles.retryBtn} onClick={loadProducts}>
            {getRetryBtn()}
          </button>
        </div>
      ) : (
        <ProductGrid>
          {sorted.map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </ProductGrid>
      )}
    </div>
  );
}
