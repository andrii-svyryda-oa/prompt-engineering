# Practice 3 — Rules, skills, and linked documents

**Language:** English · [Українською](uk/03-rules-skills-linked-docs.md)

**Time:** 60–80 minutes  
**When:** After Lecture 2  
**Depends on:** Practice 2 (`CLAUDE.md` exists)

## Goal

Split knowledge the way Lecture 2 taught: a path-scoped **rule**, a **skill** you can invoke with `/`, and a deliberate choice about what is imported vs only mentioned.

## Tasks

### 1. Path-scoped rule

Create `.claude/rules/python-api.md`:

```markdown
---
paths:
  - "app/**/*.py"
  - "tests/**/*.py"
---

# CampusDesk Python

- Route handlers stay thin; business rules go in `store.py` (or a service module).
- New endpoints and new ticket fields ship with pytest in the same change.
- Do not add databases, auth, or extra dependencies unless a spec says so.
```

### 2. Unscoped rule (short)

Create `.claude/rules/docs.md` without `paths`:

```markdown
# Docs

- Product language: "ticket", not "issue", unless referring to Jira.
- Specs live in `docs/specs/` once they exist.
```

Unscoped rules load every session. Keep this tiny.

### 3. A team skill

Create `.claude/skills/verify-change/SKILL.md`:

```markdown
---
description: Verify a CampusDesk change. Use when the user says ship, wrap up, verify, or done.
---

1. Run `pytest -q` and `ruff check .`.
2. If either fails, fix and rerun until green or you are blocked.
3. If user-visible behavior changed, say whether `docs/` needs an update. Do not write a novel.
4. Report files changed, commands run, leftover risk.
5. Do not commit unless asked.
```

### 4. CLAUDE.md trim

If `CLAUDE.md` now duplicates the Python bullets, **delete the duplicates**. Point at the rule instead with one line: “Python API rules: `.claude/rules/python-api.md`.”

Decide:

- Keep `@docs/product.md` import **or** replace with “read `docs/product.md` when the task is product-facing.”
- Write one sentence in your notes explaining the token tradeoff (Lecture 2 / 4).

### 5. Test auto-invocation vs slash

New session.

```text
I'm done with a small change. Wrap it up.
```

See if Claude picks `/verify-change` (it may or may not). Then explicitly run:

```text
/verify-change
```

**Pass:** It runs pytest and ruff (you will approve tools) and reports output.

### 6. Test the path-scoped rule

```text
@app/main.py
If I add a field, where should validation live? One paragraph.
```

**Pass:** It argues for models/store, not a fat route, in line with the rule.

### 7. `/skills` and `/context`

Confirm the skill is listed. Note whether rule files appear and when.

## Deliverable

- The two rule files and the skill
- A trimmed `CLAUDE.md`
- Two transcripts: `/verify-change` and the “where should validation live” answer

## Stretch

Add `disable-model-invocation: true` to the skill frontmatter. Confirm casual “wrap it up” no longer auto-loads it, but `/verify-change` still works. Then decide which behavior you want for the team and leave a comment in the skill.
