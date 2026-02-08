import { CartRepository } from '../repositories/CartRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { PricingEngine } from '../domain/PricingEngine';
import { PricingSummary } from '../domain/PricingEngine';

export class CartService {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly productRepo: ProductRepository,
    private readonly pricingEngine: PricingEngine
  ) {}

  createCart(): { cartId: string } {
    const cart = this.cartRepo.create();
    return { cartId: cart.id };
  }

  getCartSummary(cartId: string): PricingSummary | null {
    const cart = this.cartRepo.getById(cartId);
    if (!cart) return null;
    const products = this.productRepo.getMap();
    return this.pricingEngine.calculate(cart, products);
  }

  updateCartItems(
    cartId: string,
    sku: string,
    quantityDelta: number
  ): PricingSummary | null {
    const cart = this.cartRepo.getById(cartId);
    if (!cart) return null;
    cart.updateQuantity(sku, quantityDelta);
    this.cartRepo.save(cart);
    return this.getCartSummary(cartId);
  }

  getCartItemCount(cartId: string): number {
    const cart = this.cartRepo.getById(cartId);
    if (!cart) return 0;
    return cart.getItems().reduce((sum, item) => sum + item.quantity, 0);
  }
}
