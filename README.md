# Claude Code Course

A five-lecture course that teaches students how to use **Claude Code** as a coding agent: what it is, how to set it up for a real project, how it reads project knowledge, how MCP tools work, how to manage context, and how to do spec-driven development.

Students also complete **10 practice lessons** plus **2 bonus tasks**.

This is the student pack: lecture notes, HTML slide decks, practice briefs, a starter app, and a one-page cheatsheet.

Lecture notes, slide decks, and practice briefs are mirrored in **Ukrainian** (`lectures/uk/`, `presentations/uk/`, `practice/uk/`). English is the source. Open the matching `uk/` file or follow the language link at the top of each handout.

## Who this is for

Engineers who already write code and want to use Claude Code as a teammate, not as a autocomplete box.

You do **not** need a machine-learning background. You do need:

- a computer you can install software on
- a Claude account that can run Claude Code
- Git
- Python 3.11+ for the practice app
- optional access to a Jira Cloud site for the MCP lesson

## What you will be able to do

After the course, a student should be able to:

1. Explain, in plain language, what an LLM is and what an **agent in a loop** is.
2. Set up Claude Code for a project so the rest of the team gets the same behavior.
3. Choose the right place for knowledge: `CLAUDE.md`, rules, skills, hooks, linked docs, or MCP.
4. Use permission modes and the important slash commands without hunting through docs.
5. Watch context fill up, compact it on purpose, and keep long sessions from going fuzzy.
6. Run a **spec-driven** feature: ticket or spec → plan → code → tests → linters → fix → docs.
7. Read and create Jira work through MCP, instead of copy-pasting tickets into chat.

## Course map

| When | What | Student files |
| --- | --- | --- |
| Lecture 1 | LLMs, agents, capabilities | [`lectures/01-llms-agents-capabilities.md`](lectures/01-llms-agents-capabilities.md) · [`presentations/lecture-01.html`](presentations/lecture-01.html) |
| Practice 1–2 | First session + project setup | [`practice/01-first-session.md`](practice/01-first-session.md) · [`practice/02-project-setup.md`](practice/02-project-setup.md) |
| Lecture 2 | Rules, skills, hooks, `CLAUDE.md`, setup recommendations | [`lectures/02-project-memory-and-setup.md`](lectures/02-project-memory-and-setup.md) · [`presentations/lecture-02.html`](presentations/lecture-02.html) |
| Practice 3–4 | Rules/skills/docs + hooks/verification loop | [`practice/03-rules-skills-linked-docs.md`](practice/03-rules-skills-linked-docs.md) · [`practice/04-hooks-and-verification.md`](practice/04-hooks-and-verification.md) |
| Lecture 3 | MCP, how Claude sees tools, modes, commands | [`lectures/03-mcp-modes-commands.md`](lectures/03-mcp-modes-commands.md) · [`presentations/lecture-03.html`](presentations/lecture-03.html) |
| Practice 5 | Development loop | [`practice/05-development-loop.md`](practice/05-development-loop.md) |
| Lecture 4 | Model context and how to manage it | [`lectures/04-model-context.md`](lectures/04-model-context.md) · [`presentations/lecture-04.html`](presentations/lecture-04.html) |
| Practice 6–8 | Specs, implement from spec, documentation | [`practice/06-write-a-spec.md`](practice/06-write-a-spec.md) · [`practice/07-implement-from-spec.md`](practice/07-implement-from-spec.md) · [`practice/08-project-documentation.md`](practice/08-project-documentation.md) |
| Lecture 5 | Spec-driven development | [`lectures/05-spec-driven-development.md`](lectures/05-spec-driven-development.md) · [`presentations/lecture-05.html`](presentations/lecture-05.html) |
| Practice 9–10 | Jira MCP + end-to-end story | [`practice/09-mcp-jira.md`](practice/09-mcp-jira.md) · [`practice/10-end-to-end-story.md`](practice/10-end-to-end-story.md) |
| Bonus | Chatbot / LLM flows, then an in-app agentic loop | [`practice/bonus-01-chatbot-and-llm-flows.md`](practice/bonus-01-chatbot-and-llm-flows.md) · [`practice/bonus-02-agentic-ops-loop.md`](practice/bonus-02-agentic-ops-loop.md) |

Suggested pacing: **one lecture + two practices per teaching day**, with Lecture 5 and Practices 9–10 on the last day. Bonus work is optional after that.

## How to use the materials

### Lecture notes

The markdown files in `lectures/` are the **student handouts** (Ukrainian: `lectures/uk/`). They are long on purpose. They are written to be read, not skimmed like slides.

Read a lecture **before class** if you can. During class, follow the HTML deck. After class, use the lecture notes as the source of truth.

Each lecture ends with:

- a recap
- “check your understanding” questions
- a preview of the next lecture
- the practice that should follow

### Presentations

Open [`presentations/index.html`](presentations/index.html) in a browser (Ukrainian decks: [`presentations/uk/index.html`](presentations/uk/index.html)).

| Key | Action |
| --- | --- |
| `→` `Space` `Enter` | Next slide |
| `←` `Backspace` | Previous slide |
| `Esc` | Slide overview |
| `d` | Dark background for a dim room |
| Click right / left | Next / previous |

The decks are HTML, so they work without PowerPoint. Print to PDF from the browser if you need a backup.

### Practice lessons

Work in the starter app at [`practice/starter-campusdesk/`](practice/starter-campusdesk/). It is a small FastAPI helpdesk named **CampusDesk**. Later lessons add tickets, comments, specs, docs, Jira, and (in the bonus) an in-app agent.

Do not skip the verification loop in Practice 4–5. That loop is the difference between “Claude wrote code” and “the feature is done.”

### Cheatsheet

Keep [`resources/cheatsheet.md`](resources/cheatsheet.md) open during practices.

## Practice app

CampusDesk is a tiny campus IT helpdesk:

- list / create / update tickets
- add comments
- health check
- pytest + ruff already wired

```bash
cd practice/starter-campusdesk
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -e ".[dev]"
uvicorn app.main:app --reload
```

API docs: <http://127.0.0.1:8000/docs>

Tests:

```bash
pytest
ruff check .
```

## Official docs

This course teaches current Claude Code behavior. Product details move. When something in class disagrees with the product, trust the live docs:

- [Claude Code overview](https://code.claude.com/docs/en/overview)
- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)
- [Memory: CLAUDE.md, rules, auto memory](https://code.claude.com/docs/en/memory)
- [Skills](https://code.claude.com/docs/en/skills)
- [Hooks](https://code.claude.com/docs/en/hooks)
- [MCP](https://code.claude.com/docs/en/mcp)
- [Context window](https://code.claude.com/docs/en/context-window)
- [Best practices](https://code.claude.com/docs/en/best-practices)
- [CLI reference](https://code.claude.com/docs/en/cli-reference)

## Teaching notes

- Lecture 1 is conceptual. Do not install during the lecture unless you have extra time. Practice 1 is the install lab.
- Lecture 2 is the most important setup lecture. Students should leave with a `CLAUDE.md` they would actually commit.
- Lecture 3 needs a live `/mcp` demo if Jira access exists. If it does not, use the mock MCP workflow in Practice 9.
- Lecture 4 should include a live `/context` screenshot or terminal. Students remember the pie chart more than the prose.
- Lecture 5 should walk a ticket from spec to green tests without skipping the plan.

## License for class use

Use and adapt these materials for teaching. Do not treat the lecture notes as a substitute for Anthropic’s documentation, and do not paste secrets, API keys, or production Jira data into examples.
