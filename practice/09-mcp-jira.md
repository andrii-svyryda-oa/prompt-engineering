# Practice 9 — MCP tools and Jira stories

**Language:** English · [Українською](uk/09-mcp-jira.md)

**Time:** 60–90 minutes  
**When:** After Lectures 3 and 5  
**Depends on:** CampusDesk Claude setup from earlier practices

## Goal

Connect **Atlassian MCP** (or the mock path), **read** a story, **create** a story, and write a skill so Claude does not freelance on workflow (status, assignees, production projects).

If your classroom has no Jira Cloud: do **Part B (mock)** fully. Part A is required when instructors issued access.

---

## Part A — Live Atlassian MCP (when available)

Official URLs change. Prefer current Atlassian + Claude Code docs. A typical Claude Code install is:

```bash
claude mcp add --transport http atlassian https://mcp.atlassian.com/v2/mcp
```

Then in a session:

```text
/mcp
```

Authenticate. Confirm tools appear.

Use a **class project key** (example `CAMP`), never a production board.

### A1. Read

```text
List recent issues in project CAMP (or the key we were given).
Pick one. Summarize title, status, acceptance criteria.
Do not change any issue.
If criteria are missing, say so explicitly.
```

**Pass:** A real issue key and an honest “criteria missing” if they are.

### A2. Create from a spec file

```text
Create a Story in the class project.
Title: SPEC-001 Ticket assignee (course)
Description: Canonical spec path docs/specs/SPEC-001-ticket-assignee.md
plus a 5-line summary. Do not paste the entire spec.
Do not assign. Do not transition. Return the key.
```

**Pass:** Key returned. You open Jira in a browser and confirm the issue exists.

### A3. Permission caution

```text
Would commenting on that issue be a write? Ask me before any write.
```

Then, **only if the instructor allows comments**:

```text
Add a comment: "Course Practice 9 — agent connected. No status change."
```

### A4. Skill

`.claude/skills/jira-story/SKILL.md`:

- Default: read-only unless the user says create/comment
- Always include spec path in description when a spec exists
- Never transition status
- Never delete
- Prefer git spec as canonical

### A5. `/context`

Note MCP’s slice of the pie after a `get_issue` that returned a lot of fields. If it is huge, add to the skill: “summarize; do not echo custom fields.”

---

## Part B — Mock MCP (always available)

Even if Part A worked, do B so you can work offline.

1. Create `docs/jira-mock/CAMP-101.md` as if it were issue JSON flattened to markdown:

```markdown
# CAMP-101
Type: Story
Status: To Do
Title: Ticket tags
Description: See Open questions — not ready.

## Acceptance
(none)
```

2. Create `docs/jira-mock/CAMP-102.md` with a **complete** mini-spec for something already built (e.g. status query from Practice 5) so “read ticket” has meat.

3. Prompt:

```text
Treat docs/jira-mock/*.md as Jira. There is no live MCP.
Read CAMP-102. Restate acceptance criteria. Do not edit the mock.
```

4. Prompt:

```text
Create a new mock issue CAMP-103 from @docs/specs/SPEC-001-ticket-assignee.md
as a short ticket that points at the spec path. Write the file only.
```

**Pass:** CAMP-103 exists and does not duplicate the whole spec.

---

## Deliverable

- Part A: issue key + `/mcp` screenshot **or** written blocker (no access)
- Part B: mock files including CAMP-103
- `jira-story` skill
- One paragraph: how Claude **sees** MCP tools (name, description, schema, result) applied to what you observed

## Security

No production tokens in git. No `.mcp.json` with Authorization headers committed. User-scope MCP or env vars only.
