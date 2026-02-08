import { Cart } from '../Cart';
import { Product } from '../Product';
import { DiscountRule, DiscountResult } from './DiscountRule';

/**
 * Multi-buy-free deal: for every groupSize of sku, freeCount items are free.
 * Example: groupSize 3, freeCount 1 = "Buy 3 get 1 free".
 */
export class ThreeForTwoRule implements DiscountRule {
  readonly id: string;

  constructor(
    private readonly sku: string,
    private readonly groupSize: number = 3,
    private readonly freeCount: number = 1
  ) {
    this.id = `multi-buy-free-${sku}`;
  }

  applies(cart: Cart): boolean {
    return cart.getQuantity(this.sku) >= this.groupSize;
  }

  calculate(cart: Cart, products: Map<string, Product>): DiscountResult | null {
    const qty = cart.getQuantity(this.sku);
    if (qty < this.groupSize) return null;

    const product = products.get(this.sku);
    if (!product) return null;

    const unitPriceCents = product.getPriceCents();
    const groups = Math.floor(qty / this.groupSize);
    const freeItems = groups * this.freeCount;
    const amountCents = -(freeItems * unitPriceCents); // negative = discount

    return {
      ruleId: this.id,
      description: `Buy ${this.groupSize} get ${this.freeCount} free: ${freeItems} free on ${product.name}`,
      amountCents,
      meta: {
        sku: this.sku,
        qty,
        groupSize: this.groupSize,
        freeCount: this.freeCount,
        freeItems,
        unitPrice: unitPriceCents / 100,
      },
    };
  }
}
