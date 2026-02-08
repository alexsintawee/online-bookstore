import { describe, it, expect } from 'vitest';
import { Cart } from '../../Cart';
import { Product } from '../../Product';
import { BulkPriceRule } from '../BulkPriceRule';

const product = new Product('9780201835953', 'The Mythical Man-Month', 3187); // $31.87
const products = new Map<string, Product>([[product.sku, product]]);

describe('BulkPriceRule', () => {
  const rule = new BulkPriceRule('9780201835953', 10, 2199); // 10+ @ $21.99

  it('does not apply when qty < 10', () => {
    const cart = new Cart('c1');
    cart.setQuantity('9780201835953', 9);
    expect(rule.applies(cart)).toBe(false);
    expect(rule.calculate(cart, products)).toBeNull();
  });

  it('applies when qty >= 10', () => {
    const cart = new Cart('c1');
    cart.setQuantity('9780201835953', 10);
    expect(rule.applies(cart)).toBe(true);
    const result = rule.calculate(cart, products);
    expect(result).not.toBeNull();
    // Before: 10 * 31.87 = 318.70, After: 10 * 21.99 = 219.90, discount = -98.80
    expect(result!.amountCents).toBe(21990 - 31870);
    expect(result!.amountCents).toBe(-9880);
  });

  it('boundary: 9 vs 10 items', () => {
    const cart9 = new Cart('c9');
    cart9.setQuantity('9780201835953', 9);
    const cart10 = new Cart('c10');
    cart10.setQuantity('9780201835953', 10);
    expect(rule.applies(cart9)).toBe(false);
    expect(rule.applies(cart10)).toBe(true);
    expect(rule.calculate(cart9, products)).toBeNull();
    const r10 = rule.calculate(cart10, products);
    expect(r10!.amountCents).toBe(-9880);
  });
});
