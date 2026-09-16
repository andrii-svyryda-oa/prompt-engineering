---
name: minishop-add-feature
description: >-
  Add a new entity, API operation, or UI flow to the MiniShop demo-project
  (demo-project/backend and frontend). Use when extending MiniShop with new
  models, endpoints, workflows, repositories, RTK Query APIs, or pages.
---

# Add a MiniShop feature

Follow project rules:

- Backend: `.cursor/rules/minishop-backend-layers.mdc`
- Frontend: `.cursor/rules/minishop-frontend-entities.mdc`
- Overview: `demo-project/docs/architecture.md`

## Backend checklist

1. **Model** — `demo-project/backend/app/models/<entity>.py`; export in `models/__init__.py`.
2. **Schema** — `schemas/<entity>.py` (Pydantic request/response).
3. **Repository** — `repositories/<entity>_repository.py` (class, session in `__init__`).
4. **Workflow** — `workflows/<operation>.py` (one class per operation, e.g. `CreateFooWorkflow`).
5. **Exceptions** — domain errors in `exceptions/` if needed.
6. **Dependencies** — factory in `dependencies.py`.
7. **Endpoint** — route in `endpoints/`; map domain errors to `HTTPException`.
8. **Register** — `include_router` in `app/main.py`.
9. **Migration** — Alembic revision if schema changed.
10. **Tests** — `tests/test_<resource>.py`.

## Frontend checklist

1. **Types** — `src/entities/<entity>/types.ts`.
2. **API** — `src/entities/<entity>/api.ts` (`api.injectEndpoints`).
3. **Store** — side-effect import in `src/app/store.ts`.
4. **UI** — `components/` and `pages/` under the same entity folder.
5. **Route** — `src/App.tsx` if new path.
6. **Shared UI** — only shadcn/layout in `src/shared/`.

## Layer reminder

```
Backend:  endpoints → workflows → repositories → models
Frontend: pages → entity api.ts → app/api.ts (RTK base)
```

Preserve existing API JSON shapes and test expectations unless the task explicitly changes the contract.
