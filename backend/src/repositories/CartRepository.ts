import { Cart } from '../domain/Cart';

/**
 * In-memory cart storage. No database or external persistence.
 */
export class CartRepository {
  private carts: Map<string, Cart> = new Map();

  create(): Cart {
    const id = this.generateId();
    const cart = new Cart(id);
    this.carts.set(id, cart);
    return cart;
  }

  getById(id: string): Cart | undefined {
    return this.carts.get(id);
  }

  save(cart: Cart): void {
    this.carts.set(cart.id, cart);
  }

  private generateId(): string {
    return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }
}
