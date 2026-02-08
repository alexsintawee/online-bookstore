# Promotions (promotion.csv)

Edit this file in Excel or any spreadsheet; save as CSV. Restart the backend for changes to apply.

## Columns

| Column              | Required      | Description |
|---------------------|---------------|-------------|
| type                | Yes           | `bulk_price` or `multi_buy_free` |
| id                  | Yes           | Unique id (e.g. bulk-mythical-man-month) |
| sku                 | Yes           | Product SKU (must match products.csv) |
| minQuantity         | bulk_price    | Minimum quantity for bulk price (e.g. 10) |
| discountedUnitPrice | bulk_price    | Price per item when rule applies, in dollars (e.g. 21.99) |
| groupSize           | multi_buy_free| Size of group (e.g. 3 = "buy 3") |
| freeCount           | multi_buy_free| Free items per group (e.g. 1 = "get 1 free") |
| description         | No            | Optional text for display |

Leave minQuantity and discountedUnitPrice empty for multi_buy_free rows. Leave groupSize and freeCount empty for bulk_price rows.

## Examples

- **Bulk price:** 10+ of The Mythical Man-Month at $21.99 each  
  `bulk_price,bulk-mythical-man-month,9780201835953,10,21.99,,,Buy 10 or more...`

- **Buy 3 get 1 free:**  
  `multi_buy_free,3-for-2-coders-at-work,9781430219484,,,3,1,Buy 3 get 1 free...`

## Tips

- First row must be the header (see promotion.csv)
- If description contains a comma, put it in double quotes
- Add a new row to add a promotion; delete a row to remove it
