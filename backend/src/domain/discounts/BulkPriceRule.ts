import { Cart } from '../Cart';
import { Product } from '../Product';
import { DiscountRule, DiscountResult } from './DiscountRule';

/**
 * Bulk price override: if cart has minQty or more of sku, each item is priced at bulkUnitPriceCents.
 * Example: 10+ of 9780201835953 @ $21.99 each.
 */
export class BulkPriceRule implements DiscountRule {
  readonly id: string;

  constructor(
    private readonly sku: string,
    private readonly minQty: number,
    private readonly bulkUnitPriceCents: number
  ) {
    this.id = `bulk-price-${sku}`;
  }

  applies(cart: Cart): boolean {
    return cart.getQuantity(this.sku) >= this.minQty;
  }

  calculate(cart: Cart, products: Map<string, Product>): DiscountResult | null {
    const qty = cart.getQuantity(this.sku);
    if (qty < this.minQty) return null;

    const product = products.get(this.sku);
    if (!product) return null;

    const unitPriceBefore = product.getPriceCents();
    const subtotalBefore = unitPriceBefore * qty;
    const subtotalAfter = this.bulkUnitPriceCents * qty;
    const amountCents = subtotalAfter - subtotalBefore; // negative = discount

    return {
      ruleId: this.id,
      description: `Bulk price applied to ${product.name} (${this.minQty}+ @ $${(this.bulkUnitPriceCents / 100).toFixed(2)})`,
      amountCents,
      meta: {
        sku: this.sku,
        qty,
        unitPriceBefore: unitPriceBefore / 100,
        unitPriceAfter: this.bulkUnitPriceCents / 100,
      },
    };
  }
}
