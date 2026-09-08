# Practice 8 — Project documentation the agent can use

**Language:** English · [Українською](uk/08-project-documentation.md)

**Time:** 50–70 minutes  
**When:** After Practice 7  
**Depends on:** Assignee (or whatever you implemented) actually exists

## Goal

Make documentation **short, structured, and findable** so the next session does not need a 20-file explore. Practice the Lecture 4 tradeoff: import vs path mention.

## Tasks

### 1. Audit current docs

Read `docs/product.md`, `docs/architecture.md`, `README.md`, `CLAUDE.md`.

Mark each as:

- **stale** (disagrees with code)
- **too big to import**
- **missing a heading** an agent would search for

### 2. Fix staleness

With Claude, in Plan mode first:

```text
Diff docs/architecture.md and docs/product.md against the current API.
List mismatches only. Do not rewrite from scratch.
```

Then apply a **minimal** patch. No marketing.

### 3. Add an HTTP examples page

Create `docs/http-examples.md` with copy-pasteable `curl` (or httpx) for:

- health
- list / filter if Practice 5 exists
- create ticket with and without assignee
- patch assignee to a value and to null

Keep it under ~80 lines.

### 4. CLAUDE.md policy

Choose **one**:

**A.** Import `docs/http-examples.md` (only if it stayed tiny)  
**B.** Do not import; add: “HTTP examples: `docs/http-examples.md` — read when changing the API.”

Write two sentences in your homework: which you chose and the token reason.

### 5. A docs skill

`.claude/skills/sync-docs/SKILL.md`:

- When API behavior changes, update architecture + http-examples + spec status
- Do not duplicate the spec into product.md
- Keep product.md for users and roles, not JSON schemas

Invoke `/sync-docs` after a fake question: “Did we document clearing assignee with null?”

**Pass:** It either confirms the example exists or adds it.

### 6. Nested CLAUDE.md experiment (optional)

Add `docs/CLAUDE.md` with one line: “These files are for humans and agents; prefer headings over prose.” Start Claude from `app/` vs repo root and see (Lecture 2) when nested files load. Note it.

## Deliverable

- Updated docs + `http-examples.md`
- `/sync-docs` skill
- Your import vs mention decision
- Before/after word count of `docs/architecture.md` (it should not balloon)

## Stretch

Add a “Document map” table to README (path → purpose). One screen max.
