from sqlalchemy.orm import Session

from app.models import Order
from app.repositories.order_repository import OrderRepository


class GetOrderWorkflow:
    def __init__(self, session: Session) -> None:
        self._orders = OrderRepository(session)

    def execute(self, order_id: int) -> Order | None:
        return self._orders.get_by_id(order_id)
