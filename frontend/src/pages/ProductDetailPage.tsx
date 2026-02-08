import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import { ApiClient, getImageSrc } from '../core/api/ApiClient';
import type { Product } from '../types';
import {
  getBreadcrumbHome,
  getBreadcrumbSeparator,
  getCategoryLabel,
  getProductNotFound,
  getBackToShop,
  getNoCoverImage,
  getZoomBtnLabel,
  getZoomAriaLabel,
  getWishlistBtn,
  getAddToWishlistAria,
  getRemoveFromWishlistAria,
  getAuthorPlaceholder,
  getQuantityLabel,
  getAddToCartBtn,
  getFormatLabel,
  getProductMetaLabel,
  getIsbnLabel,
  getPublisherLabel,
  getPagesLabel,
  getReleaseDateLabel,
  getDeliveryLabel,
  getPostcodePlaceholder,
  getEmptyValueLabel,
  getTabSummaryLabel,
  getTabSummaryContent,
  getTabBookDetailsLabel,
  getTabReviewsLabel,
  getTabReviewsContent,
  getTabReturnsLabel,
  getTabReturnsContent,
  getBreadcrumbAriaLabel,
  getCloseZoomAriaLabel,
  getCloseZoomButtonLabel,
  getZoomOutAriaLabel,
  getZoomOutButtonLabel,
  getZoomInAriaLabel,
  getZoomInButtonLabel,
  getZoomDialogAriaLabel,
} from '../core/config';
import { PriceDisplay } from '../components/product/PriceDisplay';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { Tabs } from '../components/ui/Tabs';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import styles from './ProductDetailPage.module.css';

export function ProductDetailPage() {
  const { sku } = useParams<{ sku: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('summary');
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoomImageLoaded, setZoomImageLoaded] = useState(false);
  const [zoomImageLoadError, setZoomImageLoadError] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = product ? isInWishlist(product.sku) : false;

  const imageUrl = product
    ? product.imageUrl || `/api/images/${product.sku}.svg`
    : '';

  useEffect(() => {
    setImageLoaded(false);
  }, [imageUrl]);

  useEffect(() => {
    if (!sku) return;
    setZoomOpen(false);
    setZoomLevel(1);
    setImageLoadError(false);
    setImageLoaded(false);
    ApiClient.getProducts()
      .then((list) => list.find((p) => p.sku === sku) ?? null)
      .then(setProduct)
      .catch(() => setProduct(null));
  }, [sku]);

  useEffect(() => {
    if (zoomOpen) {
      setZoomImageLoaded(false);
      setZoomImageLoadError(false);
    }
  }, [zoomOpen]);

  useEffect(() => {
    if (!zoomOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [zoomOpen]);

  const handleAddToCart = async () => {
    await addToCart(sku!, quantity);
  };

  if (!product) {
    return (
      <div className="container">
        <p className={styles.notFound}>{getProductNotFound()}</p>
        <Link to="/">{getBackToShop()}</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'summary', label: getTabSummaryLabel(), content: <p>{getTabSummaryContent()}</p> },
    {
      id: 'details',
      label: getTabBookDetailsLabel(),
      content: (
        <table className={styles.detailTable}>
          <tbody>
            <tr>
              <th>{getIsbnLabel()}</th>
              <td>{product.sku}</td>
            </tr>
            <tr>
              <th>{getPublisherLabel()}</th>
              <td>{getEmptyValueLabel()}</td>
            </tr>
            <tr>
              <th>{getPagesLabel()}</th>
              <td>{getEmptyValueLabel()}</td>
            </tr>
          </tbody>
        </table>
      ),
    },
    { id: 'reviews', label: getTabReviewsLabel(), content: <p>{getTabReviewsContent()}</p> },
    { id: 'returns', label: getTabReturnsLabel(), content: <p>{getTabReturnsContent()}</p> },
  ];

  return (
    <div className="container">
      <nav className={styles.breadcrumbs} aria-label={getBreadcrumbAriaLabel()}>
        <Link to="/">{getBreadcrumbHome()}</Link>
        <span className={styles.sep}>{getBreadcrumbSeparator()}</span>
        <span>{getCategoryLabel()}</span>
        <span className={styles.sep}>{getBreadcrumbSeparator()}</span>
        <span>{product.name}</span>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.imageWrap}>
            <div className={styles.imageArea}>
              {imageUrl && !imageLoadError ? (
                <>
                  <div className={styles.imagePlaceholder}>
                    <span className={styles.placeholderTitle}>{product.name}</span>
                    <span className={styles.placeholderSub}>{getNoCoverImage()}</span>
                  </div>
                  <img
                    src={getImageSrc(imageUrl)}
                    alt={product.name}
                    className={`${styles.coverImage} ${styles.coverImageOverlay}`}
                    style={{ display: imageLoaded ? 'block' : 'none' }}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoadError(true)}
                  />
                </>
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span className={styles.placeholderTitle}>{product.name}</span>
                  <span className={styles.placeholderSub}>{getNoCoverImage()}</span>
                </div>
              )}
            </div>
            <div className={styles.imageActions}>
              <button
                type="button"
                className={styles.imageBtn}
                onClick={() => imageUrl && (setZoomLevel(1), setZoomOpen(true))}
                disabled={!imageUrl}
                aria-label={getZoomAriaLabel()}
              >
                {getZoomBtnLabel()}
              </button>
              <button
                type="button"
                className={inWishlist ? styles.imageBtnActive : styles.imageBtn}
                onClick={() => product && toggleWishlist(product.sku)}
                aria-label={inWishlist ? getRemoveFromWishlistAria() : getAddToWishlistAria()}
              >
                {getWishlistBtn()}
              </button>
            </div>
          </div>
        </div>
        <div className={styles.heroRight}>
          <h1 className={styles.productTitle}>{product.name}</h1>
          <p className={styles.author}>{getAuthorPlaceholder()}</p>
          <div className={styles.priceBlock}>
            <PriceDisplay price={product.price} size="large" />
          </div>
          <div className={styles.quantityRow}>
            <label htmlFor="qty-detail">{getQuantityLabel()}</label>
            <QuantityStepper
              value={quantity}
              min={1}
              onChange={setQuantity}
            />
          </div>
          <button
            type="button"
            className={styles.addToCartBtn}
            onClick={handleAddToCart}
          >
            {getAddToCartBtn()}
          </button>
          <dl className={styles.meta}>
            <dt>{getFormatLabel()}</dt>
            <dd>{getProductMetaLabel()}</dd>
            <dt>{getIsbnLabel()}</dt>
            <dd>{product.sku}</dd>
            <dt>{getReleaseDateLabel()}</dt>
            <dd>{getEmptyValueLabel()}</dd>
          </dl>
          <div className={styles.delivery}>
            <label htmlFor="postcode">{getDeliveryLabel()}</label>
            <input
              id="postcode"
              type="text"
              placeholder={getPostcodePlaceholder()}
              className={styles.postcodeInput}
              readOnly
              aria-label={getPostcodePlaceholder()}
            />
          </div>
        </div>
      </section>

      <section className={styles.tabsSection}>
        <Tabs tabs={tabs} activeId={activeTab} onSelect={setActiveTab} />
      </section>

      {zoomOpen && imageUrl && createPortal(
        <div
          className={styles.zoomOverlay}
          onClick={() => setZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={getZoomDialogAriaLabel()}
        >
          <div className={styles.zoomContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.zoomClose}
              onClick={() => setZoomOpen(false)}
              aria-label={getCloseZoomAriaLabel()}
            >
              {getCloseZoomButtonLabel()}
            </button>
            <div className={styles.zoomControls}>
              <button
                type="button"
                className={styles.zoomControlBtn}
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                aria-label={getZoomOutAriaLabel()}
                title={getZoomOutAriaLabel()}
              >
                {getZoomOutButtonLabel()}
              </button>
              <button
                type="button"
                className={styles.zoomControlBtn}
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                aria-label={getZoomInAriaLabel()}
                title={getZoomInAriaLabel()}
              >
                {getZoomInButtonLabel()}
              </button>
            </div>
            <div className={styles.zoomImageWrap}>
              {(!zoomImageLoaded || zoomImageLoadError) && (
                <div className={styles.zoomPlaceholder}>
                  <span className={styles.zoomPlaceholderTitle}>{product.name}</span>
                  <span className={styles.zoomPlaceholderSub}>{getNoCoverImage()}</span>
                </div>
              )}
              {!zoomImageLoadError && (
                <img
                  src={getImageSrc(imageUrl)}
                  alt={product.name}
                  className={styles.zoomImage}
                  style={{
                    display: zoomImageLoaded ? 'block' : 'none',
                    transform: `scale(${zoomLevel})`,
                  }}
                  onLoad={() => setZoomImageLoaded(true)}
                  onError={() => setZoomImageLoadError(true)}
                />
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
