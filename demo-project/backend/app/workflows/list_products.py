from sqlalchemy.orm import Session

from app.models import Product
from app.repositories.product_repository import ProductRepository


class ListProductsWorkflow:
    def __init__(self, session: Session) -> None:
        self._products = ProductRepository(session)

    def execute(self) -> list[Product]:
        return self._products.list_ordered_by_id()
