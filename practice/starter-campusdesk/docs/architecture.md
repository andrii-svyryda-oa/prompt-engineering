# CampusDesk architecture

## Shape

```
app/
  main.py      FastAPI routes
  models.py    Pydantic request/response models
  store.py     In-memory TicketStore
```

There is one process and one `TicketStore` instance created at import time. Data resets when the server restarts.

## API

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/health` | Liveness |
| GET | `/tickets` | Newest ids last |
| POST | `/tickets` | 201 |
| GET | `/tickets/{id}` | 404 if missing |
| PATCH | `/tickets/{id}` | Partial update |
| POST | `/tickets/{id}/comments` | 201 |

## Status values

`open` → `in_progress` → `resolved`

The starter does not enforce that order. A later spec may.

## Testing

`tests/test_tickets.py` uses FastAPI's `TestClient`. Each test run constructs the app module's store as it was imported, so tests share process state. Keep that in mind if you add tests that depend on exact ids.

## Conventions we want Claude to follow later

- Keep handlers thin; business rules belong in the store or a dedicated service module.
- Pydantic models are the contract. Do not return raw dicts from ticket endpoints.
- New endpoints need tests in the same change.
