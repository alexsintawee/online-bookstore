export interface Product {
  sku: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface CartLineItem {
  sku: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineSubtotal: number;
  imageUrl?: string;
}

export interface CartDiscount {
  ruleId: string;
  description: string;
  amount: number;
  meta?: Record<string, unknown>;
}

export interface CartTotals {
  subtotal: number;
  discountTotal: number;
  total: number;
}

export interface CartSummary {
  items: CartLineItem[];
  discounts: CartDiscount[];
  totals: CartTotals;
}

export interface CreateCartResponse {
  cartId: string;
}
