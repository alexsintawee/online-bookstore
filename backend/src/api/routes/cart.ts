import { Router } from 'express';
import { CartService } from '../../services/CartService';

export function createCartRouter(cartService: CartService): Router {
  const router = Router();

  router.post('/api/cart', (_req, res) => {
    try {
      const { cartId } = cartService.createCart();
      res.status(201).json({ cartId });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create cart' });
    }
  });

  router.get('/api/cart/:cartId', (req, res) => {
    const { cartId } = req.params;
    const summary = cartService.getCartSummary(cartId);
    if (!summary) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(summary);
  });

  router.post('/api/cart/:cartId/items', (req, res) => {
    const { cartId } = req.params;
    const { sku, quantityDelta } = req.body;
    if (typeof sku !== 'string' || typeof quantityDelta !== 'number') {
      return res.status(400).json({ error: 'Body must include sku (string) and quantityDelta (number)' });
    }
    const summary = cartService.updateCartItems(cartId, sku, quantityDelta);
    if (!summary) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(summary);
  });

  return router;
}
