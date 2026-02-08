import { CartItem } from './CartItem';

/**
 * Cart entity: holds items and supports add/remove/setQty.
 * Quantity cannot go below 0.
 */
export class Cart {
  private items: Map<string, CartItem> = new Map();

  constructor(public readonly id: string) {}

  getItems(): CartItem[] {
    return Array.from(this.items.values()).filter((item) => item.quantity > 0);
  }

  getItem(sku: string): CartItem | undefined {
    return this.items.get(sku);
  }

  getQuantity(sku: string): number {
    return this.items.get(sku)?.quantity ?? 0;
  }

  addItem(sku: string, quantityDelta: number): void {
    if (quantityDelta <= 0) return;
    const existing = this.items.get(sku);
    if (existing) {
      existing.quantity += quantityDelta;
    } else {
      this.items.set(sku, new CartItem(sku, quantityDelta));
    }
  }

  removeItem(sku: string, quantityDelta: number): void {
    if (quantityDelta <= 0) return;
    const existing = this.items.get(sku);
    if (!existing) return;
    existing.quantity = Math.max(0, existing.quantity - quantityDelta);
    if (existing.quantity === 0) {
      this.items.delete(sku);
    }
  }

  setQuantity(sku: string, quantity: number): void {
    if (quantity < 0) quantity = 0;
    if (quantity === 0) {
      this.items.delete(sku);
    } else {
      const existing = this.items.get(sku);
      if (existing) {
        existing.quantity = quantity;
      } else {
        this.items.set(sku, new CartItem(sku, quantity));
      }
    }
  }

  /** Apply quantity delta (add or remove). Quantity cannot go below 0. */
  updateQuantity(sku: string, quantityDelta: number): void {
    const current = this.getQuantity(sku);
    const newQty = Math.max(0, current + quantityDelta);
    this.setQuantity(sku, newQty);
  }

  clone(): Cart {
    const c = new Cart(this.id);
    this.getItems().forEach((item) => {
      c.items.set(item.sku, item.clone());
    });
    return c;
  }
}
