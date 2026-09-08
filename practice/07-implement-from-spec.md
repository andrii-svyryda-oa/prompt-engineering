# Practice 7 — Implement from a spec

**Language:** English · [Українською](uk/07-implement-from-spec.md)

**Time:** 70–100 minutes  
**When:** After Practice 6 and Lecture 5  
**Depends on:** `docs/specs/SPEC-001-ticket-assignee.md` is approved

## Goal

A **new or cleared session** implements SPEC-001 only, with tests mapped to acceptance criteria, until pytest and ruff are green. Docs updated if behavior changed.

## Tasks

### 1. Skill (if not already)

`.claude/skills/implement-spec/SKILL.md` as in Lecture 5 §6 (adapt wording). CLAUDE.md should tell Claude to use it.

### 2. Fresh context

```bash
cd practice/starter-campusdesk
claude --permission-mode plan
```

Do **not** continue the Practice 6 session if it is already fat with drafting chatter. `/clear` is acceptable.

### 3. Plan against the file

```text
/implement-spec @docs/specs/SPEC-001-ticket-assignee.md
```

or the equivalent prompt from the lecture. **Stop at the plan.** Check:

- no User table
- tests named or described per acceptance line
- store + models + routes + tests only

### 4. Optional TDD path (recommended)

```text
Write failing pytest functions for each acceptance criterion first.
Run pytest -q; they must fail for the right reason.
Then implement until green. Do not weaken tests to match accidents.
```

If time is short, implement tests in the same turn — but still **from the spec**, not from the code you already wrote.

### 5. Verify loop

```text
pytest -q and ruff check . until green. Show evidence.
```

Then **you** run the same commands locally.

### 6. Docs

Update `docs/architecture.md` (field + PATCH semantics) and `docs/product.md` if the user-visible story changed. Set spec status to `implemented`.

### 7. Diff review (human)

Open the diff. Delete anything not in SPEC-001. If you wanted it, it belongs in SPEC-002 first.

## Deliverable

- Implementation + tests
- Spec status `implemented`
- Plan paste
- Local pytest/ruff output
- List of files in the diff — each mapped to a spec section or marked “docs”

## Fail bar

- Extra endpoints
- Assignee required
- Silent default `"unassigned"` instead of `null` without spec change
- Tests that never assert GET payload
- CLAUDE.md now contains the full spec

## Stretch

Add a negative test: PATCH with `"assignee": ""` — **only if** you first amend SPEC-001 with the chosen behavior (reject vs treat as null). Spec first.
