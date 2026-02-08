import { describe, it, expect } from 'vitest';
import { Cart } from '../Cart';
import { Product } from '../Product';
import { PricingEngine } from '../PricingEngine';
import { BulkPriceRule } from '../discounts/BulkPriceRule';
import { ThreeForTwoRule } from '../discounts/ThreeForTwoRule';

const products = new Map<string, Product>([
  [ '9325336028278', new Product('9325336028278', 'The Fresh Prince of Bel-Air', 1999) ],
  [ '9780201835953', new Product('9780201835953', 'The Mythical Man-Month', 3187) ],
  [ '9781430219484', new Product('9781430219484', 'Coders at Work', 2872) ],
  [ '9780132071482', new Product('9780132071482', 'Artificial Intelligence', 11992) ],
]);

const rules = [
  new BulkPriceRule('9780201835953', 10, 2199),
  new ThreeForTwoRule('9781430219484'),
];
const engine = new PricingEngine(rules);

describe('PricingEngine', () => {
  it('Example 1: Cart 9780201835953 x10 + 9325336028278 x1 => total 239.89', () => {
    const cart = new Cart('ex1');
    cart.setQuantity('9780201835953', 10);
    cart.setQuantity('9325336028278', 1);
    const summary = engine.calculate(cart, products);
    expect(summary.totals.subtotal).toBe(338.69);
    expect(summary.totals.discountTotal).toBe(-98.8);
    expect(summary.totals.total).toBe(239.89);
  });

  it('Example 2: Cart 9781430219484 x3 + 9780132071482 x1 => total 177.36', () => {
    const cart = new Cart('ex2');
    cart.setQuantity('9781430219484', 3);
    cart.setQuantity('9780132071482', 1);
    const summary = engine.calculate(cart, products);
    expect(summary.totals.subtotal).toBe(206.08);
    expect(summary.totals.discountTotal).toBe(-28.72);
    expect(summary.totals.total).toBe(177.36);
  });

  it('Bulk boundary: 9 items no bulk discount', () => {
    const cart = new Cart('b9');
    cart.setQuantity('9780201835953', 9);
    const summary = engine.calculate(cart, products);
    expect(summary.discounts.length).toBe(0);
    expect(summary.totals.total).toBe(9 * 31.87);
  });

  it('Bulk boundary: 10 items gets bulk discount', () => {
    const cart = new Cart('b10');
    cart.setQuantity('9780201835953', 10);
    const summary = engine.calculate(cart, products);
    expect(summary.discounts.length).toBe(1);
    expect(summary.totals.total).toBe(219.9);
  });
});
