from decimal import Decimal

from sqlalchemy.orm import Session

from app.models import Order, OrderItem, Product


class OrderRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def get_by_id(self, order_id: int) -> Order | None:
        return self._session.get(Order, order_id)

    def create_pending(self, customer_name: str, customer_email: str) -> Order:
        order = Order(
            customer_name=customer_name,
            customer_email=customer_email,
            total=Decimal("0.00"),
        )
        self._session.add(order)
        self._session.flush()
        return order

    def add_line_item(
        self,
        order: Order,
        product: Product,
        quantity: int,
    ) -> OrderItem:
        item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            unit_price=product.price,
            quantity=quantity,
        )
        self._session.add(item)
        return item

    def set_total(self, order: Order, total: Decimal) -> None:
        order.total = total

    def commit(self) -> None:
        self._session.commit()

    def rollback(self) -> None:
        self._session.rollback()

    def refresh(self, order: Order) -> None:
        self._session.refresh(order)
