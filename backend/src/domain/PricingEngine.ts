import { Cart } from './Cart';
import { Product } from './Product';
import { Money } from './Money';
import { DiscountRule, DiscountResult } from './discounts/DiscountRule';

export interface LineItemSummary {
  sku: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineSubtotal: number;
  imageUrl: string;
}

export interface DiscountSummary {
  ruleId: string;
  description: string;
  amount: number;
  meta?: Record<string, unknown>;
}

export interface TotalsSummary {
  subtotal: number;
  discountTotal: number;
  total: number;
}

export interface PricingSummary {
  items: LineItemSummary[];
  discounts: DiscountSummary[];
  totals: TotalsSummary;
}

/**
 * Runs all registered discount rules and returns a full pricing summary.
 * All amounts in summary are in dollars (2 decimals) for API output.
 */
export class PricingEngine {
  constructor(private readonly rules: DiscountRule[]) {}

  calculate(cart: Cart, products: Map<string, Product>): PricingSummary {
    const items: LineItemSummary[] = [];
    let subtotalCents = 0;

    for (const cartItem of cart.getItems()) {
      const product = products.get(cartItem.sku);
      if (!product) continue;

      const unitPriceCents = product.getPriceCents();
      const lineSubtotalCents = unitPriceCents * cartItem.quantity;
      subtotalCents += lineSubtotalCents;

      const imageUrl = product.image
        ? product.image.startsWith('/') || product.image.startsWith('http')
          ? product.image
          : `/api/images/${product.image}`
        : `/api/images/${product.sku}.svg`;

      items.push({
        sku: cartItem.sku,
        name: product.name,
        unitPrice: roundDollars(unitPriceCents / 100),
        quantity: cartItem.quantity,
        lineSubtotal: roundDollars(lineSubtotalCents / 100),
        imageUrl,
      });
    }

    const discounts: DiscountSummary[] = [];
    let discountTotalCents = 0;

    for (const rule of this.rules) {
      if (!rule.applies(cart)) continue;
      const result = rule.calculate(cart, products);
      if (result && result.amountCents !== 0) {
        discounts.push({
          ruleId: result.ruleId,
          description: result.description,
          amount: roundDollars(result.amountCents / 100),
          meta: result.meta,
        });
        discountTotalCents += result.amountCents;
      }
    }

    const totalCents = subtotalCents + discountTotalCents;

    return {
      items,
      discounts,
      totals: {
        subtotal: roundDollars(subtotalCents / 100),
        discountTotal: roundDollars(discountTotalCents / 100),
        total: roundDollars(totalCents / 100),
      },
    };
  }
}

function roundDollars(value: number): number {
  return Math.round(value * 100) / 100;
}
