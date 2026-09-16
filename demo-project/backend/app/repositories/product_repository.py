from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Product


class ProductRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def list_ordered_by_id(self) -> list[Product]:
        return list(
            self._session.scalars(select(Product).order_by(Product.id)).all()
        )

    def get_by_id(self, product_id: int) -> Product | None:
        return self._session.get(Product, product_id)

    def lock_by_id_for_update(self, product_id: int) -> Product | None:
        return self._session.scalar(
            select(Product).where(Product.id == product_id).with_for_update()
        )

    def decrease_stock(self, product: Product, quantity: int) -> None:
        product.stock -= quantity
