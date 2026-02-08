import express from 'express';
import cors from 'cors';
import path from 'path';
import { ProductRepository } from './repositories/ProductRepository';
import { CartRepository } from './repositories/CartRepository';
import { PricingEngine } from './domain/PricingEngine';
import { ProductService } from './services/ProductService';
import { CartService } from './services/CartService';
import { createProductsRouter } from './api/routes/products';
import { createCartRouter } from './api/routes/cart';
import { createPromotionsRouter } from './api/routes/promotions';
import { loadPromotions } from './loadPromotions';

// From dist/: __dirname = backend/dist -> ../../ = online-bookstore, so ../../data = online-bookstore/data
const projectData = path.join(__dirname, '../../data');
const imagesPath = path.join(projectData, 'source/images');

const productRepo = new ProductRepository(projectData);
const cartRepo = new CartRepository();

const discountRules = loadPromotions(projectData);
const pricingEngine = new PricingEngine(discountRules);

const productService = new ProductService(productRepo);
const cartService = new CartService(cartRepo, productRepo, pricingEngine);

const app = express();
app.use(cors());
app.use(express.json());

// Base path for reverse proxy (e.g. cPanel: set BASE_PATH=/online-bookstore)
const basePath = process.env.BASE_PATH || '';

// Serve product images from data/source/images at /api/images and /images
app.use(basePath + '/api/images', express.static(imagesPath));
app.use(basePath + '/images', express.static(imagesPath));
// Also at root so /api/images works when proxy strips prefix
if (basePath) {
  app.use('/api/images', express.static(imagesPath));
  app.use('/images', express.static(imagesPath));
}

// Mount at base path (proxy forwards full path, e.g. /online-bookstore/api/products)
app.use(basePath, createProductsRouter(productService));
app.use(basePath, createCartRouter(cartService));
app.use(basePath, createPromotionsRouter(projectData));
// Also at root (proxy strips prefix and forwards /api/products)
app.use('', createProductsRouter(productService));
app.use('', createCartRouter(cartService));
app.use('', createPromotionsRouter(projectData));
// When BASE_PATH is not passed by cPanel, proxy still sends /online-bookstore/api/products — mount at /online-bookstore
const fallbackPath = '/online-bookstore';
if (fallbackPath !== basePath) {
  app.use(fallbackPath + '/api/images', express.static(imagesPath));
  app.use(fallbackPath + '/images', express.static(imagesPath));
  app.use(fallbackPath, createProductsRouter(productService));
  app.use(fallbackPath, createCartRouter(cartService));
  app.use(fallbackPath, createPromotionsRouter(projectData));
}

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Online Bookstore API running at http://localhost:${PORT}`);
});
