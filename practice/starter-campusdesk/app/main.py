from fastapi import FastAPI, HTTPException

from app.models import Comment, CommentCreate, Ticket, TicketCreate, TicketUpdate
from app.store import TicketStore

app = FastAPI(
    title="CampusDesk",
    description="Campus IT helpdesk used in the Claude Code course.",
    version="0.1.0",
)
store = TicketStore()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "campusdesk"}


@app.get("/tickets", response_model=list[Ticket])
def list_tickets() -> list[Ticket]:
    return store.list_tickets()


@app.post("/tickets", response_model=Ticket, status_code=201)
def create_ticket(payload: TicketCreate) -> Ticket:
    return store.create(payload)


@app.get("/tickets/{ticket_id}", response_model=Ticket)
def get_ticket(ticket_id: int) -> Ticket:
    ticket = store.get_ticket(ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@app.patch("/tickets/{ticket_id}", response_model=Ticket)
def update_ticket(ticket_id: int, payload: TicketUpdate) -> Ticket:
    ticket = store.update(ticket_id, payload)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@app.post("/tickets/{ticket_id}/comments", response_model=Comment, status_code=201)
def add_comment(ticket_id: int, payload: CommentCreate) -> Comment:
    comment = store.add_comment(ticket_id, payload)
    if comment is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return comment
