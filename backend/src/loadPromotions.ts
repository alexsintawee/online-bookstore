import * as fs from 'fs';
import * as path from 'path';
import type { DiscountRule } from './domain/discounts/DiscountRule';
import { BulkPriceRule } from './domain/discounts/BulkPriceRule';
import { ThreeForTwoRule } from './domain/discounts/ThreeForTwoRule';
import { parseCsv, rowToObject } from './parseCsv';

export interface BulkPricePromotion {
  type: 'bulk_price';
  id: string;
  sku: string;
  minQuantity: number;
  discountedUnitPrice: number;
  description?: string;
}

export interface MultiBuyFreePromotion {
  type: 'multi_buy_free';
  id: string;
  sku: string;
  /** Size of each group (e.g. 3 = "buy 3") */
  groupSize: number;
  /** How many items are free per group (e.g. 1 = "get 1 free") */
  freeCount: number;
  description?: string;
}

export type PromotionRow = BulkPricePromotion | MultiBuyFreePromotion;

export interface PromotionConfig {
  promotions: PromotionRow[];
}

const DEFAULT_RULES: DiscountRule[] = [
  new BulkPriceRule('9780201835953', 10, 2199),
  new ThreeForTwoRule('9781430219484'),
];

function parsePromotions(raw: unknown): DiscountRule[] {
  const config = raw as PromotionConfig;
  if (!config?.promotions || !Array.isArray(config.promotions)) return DEFAULT_RULES;

  const rules: DiscountRule[] = [];
  for (const p of config.promotions) {
    if (!p?.type || !p?.sku) continue;
    if (p.type === 'bulk_price') {
      const bulk = p as BulkPricePromotion;
      const minQty = Number(bulk.minQuantity);
      const priceCents = Math.round(Number(bulk.discountedUnitPrice) * 100);
      if (minQty >= 1 && priceCents >= 0) {
        rules.push(new BulkPriceRule(bulk.sku, minQty, priceCents));
      }
    } else if (p.type === 'multi_buy_free') {
      const mb = p as MultiBuyFreePromotion;
      const groupSize = Math.max(1, Number(mb.groupSize) || 3);
      const freeCount = Math.max(0, Math.min(Number(mb.freeCount) || 1, groupSize));
      rules.push(new ThreeForTwoRule(mb.sku, groupSize, freeCount));
    }
  }
  return rules.length > 0 ? rules : DEFAULT_RULES;
}

function parsePromotionsFromCsv(raw: string): DiscountRule[] {
  const { headers, rows } = parseCsv(raw);
  const rules: DiscountRule[] = [];
  for (const values of rows) {
    const p = rowToObject(headers, values);
    if (!p.type || !p.sku) continue;
    if (p.type === 'bulk_price') {
      const minQty = Number(p.minQuantity);
      const priceCents = Math.round(Number(p.discountedUnitPrice) * 100);
      if (minQty >= 1 && priceCents >= 0) {
        rules.push(new BulkPriceRule(p.sku, minQty, priceCents));
      }
    } else if (p.type === 'multi_buy_free') {
      const groupSize = Math.max(1, Number(p.groupSize) || 3);
      const freeCount = Math.max(0, Math.min(Number(p.freeCount) || 1, groupSize));
      rules.push(new ThreeForTwoRule(p.sku, groupSize, freeCount));
    }
  }
  return rules.length > 0 ? rules : DEFAULT_RULES;
}

/**
 * Load discount rules from data/source/csv/promotion.csv (or .json fallback).
 * CSV preferred for content-admin friendliness.
 */
export function loadPromotions(dataDir: string): DiscountRule[] {
  const csvCandidates = [
    path.join(dataDir, 'source/csv/promotion.csv'),
    path.join(process.cwd(), 'data/source/csv/promotion.csv'),
    path.join(process.cwd(), '../data/source/csv/promotion.csv'),
  ];
  for (const p of csvCandidates) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf-8');
        return parsePromotionsFromCsv(raw);
      } catch (err) {
        console.warn('Failed to load promotion.csv, using default rules:', err);
        return DEFAULT_RULES;
      }
    }
  }
  const jsonCandidates = [
    path.join(dataDir, 'source/json/promotion.json'),
    path.join(process.cwd(), 'data/source/json/promotion.json'),
    path.join(process.cwd(), '../data/source/json/promotion.json'),
  ];
  for (const p of jsonCandidates) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf-8');
        return parsePromotions(JSON.parse(raw));
      } catch (err) {
        console.warn('Failed to load promotion.json, using default rules:', err);
        return DEFAULT_RULES;
      }
    }
  }
  return DEFAULT_RULES;
}

const DEFAULT_PROMOTION_DATA: PromotionRow[] = [
  { type: 'bulk_price', id: 'bulk-mythical-man-month', sku: '9780201835953', minQuantity: 10, discountedUnitPrice: 21.99 },
  { type: 'multi_buy_free', id: '3-for-2-coders-at-work', sku: '9781430219484', groupSize: 3, freeCount: 1 },
];

function csvRowsToPromotionData(headers: string[], rows: string[][]): PromotionRow[] {
  const result: PromotionRow[] = [];
  for (const values of rows) {
    const p = rowToObject(headers, values);
    if (!p.type || !p.sku) continue;
    if (p.type === 'bulk_price') {
      result.push({
        type: 'bulk_price',
        id: p.id ?? p.sku,
        sku: p.sku,
        minQuantity: Number(p.minQuantity) || 0,
        discountedUnitPrice: Number(p.discountedUnitPrice) || 0,
        description: p.description,
      });
    } else if (p.type === 'multi_buy_free') {
      result.push({
        type: 'multi_buy_free',
        id: p.id ?? p.sku,
        sku: p.sku,
        groupSize: Number(p.groupSize) || 3,
        freeCount: Number(p.freeCount) || 1,
        description: p.description,
      });
    }
  }
  return result;
}

/**
 * Load promotion data for API (same source as loadPromotions).
 * Returns { promotions: PromotionRow[] } for GET /api/promotions.
 */
export function getPromotionData(dataDir: string): { promotions: PromotionRow[] } {
  const csvCandidates = [
    path.join(dataDir, 'source/csv/promotion.csv'),
    path.join(process.cwd(), 'data/source/csv/promotion.csv'),
    path.join(process.cwd(), '../data/source/csv/promotion.csv'),
  ];
  for (const p of csvCandidates) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf-8');
        const { headers, rows } = parseCsv(raw);
        const promotions = csvRowsToPromotionData(headers, rows);
        return { promotions: promotions.length > 0 ? promotions : DEFAULT_PROMOTION_DATA };
      } catch (err) {
        console.warn('Failed to read promotion.csv for API:', err);
        return { promotions: DEFAULT_PROMOTION_DATA };
      }
    }
  }
  const jsonCandidates = [
    path.join(dataDir, 'source/json/promotion.json'),
    path.join(process.cwd(), 'data/source/json/promotion.json'),
    path.join(process.cwd(), '../data/source/json/promotion.json'),
  ];
  for (const p of jsonCandidates) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf-8');
        const config = JSON.parse(raw) as PromotionConfig;
        if (config?.promotions?.length) return config;
        return { promotions: DEFAULT_PROMOTION_DATA };
      } catch (err) {
        console.warn('Failed to read promotion.json for API:', err);
        return { promotions: DEFAULT_PROMOTION_DATA };
      }
    }
  }
  return { promotions: DEFAULT_PROMOTION_DATA };
}
