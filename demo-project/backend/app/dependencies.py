from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.workflows.create_order import CreateOrderWorkflow
from app.workflows.get_order import GetOrderWorkflow
from app.workflows.get_product import GetProductWorkflow
from app.workflows.list_products import ListProductsWorkflow


def get_list_products_workflow(
    db: Session = Depends(get_db),
) -> ListProductsWorkflow:
    return ListProductsWorkflow(db)


def get_get_product_workflow(
    db: Session = Depends(get_db),
) -> GetProductWorkflow:
    return GetProductWorkflow(db)


def get_create_order_workflow(
    db: Session = Depends(get_db),
) -> CreateOrderWorkflow:
    return CreateOrderWorkflow(db)


def get_get_order_workflow(
    db: Session = Depends(get_db),
) -> GetOrderWorkflow:
    return GetOrderWorkflow(db)
