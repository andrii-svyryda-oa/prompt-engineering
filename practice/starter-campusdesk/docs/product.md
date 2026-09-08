# CampusDesk product

CampusDesk is a campus IT helpdesk. Students and staff file tickets. On-call IT staff comment, change status, and close work.

This file is product intent, not a spec. Specs for new work live in `docs/specs/` after Practice 6.

## Users

- **Requester** — a student or staff member who reports a problem.
- **IT staff** — people who investigate and update tickets.
- **Lead** — wants summaries: open volume, aging high-priority tickets, what's resolved today.

## Current scope

- Create a ticket with title, description, requester, priority.
- List tickets.
- Get one ticket, including comments.
- Update title, description, status, priority.
- Add a comment.

There is no login yet. The API trusts the `requester` and `author` fields.

## Out of scope (for now)

- Authentication
- File attachments
- Email / Slack notifications
- A rich UI (OpenAPI is enough until a later lesson)
- Persistence across process restarts (in-memory store)

## Language

Talk about **tickets**, not issues or bugs, unless a Jira ticket is the source of work.
