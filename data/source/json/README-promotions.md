# Promotion rules (promotion.json)

Edit `promotion.json` to change discounts. Restart the backend for changes to apply.

## Structure

- **promotions**: array of rule objects. Order does not affect behaviour.

## Rule types

### bulk_price

Applies a lower unit price when the customer buys a minimum quantity of one product.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | yes | Must be `"bulk_price"` |
| id | string | yes | Unique id (e.g. for display) |
| sku | string | yes | Product SKU (must match `products.json`) |
| minQuantity | number | yes | Minimum quantity to get the discount (e.g. 10) |
| discountedUnitPrice | number | yes | Price per item when rule applies, in dollars (e.g. 21.99) |
| description | string | no | Optional text for display |

Example: 10+ copies of The Mythical Man-Month at $21.99 each.

### multi_buy_free

“Buy N get M free”: for every **groupSize** items, **freeCount** are free. You control the numbers.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | yes | Must be `"multi_buy_free"` |
| id | string | yes | Unique id |
| sku | string | yes | Product SKU (must match `products.json`) |
| groupSize | number | yes | Size of each group (e.g. 3 = “buy 3”) |
| freeCount | number | yes | How many items are free per group (e.g. 1 = “get 1 free”) |
| description | string | no | Optional text for display |

Examples:

- Buy 3 get 1 free: `groupSize: 3`, `freeCount: 1`
- Buy 4 get 1 free: `groupSize: 4`, `freeCount: 1`
- Buy 5 get 2 free: `groupSize: 5`, `freeCount: 2`

## Product SKUs (from products.json)

Use these `sku` values so the rule applies to the right product:

- `9780201835953` – The Mythical Man-Month
- `9781430219484` – Coders at Work
- `9780132071482` – Artificial Intelligence
- `9325336130810` – Game of Thrones: Season 1
- `9325336028278` – The Fresh Prince of Bel-Air

## Adding or removing promotions

- Add a new object to the `promotions` array (use `bulk_price` or `multi_buy_free`).
- Remove an object from the array to disable that promotion.
- Invalid or missing entries are skipped; the backend falls back to default rules if the file is missing or invalid.
