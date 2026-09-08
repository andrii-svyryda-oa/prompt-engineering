# Lecture 1 — From language models to coding agents

**Language:** English · [Українською](uk/01-llms-agents-capabilities.md)

**Give this file to students as the Lecture 1 handout.**  
**Slides:** `presentations/lecture-01.html`  
**After class:** Practice 1 and Practice 2

---

## How to read this

This handout is long on purpose. The slides are the classroom path. This file is what you keep.

Read it like a chapter, not like a tweet:

- Headings are the map. If you are lost, jump to the next heading and come back.
- Gray “In one sentence” boxes are the thing to remember if you remember only one line.
- Examples are realistic Claude Code sessions, not toy math problems.
- At the end there are check questions. Answer them in writing. If you cannot, reread that section.

You do not need a machine-learning course for this. You need a working model of **what the model is**, **what an agent is**, and **what Claude Code is allowed to do**.

---

## Learning objectives

By the end of this lecture you should be able to:

1. Explain what an LLM is in honest sentences: a next-token predictor limited to its window — not a database, not a compiler, not a source of truth.
2. Explain why a chatbot is not an agent: you stay in the middle (copy, run, paste errors) instead of the model using tools and reading the results.
3. Draw the **agentic loop** — gather → act → verify → repeat — and say what happens on fail, pass, and stuck. Name a check the agent can run without you.
4. List the main jobs Claude Code can do in a real repository (explore, implement from a spec, fix a bug, refactor to a pattern, run tests/linters) and when each one works.
5. Name what still belongs to you: architecture, secrets, production writes, merge to `main`, and the definition of “done.” Distinguish a request in English from enforcement (hooks, missing tools).
6. Start a session so the loop can close: name files and contracts, point with `@path`, separate explore from edit, ask for command output, interrupt instead of restarting.

---

## 1. What an LLM is, in few words

A **large language model** (LLM) is a program that predicts the next piece of text, called a **token**, given the text it has already seen.

That is the whole mechanism. It is not a database. It is not a compiler. It is not a person. It is a very large next-token predictor that was trained on huge amounts of text, including a lot of source code.

Because it was trained that way, the “next token” is often a useful answer, a useful function, a useful plan, or a useful shell command. The usefulness is a side effect of predicting text well, not a separate “understanding module” hiding behind the words.

> **In one sentence:** an LLM turns the text you give it into more text that is statistically likely to follow — and that text is often good enough to ship if you check it.

### Tokens, not “words”

The model does not see your file the way you see it. It sees a sequence of tokens. A token might be a whole word, a piece of a word, a punctuation mark, or a bit of code like `def` or `=>`.

This matters for three practical reasons:

1. **Cost and limits are measured in tokens**, not pages.
2. **The model has a maximum number of tokens it can see at once.** That budget is the **context window**. Lecture 4 is entirely about this.
3. **Code is dense.** A 400-line file is a lot of tokens. A test run that dumps 2,000 lines of stack traces is also a lot of tokens.

You do not need to count tokens by hand. You do need to stop thinking “Claude read my whole company.” It read whatever fit in the window of this session.

### What “knowing” means here

When people say “Claude knows Python,” they mean: given Python-looking text, the model is good at continuing with more Python-looking text that often compiles.

When people say “Claude knows our codebase,” they mean something different, and it is only true **in this session**, after it has read files, errors, tickets, and your `CLAUDE.md`. There is no permanent copy of your repo inside the model. Next session starts empty except for the files and instructions you load again.

That is why setup exists. Lecture 2 is how you reload the useful parts on purpose.

### What an LLM is not

Keep this list. You will need it when a demo looks magical.

| It is not | So do not expect |
| --- | --- |
| A source of truth | It can invent APIs, ticket IDs, and “the test passed” |
| A sandbox by itself | Text that looks like a command is not the same as a command that ran |
| Deterministic | Same prompt, slightly different answer |
| Your access-control system | If a tool is available, the model may try to use it |
| A replacement for review | Fluent code can still be wrong, unsafe, or out of spec |

An LLM is a strong **generator**. An agent is a generator **plus tools plus a loop that checks results**.

---

## 2. The chatbot trap

If you have used ChatGPT, Claude.ai, or a copilot in the editor, you already know the chatbot pattern:

1. You type.
2. It replies with text.
3. You copy the text somewhere else.
4. You run the tests.
5. You paste the error back.
6. Repeat until you are tired.

That pattern can help you write a function. It falls apart when the job is “make this repository correct.”

The bottleneck is **you**. You are the hands. You are the file reader. You are the test runner. You are the person who notices the model forgot the edge case from message three.

A chatbot is an LLM with a chat UI.  
An **agent** is an LLM that is allowed to **use tools**, see the results, and continue **without you pasting every step**.

> **In one sentence:** a chatbot talks; an agent works a turn, looks at what happened, and works the next turn.

Claude Code is built for the second thing.

---

## 3. What an agent is

An **agent**, in this course, is:

**a language model in a loop that can call tools, read the tool results, and decide the next action until the task is done or a human stops it.**

Unpack that.

- **Language model** — still just predicting tokens. The “brain” did not change species.
- **In a loop** — one model call is not the product. The product is a sequence of calls.
- **Tools** — functions the harness exposes: read a file, edit a file, run a command, fetch a URL, call Jira, spawn a subagent.
- **Read the results** — the tool output is appended to the conversation. The next prediction is conditioned on reality (or on an error), not only on hope.
- **Until done** — “done” is whatever the prompt, the tests, the spec, or you define. Agents are famous for stopping too early if you do not give them a check.

This is the same idea whether the product is called Claude Code, a research agent, or an internal bot. The quality difference is almost always:

1. which tools exist
2. how much context they receive
3. whether verification is automatic
4. whether dangerous tools are gated

### A picture of the loop

```
You: "Fix the failing ticket tests."

        ┌──────────────────────────────────────────┐
        │  1. GATHER CONTEXT                       │
        │     read files, search, open the spec,   │
        │     run the tests once to see the error  │
        └──────────────────┬───────────────────────┘
                           ▼
        ┌──────────────────────────────────────────┐
        │  2. TAKE ACTION                          │
        │     edit code, write a test, call MCP    │
        └──────────────────┬───────────────────────┘
                           ▼
        ┌──────────────────────────────────────────┐
        │  3. VERIFY                               │
        │     pytest, ruff, types, a screenshot    │
        └──────────────────┬───────────────────────┘
                           ▼
              failed? ──── loop again
              passed? ──── stop and report
              stuck?  ──── ask you
```

Claude Code’s own docs describe the same three phases: gather, act, verify. They blend. A “read file” is already an action. A test run is both action and verification. The point of the picture is not philosophy. The point is **you should design work so the loop can close without you**.

If there is no check the agent can run, **you** become the check. That is slow, and you will miss things.

### You are in the loop too

An agent is not a vending machine. You can:

- interrupt (`Esc`) and redirect
- queue a correction while it is still working
- switch to plan mode so it cannot edit yet
- rewind files to an earlier checkpoint
- reject a tool call

Treat it like a strong intern with fast hands and no fear: give a clear task, give a way to verify, watch the first stretch, then give it more rope.

---

## 4. Tools are what make it agentic

Without tools, Claude can only emit text. With tools, text becomes **requests** the Claude Code app executes.

Built-in tools cluster into a few jobs:

| Job | Examples | Why it matters |
| --- | --- | --- |
| Files | Read, write, edit | The repo is the product |
| Search | Glob, grep, codebase search | It can find things you did not name |
| Shell | tests, git, linters, servers | It can close the loop |
| Web | fetch docs, search errors | It can look up what is not in the repo |
| Orchestration | subagents, questions to you | It can split work and ask |

Later you add **MCP tools** (Jira, Slack, databases). Those are still just tools. Claude sees a name, a description, and a schema. It does not magically “understand Jira.” It calls `create_issue` because the description said that is how you create an issue.

Lecture 3 is the MCP lecture. Remember from today: **the model only acts through tools the harness offered**. If a tool is missing, Claude will guess, invent, or ask you to paste. If a tool is present, Claude will try it when the prompt looks like a match.

### A concrete loop

You say: “Write tests for ticket comments, run them, fix failures.”

A typical Claude Code trace looks like this:

1. **Grep / glob** — find `comments` in `app/` and `tests/`.
2. **Read** `app/main.py`, `app/store.py`, `tests/test_tickets.py`.
3. **Edit** the test file.
4. **Bash** `pytest`.
5. Read the failure.
6. **Edit** the app or the test.
7. **Bash** `pytest` again.
8. Stop when green, and tell you what changed.

That is not a chat. That is an agent. Your job is to make sure step 4–7 are part of the assignment, not an afterthought you run tomorrow.

---

## 5. What Claude Code actually is

Claude Code is **an agentic harness around Claude**.

Three pieces:

1. **The model** — reasons, writes, chooses tools.
2. **The tools** — file, shell, search, web, MCP, subagents.
3. **The product around them** — permissions, `CLAUDE.md`, skills, hooks, compaction, checkpoints, the terminal/IDE UI.

The harness is why two people with the same model get different results. One person has a 12-line `CLAUDE.md`, a test command, and a linter hook. The other pastes stack traces into a web chat. Same model family. Different system.

### Where it runs

The loop is the same. The **place the code executes** changes:

| Surface | Code runs | Use it when |
| --- | --- | --- |
| Terminal CLI | Your machine | Default for this course |
| VS Code / Cursor / JetBrains | Your machine, nicer diffs | You want inline review |
| Desktop app | Your machine | Parallel sessions, visual diffs |
| claude.ai/code (web) | Cloud VM | You do not have the repo locally |
| Remote Control | Your machine, UI in a browser | You left the desk |

Class default: **CLI in the project folder**. If your school standardizes on the VS Code extension, the commands (`/context`, `/mcp`, Plan mode) still apply.

### What a session is

Each conversation is a **session**:

- It has its own context window.
- It is saved locally so you can resume or rewind.
- A new session does **not** inherit the last chat, unless you continue/resume it.
- Persistent knowledge has to live in files: `CLAUDE.md`, rules, skills, docs, tickets.

This is why “Claude forgot our coding style” is usually “you started a new session and never wrote the style down.”

---

## 6. General capabilities — what you can ask for

Use this as a menu, not as a promise that every item is free.

### Explore a codebase

Good first prompt in a new repo:

```text
Explore this repository. Explain:
- what the product is
- how to run it
- how to test it
- where a new endpoint would go
Do not change files yet.
```

Claude will search and read. In plan mode it will not edit. This is the right first move in Practice 1.

### Build a feature

Good when the spec is clear:

```text
Add PATCH semantics as described in @docs/specs/SPEC-001-ticket-assignee.md.
Write tests from the acceptance criteria.
Run pytest and ruff. Fix until green.
```

Bad when the spec is “make tickets better.”

### Fix a bug

Give the symptom, a location if you have one, and the definition of fixed:

```text
GET /tickets/9999 should return 404.
Right now the test test_missing_ticket_is_404 fails with this output:
[paste]
Find the cause, add a regression test if needed, fix it, rerun tests.
```

### Refactor

Point at a pattern that already exists. Agents love inventing a new abstraction. Make them copy yours.

```text
Move ticket status changes into the store.
Follow the same style as create() and add_comment().
No new dependencies. Tests must stay green.
```

### Tests, linters, types

This is the inner loop of the course:

**write or change code → run tests → run linters → read failures → fix → repeat.**

You will practice it until it is boring. Boring is the goal.

### Git

Claude can branch, commit, and open pull requests if `git` and `gh` work on your machine. You still decide whether the message and the diff are honest.

### Docs

Claude is good at updating architecture notes **after** the code is real. It is also good at writing a spec **before** the code, if you hold it to the spec format in Lecture 5.

### External systems (MCP)

Once connected, you can say:

```text
Read Jira CAMP-42. Summarize acceptance criteria.
Do not change the issue.
```

or

```text
Create a story in CAMP titled "Add ticket assignee"
with the scope from @docs/specs/SPEC-001-ticket-assignee.md
```

Without MCP, you paste. With MCP, the ticket is a tool result, which is better — and also a new way to make a mess if you give it permission to transition issues in production.

### Parallel work

Claude can spawn **subagents** that explore in their own context and return a summary. That is a context technique (Lecture 4) and a speed technique. In class, use it when you would otherwise dump a whole directory into the main chat.

---

## 7. What it is not good at (yet you will still try)

Honesty saves hours.

**Vague product taste.** “Make the API nicer” produces a random nicer. Write the nicer down.

**Secrets and production.** Do not put production credentials in chat. Do not point an unsupervised agent at production Jira with permission to delete. Tools do what they are asked.

**Fresh private facts.** If it is not in the repo, the ticket, the MCP server, or the web, the model will fill the gap with a plausible sentence.

**Huge unrelated sessions.** After enough files and stack traces, quality drops. That is context, not “the model got lazy.” Lecture 4.

**Policy you only wrote in English.** “Never edit `.env`” in `CLAUDE.md` is a request. A hook that blocks the edit is enforcement. Lecture 2.

**Your job as the engineer.** Architecture tradeoffs, user harm, “should we build this,” and merging to `main` stay human. The agent accelerates the middle.

---

## 8. Safety you will actually use

Two mechanisms matter on day one.

### Permissions

Claude Code asks before many actions, depending on **permission mode**. Cycle modes with `Shift+Tab` (on some Windows terminals, `Alt+M`).

| Mode | Feel |
| --- | --- |
| Manual | Safe, chatty. You approve edits and commands. |
| Accept edits | Faster coding. Shell still gated. |
| Plan | Research and a written plan. No source edits. |
| Auto | A classifier allows most actions, blocks scary ones. |
| Bypass | Almost no prompts. Dangerous. Isolated environments only. |

Class recommendation for the first two practices: **Manual or Accept edits**, and **Plan** when the task is a feature. Do not start with Bypass because a slide looked cool.

You can also allowlist trusted commands (`pytest`, `ruff check .`) so you are not clicking Yes on the same test runner fifty times. That is `/permissions` and `.claude/settings.json`, covered in Lecture 2–3.

### Checkpoints

Before file edits, Claude Code snapshots the files. Double `Esc` can rewind conversation and files. This is not git. Remote side effects (Jira transitions, `git push`, dropped tables) do not rewind. **Git is still the real undo for commits. Hooks and permissions are the real undo for tools that leave the laptop.**

---

## 9. How to talk to it so the loop works

You do not need perfect prompts. You need **specific** ones.

### Name the artifact

Bad: “fix tickets.”  
Better: “In `app/store.py`, updating a missing id should return `None` so the route can 404.”

### Point at files

Use `@app/store.py` instead of “the store file, you know the one.”

### Define done

Bad: “add comments.”  
Better: “POST `/tickets/{id}/comments` returns 201 and the comment appears on GET. Tests in `tests/test_tickets.py`. `pytest` and `ruff` green.”

### Separate explore from edit

For anything that touches more than one file:

1. Plan mode, or an explicit “do not edit yet.”
2. Read the plan.
3. Then implement.

Jumping straight to edits is fine for a one-line rename.

### Ask for evidence

```text
When you finish, show the commands you ran and the last lines of output.
Do not say the tests pass unless you ran them in this session.
```

If you do not ask, some sessions will end with a confident paragraph and an unrun test suite.

### Redirect instead of restarting

When it goes the wrong way, do not `/clear` immediately. Say what was wrong. The loop can turn. Restart when the conversation is about a different job, or when the context is junk (Lecture 4).

---

## 10. A first session you can picture

You `cd` into CampusDesk and run `claude`.

Nothing has been configured yet. There is no `CLAUDE.md`. Claude still has tools: it can read the folder you launched in.

You type:

```text
You are in CampusDesk. Do not change any files.
1. What does this app do?
2. How do I run it and test it?
3. Where would I add a new field on a ticket?
```

What should happen:

- It lists files.
- It reads `README.md`, `app/main.py`, `docs/product.md`.
- It answers with paths and commands, not vibes.

If it starts rewriting the README, you stop it and remind it: no edits. That reminder belongs in the prompt from the start. Models like to be helpful by changing things.

Then you try a tiny edit with verification:

```text
Add a `service` field to the health payload, already there is one.
Wait — do not add features. Instead run pytest and tell me if the suite is green.
```

You are training yourself: **read first, change second, measure always.**

---

## 11. Mental model for the rest of the course

Carry these five claims. Later lectures attach machinery to each.

1. **The model predicts tokens.** Quality comes from context + tools + checks, not from pleading.
2. **The agent is the loop.** If the loop cannot verify, you are still the intern’s manager for every minute.
3. **Session memory is short.** Files are long. Put standing instructions in files.
4. **Tools are the hands.** MCP, shell, and editors are how the loop touches Jira and git. Descriptions are how the model chooses them.
5. **Context is a budget.** Every file, every MCP schema, every `CLAUDE.md` import spends it. Spend it on purpose.

Lecture 2: how Claude reads `CLAUDE.md`, rules, skills, hooks, and linked docs — and how you should set up a project.  
Lecture 3: MCP, modes, commands.  
Lecture 4: the context window.  
Lecture 5: spec-driven development, which is how you stop the agent from building a plausible product that nobody asked for.

---

## Recap

- An LLM predicts the next token. That is enough to write code, and not enough to be trusted blindly.
- A chatbot only returns text. An agent calls tools, sees results, and continues.
- Claude Code is Claude plus tools plus a harness (permissions, memory files, compaction).
- The useful loop is gather → act → verify. Put tests and linters in the verify step.
- Start sessions with exploration and a definition of done. Ask for command output.
- You still own secrets, production, merge, and whether the spec was right.

---

## Check your understanding

Write answers in your notes. One short paragraph each is enough.

1. A teammate says “the model understands our microservices.” What is a more accurate sentence?
2. Why does “write the function” in a web chat take more human time than the same request in Claude Code?
3. Draw the agentic loop and mark where `pytest` belongs.
4. Name two things Claude Code can do that a pure chatbot cannot.
5. You tell Claude “never delete the database.” Is that enough? What would be stronger?
6. Why might a brand-new session not follow a coding style you explained yesterday?

---

## Preview of Lecture 2

We will look at the files Claude loads on purpose:

- `CLAUDE.md` and `CLAUDE.local.md`
- `@` linked documents
- `.claude/rules/`
- skills (`SKILL.md`)
- hooks
- settings versus prose

You will learn a setup order that does not dump the entire wiki into every session.

---

## Practice after this lecture

- **Practice 1** — install, first exploration, no reckless edits.
- **Practice 2** — first project setup: `CLAUDE.md`, gitignore for local files, `/init` and `/context`.

Bring a laptop with Python 3.11+ and permission to install Claude Code.
