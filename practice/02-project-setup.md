# Practice 2 — Set up Claude for CampusDesk

**Language:** English · [Українською](uk/02-project-setup.md)

**Time:** 50–70 minutes  
**When:** After Lecture 1, ideally after Practice 1  
**Work in:** `practice/starter-campusdesk/`

## Goal

Leave a **committed-quality** `CLAUDE.md`, gitignore for local files, and a first look at `/init` + `/context`. Another student should be able to clone this folder and get the same agent behavior.

## Tasks

### 1. Git hygiene

If this folder is not its own git repo, you can still add ignore rules to the course `.gitignore`, or a local one here.

Ensure these will not be committed when you do use git:

```
CLAUDE.local.md
.claude/settings.local.json
.venv/
```

### 2. `/init`

```bash
cd practice/starter-campusdesk
claude
```

Run `/init`. Let it draft `CLAUDE.md`. **Then cut it.**

Keep:

- install / run / test / lint commands
- where routes, models, and store live
- in-memory store resets on restart
- “done means pytest + ruff, show output”
- pointers to `docs/product.md` and `docs/architecture.md`

Delete:

- generic “write clean code”
- a tour of every function
- duplicated README

Target: **well under 200 lines**. Aim for about 40–80.

### 3. Linked docs

In `CLAUDE.md`, import the two short docs:

```markdown
Product: @docs/product.md
Architecture: @docs/architecture.md
```

Those files are small enough to tax every session. (Lecture 4 will tell you not to do this with a wiki.)

### 4. Local file (optional)

Create `CLAUDE.local.md` with something only you care about, e.g. “I prefer pytest -q.” Confirm it is gitignored.

### 5. Prove it loaded

`/clear` or start a new session. Run `/context`.

**Pass:** `CLAUDE.md` appears under memory files. If you imported the docs, they should show as well.

### 6. A behavior check

New session, **not** plan mode, Accept edits is ok:

```text
What command do you run before you claim a task is done?
Answer from project instructions, not from generic advice.
```

**Pass:** It cites pytest and ruff from your file.

If it rambles about “best practices” without those commands, your `CLAUDE.md` is too vague or did not load. Fix and retry in a **new** session (memory is loaded at start).

### 7. `/doctor`

Run `/doctor`. Apply only fixes that make sense. Do not let it bloat `CLAUDE.md` again.

## Deliverable

- `CLAUDE.md` in the starter app
- Screenshot or paste of the `/context` memory section
- Note: one line you deleted from `/init` and why

## Stretch

Add `~/.claude/CLAUDE.md` (user scope) with a personal preference. Confirm via `/context` that **both** user and project files loaded. Keep project-specific facts in the **project** file so teammates get them.
