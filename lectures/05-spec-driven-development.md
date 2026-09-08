# Lecture 5 — Spec-driven development with a coding agent

**Language:** English · [Українською](uk/05-spec-driven-development.md)

**Give this file to students as the Lecture 5 handout.**  
**Slides:** `presentations/lecture-05.html`  
**After class:** Practices 9–10, then bonuses if you have time  
**Depends on:** Lectures 1–4

---

## How to read this

Coding agents fail in a boring way: they build **a** coherent system, just not **the** system you needed.

They are trained to complete patterns. A ticket that says “add assignee” will attract a full user table, email notifications, and a React admin, because those tokens often follow “assignee” on the internet. Spec-driven development (SDD) is how you **pin** the pattern to a document you control.

This lecture is not a ceremony for enterprise theater. It is the smallest set of documents and habits that let an agent loop **close against a written contract**.

You already have the machinery:

- agent loop (L1)
- project memory (L2)
- modes and MCP (L3)
- context (L4)

SDD is how you point that machinery at **one** source of truth.

---

## Learning objectives

1. Define spec-driven development as “the spec is the contract; code is the implementation” — if it is not in the spec, do not build it; if it is, tests must prove it.
2. Write a spec an agent can implement without guessing: numbered requirements, honest Out of scope, acceptance criteria that become tests, checks, and open questions that mean stop.
3. Run the workflow: explore → spec → plan → implement → verify → docs → (optional) ticket update — Plan mode until signed.
4. Keep lanes: git holds the contract (`docs/specs/`), Jira holds the queue, `CLAUDE.md` holds policy, a skill holds the ritual.
5. Refuse scope expansion unless the spec changes first. Out of scope is the most important section for agents.
6. Plug MCP (Jira) in as **transport** for the spec, not as a second spec — you own status transitions.

---

## 1. What spec-driven development means here

**Spec-driven development** in this course:

1. Work starts with a **written spec** (markdown in the repo, or a Jira story that **is** the spec).
2. The spec lists **behavior**, **acceptance criteria**, **out of scope**, and **checks**.
3. Implementation may not add product behavior that is not in the spec.
4. Tests are traced to acceptance criteria.
5. If reality disagrees with the spec, you **change the spec first** (or explicitly waive), then the code.

This is the opposite of “vibe coding,” where the prompt is the spec and evaporates when the session ends.

> **In one sentence:** if it is not in the spec, Claude must not build it; if it is in the spec, tests must prove it.

### Why agents need this more than humans do

A human intern who overbuilds can be glared at. An agent overbuilds **fluently** and **quickly**, then writes docs that justify the extra work. Without a spec, code review is you arguing with a very fast junior.

With a spec, review is mechanical:

- every criterion has a test or a reason it is manual
- no extra endpoints
- docs match the spec, not the agent’s blog post

---

## 2. The documents and who owns them

CampusDesk (and a real team) should have a small set:

| Document | Owner | Loaded when | Contains |
| --- | --- | --- | --- |
| `docs/product.md` | Product / team | Rarely in CLAUDE.md (keep short or path-only) | Why the product exists |
| `docs/architecture.md` | Tech lead | Short import or “read when structure changes” | How we build |
| `docs/specs/SPEC-xxx.md` | You, per feature | **This task only** (`@` in the prompt) | The contract |
| Jira story | Team process | MCP when configured | Index + workflow; **may duplicate or link** the spec |
| `CLAUDE.md` | Team | Every session | How to run, test, and **honor specs** |
| Skill `/implement-spec` | Team | On demand | The SDD checklist |

Jira is excellent as a **queue** (priorities, assignees, status). Jira is a poor unique home for a 3-page spec if people paste screenshots and lose versions. Pattern we teach:

- Jira: title, link, status, short description
- Git: `docs/specs/SPEC-xxx.md` as the canonical contract
- Jira description: “Canonical spec: `docs/specs/SPEC-001-ticket-assignee.md`”

Then MCP “read CAMP-42” should tell Claude to **open that file**, not to improvise from a one-line summary.

If your class only has Jira, write the spec **in the Jira description** with the same headings, and paste it into git when you implement. Two sources will drift. Prefer one canonical file.

---

## 3. Anatomy of a spec an agent can use

A spec is not a novel. Use stable headings so a skill can say “fill these.”

### Required sections

**1. Header**

- ID: `SPEC-001`
- Title
- Status: `draft | approved | implemented`
- Jira: `CAMP-42` (optional)
- Author, date

**2. Problem**

One short paragraph. The user pain, not the solution.

**3. Scope**

Bullet list of what **will** change.

**4. Out of scope**

The most important section for agents. Explicitly list the attractive extras:

- no auth
- no persistence
- no UI
- no email

**5. Behavior / requirements**

Numbered requirements (`R1`, `R2`). Each is testable.

Good: “R1. `Ticket` has optional `assignee` (`string | null`). Default `null`.”  
Bad: “We should support ownership.”

**6. API / UX contract**

Request and response shapes. Status codes. Error bodies.

**7. Acceptance criteria**

Given / When / Then, or a table. These become tests.

**8. Checks**

```text
pytest
ruff check .
```

**9. Open questions**

If not empty, the agent must **stop** in plan mode, not guess.

### Example slice (assignee)

```markdown
## Requirements
- R1. Tickets have `assignee: str | null`, default `null`.
- R2. `POST /tickets` accepts optional `assignee`.
- R3. `PATCH /tickets/{id}` can set or clear `assignee`.
- R4. Clearing uses `null`. Omitting the field on PATCH leaves the value unchanged.

## Out of scope
- User directory, validation that assignee exists
- Notifications
- Permissions

## Acceptance
- Given a new ticket without assignee, when I GET it, then `assignee` is null.
- Given ticket 1, when I PATCH `{"assignee":"it-oncall"}`, then GET shows that value.
- Given that ticket, when I PATCH `{"assignee":null}`, then GET shows null.
```

That is implementable. “Add assignees like Jira” is not.

---

## 4. The SDD loop with Claude Code

### Phase A — Explore (Plan mode)

```text
Read @docs/product.md @docs/architecture.md @app/models.py
We want ticket assignees. Do not write code.
List current ticket fields and likely touch points.
```

### Phase B — Write or tighten the spec (you, or Claude as editor)

```text
Draft docs/specs/SPEC-001-ticket-assignee.md using our heading template.
Do not invent requirements. If unsure, put a question in Open questions.
Do not implement.
```

You **edit** the spec until you would sign it. This is the last cheap moment to stop a bad feature.

### Phase C — Plan implementation (still Plan mode)

```text
@docs/specs/SPEC-001-ticket-assignee.md
Write an implementation plan: files, tests mapped to acceptance criteria, risks.
Do not add items from Out of scope.
```

Read the plan. Delete the “optional nice-to-have migration to Postgres.”

### Phase D — Implement (Accept edits)

```text
Implement SPEC-001 only.
Map each acceptance criterion to a pytest.
Run pytest -q and ruff check . until green.
Show evidence.
If a requirement is ambiguous, stop; do not guess.
```

### Phase E — Docs

```text
Update docs/architecture.md and docs/product.md **only** where SPEC-001 changed reality.
Do not write a marketing page.
```

### Phase F — Ticket (MCP, optional)

```text
Comment on CAMP-42: spec path, test names, remaining risks.
Do not change status unless I say.
```

### Phase G — Review

You read the diff **against the spec**, not against your vibe. Extra files are guilty until the spec is updated.

---

## 5. Tests are the spec in executable form

SDD without tests is a book report.

| Acceptance line | Test idea |
| --- | --- |
| default assignee null | create ticket, assert field |
| PATCH sets assignee | patch, get, assert |
| PATCH null clears | patch null, get |
| omit field on PATCH | patch title only, assignee unchanged |

Put test names that mention the SPEC id when you can: `test_spec001_assignee_defaults_to_null`. Future agents grepping the repo will find them.

The **verification loop** from Practice 4–5 is mandatory here:

```
code → pytest → ruff → fix → repeat
```

A Stop hook that runs pytest is allowed to be annoying. That annoyance is the point.

---

## 6. CLAUDE.md and a skill that encode SDD

Add a short **always-on** rule:

```markdown
## Specs
- Feature work needs a spec in docs/specs/ or an approved Jira story that contains the same sections.
- Do not implement behavior that is not in the spec.
- If Open questions is not empty, ask; do not guess.
- Map acceptance criteria to tests.
```

That is ten lines, not a process manual.

The **procedure** lives in a skill, for example `.claude/skills/implement-spec/SKILL.md`:

```markdown
---
description: Implement a CampusDesk spec. Use when the user names a SPEC-xxx file or says spec-driven.
---

1. Read the spec. Restate requirements and out of scope.
2. If Open questions is not empty, stop.
3. Plan: files + test mapping.
4. Wait for approval if in plan mode.
5. Implement only in-scope items.
6. pytest -q and ruff check . until green.
7. Update docs if behavior changed.
8. Report: spec id, tests, leftover risks, anything you refused as out of scope.
```

Now you start work with `/implement-spec @docs/specs/SPEC-001-ticket-assignee.md`.

---

## 7. Jira and MCP, without letting the board replace git

Practice 9–10 pattern:

1. Read issue via MCP.
2. If the issue is a stub, **write SPEC-xxx in git**, then comment the path on the issue.
3. Implement from the **file**.
4. Optional: attach a summary comment.

Why not implement from Jira JSON only?

- Custom fields and HTML noise waste context (Lecture 4).
- The issue will change while your branch lives.
- Git history of `docs/specs/` is reviewable in the same PR as the code.

When creating issues from Claude:

```text
Create a story whose description is a pointer plus a 5-line summary.
Do not paste 400 lines of markdown into Jira if the spec file exists.
```

Admins: use a **non-production** Jira project for class. Deny tools that delete issues if students are excited.

---

## 8. Documentation as part of the loop

Practice 8 is not “write pretty README.” It is **making the next session cheaper**.

Good project docs for agents:

- short
- structured headings
- examples of HTTP payloads
- dated only if you will update them
- linked from `CLAUDE.md` by **path**, or imported only if tiny

After a spec is implemented, the spec status becomes `implemented`. You do not delete it. It is the regression contract.

When docs and code disagree, the agent will pick at random. A `/docs-check` skill can say: “diff product.md against OpenAPI paths.” Even a manual prompt once per PR is enough.

---

## 9. Failure modes (you will see these in class)

| Failure | What it looks like | Fix |
| --- | --- | --- |
| Spec too vague | Agent invents a User model | Tighten requirements; out of scope |
| Spec too huge | Context dies; middle criteria vanish | Split SPEC-002; compact; `@` file again |
| Two sources of truth | Jira says X, file says Y | Canonical file; Jira links |
| Tests assert the implementation | Tests green, spec unmet | Write tests from acceptance **first** (optional TDD) |
| Hook missing | “Done” and ruff never ran | Practice 4 habit |
| Plan skipped | Surprise files in the diff | Plan mode is not optional for SDD |
| Helpful extras | Notifications, auth, Redis | Out of scope + review |
| Ticket moved to Done | Jira lies | Prompt + permissions |

**TDD variant** (strong, slightly slower):

```text
Write failing tests from SPEC-001 acceptance criteria first.
Run pytest; they must fail.
Then implement until green.
Do not change tests to match accidental behavior.
```

Use this on Practice 7 if students rush.

---

## 10. How SDD uses everything from Lectures 1–4

- **L1 loop:** verify = spec’s Checks section, not “looks good.”
- **L2 memory:** CLAUDE.md points at the spec **process**; skills hold the checklist; hooks enforce tests.
- **L3 modes:** Plan until the spec and plan are signed; MCP for the queue.
- **L4 context:** spec file is `@`’d in a **clean** session; not buried under a lecture on tokens.

Bonus 1–2 then **put an agent inside CampusDesk**. That is a different product. You will spec **that** agent too (tools it may call, what it must never do). Do not improvise an LLM feature without a spec. You know too much now to pretend that is cute.

---

## Recap

- Spec-driven development makes the spec the contract and tests the proof.
- Write testable requirements and ruthless out-of-scope lists.
- Workflow: explore → spec → plan → implement → pytest/ruff → docs → optional Jira.
- Git holds the canonical spec; Jira holds the ticket; MCP is the bridge.
- Skills encode the ritual; hooks encode the checks; you encode judgment.

---

## Check your understanding

1. Why is “add assignees like other tools” a bad spec for an agent?
2. Where should a 2-page contract live if Jira and git disagree later?
3. What must happen if Open questions is not empty?
4. How do you stop Claude from adding email notifications “while we’re here”?
5. Why update architecture docs in the **same** change as the feature?
6. What is the difference between a green test suite and a met spec?

---

## After this lecture

- **Practice 9** — MCP Jira (or mock) read/create stories.
- **Practice 10** — one story all the way through SDD.
- **Bonus 1** — chatbot or LLM flow **specified first**.
- **Bonus 2** — in-app agentic loop (ask, CRUD, summaries, reports) with a tool allowlist.

You now have the whole student picture. The rest is reps.
