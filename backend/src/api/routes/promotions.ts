import { Router } from 'express';
import { getPromotionData } from '../../loadPromotions';

export function createPromotionsRouter(dataDir: string): Router {
  const router = Router();

  router.get('/api/promotions', (_req, res) => {
    try {
      const data = getPromotionData(dataDir);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load promotions' });
    }
  });

  return router;
}
