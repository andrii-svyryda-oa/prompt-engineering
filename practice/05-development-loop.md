# Practice 5 — Development loop on a real change

**Language:** English · [Українською](uk/05-development-loop.md)

**Time:** 70–90 minutes  
**When:** After Lecture 3  
**Depends on:** Practices 1–4

## Goal

Implement a **small specified change** using Plan mode, then Accept edits, then the verify loop until green. No Jira yet. No extra features.

## The change (this is your spec)

Add an optional query parameter to list tickets:

`GET /tickets?status=open|in_progress|resolved`

Rules:

- Omit `status` → same as today (all tickets).
- Invalid `status` → **422** (validation error), not 500.
- Filtering is exact match on the ticket’s `status` field.
- Seed data and existing tests should still pass.
- New tests cover: filter open, filter empty result, invalid value.

Out of scope: pagination, search, auth, persistence, UI.

## Tasks

### 1. Clean session in CampusDesk

```bash
cd practice/starter-campusdesk
claude --permission-mode plan
```

### 2. Plan only

```text
@docs/architecture.md @app/main.py @app/store.py @tests/test_tickets.py
Implement GET /tickets?status=... as in my practice brief (Practice 5).
Write a plan: files, test names, invalid-status behavior.
Do not implement. Do not add pagination or search.
```

**Pass:** Plan mentions `list_tickets` / query param / pytest. If it proposes SQL or users, reject that in chat.

### 3. Implement with evidence

Leave plan mode. Paste:

```text
Implement the approved plan only.
Map tests to the three cases: filter, empty, invalid.
Run pytest -q and ruff check . until green.
Show command output.
```

Use `/verify-change` at the end if you wrote that skill.

### 4. You run the checks too

In a normal terminal (not only Claude):

```bash
pytest -q
ruff check .
```

**Pass:** Green on **your** machine.

### 5. Manual HTTP check

Run uvicorn. Hit:

- `/tickets`
- `/tickets?status=open`
- `/tickets?status=nope` (expect 422)

### 6. Context glance

`/context` — note whether the session is already heavy. If you wandered, say what you would have `/clear`ed.

## Deliverable

- Code + tests
- Plan text (paste)
- pytest and ruff output
- Optional: OpenAPI screenshot of the new parameter

## Grading bar

| Fail | Why |
| --- | --- |
| No tests | Loop not closed |
| Invalid status returns 500 | Contract missed |
| Extra features | Did not honor out of scope |
| Only Claude said “green” | You did not run pytest locally |

## Stretch

Allow a comma-separated list `?status=open,in_progress`. **Do not do this unless you write two extra tests.** If you cannot write the tests, it is out of scope.
