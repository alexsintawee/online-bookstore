# Online Bookstore

A production-quality shopping cart and discount engine for a bookstore-style ecommerce app. Built with Node.js/TypeScript (Express) on the backend and React/TypeScript on the frontend. All data is in-memory; no database.

## Project structure

```
online-bookstore/
├── data/
│   └── source/
│       ├── json/             # products.json, promotion.json (loaded at runtime)
│       ├── csv/              # products.csv, promotion.csv (optional)
│       └── images/           # Product images (served at /api/images)
├── backend/                  # Node.js + TypeScript API
│   ├── src/
│   │   ├── domain/           # Entities, value objects, discount rules
│   │   ├── repositories/     # Product (file), Cart (in-memory)
│   │   ├── services/         # ProductService, CartService
│   │   └── api/              # Express routes
│   └── ...
├── frontend/                 # React + TypeScript SPA
│   ├── src/
│   │   ├── core/             # ApiClient, Money formatting
│   │   ├── components/       # Layout, product, cart, UI
│   │   ├── context/         # CartContext, WishlistContext
│   │   ├── pages/            # Home, Product detail, Cart, Wishlist
│   │   └── types/
│   └── ...
├── docs/                     # Additional documentation
│   ├── implementation-explanation.txt   # Implementation overview
│   ├── project-structure.txt        # Backend / frontend / data breakdown
│   ├── why-frontend-backend-separate.txt
│   ├── where-backend-reads-data.txt   # How backend loads data/source
│   └── deploy-cpanel.txt             # Deploy to cPanel
└── README.md
```

## Setup

### Backend

From the repository root (online-bookstore/):

```bash
cd backend
npm install
npm run build
```

Start the API (serves at `http://localhost:3001`):

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The backend loads products and promotions from `../data/source/` (JSON or CSV). Run backend commands from inside `backend/`. See `docs/where-backend-reads-data.txt` for path details.

### Frontend

From the repository root (online-bookstore/):

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies `/api` to the backend. Ensure the backend is running first.

**Backend API URL (config)**  
The frontend reads the API base URL from **`frontend/public/config.json`** at runtime. Edit this file to point to a different server without rebuilding:

```json
{
  "apiBaseUrl": "http://localhost:3001"
}
```

- Use `"http://localhost:3001"` for local dev (or leave empty if the app and API are on the same origin and you use a proxy).
- Use `"https://api.yourdomain.com"` (or your backend URL) when the API is on another server.
- Use `""` when the frontend and API are on the same origin (e.g. deployed together; requests go to `/api`).

A copy of the file is in `frontend/public/config.example.json`. The built app includes `config.json` in the output so you can change it on the server after deployment.

### Backend test suite

```bash
cd backend
npm test
```

The suite covers:

- **Money** value object (cents, dollars, arithmetic)
- **BulkPriceRule** (quantity threshold, discount amount)
- **ThreeForTwoRule** (quantities 2, 3, 4, 6)
- **PricingEngine** (reference cart totals)

## Documentation

Additional docs are in **`docs/`** (plain text):

| File | Description |
|------|--------------|
| `docs/implementation-explanation.txt` | Implementation overview: discount system, catalog, pricing scenarios. |
| `docs/project-structure.txt` | Project layout by backend, frontend, and data source. |
| `docs/why-frontend-backend-separate.txt` | Why backend and frontend are separate apps. |
| `docs/where-backend-reads-data.txt` | Where the backend reads from `data/source` (products, promotions, images). |
| `docs/deploy-cpanel.txt` | How to deploy backend and frontend to a server using cPanel. |

## Design decisions

### Backend

- **Integer cents everywhere**  
  All monetary values are stored and computed in cents. Conversion to dollars happens only when building API responses, with rounding to 2 decimals.

- **Extensible discount engine**  
  Discounts are implemented as a **Strategy/Rule** pattern:
  - `DiscountRule` interface: `id`, `applies(cart)`, `calculate(cart, products)`.
  - New rules are added by creating new classes (e.g. `BulkPriceRule`, `ThreeForTwoRule`) and registering them in `PricingEngine`. No changes to existing rule code are required.

- **Layered architecture**  
  - **Domain**: `Money`, `Product`, `Cart`, `CartItem`, `DiscountRule`, `PricingEngine`.  
  - **Repositories**: `ProductRepository` (reads `products.json`), `CartRepository` (in-memory map).  
  - **Services**: `ProductService`, `CartService` (orchestrate repos + pricing).  
  - **API**: Express routes call services and return JSON.

- **No database**  
  Carts and products live in memory. Product data is loaded once from the JSON file at startup.

### Frontend

- **Backend as source of truth**  
  The frontend never computes discounts or totals. It always displays data returned by `GET /api/cart/:cartId` and updates the cart via `POST /api/cart/:cartId/items`.

- **Reusable core modules**  
  - `ApiClient`: typed functions for all API calls.  
  - `Money`: format amounts for display (2 decimals).  
  - Shared types for `Product`, `CartSummary`, line items, discounts, totals.

- **Layout and UX**  
  Global layout (sticky header, footer), product grid, product detail hero, cart with item list and order summary. Styling uses CSS variables and one approach (CSS Modules) for a consistent, responsive layout inspired by modern ecommerce bookstores.

## Adding a new discount rule

1. **Create a new rule class** in `backend/src/domain/discounts/` that implements `DiscountRule`:

   ```ts
   // backend/src/domain/discounts/MyNewRule.ts
   import { Cart } from '../Cart';
   import { Product } from '../Product';
   import { DiscountRule, DiscountResult } from './DiscountRule';

   export class MyNewRule implements DiscountRule {
     readonly id = 'my-new-rule';

     applies(cart: Cart): boolean {
       // return true when the rule should run
       return cart.getQuantity('SOME_SKU') >= 5;
     }

     calculate(cart: Cart, products: Map<string, Product>): DiscountResult | null {
       // compute discount amount in cents (negative = discount)
       const amountCents = -500; // e.g. $5 off
       return {
         ruleId: this.id,
         description: 'My new promotion',
         amountCents,
         meta: { /* optional */ },
       };
     }
   }
   ```

2. **Register the rule** – either add it to the array in `backend/src/loadPromotions.ts` (with the other defaults) or add a row to `data/source/json/promotion.json` / `data/source/csv/promotion.csv` if your rule type is supported there. For code-only rules, extend the default array in `loadPromotions.ts` and pass the result into `PricingEngine` in `backend/src/index.ts`.

No changes are required in existing rule classes or in the pricing engine logic.

## API summary

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List products `[{ sku, name, price }]` |
| GET | `/api/products/:sku` | Single product by SKU |
| GET | `/api/promotions` | List active promotions (from `data/source`) |
| POST | `/api/cart` | Create cart → `{ cartId }` |
| GET | `/api/cart/:cartId` | Cart summary (items, discounts, totals) |
| POST | `/api/cart/:cartId/items` | Body: `{ sku, quantityDelta }` → updated cart summary |
| GET | `/api/images/*` | Product images (static files from `data/source/images`) |

All monetary values in responses are in dollars with 2 decimal places.

## Reference pricing scenarios

- **Cart:** 9780201835953 × 10 + 9325336028278 × 1 → **total $239.89**  
  (Bulk rule: 10+ Mythical Man-Month @ $21.99)

- **Cart:** 9781430219484 × 3 + 9780132071482 × 1 → **total $177.36**  
  (3-for-2: one free Coders at Work)
