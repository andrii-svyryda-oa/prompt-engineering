# Practice 4 — Hooks and the verification loop

**Language:** English · [Українською](uk/04-hooks-and-verification.md)

**Time:** 60–90 minutes  
**When:** After Lecture 2  
**Depends on:** Practices 2–3

## Goal

Make “write code → run checks → fix” **mechanical**. You will add a hook (or a Stop-style check) so Claude cannot honestly say it is done while ruff or pytest is red.

Exact JSON for hooks changes across Claude Code versions. **Use Claude to draft the hook**, then verify with `/hooks`.

## Safety

Work only in `practice/starter-campusdesk`. Do not hook `rm`, network wipes, or anything outside this folder.

## Tasks

### 1. Manual loop once (no hook yet)

In a session, **Accept edits**:

```text
Do not add features.
Run pytest -q and ruff check . and paste the summaries.
```

Confirm both are green on the starter. If not, fix the environment first.

### 2. Ask Claude to write a PostToolUse hook

```text
Add a project hook in .claude/settings.json that runs after Edit or Write
on Python files: ruff check on the changed file or the project.
Keep output short. Use CLAUDE_PROJECT_DIR. Windows-friendly if possible.
Then tell me how to confirm it with /hooks.
Do not add other hooks.
```

Review the JSON. You should understand matcher + command. If the command is a 40-line script that cats entire files, simplify.

### 3. Confirm registration

`/hooks`

**Pass:** You see your PostToolUse (or equivalent) listed. If not, the JSON is in the wrong file or invalid. `/doctor` may help.

### 4. Trigger it

Make a **deliberate** lint problem with Claude:

```text
In app/main.py add an unused variable named unused_course_hook_probe = 1
immediately, then stop.
```

After the edit, the hook should run. You should see ruff complain in the transcript.

Then:

```text
Remove that unused variable. Leave behavior unchanged.
Run pytest -q and ruff check . Show output.
```

**Pass:** Probe is gone; both checks green.

### 5. Stop-the-turn check (choose one)

**Option A — Stop hook:** Ask Claude to add a Stop hook that runs `pytest -q` and fails the stop if tests fail. Be careful: a broken Stop hook is annoying. If you get stuck, `/hooks` and delete it from settings.

**Option B — Prompt-only (if hooks are blocked on school machines):** Put this in `CLAUDE.md` and in `/verify-change`:

```text
Never claim done without pytest -q and ruff check . in this session.
```

Then run a negative test: ask it to “finish” after it has not run tests; see if it runs them anyway.

### 6. Write the inner-loop prompt on your cheatsheet

You will paste this constantly in Practice 5+:

```text
Write the code, then run pytest -q and ruff check .
If anything fails, fix and run again.
Do not stop until both are green or you name a blocker.
Show evidence.
```

## Deliverable

- Diff of `.claude/settings.json` (and any hook script)
- Paste of `/hooks`
- Before/after of the unused-variable probe
- Which option you chose for “cannot stop red” (A or B)

## Common stuck points

| Problem | Move |
| --- | --- |
| Hook never fires | Wrong matcher; settings not loaded; restart session |
| Hook floods context | Print one line, not full ruff JSON |
| Windows command fails | Use `python -m ruff` or a `.ps1` in `.claude/hooks/` |
| Infinite Stop loop | Remove the hook; cap exists but do not rely on pain |

## Stretch

Add a PreToolUse deny for writes to `.env` even though CampusDesk has no `.env` yet. Prove it by asking Claude to create `.env` with a fake secret — it should be blocked.
