# Practice 10 — End-to-end: story → spec → loop → evidence

**Language:** English · [Українською](uk/10-end-to-end-story.md)

**Time:** 90–120 minutes  
**When:** Last core practice  
**Depends on:** Practices 5–9

## Goal

Run the **whole course** on one new slice of CampusDesk, as if you were on a team with Jira and a repo.

Pick **one** feature from the list. Do not do two.

| ID | Feature | Notes |
| --- | --- | --- |
| A | Ticket tags | `tags: list[str]`, max 8, lowercase, PATCH replace-all |
| B | Resolved_at | Set when status becomes `resolved`, clear if reopened |
| C | List sort | `?sort=created_at|priority` with documented default |
| D | Instructor-assigned issue | Live Jira key from Practice 9 |

If you pick D, the Jira issue must have a real spec (or you write SPEC-00x first and comment the path).

## Out of scope for all options

Auth, database, UI framework, email, Slack, deleting tickets, pagination unless the spec is only pagination (it is not, above).

## Procedure (follow in order)

### 1. Queue

- **Live Jira:** create or use the story; description points at a spec path.
- **Mock:** add `docs/jira-mock/CAMP-2xx.md` the same way.

### 2. Spec in git

`docs/specs/SPEC-00x-….md` — approved, Open questions empty, acceptance testable.

Commit-quality. You are the approver.

### 3. New session, Plan mode

```text
/implement-spec @docs/specs/SPEC-00x-....md
Also read the Jira/mock ticket. If they disagree, stop and tell me.
```

Resolve disagreements by **changing the spec or the ticket**, not by averaging them in code.

### 4. Implement + verification loop

Accept edits. pytest -q, ruff, hooks/skills you already have. You rerun locally.

### 5. Docs

`/sync-docs` or equivalent. http-examples if the API changed.

### 6. Close the loop on the ticket

- Live: comment with spec path, test names, remaining risk. **Do not** move to Done unless the instructor says the definition of Done includes that.
- Mock: append a `## Implementation` section with the same.

### 7. Context note

`/context` screenshot or bullet list: what was expensive. One sentence on what you would do differently (subagent, quieter tests, fewer MCP dumps).

## Deliverable (portfolio)

A single markdown report `docs/practice-10-report.md` in the app:

- Feature chosen
- Ticket key / mock path
- Spec path
- Test names mapped to acceptance lines
- pytest/ruff output
- Jira comment text or mock implementation section
- Diff file list
- Context reflection (5–10 lines)

## Grading bar

This practice fails if any of these is true:

- No spec file
- Extra product behavior not in the spec
- Tests not traceable to acceptance
- Only the model claimed green
- Ticket and spec contradict each other in the final state
- Secrets committed

## Stretch

Open a pull request (or a patch file) whose description is the spec ID + test list. Ask Claude to write the PR body **from the spec**, then you delete any hype.
