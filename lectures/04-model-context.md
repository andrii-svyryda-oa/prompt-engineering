# Lecture 4 — Model context, and how to manage it

**Language:** English · [Українською](uk/04-model-context.md)

**Give this file to students as the Lecture 4 handout.**  
**Slides:** `presentations/lecture-04.html`  
**After class:** Practices 6–8 (specs and docs are context machines)  
**Depends on:** Lectures 1–3

---

## How to read this

If Lecture 1 was “what an agent is,” this lecture is “why your agent got stupid at 4pm.”

Almost every best practice in Claude Code is a **context** practice. The model in a nearly full window is not a different product. It is the same product with a messy desk. It will drop a constraint from the spec, “forget” the linter rule, or hallucinate a function it read an hour ago.

You will learn to **see** the window (`/context`), **spend** it on purpose, **reset** it (`/compact`, `/clear`, `/rewind`), and **isolate** heavy reads (skills, subagents, path-scoped rules).

---

## Learning objectives

1. Define the context window as RAM for this conversation — not a hard drive for the repository, and not “memory of the company.”
2. List what you already paid for before “hi” versus what accumulates as the agent works, and use `/context` as the source of truth.
3. Predict what survives `/compact` and what does not — and put durable rules in files, then `@` the spec again if the task continues.
4. Choose `/compact` vs `/rewind` vs `/clear` vs new session on purpose (same task, wrong approach, different job, new day).
5. Design `CLAUDE.md`, skills, MCP, and docs so the default session stays lean — a 400-line import taxes every rename.
6. Notice a sick window (ignored spec bullets, reinvented helpers, looping on the same log) and run a clean-session protocol for feature work.

---

## 1. The window is the working memory of *this session*

The **context window** is the maximum amount of tokenized text the model can attend to in one request: system prompt, tools, memory files, your messages, assistant messages, file contents, command output, MCP results.

Typical orders of magnitude (check `/context` for **your** model):

- many Claude Code sessions: on the order of **200k** tokens
- some models / plans: up to **1M** tokens

A million sounds infinite. It is not. One fat OpenAPI dump, one Jira issue with embedded HTML, plus twenty file reads, plus a failing test log, plus five MCP schemas, and you are in the danger zone of a 200k window. Even in a 1M window, **quality often drops before the hard limit**. The middle of a long prompt gets less attention. Compaction might already have summarized away the spec.

> **In one sentence:** context is RAM for the conversation, not a hard drive for the repository.

The repository stays on disk. Claude can **re-read** a file. What it cannot do is magically remember a paragraph that was dropped in a summary, unless that paragraph lives in `CLAUDE.md` or you say it again.

### Sessions start empty of chat, not empty of setup

New session:

- no yesterday’s jokes
- yes: `CLAUDE.md`, auto memory, skill descriptions, MCP names, system prompt

That is why Lecture 2 exists. Standing instructions must be files.

---

## 2. What occupies space (a mental pie)

When you run `/context`, you will see categories in this spirit:

| Slice | Examples | You control it by |
| --- | --- | --- |
| System prompt | Tool instructions | Usually leave it |
| Memory files | `CLAUDE.md`, rules, auto memory | Keep them short; path-scope rules |
| Skills | Descriptions always; bodies when used | Fewer, tighter descriptions |
| MCP | Names; schemas when used | Fewer servers; don’t dump results |
| Tools | Built-in tool defs | Don’t think about it |
| Conversation | Your prompts, Claude’s prose | Shorter prompts, less narration |
| Reads / bash | File bodies, pytest output | Subagents; `!pytest -q`; don’t cat logs |

Numbers in marketing slides are not your session. **`/context` is.** Make it a reflex after any long explore.

### Startup cost you pay even for “hi”

Before you type, you already spent tokens on memory + descriptions. A 400-line `CLAUDE.md` that imports three 800-line docs means **every** “rename this variable” session is taxed. That is the tax that makes people say “Claude ignores my rules.” The rules are in there. They are also buried.

---

## 3. How the window fills while you work

A realistic CampusDesk hour:

1. You attach `@docs/specs/SPEC-001.md` (3k tokens).
2. Claude reads `models.py`, `store.py`, `main.py`, tests (8k).
3. Path-scoped Python rule loads (400).
4. Claude runs `pytest` with verbose (`-vv`) (6k of junk).
5. It edits, reruns, fails, dumps a traceback (4k).
6. You paste a screenshot of OpenAPI (images are tokens too).
7. It “just checks” `docs/product.md` again.
8. You ask an unrelated question about git hooks. Claude greps the whole course folder you launched from by mistake.

None of these are mistakes individually. Together they shove the spec into the fog.

**Tool output is the silent killer.** A 15-line pytest failure is gold. A 2,000-line dump is poison. Put in `CLAUDE.md`: “run `pytest -q` unless debugging a single test.”

**Re-reading the same files** is also a killer. The model does not have a perfect index of “I already have `store.py`.” It will read it again. You can say “you already have `store.py` from earlier; do not reread unless you need a fresh copy.”

---

## 4. Compaction: the automatic janitor

When the window approaches its limit, Claude Code **compacts**: it asks the model to **summarize** older conversation and continues with that summary plus fresh working set.

This is a lifesaver. It is also a **data loss** process. Summaries keep the gist. They drop the exact acceptance criterion in the third bullet of the spec.

### What typically comes back after compact

The product re-injects some things from disk rather than trusting the summary:

| Mechanism | After compact (typical) |
| --- | --- |
| System prompt | Still there |
| Root `CLAUDE.md`, unscoped rules | Re-read from disk |
| Auto memory | Re-read from disk |
| Plan from plan mode | Re-injected |
| Path-scoped rules / nested CLAUDE.md | Reloaded when matching files are read again |
| Recently edited/read files | A **small** number may be re-read (recent first; huge files may become a path reference only) |
| Skill bodies you invoked | May be re-injected with **caps** (put important lines at the **top** of `SKILL.md`) |
| Hook output from an hour ago | In the summary, if at all |
| Your exact early prompt | Maybe a sentence in the summary |

So: **durable rules belong in files**, not in message 2.

You can also compact **manually**:

```text
/compact focus on SPEC-001 assignee field and the failing tests
```

A focused compact is better than the automatic one, which guesses what matters.

`/autocompact 500k` (or similar) changes **when** the automatic pass fires, on versions that support it. Useful if you want earlier, cleaner summaries.

`/rewind` can summarize **part** of the conversation (“from here”) so you keep the tail intact.

> **In one sentence:** compaction is lossy compression; put anything legally binding (the spec) in a file and `@` it again after compact if the task continues.

---

## 5. Clear, compact, rewind, new session

Four resets. Different jobs.

| Move | Keeps files on disk | Keeps chat | Use |
| --- | --- | --- | --- |
| `/compact` | yes | summarized | Same task, window fat |
| `/rewind` | can restore file snapshots | yes, earlier | Last approach was wrong |
| `/clear` | yes | **no** | Next task is unrelated |
| New session / `claude` | yes | no (unless `-c`) | New day, new brain |
| `claude -c` | yes | **full old chat** | Continue after lunch |

Students often `/clear` too late (they already polluted the feature with a side quest) or `/compact` when they should `/clear` (the summary still talks about the side quest).

Rule of thumb:

- Same PR, lots of reads → `/compact focus on …`
- Different ticket → `/clear` or new session
- Bad edits → rewind, then maybe compact
- “Continue homework tomorrow” → named session, `claude -c` or `--resume`

---

## 6. Design for a lean default session

This is Lecture 2 seen from the token side.

### CLAUDE.md

Under ~200 lines. Commands, layout, gotchas. Not the spec of every feature.

### Rules with `paths`

Python rules should not load when Claude only edits `docs/`.

### Skills

A 2,000-line API bible as a skill **description** is still a tax if the description is huge. Keep descriptions to a few lines. The body can be long; it loads when used.

`disable-model-invocation: true` for skills you only want via `/name`, so Claude does not preload them because a word matched.

### Linked docs

`@docs/architecture.md` in `CLAUDE.md` only if that file stays small. Otherwise mention the path in prose: “architecture lives in `docs/architecture.md`; read it when the task changes structure.” That is **one sentence**, not a 12k import. Claude can still Read the file when needed.

### MCP

Every connected server adds names. Disconnect class experiments you are not using. After `get_issue`, say “use the summary, do not keep echoing custom fields.”

### Subagents

For “find every mention of Ticket in the repo,” a subagent returns a page, not fifty files in **your** window. Use it for research. Implement in the main session with a short brief.

### Verification commands

Quiet flags. `pytest -q`. `ruff check .` without dumping every file when clean.

### Don’t launch Claude from the wrong folder

If you run `claude` in the **course root**, it will see lectures, presentations, and CampusDesk together. Memory files from the wrong tree will load. Always `cd practice/starter-campusdesk` for app work.

---

## 7. Symptoms the window is sick

Learn these the way you learn a compiler error.

| Symptom | Likely cause | Move |
| --- | --- | --- |
| Ignores a spec bullet you pasted 40 minutes ago | Compacted or buried | `@` the spec file again |
| Reinvents a helper that exists | Never found it, or forgot the read | Point at the path; consider `/clear` if lost |
| Writes a new style | `CLAUDE.md` too long or contradicted | `/context`, shorten files |
| Loops on the same test output | Same log pasted three times | `/rewind` or compact; run `-q` |
| Auto-compact thrash error | One file or log is larger than the useful window | Don’t cat it; extract the 20 lines that matter |
| MCP call then nonsense | Huge JSON result | Ask for fields you need only |
| Slow, expensive turns | Full window every call | compact / clear / smaller model for trivia |

Extended context (1M) **does not** mean you should fill it. A focused 30k-token session beats a sloppy 400k session.

---

## 8. Prompt caching (only what you need)

Claude Code **caches** a stable prefix of the prompt so repeats are cheaper and faster. Practical consequences:

- Editing `CLAUDE.md` mid-session may not behave like you think until a reload / new turn boundary. Prefer finishing the thought, or start a new session after a big memory edit.
- Switching model can bust the cache (next turn is slower/costlier).
- `/context` and cost views help you sanity-check.

You do not need to manage the cache by hand. You need to know that **churning the prefix** (giant CLAUDE.md edits, model yo-yo) has a cost.

---

## 9. A protocol for feature work (use in Practices 6–10)

1. **New or cleared session** for a new spec.
2. Plan mode. `@docs/specs/SPEC-xxx.md` once.
3. Implement. Quiet tests.
4. Midway, `/context`. If memory files are 40% of the pie, you over-imported.
5. If you context-switch to “explain tokens to my teammate,” **do that in another session**.
6. Before a long second task in the **same** session: `/compact focus on leftover TODOs for SPEC-xxx`.
7. After merge: `/clear`.

Write this on the cheatsheet until it is muscle memory.

---

## Recap

- The context window is the session’s RAM. The repo is the disk.
- Startup already spends tokens on memory and descriptions.
- File reads, bash, MCP, and images fill the rest.
- Compaction is lossy; durable truth lives in files.
- `/context` to see, `/compact` to continue, `/clear` to switch, subagents to isolate, skills/rules to delay load.
- Quiet tools and small `CLAUDE.md` are context engineering, not fussiness.

---

## Check your understanding

1. Why does a new session not remember your explanation from yesterday, even though the model “knows Python”?
2. What happens to a path-scoped rule after compact if Claude is no longer reading those files?
3. You must implement SPEC-002 after a long debugging detour on SPEC-001. Compact or clear? Why?
4. Why can importing the full product wiki in `CLAUDE.md` make the agent skip a one-line “never do X”?
5. How does a subagent help the **main** window?
6. Name two pytest habits that protect context.

---

## Preview of Lecture 5

Spec-driven development: the spec as source of truth, the loop from ticket → plan → tests → code → docs, and how to keep Claude from “helpfully” expanding scope.

---

## Practice after this lecture

- **Practice 6** — write a spec (this becomes the durable context).
- **Practice 7** — implement from the spec in a clean session.
- **Practice 8** — documentation that the agent can find without eating the window.
