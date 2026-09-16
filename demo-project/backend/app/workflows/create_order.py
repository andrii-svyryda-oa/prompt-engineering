from decimal import Decimal

from sqlalchemy.orm import Session

from app.exceptions.order import (
    DuplicateOrderLineError,
    EmptyOrderError,
    InsufficientStockError,
    OrderProductNotFoundError,
)
from app.models import Order, Product
from app.repositories.order_repository import OrderRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.order import CreateOrderRequest


class CreateOrderWorkflow:
    def __init__(self, session: Session) -> None:
        self._products = ProductRepository(session)
        self._orders = OrderRepository(session)

    def execute(self, order_in: CreateOrderRequest) -> Order:
        if not order_in.items:
            raise EmptyOrderError()

        product_ids = [item.product_id for item in order_in.items]
        if len(product_ids) != len(set(product_ids)):
            raise DuplicateOrderLineError()

        try:
            locked_products: dict[int, Product] = {}
            for product_id in product_ids:
                product = self._products.lock_by_id_for_update(product_id)
                if product is None:
                    raise OrderProductNotFoundError(product_id)
                locked_products[product_id] = product

            for line in order_in.items:
                product = locked_products[line.product_id]
                if line.quantity > product.stock:
                    raise InsufficientStockError(
                        product.name, line.quantity, product.stock
                    )

            order = self._orders.create_pending(
                order_in.customer_name, order_in.customer_email
            )

            total = Decimal("0.00")
            for line in order_in.items:
                product = locked_products[line.product_id]
                line_total = product.price * line.quantity
                total += line_total
                self._products.decrease_stock(product, line.quantity)
                self._orders.add_line_item(order, product, line.quantity)

            self._orders.set_total(order, total)
            self._orders.commit()
            self._orders.refresh(order)
            return order
        except Exception:
            self._orders.rollback()
            raise
