# How to run a teaching day

Student-facing files are in `lectures/`, `presentations/`, and `practice/`. This page is for the instructor.

## Default rhythm

| Block | Minutes | Material |
| --- | --- | --- |
| Lecture | 70–90 | HTML deck; students have the markdown open |
| Break | 10 | |
| Practice | 60–90 | Brief in `practice/` |

Five teaching days: L1+P1–2, L2+P3–4, L3+P5, L4+P6–8 (P6–7 can spill), L5+P9–10. Bonus after the course.

## Live demos that are worth it

- L1: Plan mode explore of CampusDesk, then `!pytest -q`
- L2: `/init` then **delete half of it**; `/context`
- L3: `/mcp` even if auth fails — show the panel
- L4: `/context` pie after a verbose pytest vs `pytest -q`
- L5: refuse an extra feature Claude proposes in a plan

## If Jira is unavailable

Practice 9 Part B is the full credit path. Do not skip the “how Claude sees tools” paragraph; use the mock as the stand-in for tool results.

## If Claude Code cannot be installed

Students can still read lectures and write specs/docs by hand. Practices 1–5 need the CLI; mark them incomplete rather than simulating with a generic chatbot (that would teach the wrong loop).

## Assessment (suggested)

| Piece | Weight |
| --- | --- |
| CLAUDE.md + rules + skill (P2–3) | 15% |
| Hook / verification (P4) | 10% |
| Practice 5 feature | 15% |
| SPEC-001 quality (P6) | 15% |
| Implementation + tests (P7) | 20% |
| Practice 10 report | 25% |
| Bonus | extra credit |

Fail a practice that adds unspecified product scope or commits secrets.

## Product drift

Claude Code changes quickly. Before a cohort, skim:

https://code.claude.com/docs/en/overview

Update Atlassian MCP URLs from Atlassian’s current “Rovo MCP” page. Teach `/mcp` as the source of truth.
