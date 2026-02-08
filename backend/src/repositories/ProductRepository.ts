import * as fs from 'fs';
import * as path from 'path';
import { Product } from '../domain/Product';
import { parseCsv, rowToObject } from '../parseCsv';

export interface ProductRow {
  sku: string;
  name: string;
  price: number;
  image?: string;
  imageUrl?: string;
}

const DEFAULT_PRODUCTS: ProductRow[] = [
  { sku: '9325336130810', name: 'Game of Thrones: Season 1', price: 39.49, image: '9325336130810.jpg' },
  { sku: '9325336028278', name: 'The Fresh Prince of Bel-Air', price: 19.99, image: '9325336028278.svg' },
  { sku: '9780201835953', name: 'The Mythical Man-Month', price: 31.87, image: '9780201835953.svg' },
  { sku: '9781430219484', name: 'Coders at Work', price: 28.72, image: '9781430219484.svg' },
  { sku: '9780132071482', name: 'Artificial Intelligence', price: 119.92, image: '9780132071482.svg' },
];

/**
 * Loads products from data/source/csv/products.csv (or .json fallback) into memory.
 * Tries CSV first for content-admin friendliness; falls back to JSON then built-in data.
 */
export class ProductRepository {
  private products: Map<string, Product> = new Map();
  private loaded = false;

  constructor(private readonly dataDir: string) {}

  private resolvePath(): { path: string; format: 'csv' | 'json' } | null {
    const csvCandidates = [
      path.join(this.dataDir, 'source/csv/products.csv'),
      path.resolve(process.cwd(), 'data/source/csv/products.csv'),
      path.resolve(process.cwd(), '../data/source/csv/products.csv'),
    ];
    for (const p of csvCandidates) {
      if (fs.existsSync(p)) return { path: p, format: 'csv' };
    }
    const jsonCandidates = [
      path.join(this.dataDir, 'source/json/products.json'),
      path.resolve(process.cwd(), 'data/source/json/products.json'),
      path.resolve(process.cwd(), '../data/source/json/products.json'),
    ];
    for (const p of jsonCandidates) {
      if (fs.existsSync(p)) return { path: p, format: 'json' };
    }
    return null;
  }

  load(): void {
    if (this.loaded) return;
    const resolved = this.resolvePath();
    let rows: ProductRow[];
    if (resolved) {
      try {
        const raw = fs.readFileSync(resolved.path, 'utf-8');
        if (resolved.format === 'csv') {
          const { headers, rows: csvRows } = parseCsv(raw);
          rows = csvRows.map((values) => {
            const o = rowToObject(headers, values);
            return {
              sku: o.sku ?? '',
              name: o.name ?? '',
              price: Number(o.price) || 0,
              imageUrl: o.imageUrl,
              image: o.image,
            };
          });
        } else {
          rows = JSON.parse(raw);
        }
      } catch (err) {
        console.warn(`Failed to read ${resolved.path}, using default products:`, err);
        rows = DEFAULT_PRODUCTS;
      }
    } else {
      console.warn('Products file not found (tried csv and json). Using built-in product data.');
      rows = DEFAULT_PRODUCTS;
    }
    this.products = new Map(
      rows
        .filter((r) => r.sku && r.name)
        .map((r) => [
          r.sku,
          new Product(r.sku, r.name, Math.round(r.price * 100), r.imageUrl ?? r.image),
        ])
    );
    this.loaded = true;
  }

  getAll(): Product[] {
    this.load();
    return Array.from(this.products.values());
  }

  getBySku(sku: string): Product | undefined {
    this.load();
    return this.products.get(sku);
  }

  getMap(): Map<string, Product> {
    this.load();
    return new Map(this.products);
  }
}
