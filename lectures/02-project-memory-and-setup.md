# Lecture 2 — How Claude reads a project, and how you should set one up

**Language:** English · [Українською](uk/02-project-memory-and-setup.md)

**Give this file to students as the Lecture 2 handout.**  
**Slides:** `presentations/lecture-02.html`  
**After class:** Practice 3 and Practice 4  
**Depends on:** Lecture 1

---

## How to read this

This is the setup lecture. After it, you should be able to walk into a repo and leave behind a Claude setup another engineer would thank you for.

The trap is collecting every feature. Claude Code has many: memory files, rules, skills, hooks, plugins, subagents, MCP. You do not need all of them on day one. You need the right **layer** for each kind of knowledge.

A useful test for every line you add:

> If we deleted this, would Claude start making a **repeatable** mistake?

If no, do not add it. Long instructions are not stronger. They are easier to ignore.

---

## Learning objectives

1. Describe what is already in the window before you type versus what accumulates as the agent works — and use `/context` to prove it loaded.
2. Distinguish the three layers: prose (`CLAUDE.md`) teaches, `settings.json` configures, hooks and denies enforce.
3. Write a short, checkable, committable `CLAUDE.md` of facts the code will not say — under ~200 lines, no “be clean.”
4. Use `@` imports without turning the wiki into RAM: `@` in `CLAUDE.md` is paid every session; `@` in a prompt is paid once.
5. Choose a layer on purpose: always-true and short → `CLAUDE.md`; only in `app/` → path-scoped rule; multi-step and occasional → skill; must happen even if Claude forgets → hook.
6. Follow a setup order that stops when the next layer has no trigger — and debug “it doesn’t follow the rules” with `/context`, `/skills`, and `/hooks` before rewriting the paragraph.

---

## 1. The `.claude` map

When you run `claude` in a project, Claude Code looks at the working directory and your user folder. A typical project that is actually set up looks like this:

```
your-project/
  CLAUDE.md                 # team instructions (commit)
  CLAUDE.local.md           # your notes (gitignore)
  .mcp.json                 # team MCP servers without secrets (commit)
  .claude/
    settings.json           # permissions, hooks, project policy (commit)
    settings.local.json     # your allowlists (gitignore)
    rules/
      testing.md
      api.md
    skills/
      ship-ticket/
        SKILL.md
    commands/               # older home for slash commands; still works
    agents/                 # custom subagent defs, later
```

User-wide files live under `~/.claude/` (`CLAUDE.md`, `skills/`, `rules/`, `settings.json`). Use those for **your** taste, not for the team’s architecture.

> **In one sentence:** prose files teach; `settings.json` configures; hooks enforce; skills wait until needed.

### Settings versus CLAUDE.md

People mix these up.

| | `CLAUDE.md` | `.claude/settings.json` |
| --- | --- | --- |
| Language | Markdown, advice | JSON, machinery |
| Examples | “Run `pytest` before you claim done” | permission allowlists, hooks, env |
| Enforced? | No. The model may ignore it | Yes, for the keys the product enforces |
| Tokens | Yes, it occupies context | Mostly no, except hook output |

If you need “Claude cannot `rm -rf` the disk,” that is a **hook** or a **permission deny**, not a paragraph.

---

## 2. What loads before you type

A new session does **not** start as a blank model with only your first sentence. Before you type, Claude Code typically injects:

- the system prompt (tool instructions, product behavior)
- **project-root `CLAUDE.md`** and unscoped rules
- **auto memory** (notes Claude wrote for itself, capped)
- **skill names and descriptions** (not the full skill bodies)
- **MCP tool names** (full schemas are often deferred until a tool is used)
- maybe an output style or extra system prompt you configured

Then, as it works:

- each **Read** adds file text
- **path-scoped rules** and **nested `CLAUDE.md`** load when matching files are read
- **skill bodies** load when you type `/skill-name` or when Claude decides the skill applies
- **hooks** may append output (for example a linter result after an edit)

This is why `/context` is a professional habit. It shows the pie chart of what actually occupied the window, not what you hoped was loaded.

Run it after `/init`. If `CLAUDE.md` is missing from Memory files, you are in the wrong directory or the file is named wrong.

---

## 3. CLAUDE.md — standing instructions

`CLAUDE.md` is a markdown file Claude reads at the start of **every** session in that scope. You write it. It is the replacement for repeating yourself.

### Where the files live (broad → specific)

| Scope | Location | Who it is for |
| --- | --- | --- |
| Managed / org | OS-specific policy path | Company-wide, IT-owned |
| User | `~/.claude/CLAUDE.md` | You, all projects |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | The team, committed |
| Local | `./CLAUDE.local.md` | You, this repo, gitignored |
| Nested | `package/CLAUDE.md` | Loads when Claude works in that subtree |

Files **concatenate**. They do not override like CSS. Closer instructions are read later, which usually helps, but **contradictions** make Claude pick at random. Clean them up.

Claude also walks **up** the directory tree. Launching in `apps/api/` can load `apps/api/CLAUDE.md` and `apps/CLAUDE.md` and repo-root `CLAUDE.md`. In a monorepo that is powerful and noisy. There is a `claudeMdExcludes` setting for “please ignore the other team’s file.”

### What to put in

Put facts Claude cannot infer reliably from code:

- how to run, test, lint, typecheck
- package manager (`pnpm` vs `npm`)
- “always / never” that is project-specific
- where features live (“routes in `app/main.py`, rules in `store.py`”)
- git / PR conventions if they are real
- env vars required to boot
- gotchas (“in-memory store resets; tests share process state”)

### What to keep out

- tutorials and history
- full API catalogs (link or skill)
- standard language advice Claude already has (“write clean code”)
- anything that changes every week (put dates in specs, not in CLAUDE.md)
- a file-by-file tour of the repo

Anthropic’s own guidance: aim **under ~200 lines**. If a line would not cause a mistake when removed, remove it.

### How to write a line so it is followed

Vague: “Format code properly.”  
Checkable: “Python: ruff, line length 100, as in `pyproject.toml`.”

Vague: “Test your changes.”  
Checkable: “Before you say a task is done, run `pytest` and `ruff check .` and paste the summary.”

Vague: “Be careful with the database.”  
Checkable: “Do not run destructive SQL. There is no production database in this exercise app.”

If one rule is still skipped, you can emphasize **that one line**. If you emphasize twenty lines, none of them are special.

### `/init`

`/init` inspects the repo and drafts a `CLAUDE.md`. If one exists, it suggests improvements rather than blindly overwriting.

Use it as a **starter**, then cut. Generated files are often too long and too obvious. Run `/doctor` later: it can flag committed instructions Claude could have inferred from the code.

### Auto memory

Separate from `CLAUDE.md`: Claude can write **auto memory** (learnings, your corrections) into a memory file that loads at session start, truncated (on the order of first 200 lines or 25KB).

- You write `CLAUDE.md` for the team.
- Claude writes auto memory for patterns it noticed.

Do not treat auto memory as the architecture doc. If a correction should survive for everyone, promote it into `CLAUDE.md` or a rule yourself.

`/memory` opens the files. Use it when you think “it should have remembered that.”

---

## 4. Linked documents (`@` imports)

Inside `CLAUDE.md` you can pull other files in:

```markdown
See @README.md for how to run the app.
Architecture: @docs/architecture.md
Product intent: @docs/product.md
```

Rules that matter:

- Imports are **expanded at launch** into the context window. They are not free.
- Relative paths are relative to the **file that contains the import**, not necessarily the cwd.
- Imports can nest, with a small hop limit (on the order of four).
- Inside backticks, `@README` is just text. Outside, `@README` imports.
- First time a project imports files **outside** the working directory (for example `~/.claude/...`), Claude Code asks for approval. That is a safety dialog, not a nuisance.

### When to import

Import a **short** architecture note or a 40-line README section the model always needs.

Do **not** import:

- the entire Confluence export
- generated OpenAPI JSON
- last quarter’s design review

Those belong in a **skill** (loaded on demand) or in `@` mentions **in a single prompt** when that task needs them.

> **In one sentence:** `@` in `CLAUDE.md` means “pay this token cost every session”; `@` in a prompt means “pay it this once.”

### AGENTS.md and other tools

Claude Code reads `CLAUDE.md`, not `AGENTS.md`, by default. If the repo already has `AGENTS.md` for other agents, the clean pattern is:

```markdown
@AGENTS.md

## Claude Code
Use plan mode for anything that touches `app/store.py`.
```

`/init` can also absorb Cursor / Copilot-style rule files into a draft `CLAUDE.md`.

---

## 5. Rules — `.claude/rules/`

When `CLAUDE.md` starts collecting chapters, split them.

Put markdown files in `.claude/rules/`:

```
.claude/rules/
  testing.md
  python-style.md
  http-api.md
```

Unscoped rules load at session start, similar to `CLAUDE.md`.

### Path-scoped rules

```markdown
---
paths:
  - "app/**/*.py"
  - "tests/**/*.py"
---

# Python in CampusDesk

- Business rules live in `store.py` or a service module, not in the route.
- New endpoints ship with tests in the same change.
```

These load when Claude **reads matching files**, which saves tokens on sessions that never touch Python.

If a rule must survive compaction and always apply, keep it unscoped or in root `CLAUDE.md`. Path-scoped rules can be summarized away with the rest of history, then reloaded when matching files are read again.

User-level rules: `~/.claude/rules/` for personal taste (“I prefer explicit types”) that should not be committed to CampusDesk.

---

## 6. Skills — procedures that load on demand

A **skill** is a folder with `SKILL.md`. The folder name becomes `/folder-name`.

Claude sees the **description** up front. The **body** loads when:

- you type `/ship-ticket`, or
- Claude judges that the user request matches the description

That is the point. Skills are how you keep `CLAUDE.md` small.

Custom slash commands used to live as `.claude/commands/foo.md`. That still works. New work should use `.claude/skills/foo/SKILL.md`. Same `/foo`.

### A skill worth writing

If you paste the same 20-line checklist every time you “finish a ticket,” that is a skill.

```markdown
---
description: Finish a CampusDesk code change. Use when the user asks to ship, wrap up, or verify a ticket feature.
---

## Finish a change

1. Run `pytest` and `ruff check .`.
2. If either fails, fix and rerun. Do not stop on the first green file if the suite is red.
3. Update `docs/` only if user-visible behavior changed.
4. Summarize: files changed, tests run, leftover risk.

Do not commit unless the user asked.
```

Optional YAML fields (product-dependent, but useful to know):

- `disable-model-invocation: true` — only you may fire it with `/name`. Keeps the description from auto-triggering.
- `context: fork` — run the skill in a subagent so the body and its file reads stay out of your main window.

Skills can also inject live command output with a special `!` `` command `` syntax in the markdown, so a “summarize my diff” skill can include `git diff` without Claude guessing.

### Skill versus CLAUDE.md versus rule

| Need | Put it in |
| --- | --- |
| Always true, short | `CLAUDE.md` |
| Always true, but only in `app/` | path-scoped rule |
| Multi-step procedure, sometimes | skill |
| Must run even if Claude “forgets” | hook |

### Where skills live

| Place | Path |
| --- | --- |
| Project (team) | `.claude/skills/<name>/SKILL.md` |
| User | `~/.claude/skills/<name>/SKILL.md` |
| Plugin | inside an installed plugin |

`/skills` lists what this session can see. If your skill is missing, the folder name or frontmatter is wrong, or you launched in the parent directory.

---

## 7. Hooks — the loop you do not have to remember

A **hook** is a command, HTTP call, prompt, or subagent that Claude Code runs at a **lifecycle event**.

Advice in markdown is optional. Hooks are not. If you need “every Python edit is formatted” or “never write to `.env`,” use a hook.

### Events you will actually configure in class

| Event | When | Typical use |
| --- | --- | --- |
| `PreToolUse` | Before a tool runs | Block `rm -rf`, block writes to secrets |
| `PostToolUse` | After a successful tool | Run ruff on the edited file |
| `Stop` | Claude thinks it is done | Run the full test suite; block stop if red |
| `SessionStart` | Session begins | Print repo name, remind of branch |
| `PreCompact` | Before context summary | Snapshot notes you care about |

There are many more events (permissions, subagents, compaction). You do not need them to pass this course. You need the idea: **hooks attach to the harness, not to the model’s good intentions.**

### Shape in settings

Hooks live under `"hooks"` in a settings file, not in a random `hooks.json` at repo root (plugins use `hooks/hooks.json`; projects usually use `.claude/settings.json`).

A conceptual PostToolUse example:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "ruff check ${CLAUDE_PROJECT_DIR}"
          }
        ]
      }
    ]
  }
}
```

Exact matcher names and JSON fields change with versions. In class: ask Claude to **draft the hook**, then run `/hooks` to confirm it registered. `/hooks` is truth. The file on disk is intent.

### Hook output is context

If a PostToolUse hook prints linter errors, that text goes back into the conversation. That is good: the agent can fix them. It also **costs tokens**. A hook that dumps a 5,000-line log on every edit will wreck the session. Print a short summary.

### Stop hooks and “done”

A Stop hook can refuse to let the turn end until `pytest` passes. That is how you get unattended loops. Claude Code will not let a broken Stop hook trap you forever; there is a cap on consecutive blocks. Still: write the script so it fails clearly.

> **In one sentence:** skills tell Claude how to ship; hooks make “unshipped” harder.

---

## 8. Permissions and local settings

`.claude/settings.json` (committed) can allow `pytest`, `ruff`, `git status`, and deny obviously stupid commands.

`.claude/settings.local.json` (gitignored) is where **you** put extra allowlists so you are not fighting the team file.

`CLAUDE.local.md` is the prose version of “only I care”: your sandbox URL, your test user.

Always gitignore:

```
CLAUDE.local.md
.claude/settings.local.json
```

Never commit API tokens. `.mcp.json` may be committed **without** secrets; use env vars or user-scope MCP for tokens. Lecture 3.

---

## 9. Recommended setup for a project (do this in order)

This is the order we want in class and at work. Stop when the next layer has no trigger yet.

### Step 0 — Make the repo honest

- README that actually runs
- one test command
- one lint command
- a short architecture note

If humans cannot run the checks, the agent cannot either.

### Step 1 — `/init`, then cut

Generate `CLAUDE.md`. Delete anything the code already shows. Keep commands and gotchas. Commit it.

### Step 2 — `/context` and `/doctor`

Confirm the file loaded. Fix contradictions.

### Step 3 — Permissions for the inner loop

Allow the test and lint commands you trust. Stay in Manual or Accept edits until you are calm.

### Step 4 — Path-scoped rules

When `CLAUDE.md` grows a “Python” section and a “docs” section, split them.

### Step 5 — One skill for the team loop

Example: `/verify-change` that runs pytest + ruff and updates docs if needed.

### Step 6 — Hooks for the thing people forget

Format-on-edit, or Stop-hook tests. Start with one hook. Watch `/hooks`.

### Step 7 — MCP when copy-paste starts

Jira, Slack, Figma, the database. Not before. Each MCP server adds tool names (and sometimes a lot more) to the world the model can see.

### Step 8 — Only then: extra agents, plugins, fancy workflows

If you start at step 8 you will have a museum of YAML and a model that still cannot run tests.

### Team habits

- Review `CLAUDE.md` in PRs like code.
- If Claude makes the same mistake twice, change a file, not your mood.
- If a rule must never fail, it is a hook or a CI check, not italics in markdown.
- Keep docs that you `@` import short, or they tax every session.

---

## 10. How Claude “sees” all of this together

Imagine you ask: “Add an assignee field to tickets.”

1. Root `CLAUDE.md` already said: models in `models.py`, store in `store.py`, tests required.
2. Claude reads `app/models.py`. A path-scoped API rule loads.
3. The description of `/ship-ticket` matches “wrap up a feature”; Claude may load that skill at the end.
4. After each edit, a PostToolUse hook runs ruff. Output appears in the transcript.
5. You never mentioned ruff. The harness did.

That is a **configured** agent. Same model as a teammate with an empty repo, very different trajectory.

If something “doesn’t work”:

| Symptom | Check |
| --- | --- |
| Ignores style | `/context` — is the file loaded? Is it 800 lines? |
| Skill missing | `/skills`, folder name, working directory |
| Hook missing | `/hooks`, JSON in settings, matcher |
| Still does the dangerous thing | hook / deny rule, not more prose |

`/debug`, `/doctor`, and `claude --safe-mode` exist for “my config is haunted.” Safe mode turns customizations off so you can see if the problem is the model or your museum.

---

## 11. A CampusDesk `CLAUDE.md` worth committing

Something in this shape is enough for Practices 2–4:

```markdown
# CampusDesk

## Commands
- Install: `pip install -e ".[dev]"`
- Run: `uvicorn app.main:app --reload`
- Test: `pytest`
- Lint: `ruff check .`

## Architecture
- FastAPI app in `app/main.py`
- Pydantic models in `app/models.py`
- In-memory store in `app/store.py` (resets on restart)
- Product intent: @docs/product.md
- Architecture: @docs/architecture.md

## Rules
- Keep route handlers thin.
- Every behavior change needs a pytest.
- Do not add auth, persistence, or new dependencies unless the spec says so.
- Before you claim done: `pytest` and `ruff check .` are green. Show the output.
```

Notice: no novel, no copy of FastAPI docs, no “be a helpful assistant.”

---

## Recap

- Session start loads standing memory, skill **descriptions**, and MCP **names** — not every document you own.
- `CLAUDE.md` is always-on, short, specific, committed.
- `@` imports in `CLAUDE.md` are always-on too; spend them carefully.
- Rules split topics; `paths` delay loading.
- Skills are on-demand playbooks and `/commands`.
- Hooks and settings enforce; markdown requests.
- Set up in order: honest repo → small CLAUDE.md → permissions → rules → one skill → one hook → MCP.

---

## Check your understanding

1. Why can a 600-line `CLAUDE.md` make Claude *less* obedient?
2. You want a 15-step release checklist used twice a month. CLAUDE.md, rule, skill, or hook?
3. You want ruff to run after every file edit even if Claude forgets. Which layer?
4. What is the difference between `@docs/architecture.md` in `CLAUDE.md` and attaching `@docs/architecture.md` in one prompt?
5. A teammate’s skill does not appear. Name three places you would look.
6. Why gitignore `CLAUDE.local.md`?

---

## Preview of Lecture 3

MCP servers, how tool names show up to the model, permission modes, and the commands you will use daily (`/mcp`, `/context`, `/compact`, `/permissions`, Plan mode, `!` shell, `@` files).

---

## Practice after this lecture

- **Practice 3** — rules, skills, linked docs on CampusDesk.
- **Practice 4** — a verification hook and a stop-the-loop-until-green habit.
