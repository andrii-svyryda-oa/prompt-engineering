# MiniShop — architecture

## Overview

```
demo-project/
  backend/          FastAPI + SQLAlchemy + Alembic + PostgreSQL
  frontend/         React + TypeScript + Vite + RTK + shadcn/ui
  docs/             Product and architecture docs (this folder)
  docker-compose.yml   PostgreSQL for local dev
```

```
┌─────────────┐     REST (JSON)      ┌─────────────┐     SQL      ┌────────────┐
│   React     │ ◄──────────────────► │   FastAPI   │ ◄──────────► │ PostgreSQL │
│  RTK Query  │   http://localhost:   │  SQLAlchemy │              │   :5432    │
│  shadcn/ui  │        8000           │   Alembic   │              └────────────┘
└─────────────┘                      └─────────────┘
     :5173
```

CORS is enabled on the backend for `http://localhost:5173`.

## Backend (`demo-project/backend/`)

### Stack

- Python 3.11+
- FastAPI
- SQLAlchemy 2.x (async optional; sync is fine for demo)
- Alembic migrations
- Pydantic v2 schemas
- `psycopg2` or `psycopg` for PostgreSQL
- pytest + httpx TestClient for API tests

### Layout

Request flow: **endpoints → workflows → repositories → models**.

```
backend/
  app/
    main.py             FastAPI app, CORS, endpoint routers
    config.py           Settings (DATABASE_URL from env)
    database.py         Engine, SessionLocal, get_db dependency
    dependencies.py     FastAPI Depends factories for workflows
    seed.py             Seed products on startup or via CLI
    models/             One ORM module per entity
      product.py
      order.py
      order_item.py
    schemas/            One Pydantic module per entity (HTTP contract)
      product.py
      order.py
    repositories/       Class-based persistence (one class per entity)
      product_repository.py
      order_repository.py
    workflows/          One workflow class per API operation
      list_products.py
      get_product.py
      create_order.py
      get_order.py
    endpoints/          HTTP routing only
      products.py
      orders.py
    exceptions/         Domain errors (mapped to HTTP in endpoints)
  alembic/
    versions/           Initial migration
  tests/
    test_products.py
    test_orders.py
  alembic.ini
  pyproject.toml
  uv.lock
  README.md
```

### Database schema

**products**

| Column | Type | Notes |
| --- | --- | --- |
| id | int PK | |
| name | varchar(200) | |
| description | text | nullable |
| price | numeric(10,2) | |
| stock | int | ≥ 0 |

**orders**

| Column | Type | Notes |
| --- | --- | --- |
| id | int PK | |
| customer_name | varchar(100) | |
| customer_email | varchar(255) | |
| total | numeric(10,2) | |
| created_at | timestamptz | default now |

**order_items**

| Column | Type | Notes |
| --- | --- | --- |
| id | int PK | |
| order_id | FK → orders | |
| product_id | int | reference, not FK enforced if product deleted |
| product_name | varchar(200) | snapshot |
| unit_price | numeric(10,2) | snapshot |
| quantity | int | |

### API contract

| Method | Path | Body | Response | Errors |
| --- | --- | --- | --- | --- |
| GET | `/health` | — | `{ "status": "ok" }` | — |
| GET | `/products` | — | `Product[]` | — |
| GET | `/products/{id}` | — | `Product` | 404 |
| POST | `/orders` | `CreateOrderRequest` | `Order` | 400 validation, 409 stock |
| GET | `/orders/{id}` | — | `Order` with items | 404 |

**Product**

```json
{ "id": 1, "name": "Notebook", "description": "...", "price": "4.99", "stock": 50 }
```

**CreateOrderRequest**

```json
{
  "customer_name": "Ada Lovelace",
  "customer_email": "ada@example.com",
  "items": [{ "product_id": 1, "quantity": 2 }]
}
```

**Order** (response includes nested `items`)

```json
{
  "id": 1,
  "customer_name": "Ada Lovelace",
  "customer_email": "ada@example.com",
  "total": "9.98",
  "created_at": "2026-09-11T12:00:00Z",
  "items": [
    { "product_id": 1, "product_name": "Notebook", "unit_price": "4.99", "quantity": 2 }
  ]
}
```

### Order placement logic

1. Begin transaction.
2. For each line, `SELECT ... FOR UPDATE` on product row.
3. Validate stock; if any line fails, rollback and return 409.
4. Insert order + order_items; decrement stock.
5. Commit.

### Local run

```bash
# from demo-project/
docker compose up -d
cd backend
uv sync --extra dev
uv run python -m alembic upgrade head
uv run python -m app.seed        # or seed runs on startup
uv run python -m uvicorn app.main:app --reload --port 8000
uv run python -m pytest -q
```

`DATABASE_URL=postgresql://minishop:minishop@localhost:5432/minishop`

## Frontend (`demo-project/frontend/`)

### Stack

- React 18 + TypeScript
- Vite
- Redux Toolkit + RTK Query (`@reduxjs/toolkit/query/react`)
- React Router
- shadcn/ui (Tailwind CSS)
- No auth library needed

### Layout

One folder per **entity** (`product`, `order`, `cart`), with subfolders by file kind. RTK Query in each entity’s `api.ts` is the HTTP boundary (analogous to backend endpoints).

```
frontend/
  src/
    app/
      store.ts              Redux store + RTK Query base slice
      api.ts                  shared RTK base (baseUrl, tags)
      hooks.ts                typed useAppDispatch / useAppSelector
    entities/
      product/
        types.ts
        api.ts
        components/ProductCard.tsx
        pages/CatalogPage.tsx, ProductDetailPage.tsx
      order/
        types.ts
        api.ts
        pages/CheckoutPage.tsx, OrderConfirmationPage.tsx
      cart/                   client-only entity (no backend aggregate)
        types.ts
        cartSlice.ts
        components/CartLineItem.tsx
        pages/CartPage.tsx
    shared/
      Layout.tsx
      components/ui/          shadcn components
    main.tsx
    App.tsx                   routes
  index.html
  package.json
  vite.config.ts
  tailwind.config.js
  components.json
  README.md
```

### State split

| Concern | Where |
| --- | --- |
| Server data (products, order result) | RTK Query cache |
| Cart (items, quantities) | `cartSlice` in Redux |
| UI loading/errors | RTK Query + local component state |

### Routes

| Path | Page |
| --- | --- |
| `/` | Catalog — product grid |
| `/products/:id` | Product detail + add to cart |
| `/cart` | Cart review |
| `/checkout` | Name/email form + place order |
| `/orders/:id` | Confirmation after successful checkout |

### RTK Query base

- `baseUrl`: `http://localhost:8000`
- Tag types: `Product`, `Order`
- After successful order, invalidate `Product` tags (stock changed) and clear cart via dispatch

### Local run

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

## Docker Compose (`demo-project/docker-compose.yml`)

Single `postgres:16` service:

- database: `minishop`
- user/password: `minishop`
- port: `5432`
- volume for data persistence across restarts

## Verification checklist

1. `docker compose up -d` — Postgres healthy
2. Backend migrations + seed + tests pass
3. Frontend builds (`npm run build`) without type errors
4. Manual flow: catalog → add to cart → checkout → confirmation; stock decreases on repeat catalog load

## Conventions

- Backend: thin **endpoints**; orchestration in **workflows** (one operation per file); SQL in **repository** classes only; Pydantic **schemas** are the HTTP contract.
- Frontend: no raw `fetch` outside `app/api.ts` / entity `api.ts`; types live in each entity’s `types.ts`; shared chrome in `shared/`.
- Money: API uses decimal strings; display with two decimals in UI.
- Errors: backend maps domain exceptions to HTTP in endpoints; frontend maps 409 stock errors to toast or inline message.

## Adding a new entity (checklist)

**Backend**

1. `models/<entity>.py` — SQLAlchemy model; export from `models/__init__.py` for Alembic.
2. `schemas/<entity>.py` — request/response Pydantic models.
3. `repositories/<entity>_repository.py` — persistence class.
4. `workflows/<operation>.py` — one workflow per new API operation.
5. `endpoints/<resource>.py` — routes; wire workflows via `dependencies.py`.
6. Register router in `main.py`; add pytest coverage.

**Frontend**

1. `entities/<entity>/types.ts` — types mirroring API.
2. `entities/<entity>/api.ts` — RTK Query endpoints; side-effect import in `app/store.ts`.
3. Pages/components under the same entity folder.
4. Route in `App.tsx` if needed.
