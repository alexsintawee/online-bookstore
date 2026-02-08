import { Cart } from '../Cart';
import { Product } from '../Product';

export interface DiscountResult {
  ruleId: string;
  description: string;
  amountCents: number;
  meta?: Record<string, unknown>;
}

/**
 * Extensible discount rule. New rules are added by creating new classes
 * that implement this interface and registering them with the PricingEngine.
 */
export interface DiscountRule {
  readonly id: string;

  /** Whether this rule applies to the given cart. */
  applies(cart: Cart): boolean;

  /** Calculate discount amount (negative = discount) and metadata. */
  calculate(cart: Cart, products: Map<string, Product>): DiscountResult | null;
}
