from datetime import UTC, datetime

from app.models import Comment, CommentCreate, Ticket, TicketCreate, TicketUpdate


class TicketStore:
    def __init__(self) -> None:
        self._tickets: dict[int, Ticket] = {}
        self._next_ticket_id = 1
        self._next_comment_id = 1
        self._seed()

    def _seed(self) -> None:
        demo = self.create(
            TicketCreate(
                title="Wi-Fi drops in the library",
                description="Students lose connection on floor 2 every afternoon.",
                requester="maya@campus.edu",
                priority="high",
            )
        )
        self.add_comment(
            demo.id,
            CommentCreate(author="it-oncall", body="Checking access points near the west stacks."),
        )

    def list_tickets(self) -> list[Ticket]:
        return sorted(self._tickets.values(), key=lambda ticket: ticket.id)

    def get_ticket(self, ticket_id: int) -> Ticket | None:
        return self._tickets.get(ticket_id)

    def create(self, payload: TicketCreate) -> Ticket:
        ticket = Ticket(
            id=self._next_ticket_id,
            title=payload.title,
            description=payload.description,
            requester=payload.requester,
            priority=payload.priority,
            created_at=datetime.now(UTC),
        )
        self._tickets[ticket.id] = ticket
        self._next_ticket_id += 1
        return ticket

    def update(self, ticket_id: int, payload: TicketUpdate) -> Ticket | None:
        ticket = self._tickets.get(ticket_id)
        if ticket is None:
            return None
        data = ticket.model_dump()
        patch = payload.model_dump(exclude_unset=True)
        data.update(patch)
        updated = Ticket.model_validate(data)
        self._tickets[ticket_id] = updated
        return updated

    def add_comment(self, ticket_id: int, payload: CommentCreate) -> Comment | None:
        ticket = self._tickets.get(ticket_id)
        if ticket is None:
            return None
        comment = Comment(
            id=self._next_comment_id,
            ticket_id=ticket_id,
            author=payload.author,
            body=payload.body,
            created_at=datetime.now(UTC),
        )
        self._next_comment_id += 1
        updated = ticket.model_copy(update={"comments": [*ticket.comments, comment]})
        self._tickets[ticket_id] = updated
        return comment
