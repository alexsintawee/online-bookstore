/**
 * All app variables in one place: core/config/config.json.
 * Optional runtime override from public/config.json (e.g. for deployment).
 * No hardcoded UI strings in components – use getters from here.
 */

import defaultConfig from './config.json';

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface AppConfig {
  apiBaseUrl: string;
  apiPathPrefix: string;
  errorRequestFailed: string;
  appName: string;
  siteTitle: string;
  brandAriaLabel: string;
  searchPlaceholder: string;
  copyrightText: string;
  storageKeyCart: string;
  storageKeyWishlist: string;
  breadcrumbHome: string;
  breadcrumbSeparator: string;
  categoryLabel: string;
  homePageTitle: string;
  homePageSubtitle: string;
  sortByLabel: string;
  sortOptionTitle: string;
  sortOptionPrice: string;
  loadingProducts: string;
  errorRetryHint: string;
  errorRetryCode: string;
  errorLoadProductsDefault: string;
  retryBtn: string;
  searchAriaLabel: string;
  accountAriaLabel: string;
  wishlistAriaLabel: string;
  wishlistAriaLabelWithCount: string;
  cartAriaLabel: string;
  navItems: NavItem[];
  footerColumns: FooterColumn[];
  breadcrumbCart: string;
  cartPageTitle: string;
  loadingCart: string;
  clearCartHint: string;
  emptyCartMessage: string;
  continueShopping: string;
  orderSummaryTitle: string;
  subtotalLabel: string;
  discountsLabel: string;
  totalLabel: string;
  checkoutBtnLabel: string;
  breadcrumbWishlist: string;
  wishlistPageTitle: string;
  emptyWishlistMessage: string;
  loadingWishlist: string;
  addToCartBtn: string;
  removeBtn: string;
  removeFromWishlistAria: string;
  addToWishlistAria: string;
  productMetaLabel: string;
  productNotFound: string;
  backToShop: string;
  quantityLabel: string;
  wishlistBtn: string;
  zoomBtnLabel: string;
  zoomAriaLabel: string;
  noCoverImage: string;
  authorPlaceholder: string;
  formatLabel: string;
  isbnLabel: string;
  publisherLabel: string;
  pagesLabel: string;
  releaseDateLabel: string;
  deliveryLabel: string;
  postcodePlaceholder: string;
  emptyValueLabel: string;
  closeZoomAriaLabel: string;
  closeZoomButtonLabel: string;
  zoomOutAriaLabel: string;
  zoomOutButtonLabel: string;
  zoomInAriaLabel: string;
  zoomInButtonLabel: string;
  zoomDialogAriaLabel: string;
  tabSummaryLabel: string;
  tabSummaryContent: string;
  tabBookDetailsLabel: string;
  tabReviewsLabel: string;
  tabReviewsContent: string;
  tabReturnsLabel: string;
  tabReturnsContent: string;
  breadcrumbAriaLabel: string;
  quantityGroupAriaLabel: string;
  decreaseQuantityAriaLabel: string;
  increaseQuantityAriaLabel: string;
  cartItemNoImageText: string;
  skuLabel: string;
  removeItemLabel: string;
  removeItemAriaLabelTemplate: string;
  moneyLocale: string;
  moneyCurrency: string;
  moneyMinFractionDigits: number;
  moneyMaxFractionDigits: number;
}

const FALLBACK: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : ''),
  apiPathPrefix: '/api',
  errorRequestFailed: 'Request failed',
  appName: 'Online Bookstore',
  siteTitle: 'Online Bookstore | Books & More',
  brandAriaLabel: 'Online Bookstore home',
  searchPlaceholder: 'Search books, toys, more...',
  copyrightText: 'All rights reserved.',
  storageKeyCart: 'online-bookstore-cart-id',
  storageKeyWishlist: 'online-bookstore-wishlist',
  breadcrumbHome: 'Home',
  breadcrumbSeparator: ' / ',
  categoryLabel: 'Books',
  homePageTitle: 'Books',
  homePageSubtitle: 'Discover our selection of books and media.',
  sortByLabel: 'Sort by',
  sortOptionTitle: 'Title',
  sortOptionPrice: 'Price',
  loadingProducts: 'Loading products…',
  errorRetryHint: 'Make sure the backend is running:',
  errorRetryCode: 'cd backend && npm start',
  errorLoadProductsDefault: 'Could not load products.',
  retryBtn: 'Retry',
  searchAriaLabel: 'Search',
  accountAriaLabel: 'Account',
  wishlistAriaLabel: 'Wishlist',
  wishlistAriaLabelWithCount: 'Wishlist ({count} items)',
  cartAriaLabel: 'Cart',
  navItems: [
    { label: 'Books', href: '#books' },
    { label: 'Toys', href: '#toys' },
    { label: 'Home', href: '#home' },
    { label: 'Baby', href: '#baby' },
    { label: 'Sports & Outdoors', href: '#sports' },
  ],
  footerColumns: [
    { title: 'Shop', links: [{ label: 'Books', href: '#books' }, { label: 'Toys', href: '#toys' }, { label: 'Home', href: '#home' }] },
    { title: 'About', links: [{ label: 'About Us', href: '#about' }, { label: 'Careers', href: '#careers' }] },
    { title: 'Support', links: [{ label: 'Contact', href: '#contact' }, { label: 'FAQ', href: '#faq' }, { label: 'Returns', href: '#returns' }] },
  ],
  breadcrumbCart: 'Cart',
  cartPageTitle: 'Shopping cart',
  loadingCart: 'Loading cart…',
  clearCartHint: 'Clear cart and start fresh',
  emptyCartMessage: 'Your cart is empty.',
  continueShopping: 'Continue shopping',
  orderSummaryTitle: 'Order summary',
  subtotalLabel: 'Subtotal',
  discountsLabel: 'Discounts',
  totalLabel: 'Total',
  checkoutBtnLabel: 'Proceed to checkout',
  breadcrumbWishlist: 'Wishlist',
  wishlistPageTitle: 'Wishlist',
  emptyWishlistMessage: 'Your wishlist is empty.',
  loadingWishlist: 'Loading wishlist…',
  addToCartBtn: 'Add to Cart',
  removeBtn: 'Remove',
  removeFromWishlistAria: 'Remove from wishlist',
  addToWishlistAria: 'Add to wishlist',
  productMetaLabel: 'Book',
  productNotFound: 'Product not found.',
  backToShop: 'Back to shop',
  quantityLabel: 'Quantity',
  wishlistBtn: 'Wishlist',
  zoomBtnLabel: 'Zoom',
  zoomAriaLabel: 'Zoom into cover image',
  noCoverImage: 'No cover image',
  authorPlaceholder: 'Author placeholder',
  formatLabel: 'Format',
  isbnLabel: 'ISBN',
  publisherLabel: 'Publisher',
  pagesLabel: 'Pages',
  releaseDateLabel: 'Release date',
  deliveryLabel: 'Delivery',
  postcodePlaceholder: 'Enter postcode',
  emptyValueLabel: '—',
  closeZoomAriaLabel: 'Close zoom',
  closeZoomButtonLabel: '×',
  zoomOutAriaLabel: 'Zoom out',
  zoomOutButtonLabel: '−',
  zoomInAriaLabel: 'Zoom in',
  zoomInButtonLabel: '+',
  zoomDialogAriaLabel: 'Zoomed cover image',
  tabSummaryLabel: 'Summary',
  tabSummaryContent: 'A compelling read. This product is part of our catalogue and available for delivery. Add to cart to proceed.',
  tabBookDetailsLabel: 'Book Details',
  tabReviewsLabel: 'Reviews',
  tabReviewsContent: 'No reviews yet. Be the first to review!',
  tabReturnsLabel: 'Returns',
  tabReturnsContent: 'Our returns policy allows returns within 30 days for unused items. Contact support for assistance.',
  breadcrumbAriaLabel: 'Breadcrumb',
  quantityGroupAriaLabel: 'Quantity',
  decreaseQuantityAriaLabel: 'Decrease quantity',
  increaseQuantityAriaLabel: 'Increase quantity',
  cartItemNoImageText: 'No image',
  skuLabel: 'SKU',
  removeItemLabel: 'Remove',
  removeItemAriaLabelTemplate: 'Remove {name} from cart',
  moneyLocale: 'en-AU',
  moneyCurrency: 'AUD',
  moneyMinFractionDigits: 2,
  moneyMaxFractionDigits: 2,
};

function str(v: unknown, fallback: string): string {
  return typeof v === 'string' && v.length > 0 ? v : fallback;
}

function num(v: unknown, fallback: number): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string') {
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

function navItems(v: unknown, fallback: NavItem[]): NavItem[] {
  if (!Array.isArray(v)) return fallback;
  return v.map((item) => ({
    label: str((item as NavItem).label, ''),
    href: str((item as NavItem).href, '#'),
  })).filter((item) => item.label);
}

function footerColumns(v: unknown, fallback: FooterColumn[]): FooterColumn[] {
  if (!Array.isArray(v)) return fallback;
  return v.map((col) => {
    const c = col as FooterColumn;
    const links = Array.isArray(c.links)
      ? c.links.map((l) => ({ label: str(l.label, ''), href: str(l.href, '#') })).filter((l) => l.label)
      : fallback[0]?.links ?? [];
    return { title: str(c.title, ''), links };
  }).filter((col) => col.title);
}

/**
 * Normalize config: accept either grouped (nested) or flat format and return flat AppConfig.
 */
function normalizeConfig(data: unknown): Partial<AppConfig> {
  const o = (data as Record<string, unknown>) ?? {};
  if (typeof o.apiBaseUrl === 'string') {
    return o as Partial<AppConfig>;
  }
  const api = (o.api as Record<string, unknown>) ?? {};
  const app = (o.app as Record<string, unknown>) ?? {};
  const breadcrumbs = (o.breadcrumbs as Record<string, unknown>) ?? {};
  const header = (o.header as Record<string, unknown>) ?? {};
  const footer = (o.footer as Record<string, unknown>) ?? {};
  const homePage = (o.homePage as Record<string, unknown>) ?? {};
  const cart = (o.cart as Record<string, unknown>) ?? {};
  const wishlist = (o.wishlist as Record<string, unknown>) ?? {};
  const productDetail = (o.productDetail as Record<string, unknown>) ?? {};
  const productCard = (o.productCard as Record<string, unknown>) ?? {};
  const cartItem = (o.cartItem as Record<string, unknown>) ?? {};
  const quantityStepper = (o.quantityStepper as Record<string, unknown>) ?? {};
  const money = (o.money as Record<string, unknown>) ?? {};
  return {
    apiBaseUrl: str(api.baseUrl, FALLBACK.apiBaseUrl),
    apiPathPrefix: str(api.pathPrefix, FALLBACK.apiPathPrefix),
    errorRequestFailed: str(api.errorRequestFailed, FALLBACK.errorRequestFailed),
    appName: str(app.appName, FALLBACK.appName),
    siteTitle: str(app.siteTitle, FALLBACK.siteTitle),
    brandAriaLabel: str(header.brandAriaLabel ?? app.brandAriaLabel, FALLBACK.brandAriaLabel),
    searchPlaceholder: str(app.searchPlaceholder, FALLBACK.searchPlaceholder),
    copyrightText: str(app.copyrightText, FALLBACK.copyrightText),
    storageKeyCart: str(app.storageKeyCart, FALLBACK.storageKeyCart),
    storageKeyWishlist: str(app.storageKeyWishlist, FALLBACK.storageKeyWishlist),
    breadcrumbHome: str(breadcrumbs.home, FALLBACK.breadcrumbHome),
    breadcrumbSeparator: str(breadcrumbs.separator, FALLBACK.breadcrumbSeparator),
    categoryLabel: str(breadcrumbs.categoryLabel, FALLBACK.categoryLabel),
    breadcrumbCart: str(breadcrumbs.cart, FALLBACK.breadcrumbCart),
    breadcrumbWishlist: str(breadcrumbs.wishlist, FALLBACK.breadcrumbWishlist),
    breadcrumbAriaLabel: str(breadcrumbs.ariaLabel, FALLBACK.breadcrumbAriaLabel),
    searchAriaLabel: str(header.searchAriaLabel, FALLBACK.searchAriaLabel),
    accountAriaLabel: str(header.accountAriaLabel, FALLBACK.accountAriaLabel),
    wishlistAriaLabel: str(header.wishlistAriaLabel, FALLBACK.wishlistAriaLabel),
    wishlistAriaLabelWithCount: str(header.wishlistAriaLabelWithCount, FALLBACK.wishlistAriaLabelWithCount),
    cartAriaLabel: str(header.cartAriaLabel, FALLBACK.cartAriaLabel),
    navItems: navItems(header.navItems, FALLBACK.navItems),
    footerColumns: footerColumns(footer.columns, FALLBACK.footerColumns),
    homePageTitle: str(homePage.title, FALLBACK.homePageTitle),
    homePageSubtitle: str(homePage.subtitle, FALLBACK.homePageSubtitle),
    sortByLabel: str(homePage.sortByLabel, FALLBACK.sortByLabel),
    sortOptionTitle: str(homePage.sortOptionTitle, FALLBACK.sortOptionTitle),
    sortOptionPrice: str(homePage.sortOptionPrice, FALLBACK.sortOptionPrice),
    loadingProducts: str(homePage.loadingProducts, FALLBACK.loadingProducts),
    errorRetryHint: str(homePage.errorRetryHint, FALLBACK.errorRetryHint),
    errorRetryCode: str(homePage.errorRetryCode, FALLBACK.errorRetryCode),
    errorLoadProductsDefault: str(homePage.errorLoadProductsDefault, FALLBACK.errorLoadProductsDefault),
    retryBtn: str(homePage.retryBtn, FALLBACK.retryBtn),
    cartPageTitle: str(cart.pageTitle, FALLBACK.cartPageTitle),
    loadingCart: str(cart.loadingCart, FALLBACK.loadingCart),
    clearCartHint: str(cart.clearCartHint, FALLBACK.clearCartHint),
    emptyCartMessage: str(cart.emptyMessage, FALLBACK.emptyCartMessage),
    continueShopping: str(cart.continueShopping, FALLBACK.continueShopping),
    orderSummaryTitle: str(cart.orderSummaryTitle, FALLBACK.orderSummaryTitle),
    subtotalLabel: str(cart.subtotalLabel, FALLBACK.subtotalLabel),
    discountsLabel: str(cart.discountsLabel, FALLBACK.discountsLabel),
    totalLabel: str(cart.totalLabel, FALLBACK.totalLabel),
    checkoutBtnLabel: str(cart.checkoutBtnLabel, FALLBACK.checkoutBtnLabel),
    wishlistPageTitle: str(wishlist.pageTitle, FALLBACK.wishlistPageTitle),
    emptyWishlistMessage: str(wishlist.emptyMessage, FALLBACK.emptyWishlistMessage),
    loadingWishlist: str(wishlist.loadingWishlist, FALLBACK.loadingWishlist),
    addToCartBtn: str(wishlist.addToCartBtn ?? productDetail.addToCartBtn ?? productCard.addToCartBtn, FALLBACK.addToCartBtn),
    removeBtn: str(wishlist.removeBtn, FALLBACK.removeBtn),
    removeFromWishlistAria: str(wishlist.removeFromWishlistAria ?? productDetail.removeFromWishlistAria ?? productCard.removeFromWishlistAria, FALLBACK.removeFromWishlistAria),
    addToWishlistAria: str(productDetail.addToWishlistAria ?? productCard.addToWishlistAria, FALLBACK.addToWishlistAria),
    productMetaLabel: str(wishlist.productMetaLabel ?? productCard.productMetaLabel ?? productDetail.productMetaLabel, FALLBACK.productMetaLabel),
    productNotFound: str(productDetail.notFound, FALLBACK.productNotFound),
    backToShop: str(productDetail.backToShop, FALLBACK.backToShop),
    quantityLabel: str(productDetail.quantityLabel, FALLBACK.quantityLabel),
    wishlistBtn: str(productDetail.wishlistBtn, FALLBACK.wishlistBtn),
    zoomBtnLabel: str(productDetail.zoomBtnLabel, FALLBACK.zoomBtnLabel),
    zoomAriaLabel: str(productDetail.zoomAriaLabel, FALLBACK.zoomAriaLabel),
    noCoverImage: str(productDetail.noCoverImage ?? productCard.noCoverImage, FALLBACK.noCoverImage),
    authorPlaceholder: str(productDetail.authorPlaceholder, FALLBACK.authorPlaceholder),
    formatLabel: str(productDetail.formatLabel, FALLBACK.formatLabel),
    isbnLabel: str(productDetail.isbnLabel, FALLBACK.isbnLabel),
    publisherLabel: str(productDetail.publisherLabel, FALLBACK.publisherLabel),
    pagesLabel: str(productDetail.pagesLabel, FALLBACK.pagesLabel),
    releaseDateLabel: str(productDetail.releaseDateLabel, FALLBACK.releaseDateLabel),
    deliveryLabel: str(productDetail.deliveryLabel, FALLBACK.deliveryLabel),
    postcodePlaceholder: str(productDetail.postcodePlaceholder, FALLBACK.postcodePlaceholder),
    emptyValueLabel: str(productDetail.emptyValueLabel, FALLBACK.emptyValueLabel),
    closeZoomAriaLabel: str(productDetail.closeZoomAriaLabel, FALLBACK.closeZoomAriaLabel),
    closeZoomButtonLabel: str(productDetail.closeZoomButtonLabel, FALLBACK.closeZoomButtonLabel),
    zoomOutAriaLabel: str(productDetail.zoomOutAriaLabel, FALLBACK.zoomOutAriaLabel),
    zoomOutButtonLabel: str(productDetail.zoomOutButtonLabel, FALLBACK.zoomOutButtonLabel),
    zoomInAriaLabel: str(productDetail.zoomInAriaLabel, FALLBACK.zoomInAriaLabel),
    zoomInButtonLabel: str(productDetail.zoomInButtonLabel, FALLBACK.zoomInButtonLabel),
    zoomDialogAriaLabel: str(productDetail.zoomDialogAriaLabel, FALLBACK.zoomDialogAriaLabel),
    tabSummaryLabel: str(productDetail.tabSummaryLabel, FALLBACK.tabSummaryLabel),
    tabSummaryContent: str(productDetail.tabSummaryContent, FALLBACK.tabSummaryContent),
    tabBookDetailsLabel: str(productDetail.tabBookDetailsLabel, FALLBACK.tabBookDetailsLabel),
    tabReviewsLabel: str(productDetail.tabReviewsLabel, FALLBACK.tabReviewsLabel),
    tabReviewsContent: str(productDetail.tabReviewsContent, FALLBACK.tabReviewsContent),
    tabReturnsLabel: str(productDetail.tabReturnsLabel, FALLBACK.tabReturnsLabel),
    tabReturnsContent: str(productDetail.tabReturnsContent, FALLBACK.tabReturnsContent),
    cartItemNoImageText: str(cartItem.noImageText, FALLBACK.cartItemNoImageText),
    skuLabel: str(cartItem.skuLabel, FALLBACK.skuLabel),
    removeItemLabel: str(cartItem.removeLabel, FALLBACK.removeItemLabel),
    removeItemAriaLabelTemplate: str(cartItem.removeItemAriaLabelTemplate, FALLBACK.removeItemAriaLabelTemplate),
    quantityGroupAriaLabel: str(quantityStepper.groupAriaLabel, FALLBACK.quantityGroupAriaLabel),
    decreaseQuantityAriaLabel: str(quantityStepper.decreaseAriaLabel, FALLBACK.decreaseQuantityAriaLabel),
    increaseQuantityAriaLabel: str(quantityStepper.increaseAriaLabel, FALLBACK.increaseQuantityAriaLabel),
    moneyLocale: str(money.locale, FALLBACK.moneyLocale),
    moneyCurrency: str(money.currency, FALLBACK.moneyCurrency),
    moneyMinFractionDigits: num(money.minFractionDigits, FALLBACK.moneyMinFractionDigits),
    moneyMaxFractionDigits: num(money.maxFractionDigits, FALLBACK.moneyMaxFractionDigits),
  };
}

function mergeConfig(data: unknown, base: AppConfig): AppConfig {
  const o = (data as Partial<AppConfig>) ?? {};
  return {
    apiBaseUrl: str(o.apiBaseUrl, base.apiBaseUrl),
    apiPathPrefix: str(o.apiPathPrefix, base.apiPathPrefix),
    errorRequestFailed: str(o.errorRequestFailed, base.errorRequestFailed),
    appName: str(o.appName, base.appName),
    siteTitle: str(o.siteTitle, base.siteTitle),
    brandAriaLabel: str(o.brandAriaLabel, base.brandAriaLabel),
    searchPlaceholder: str(o.searchPlaceholder, base.searchPlaceholder),
    copyrightText: str(o.copyrightText, base.copyrightText),
    storageKeyCart: str(o.storageKeyCart, base.storageKeyCart),
    storageKeyWishlist: str(o.storageKeyWishlist, base.storageKeyWishlist),
    breadcrumbHome: str(o.breadcrumbHome, base.breadcrumbHome),
    breadcrumbSeparator: str(o.breadcrumbSeparator, base.breadcrumbSeparator),
    categoryLabel: str(o.categoryLabel, base.categoryLabel),
    homePageTitle: str(o.homePageTitle, base.homePageTitle),
    homePageSubtitle: str(o.homePageSubtitle, base.homePageSubtitle),
    sortByLabel: str(o.sortByLabel, base.sortByLabel),
    sortOptionTitle: str(o.sortOptionTitle, base.sortOptionTitle),
    sortOptionPrice: str(o.sortOptionPrice, base.sortOptionPrice),
    loadingProducts: str(o.loadingProducts, base.loadingProducts),
    errorRetryHint: str(o.errorRetryHint, base.errorRetryHint),
    errorRetryCode: str(o.errorRetryCode, base.errorRetryCode),
    errorLoadProductsDefault: str(o.errorLoadProductsDefault, base.errorLoadProductsDefault),
    retryBtn: str(o.retryBtn, base.retryBtn),
    searchAriaLabel: str(o.searchAriaLabel, base.searchAriaLabel),
    accountAriaLabel: str(o.accountAriaLabel, base.accountAriaLabel),
    wishlistAriaLabel: str(o.wishlistAriaLabel, base.wishlistAriaLabel),
    wishlistAriaLabelWithCount: str(o.wishlistAriaLabelWithCount, base.wishlistAriaLabelWithCount),
    cartAriaLabel: str(o.cartAriaLabel, base.cartAriaLabel),
    navItems: navItems(o.navItems, base.navItems),
    footerColumns: footerColumns(o.footerColumns, base.footerColumns),
    breadcrumbCart: str(o.breadcrumbCart, base.breadcrumbCart),
    cartPageTitle: str(o.cartPageTitle, base.cartPageTitle),
    loadingCart: str(o.loadingCart, base.loadingCart),
    clearCartHint: str(o.clearCartHint, base.clearCartHint),
    emptyCartMessage: str(o.emptyCartMessage, base.emptyCartMessage),
    continueShopping: str(o.continueShopping, base.continueShopping),
    orderSummaryTitle: str(o.orderSummaryTitle, base.orderSummaryTitle),
    subtotalLabel: str(o.subtotalLabel, base.subtotalLabel),
    discountsLabel: str(o.discountsLabel, base.discountsLabel),
    totalLabel: str(o.totalLabel, base.totalLabel),
    checkoutBtnLabel: str(o.checkoutBtnLabel, base.checkoutBtnLabel),
    breadcrumbWishlist: str(o.breadcrumbWishlist, base.breadcrumbWishlist),
    wishlistPageTitle: str(o.wishlistPageTitle, base.wishlistPageTitle),
    emptyWishlistMessage: str(o.emptyWishlistMessage, base.emptyWishlistMessage),
    loadingWishlist: str(o.loadingWishlist, base.loadingWishlist),
    addToCartBtn: str(o.addToCartBtn, base.addToCartBtn),
    removeBtn: str(o.removeBtn, base.removeBtn),
    removeFromWishlistAria: str(o.removeFromWishlistAria, base.removeFromWishlistAria),
    addToWishlistAria: str(o.addToWishlistAria, base.addToWishlistAria),
    productMetaLabel: str(o.productMetaLabel, base.productMetaLabel),
    productNotFound: str(o.productNotFound, base.productNotFound),
    backToShop: str(o.backToShop, base.backToShop),
    quantityLabel: str(o.quantityLabel, base.quantityLabel),
    wishlistBtn: str(o.wishlistBtn, base.wishlistBtn),
    zoomBtnLabel: str(o.zoomBtnLabel, base.zoomBtnLabel),
    zoomAriaLabel: str(o.zoomAriaLabel, base.zoomAriaLabel),
    noCoverImage: str(o.noCoverImage, base.noCoverImage),
    authorPlaceholder: str(o.authorPlaceholder, base.authorPlaceholder),
    formatLabel: str(o.formatLabel, base.formatLabel),
    isbnLabel: str(o.isbnLabel, base.isbnLabel),
    publisherLabel: str(o.publisherLabel, base.publisherLabel),
    pagesLabel: str(o.pagesLabel, base.pagesLabel),
    releaseDateLabel: str(o.releaseDateLabel, base.releaseDateLabel),
    deliveryLabel: str(o.deliveryLabel, base.deliveryLabel),
    postcodePlaceholder: str(o.postcodePlaceholder, base.postcodePlaceholder),
    emptyValueLabel: str(o.emptyValueLabel, base.emptyValueLabel),
    closeZoomAriaLabel: str(o.closeZoomAriaLabel, base.closeZoomAriaLabel),
    closeZoomButtonLabel: str(o.closeZoomButtonLabel, base.closeZoomButtonLabel),
    zoomOutAriaLabel: str(o.zoomOutAriaLabel, base.zoomOutAriaLabel),
    zoomOutButtonLabel: str(o.zoomOutButtonLabel, base.zoomOutButtonLabel),
    zoomInAriaLabel: str(o.zoomInAriaLabel, base.zoomInAriaLabel),
    zoomInButtonLabel: str(o.zoomInButtonLabel, base.zoomInButtonLabel),
    zoomDialogAriaLabel: str(o.zoomDialogAriaLabel, base.zoomDialogAriaLabel),
    tabSummaryLabel: str(o.tabSummaryLabel, base.tabSummaryLabel),
    tabSummaryContent: str(o.tabSummaryContent, base.tabSummaryContent),
    tabBookDetailsLabel: str(o.tabBookDetailsLabel, base.tabBookDetailsLabel),
    tabReviewsLabel: str(o.tabReviewsLabel, base.tabReviewsLabel),
    tabReviewsContent: str(o.tabReviewsContent, base.tabReviewsContent),
    tabReturnsLabel: str(o.tabReturnsLabel, base.tabReturnsLabel),
    tabReturnsContent: str(o.tabReturnsContent, base.tabReturnsContent),
    breadcrumbAriaLabel: str(o.breadcrumbAriaLabel, base.breadcrumbAriaLabel),
    quantityGroupAriaLabel: str(o.quantityGroupAriaLabel, base.quantityGroupAriaLabel),
    decreaseQuantityAriaLabel: str(o.decreaseQuantityAriaLabel, base.decreaseQuantityAriaLabel),
    increaseQuantityAriaLabel: str(o.increaseQuantityAriaLabel, base.increaseQuantityAriaLabel),
    cartItemNoImageText: str(o.cartItemNoImageText, base.cartItemNoImageText),
    skuLabel: str(o.skuLabel, base.skuLabel),
    removeItemLabel: str(o.removeItemLabel, base.removeItemLabel),
    removeItemAriaLabelTemplate: str(o.removeItemAriaLabelTemplate, base.removeItemAriaLabelTemplate),
    moneyLocale: str(o.moneyLocale, base.moneyLocale),
    moneyCurrency: str(o.moneyCurrency, base.moneyCurrency),
    moneyMinFractionDigits: num(o.moneyMinFractionDigits, base.moneyMinFractionDigits),
    moneyMaxFractionDigits: num(o.moneyMaxFractionDigits, base.moneyMaxFractionDigits),
  };
}

function fromFile(c: unknown): AppConfig {
  return mergeConfig(normalizeConfig(c), FALLBACK);
}

let config: AppConfig | null = null;
const defaultFromFile: AppConfig = fromFile(defaultConfig);

export async function loadConfig(): Promise<AppConfig> {
  if (config) return config;
  config = defaultFromFile;
  // Only fetch public/config.json in production (deployed dist). Local dev uses src/core/config/config.json only.
  if (!import.meta.env.PROD) return config;
  try {
    const base = (import.meta.env.BASE_URL ?? '/').replace(/\/?$/, '/');
    const res = await fetch(`${base}config.json`, { cache: 'no-store' });
    if (!res.ok) return config;
    const data = (await res.json()) as unknown;
    config = mergeConfig(normalizeConfig(data), config);
    return config;
  } catch {
    return config;
  }
}

function get<K extends keyof AppConfig>(key: K): AppConfig[K] {
  return config?.[key] ?? defaultFromFile[key];
}

export function getApiBaseUrl(): string { return get('apiBaseUrl'); }
export function getApiPathPrefix(): string { return get('apiPathPrefix'); }
export function getAppName(): string { return get('appName'); }
export function getSiteTitle(): string { return get('siteTitle'); }
export function getBrandAriaLabel(): string { return get('brandAriaLabel'); }
export function getSearchPlaceholder(): string { return get('searchPlaceholder'); }
export function getStorageKeyCart(): string { return get('storageKeyCart'); }
export function getStorageKeyWishlist(): string { return get('storageKeyWishlist'); }
export function getCopyrightText(): string { return get('copyrightText'); }
export function getBreadcrumbHome(): string { return get('breadcrumbHome'); }
export function getBreadcrumbSeparator(): string { return get('breadcrumbSeparator'); }
export function getCategoryLabel(): string { return get('categoryLabel'); }
export function getHomePageTitle(): string { return get('homePageTitle'); }
export function getHomePageSubtitle(): string { return get('homePageSubtitle'); }
export function getSortByLabel(): string { return get('sortByLabel'); }
export function getSortOptionTitle(): string { return get('sortOptionTitle'); }
export function getSortOptionPrice(): string { return get('sortOptionPrice'); }
export function getLoadingProducts(): string { return get('loadingProducts'); }
export function getErrorRetryHint(): string { return get('errorRetryHint'); }
export function getErrorRetryCode(): string { return get('errorRetryCode'); }
export function getErrorLoadProductsDefault(): string { return get('errorLoadProductsDefault'); }
export function getRetryBtn(): string { return get('retryBtn'); }
export function getSearchAriaLabel(): string { return get('searchAriaLabel'); }
export function getAccountAriaLabel(): string { return get('accountAriaLabel'); }
export function getWishlistAriaLabel(): string { return get('wishlistAriaLabel'); }
export function getWishlistAriaLabelWithCount(count: number): string {
  return get('wishlistAriaLabelWithCount').replace('{count}', String(count));
}
export function getCartAriaLabel(): string { return get('cartAriaLabel'); }
export function getNavItems(): NavItem[] { return get('navItems'); }
export function getFooterColumns(): FooterColumn[] { return get('footerColumns'); }
export function getBreadcrumbCart(): string { return get('breadcrumbCart'); }
export function getCartPageTitle(): string { return get('cartPageTitle'); }
export function getLoadingCart(): string { return get('loadingCart'); }
export function getClearCartHint(): string { return get('clearCartHint'); }
export function getEmptyCartMessage(): string { return get('emptyCartMessage'); }
export function getContinueShopping(): string { return get('continueShopping'); }
export function getOrderSummaryTitle(): string { return get('orderSummaryTitle'); }
export function getSubtotalLabel(): string { return get('subtotalLabel'); }
export function getDiscountsLabel(): string { return get('discountsLabel'); }
export function getTotalLabel(): string { return get('totalLabel'); }
export function getCheckoutBtnLabel(): string { return get('checkoutBtnLabel'); }
export function getBreadcrumbWishlist(): string { return get('breadcrumbWishlist'); }
export function getWishlistPageTitle(): string { return get('wishlistPageTitle'); }
export function getEmptyWishlistMessage(): string { return get('emptyWishlistMessage'); }
export function getLoadingWishlist(): string { return get('loadingWishlist'); }
export function getAddToCartBtn(): string { return get('addToCartBtn'); }
export function getRemoveBtn(): string { return get('removeBtn'); }
export function getRemoveFromWishlistAria(): string { return get('removeFromWishlistAria'); }
export function getAddToWishlistAria(): string { return get('addToWishlistAria'); }
export function getProductMetaLabel(): string { return get('productMetaLabel'); }
export function getProductNotFound(): string { return get('productNotFound'); }
export function getBackToShop(): string { return get('backToShop'); }
export function getQuantityLabel(): string { return get('quantityLabel'); }
export function getWishlistBtn(): string { return get('wishlistBtn'); }
export function getZoomBtnLabel(): string { return get('zoomBtnLabel'); }
export function getZoomAriaLabel(): string { return get('zoomAriaLabel'); }
export function getNoCoverImage(): string { return get('noCoverImage'); }
export function getAuthorPlaceholder(): string { return get('authorPlaceholder'); }
export function getFormatLabel(): string { return get('formatLabel'); }
export function getIsbnLabel(): string { return get('isbnLabel'); }
export function getPublisherLabel(): string { return get('publisherLabel'); }
export function getPagesLabel(): string { return get('pagesLabel'); }
export function getReleaseDateLabel(): string { return get('releaseDateLabel'); }
export function getDeliveryLabel(): string { return get('deliveryLabel'); }
export function getPostcodePlaceholder(): string { return get('postcodePlaceholder'); }
export function getEmptyValueLabel(): string { return get('emptyValueLabel'); }
export function getCloseZoomAriaLabel(): string { return get('closeZoomAriaLabel'); }
export function getCloseZoomButtonLabel(): string { return get('closeZoomButtonLabel'); }
export function getErrorRequestFailed(): string { return get('errorRequestFailed'); }
export function getZoomOutAriaLabel(): string { return get('zoomOutAriaLabel'); }
export function getZoomOutButtonLabel(): string { return get('zoomOutButtonLabel'); }
export function getZoomInAriaLabel(): string { return get('zoomInAriaLabel'); }
export function getZoomInButtonLabel(): string { return get('zoomInButtonLabel'); }
export function getZoomDialogAriaLabel(): string { return get('zoomDialogAriaLabel'); }
export function getTabSummaryLabel(): string { return get('tabSummaryLabel'); }
export function getTabSummaryContent(): string { return get('tabSummaryContent'); }
export function getTabBookDetailsLabel(): string { return get('tabBookDetailsLabel'); }
export function getTabReviewsLabel(): string { return get('tabReviewsLabel'); }
export function getTabReviewsContent(): string { return get('tabReviewsContent'); }
export function getTabReturnsLabel(): string { return get('tabReturnsLabel'); }
export function getTabReturnsContent(): string { return get('tabReturnsContent'); }
export function getBreadcrumbAriaLabel(): string { return get('breadcrumbAriaLabel'); }
export function getQuantityGroupAriaLabel(): string { return get('quantityGroupAriaLabel'); }
export function getDecreaseQuantityAriaLabel(): string { return get('decreaseQuantityAriaLabel'); }
export function getIncreaseQuantityAriaLabel(): string { return get('increaseQuantityAriaLabel'); }
export function getCartItemNoImageText(): string { return get('cartItemNoImageText'); }
export function getSkuLabel(): string { return get('skuLabel'); }
export function getRemoveItemLabel(): string { return get('removeItemLabel'); }
export function getRemoveItemAriaLabel(name: string): string {
  return get('removeItemAriaLabelTemplate').replace('{name}', name);
}
export function getMoneyLocale(): string { return get('moneyLocale'); }
export function getMoneyCurrency(): string { return get('moneyCurrency'); }
export function getMoneyMinFractionDigits(): number { return get('moneyMinFractionDigits'); }
export function getMoneyMaxFractionDigits(): number { return get('moneyMaxFractionDigits'); }
