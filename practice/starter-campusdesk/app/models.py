from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

TicketStatus = Literal["open", "in_progress", "resolved"]
TicketPriority = Literal["low", "medium", "high"]


class Comment(BaseModel):
    id: int
    ticket_id: int
    author: str
    body: str
    created_at: datetime


class Ticket(BaseModel):
    id: int
    title: str
    description: str
    requester: str
    status: TicketStatus = "open"
    priority: TicketPriority = "medium"
    created_at: datetime
    comments: list[Comment] = Field(default_factory=list)


class TicketCreate(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    description: str = Field(min_length=3, max_length=4000)
    requester: str = Field(min_length=2, max_length=80)
    priority: TicketPriority = "medium"


class TicketUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=120)
    description: str | None = Field(default=None, min_length=3, max_length=4000)
    status: TicketStatus | None = None
    priority: TicketPriority | None = None


class CommentCreate(BaseModel):
    author: str = Field(min_length=2, max_length=80)
    body: str = Field(min_length=1, max_length=2000)
