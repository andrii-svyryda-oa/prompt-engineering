from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import get_get_product_workflow, get_list_products_workflow
from app.schemas.product import ProductRead
from app.workflows.get_product import GetProductWorkflow
from app.workflows.list_products import ListProductsWorkflow

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductRead])
def list_products(
    workflow: ListProductsWorkflow = Depends(get_list_products_workflow),
) -> list[ProductRead]:
    return workflow.execute()


@router.get("/{product_id}", response_model=ProductRead)
def get_product(
    product_id: int,
    workflow: GetProductWorkflow = Depends(get_get_product_workflow),
) -> ProductRead:
    product = workflow.execute(product_id)
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id} not found",
        )
    return product
