from sqlalchemy.orm import Session

from app.models import Product
from app.repositories.product_repository import ProductRepository


class GetProductWorkflow:
    def __init__(self, session: Session) -> None:
        self._products = ProductRepository(session)

    def execute(self, product_id: int) -> Product | None:
        return self._products.get_by_id(product_id)
