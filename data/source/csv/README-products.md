# Products (products.csv)

Edit this file in Excel or any spreadsheet; save as CSV. Restart the backend for changes to apply.

## Columns

| Column   | Required | Description |
|----------|----------|-------------|
| sku      | Yes      | Product ID (e.g. 9780132071482) |
| name     | Yes      | Product name |
| price    | Yes      | Price in dollars (e.g. 119.92) |
| imageUrl | No       | Image path (e.g. /api/images/9780132071482.svg) |

## Tips

- First row must be the header: `sku,name,price,imageUrl`
- If a name contains a comma, put the whole value in double quotes: `"Book, The Sequel"`
- Do not add extra columns; the backend only uses these four
