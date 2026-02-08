import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { getImageSrc } from '../../core/api/ApiClient';
import { getAddToCartBtn, getAddToWishlistAria, getRemoveFromWishlistAria, getNoCoverImage, getProductMetaLabel } from '../../core/config';
import { PriceDisplay } from './PriceDisplay';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, createCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.sku);
  const imageUrl = product.imageUrl || `/api/images/${product.sku}.svg`;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const handleAddToCart = async () => {
    await createCart();
    await addToCart(product.sku, 1);
  };

  const showPlaceholder = !imageUrl || !imageLoaded || imageLoadError;

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.sku}`} className={styles.imageLink}>
        {showPlaceholder && (
          <div className={styles.imagePlaceholder} aria-hidden>
            {imageUrl ? (
              <>
                <span className={styles.placeholderTitle}>{product.name}</span>
                <span className={styles.placeholderSub}>{getNoCoverImage()}</span>
              </>
            ) : (
              <span className={styles.imageIcon}>📖</span>
            )}
          </div>
        )}
        {imageUrl && !imageLoadError && (
          <img
            src={getImageSrc(imageUrl)}
            alt={product.name}
            className={styles.image}
            style={{ display: imageLoaded ? 'block' : 'none' }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoadError(true)}
          />
        )}
      </Link>
      <div className={styles.body}>
        <Link to={`/product/${product.sku}`} className={styles.title}>
          {product.name}
        </Link>
        <p className={styles.meta}>{getProductMetaLabel()}</p>
        <PriceDisplay price={product.price} />
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.addBtn}
            onClick={handleAddToCart}
          >
            {getAddToCartBtn()}
          </button>
          <button
            type="button"
            className={inWishlist ? styles.wishlistBtnActive : styles.wishlistBtn}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.sku);
            }}
            aria-label={inWishlist ? getRemoveFromWishlistAria() : getAddToWishlistAria()}
          >
            ♥
          </button>
        </div>
      </div>
    </article>
  );
}
