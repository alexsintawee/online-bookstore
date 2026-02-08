import { Router } from 'express';
import { ProductService } from '../../services/ProductService';

export function createProductsRouter(productService: ProductService): Router {
  const router = Router();

  router.get('/api/products', (_req, res) => {
    try {
      const products = productService.getAllProducts();
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load products' });
    }
  });

  return router;
}
