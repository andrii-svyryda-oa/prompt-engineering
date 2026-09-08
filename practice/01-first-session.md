# Practice 1 — First Claude Code session

**Language:** English · [Українською](uk/01-first-session.md)

**Time:** 45–60 minutes  
**When:** After Lecture 1  
**Work in:** `practice/starter-campusdesk/`

## Goal

Install Claude Code (if needed), open it in CampusDesk, explore without wrecking the repo, then run the tests **yourself** and ask Claude to explain the result.

## Setup

1. Python 3.11+ available: `python --version`
2. Create a venv and install (from `practice/starter-campusdesk`):

```bash
python -m venv .venv
```

Windows: `.venv\Scripts\activate`  
macOS/Linux: `source .venv/bin/activate`

```bash
pip install -e ".[dev]"
pytest
ruff check .
```

3. Install Claude Code using current official instructions (Windows PowerShell example):

```powershell
irm https://claude.ai/install.ps1 | iex
```

4. Sign in when prompted. You need a Claude plan that can run Claude Code.

## Tasks

### 1. Launch in the right folder

```bash
cd practice/starter-campusdesk
claude
```

If you launch from the course root, Claude will see lectures and presentations too. That is the wrong context for this app.

### 2. Explore with no edits

Stay in **Plan** mode (`Shift+Tab` until the indicator says plan) or put this in the prompt:

```text
Do not change any files.
Explore CampusDesk.
Explain: what the product is, how to run it, how to test it,
and where a new ticket field would be added.
Cite file paths.
```

**Pass:** You get an answer that mentions `app/main.py`, `app/store.py`, `app/models.py`, `pytest`, and `uvicorn`. If it starts editing, `Esc` and remind it.

### 3. Attach a file on purpose

```text
@docs/product.md
In one paragraph, who is this for? Do not edit.
```

**Pass:** The paragraph matches product.md (requester, IT staff, lead).

### 4. Ground truth from the shell

In the Claude prompt, run:

```text
!pytest -q
```

Then:

```text
Did the suite pass? Quote the summary line. Do not change code.
```

**Pass:** Claude quotes the pytest output you just produced, not a guessed “all tests passed.”

### 5. A tiny question that needs a read

```text
What happens if I GET /tickets/9999? Point at the handler.
Still no edits.
```

**Pass:** It points at the 404 path in `main.py` (or equivalent).

### 6. Commands to try once

Type `/help` and `/context`. Screenshot or note:

- whether any Memory files loaded (probably none yet — that is Practice 2)
- roughly what is occupying the window

## Deliverable

A short note (markdown in your homework folder, not necessarily in the repo):

- Claude Code version (`claude -v`)
- Three file paths you learned
- What `/context` showed for memory files
- One thing the agent got slightly wrong, if anything

## Common stuck points

| Problem | Move |
| --- | --- |
| `claude` not found | Restart the terminal after install; check PATH |
| Wrong shell on Windows | PowerShell vs CMD install commands differ |
| Tests fail before you start | Tell an instructor; do not “fix” until Practice 5 unless the install is broken |
| Claude edits README | You were not in plan mode; rewind if needed (`Esc` `Esc`) |

## Stretch

Start the API with `uvicorn app.main:app --reload` in another terminal. Ask Claude (no edits) how to create a ticket via HTTP. Then do it with curl or the docs UI at `/docs`.
