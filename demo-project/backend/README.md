# MiniShop Backend

FastAPI backend for the MiniShop demo store.

Code is organized in layers: **endpoints → workflows → repositories**, with one file per entity in `models/` and `schemas/`. See `../docs/architecture.md` for details.

## Prerequisites

- Python 3.11+
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (install via the official script or `pip install uv`)
- Docker (for PostgreSQL)

## Setup

From the `demo-project/` directory, start PostgreSQL:

```bash
docker compose up -d
```

Install dependencies and run migrations from `backend/`:

```bash
cd backend
uv sync --extra dev
# Windows PowerShell:
$env:DATABASE_URL="postgresql://minishop:minishop@localhost:5432/minishop"
# Linux/macOS:
# export DATABASE_URL=postgresql://minishop:minishop@localhost:5432/minishop
uv run python -m alembic upgrade head
uv run python -m app.seed
```

`uv sync` creates `.venv` in `backend/` and installs this project (editable) plus dependencies from `uv.lock`.

## Run the API

```bash
uv run python -m uvicorn app.main:app --reload --port 8000
```

- API: http://localhost:8000
- OpenAPI docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

CORS is enabled for `http://localhost:5173` (Vite frontend).

## Tests

```bash
uv run python -m pytest -q
```

Tests use an in-memory SQLite database and do not require PostgreSQL.

## Environment

| Variable | Default |
| --- | --- |
| `DATABASE_URL` | `postgresql://minishop:minishop@localhost:5432/minishop` |
