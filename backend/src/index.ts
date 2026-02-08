import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
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

// Serve frontend SPA: env FRONTEND_DIST, or backend/frontend-dist, or online-bookstore/frontend-dist (sibling)
const frontendDistEnv = process.env.FRONTEND_DIST;
const frontendDistInBackend = path.join(__dirname, '../frontend-dist');
const frontendDistSibling = path.join(__dirname, '../../frontend-dist');
const frontendDist = (frontendDistEnv && fs.existsSync(frontendDistEnv))
  ? frontendDistEnv
  : fs.existsSync(frontendDistInBackend)
    ? frontendDistInBackend
    : fs.existsSync(frontendDistSibling)
      ? frontendDistSibling
      : '';
if (frontendDist) {
  const sendIndex = (_req: express.Request, res: express.Response) =>
    res.sendFile(path.join(frontendDist, 'index.html'));
  const assetsDir = path.join(frontendDist, 'assets');
  // Serve JS/CSS with explicit MIME type so browser never gets text/html
  const sendAsset = (req: express.Request, res: express.Response) => {
    const file = path.join(assetsDir, req.params.filename);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile())
      return res.status(404).end();
    const ext = path.extname(file).toLowerCase();
    if (ext === '.js') res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    else if (ext === '.css') res.setHeader('Content-Type', 'text/css; charset=utf-8');
    res.sendFile(path.resolve(file));
  };
  // Fallback path FIRST so GET /online-bookstore/assets/* is served as static
  if (fallbackPath !== basePath) {
    app.get(fallbackPath + '/assets/:filename', sendAsset);
    app.use(fallbackPath, express.static(frontendDist, { index: false }));
    app.get(fallbackPath, sendIndex);
    app.get(fallbackPath + '/', sendIndex);
    app.get(fallbackPath + '/*', sendIndex);
  }
  app.get(basePath + '/assets/:filename', sendAsset);
  app.use(basePath, express.static(frontendDist, { index: false }));
  app.get(basePath, sendIndex);
  app.get(basePath + '/', sendIndex);
  app.get(basePath + '/*', sendIndex);
  app.get('/assets/:filename', sendAsset);
  app.use('/assets', express.static(assetsDir, { index: false }));
  app.get('/', sendIndex);
  app.get('/*', (req, res) => {
    const file = path.join(frontendDist, req.path);
    if (fs.existsSync(file) && fs.statSync(file).isFile())
      return res.sendFile(path.resolve(file));
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Online Bookstore API running at http://localhost:${PORT}`);
});
