# CampusDesk

Tiny campus IT helpdesk used throughout the Claude Code course.

This starter is intentionally small. You will grow it in the practice lessons: CLAUDE.md, skills, hooks, specs, docs, Jira, and (bonus) an in-app agent.

## Run

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -e ".[dev]"
uvicorn app.main:app --reload
```

Open <http://127.0.0.1:8000/docs>.

## Check

```bash
pytest
ruff check .
```

## What is already here

| Path | Role |
| --- | --- |
| `app/main.py` | FastAPI app, health, tickets, comments |
| `app/models.py` | Pydantic models |
| `app/store.py` | In-memory store (resets on restart) |
| `tests/` | pytest coverage for the current API |
| `docs/product.md` | Product intent |
| `docs/architecture.md` | How the code is shaped |

There is **no** `.claude/` folder yet. You add that in Practice 2.
