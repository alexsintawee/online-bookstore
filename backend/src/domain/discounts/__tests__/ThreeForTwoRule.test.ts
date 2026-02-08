import { describe, it, expect } from 'vitest';
import { Cart } from '../../Cart';
import { Product } from '../../Product';
import { ThreeForTwoRule } from '../ThreeForTwoRule';

const product = new Product('9781430219484', 'Coders at Work', 2872); // $28.72
const products = new Map<string, Product>([[product.sku, product]]);

describe('ThreeForTwoRule', () => {
  const rule = new ThreeForTwoRule('9781430219484');

  it('does not apply for qty 1 or 2', () => {
    const cart2 = new Cart('c2');
    cart2.setQuantity('9781430219484', 2);
    expect(rule.applies(cart2)).toBe(false);
    expect(rule.calculate(cart2, products)).toBeNull();
  });

  it('applies for qty 3: 1 free', () => {
    const cart = new Cart('c3');
    cart.setQuantity('9781430219484', 3);
    expect(rule.applies(cart)).toBe(true);
    const result = rule.calculate(cart, products);
    expect(result).not.toBeNull();
    expect(result!.amountCents).toBe(-2872); // 1 * 28.72
  });

  it('qty 4: still 1 free', () => {
    const cart = new Cart('c4');
    cart.setQuantity('9781430219484', 4);
    const result = rule.calculate(cart, products);
    expect(result!.amountCents).toBe(-2872);
  });

  it('qty 6: 2 free', () => {
    const cart = new Cart('c6');
    cart.setQuantity('9781430219484', 6);
    const result = rule.calculate(cart, products);
    expect(result!.amountCents).toBe(-5744); // 2 * 28.72
  });
});
