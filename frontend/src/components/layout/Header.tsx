import { Link } from 'react-router-dom';
import {
  getBrandAriaLabel,
  getSearchPlaceholder,
  getSearchAriaLabel,
  getAccountAriaLabel,
  getWishlistAriaLabel,
  getWishlistAriaLabelWithCount,
  getCartAriaLabel,
  getNavItems,
} from '../../core/config';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import styles from './Header.module.css';

export function Header() {
  const { cartId, itemCount } = useCart();
  const { wishlistSkus } = useWishlist();
  const wishlistCount = wishlistSkus.length;
  const brandAriaLabel = getBrandAriaLabel();
  const searchPlaceholder = getSearchPlaceholder();
  const searchAriaLabel = getSearchAriaLabel();
  const accountAriaLabel = getAccountAriaLabel();
  const wishlistAriaLabel = getWishlistAriaLabel();
  const wishlistAriaLabelWithCount = getWishlistAriaLabelWithCount(wishlistCount);
  const cartAriaLabel = getCartAriaLabel();
  const navItems = getNavItems();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label={brandAriaLabel}>
          <img src="/logo.svg" alt="" className={styles.logo} width="140" height="32" />
        </Link>
        <div className={styles.search}>
          <span className={styles.searchIcon} aria-hidden>🔍</span>
          <input
            type="search"
            placeholder={searchPlaceholder}
            className={styles.searchInput}
            aria-label={searchAriaLabel}
          />
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.actions}>
          <a href="#account" className={styles.iconBtn} aria-label={accountAriaLabel}>
            <svg className={styles.accountIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </a>
          <Link
            to="/wishlist"
            className={styles.iconBtn}
            aria-label={wishlistCount > 0 ? wishlistAriaLabelWithCount : wishlistAriaLabel}
          >
            ♥
            {wishlistCount > 0 && (
              <span className={styles.badge} aria-hidden>
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className={styles.cartLink} aria-label={cartAriaLabel}>
            <svg className={styles.cartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="9" cy="21" r="1" fill="currentColor" />
              <circle cx="20" cy="21" r="1" fill="currentColor" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartId != null && itemCount > 0 && (
              <span className={styles.badge}>{itemCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
