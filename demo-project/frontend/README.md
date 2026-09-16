# MiniShop Frontend

React storefront for the MiniShop demo. Browse products, manage a cart, and place orders against the FastAPI backend at `http://localhost:8000`.

## Stack

- React 18 + TypeScript
- Vite
- Redux Toolkit + RTK Query
- React Router
- shadcn/ui + Tailwind CSS
- Sonner (toasts)

## Prerequisites

- Node.js 18+
- Backend running at `http://localhost:8000` (see `../backend/README.md`)

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # optional: preview production build
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Product catalog |
| `/products/:id` | Product detail + add to cart |
| `/cart` | Cart review |
| `/checkout` | Checkout form |
| `/orders/:id` | Order confirmation |

## Project structure

```
src/
  app/              Redux store, RTK Query base API, typed hooks
  entities/         One folder per entity (product, order, cart)
    <entity>/       types.ts, api.ts, pages/, components/, state as needed
  shared/           Layout, shadcn/ui components
```

See `../docs/architecture.md` for layer conventions and how to add new features.
