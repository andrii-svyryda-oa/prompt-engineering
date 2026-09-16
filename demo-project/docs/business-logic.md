# MiniShop — business logic

MiniShop is a minimal online store demo. Visitors browse a product catalog, manage a shopping cart, and submit a simple order. There is no login, payment gateway, or admin panel in this demo.

## Users

- **Shopper** — browses products, adds items to a cart, and checks out with a name and email.

## Core concepts

### Product

A sellable item with a stable id, display name, description, price (decimal, USD), and stock count. Products are seeded at startup; shoppers cannot create or edit them.

### Cart

A client-side collection of line items. Each line references a product id and a quantity (integer ≥ 1). The cart is not persisted on the server until checkout.

### Order

Created at checkout from the cart snapshot. Stores shopper contact info, line items (product id, name, unit price, quantity at time of order), and a total. Stock is decremented when the order is placed; checkout fails if any line exceeds available stock.

## Workflows

### Browse catalog

1. Shopper opens the shop home page.
2. System loads all products where `stock > 0` (or all products with an out-of-stock badge).
3. Shopper can open a product detail view.

### Add to cart

1. Shopper selects a quantity (default 1, max = available stock).
2. Item is added to the in-memory cart (Redux). If the product is already in the cart, quantities merge (capped at stock).
3. Cart badge updates.

### View / edit cart

1. Shopper opens the cart page.
2. Can change quantities or remove lines.
3. Cart total recalculates as sum of `price × quantity`.

### Checkout

1. Shopper enters **name** (required, 1–100 chars) and **email** (required, valid format).
2. On submit, frontend sends cart lines to `POST /orders`.
3. Backend validates stock, creates order, decrements stock in one transaction.
4. On success, frontend clears the cart and shows an order confirmation with order id and total.
5. On failure (e.g. insufficient stock), show an error and refresh product stock from the API.

## Business rules

| Rule | Detail |
| --- | --- |
| BR-1 | Price is stored and returned as a decimal with two fractional digits. |
| BR-2 | Quantity must be ≥ 1 and ≤ current stock for that product. |
| BR-3 | Order total = Σ (unit price × quantity) using prices at checkout time. |
| BR-4 | Stock cannot go negative; concurrent checkouts use DB transaction + row lock. |
| BR-5 | Empty cart cannot checkout. |
| BR-6 | Product names on order lines are copied at order time (historical record). |

## Seed data

On first run, the database is migrated and seeded with at least three products, for example:

| Name | Price | Stock |
| --- | --- | --- |
| Notebook | 4.99 | 50 |
| Pen Set | 12.50 | 30 |
| Desk Lamp | 29.00 | 15 |

## Out of scope

- User accounts and authentication
- Payment processing
- Shipping addresses and fulfillment
- Admin CRUD for products
- Order history lookup by email
- Search, filters, categories, images (optional placeholder image URL is fine)

## Acceptance scenarios

- **AS-1** Given products exist, when the shopper loads the catalog, then all seeded products are listed with name, price, and stock.
- **AS-2** Given a product with stock 5, when the shopper adds 2 to cart, then the cart shows quantity 2 and subtotal `price × 2`.
- **AS-3** Given a valid cart, when checkout succeeds, then the API returns order id and total, stock decreases, and the cart clears.
- **AS-4** Given a cart requesting more than available stock, when checkout is submitted, then the API returns 409 with a clear message and no order is created.
