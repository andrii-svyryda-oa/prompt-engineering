# Practice 6 — Write a spec (no code)

**Language:** English · [Українською](uk/06-write-a-spec.md)

**Time:** 50–70 minutes  
**When:** After Lecture 5 (or after Lecture 4 with the Lecture 5 handout open)  
**Depends on:** You understand CampusDesk as it exists **after** Practice 5 (status query may already exist)

## Goal

Produce an **approved** spec file an agent could implement tomorrow without asking you what “assignee” means. You may use Claude as an **editor**, not as the product owner. You sign the spec.

## Feature to specify

**Ticket assignee** — optional person currently responsible for a ticket.

You are the product owner. Make the boring, testable choices. Suggested defaults if you do not care:

- Field name: `assignee`
- Type: `string | null`
- Default on create: `null`
- PATCH can set a string or clear with `null`
- Omitting the field on PATCH leaves it unchanged
- No validation that the person exists
- No notifications, no UI, no auth, no persistence change beyond the in-memory model

If Practice 5 is not merged in your copy, do not include status filtering in this spec except as “already exists” if it does.

## Tasks

### 1. Create the folder

`docs/specs/`

Copy headings from Lecture 5 §3. Filename:

`docs/specs/SPEC-001-ticket-assignee.md`

### 2. Draft with Claude in Plan mode

```text
Read @docs/product.md @docs/architecture.md @app/models.py
Draft docs/specs/SPEC-001-ticket-assignee.md for ticket assignee.
Use the course heading template.
Do not invent requirements I did not confirm.
Put uncertainties in Open questions.
Do not write application code.
```

### 3. You edit until Open questions is empty

Delete any User model, email, Slack, database, GraphQL, or React the model “helpfully” added. Fill acceptance criteria as Given/When/Then or a table covering:

- default null
- set via POST
- set via PATCH
- clear via PATCH null
- omit on PATCH does not wipe assignee
- GET includes the field

### 4. Add Checks

```text
pytest -q
ruff check .
```

### 5. Status `approved`

Not `implemented`. You have not built it yet.

### 6. Optional CLAUDE.md one-liner

```markdown
## Specs
Feature work needs a spec in docs/specs/. Do not implement out of scope. Empty Open questions before coding.
```

Do not paste the whole spec into CLAUDE.md.

## Deliverable

- `SPEC-001-ticket-assignee.md` with empty Open questions
- A 5-line note: one extra you refused from Claude’s first draft

## Stretch

Write `SPEC-002` as a stub with **non-empty** Open questions (e.g. ticket tags). In Practice 7 you should **not** implement SPEC-002. That is the point.
