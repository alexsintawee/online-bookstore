/**
 * Cart line item: SKU and quantity.
 */
export class CartItem {
  constructor(
    public readonly sku: string,
    public quantity: number
  ) {
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }
  }

  clone(): CartItem {
    return new CartItem(this.sku, this.quantity);
  }
}
