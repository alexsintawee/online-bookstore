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

// Serve product images from data/source/images at /api/images and /images
app.use('/api/images', express.static(imagesPath));
app.use('/images', express.static(imagesPath));

app.use(createProductsRouter(productService));
app.use(createCartRouter(cartService));
app.use(createPromotionsRouter(projectData));

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Online Bookstore API running at http://localhost:${PORT}`);
});
