import { describe, it, expect } from 'vitest';
import { Money } from '../Money';

describe('Money', () => {
  it('stores and returns cents', () => {
    const m = new Money(1999);
    expect(m.getCents()).toBe(1999);
  });

  it('converts to dollars with 2 decimals', () => {
    expect(Money.fromDollars(19.99).toDollars()).toBe(19.99);
    expect(Money.fromCents(3187).toDollars()).toBe(31.87);
  });

  it('adds and subtracts', () => {
    const a = Money.fromDollars(10);
    const b = Money.fromDollars(3.50);
    expect(a.add(b).toDollars()).toBe(13.5);
    expect(a.subtract(b).toDollars()).toBe(6.5);
  });

  it('multiplies', () => {
    const m = Money.fromDollars(31.87);
    expect(m.multiply(10).toDollars()).toBe(318.7);
  });

  it('zero', () => {
    expect(Money.zero().getCents()).toBe(0);
  });

  it('throws if non-integer cents', () => {
    expect(() => new Money(19.5)).toThrow('integer cents');
  });
});
