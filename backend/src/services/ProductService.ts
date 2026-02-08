import { ProductRepository } from '../repositories/ProductRepository';
import { Product } from '../domain/Product';

export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  getAllProducts(): Array<{ sku: string; name: string; price: number; imageUrl: string }> {
    return this.productRepo.getAll().map((p) => ({
      sku: p.sku,
      name: p.name,
      price: p.getPrice().toDollars(),
      imageUrl: p.image
        ? p.image.startsWith('/') || p.image.startsWith('http')
          ? p.image
          : `/api/images/${p.image}`
        : `/api/images/${p.sku}.svg`,
    }));
  }

  getProductMap(): Map<string, Product> {
    return this.productRepo.getMap();
  }
}
