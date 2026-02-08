import { Money } from './Money';

/**
 * Product entity. Price is stored in cents internally.
 */
export class Product {
  constructor(
    public readonly sku: string,
    public readonly name: string,
    private readonly priceCents: number,
    public readonly image?: string
  ) {}

  getPrice(): Money {
    return Money.fromCents(this.priceCents);
  }

  getPriceCents(): number {
    return this.priceCents;
  }
}
