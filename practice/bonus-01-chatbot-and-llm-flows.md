# Bonus 1 — Chatbot or LLM flows inside CampusDesk

**Language:** English · [Українською](uk/bonus-01-chatbot-and-llm-flows.md)

**Time:** 3–5 hours (can split across two sittings)  
**When:** After Practice 10  
**Level:** Bonus. Core course is complete without this.

## Goal

Put a **small language-model feature in the product**, specified first, implemented with the same agent loop you already use.

Choose **one** track.

| Track | What you build | Why it exists |
| --- | --- | --- |
| **A. Helpdesk chatbot** | `POST /chat` — user asks a question about tickets / how CampusDesk works; the server calls an LLM and returns an answer | User-facing assistant |
| **B. LLM flow** | A **pipeline** of 2–3 prompts with structured output, no chat UI required — e.g. “summarize this ticket + comments → priority suggestion + one-line reply draft” | Backend workflow |

Both tracks must be **agent-safe**: no hidden writes, no unbounded tool use yet (that is Bonus 2).

## Non-negotiable spec sections

Write `docs/specs/SPEC-B1-llm-feature.md` before code.

Include:

1. **User / caller** — who hits the endpoint.
2. **Input / output JSON** — exact shapes.
3. **Model provider** — OpenAI-compatible HTTP, Anthropic, or a **fake provider** for tests (see below).
4. **What the model is allowed to say** — e.g. it may summarize tickets it was given; it may not invent ticket ids.
5. **Timeouts and failure** — 4xx vs 5xx, what if the provider is down.
6. **Secrets** — API key from env, never logged, never in git.
7. **Out of scope** — no RAG over the whole internet, no Jira writes, no agent loop with tools (Bonus 2).
8. **Tests** — at least:
   - provider error → defined status code
   - invalid body → 422
   - happy path with a **stubbed** LLM (do not call a real network in pytest)

## Fake provider (required for CI)

Do **not** make unit tests hit a paid API.

Pattern:

```text
app/llm.py          # client; reads CAMPUSDESK_LLM_BASE_URL + key
tests/conftest.py   # monkeypatch or httpx mock
```

pytest uses a dummy response. A manual script or README section may call a real model if the student has a key.

## Track A sketch (not a spec)

`POST /chat`

```json
{ "message": "How do I clear an assignee?", "ticket_id": null }
```

Server:

1. If `ticket_id` set, load that ticket (404 if missing).
2. Build a prompt: system (“you are CampusDesk help, use only provided ticket JSON and short product facts”) + user message.
3. Call LLM.
4. Return `{ "reply": "...", "used_ticket_id": 1 | null }`.

System prompt facts should come from a **short** string or `docs/product.md` excerpt you copy into code — not an unbounded file read of the whole repo.

## Track B sketch (not a spec)

`POST /tickets/{id}/suggest`

Pipeline:

1. Prompt 1: JSON `{ "summary": str, "priority": "low"|"medium"|"high" }`
2. Prompt 2: JSON `{ "reply_draft": str }` given the summary
3. Return both. If prompt 1 JSON fails to parse → 502 with an error code, no retry storm.

## Implementation rules (Claude Code)

- Plan mode until the spec is signed.
- `/implement-spec` against SPEC-B1.
- No extra endpoints.
- Update http-examples and architecture.
- `CLAUDE.md`: how to set env vars for local real calls; tests must not need them.

## Deliverable

- SPEC-B1
- Code + stubbed tests green
- README section “LLM feature” with env vars
- A recorded example (paste) of one **real** call **or** a written note that only stubs were used

## Stretch

Add a `dry_run: true` flag that returns the **prompt** that would have been sent, without calling the provider. Extremely useful for teaching and for debugging. Spec it first.
