from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import get_create_order_workflow, get_get_order_workflow
from app.exceptions.order import (
    DuplicateOrderLineError,
    EmptyOrderError,
    InsufficientStockError,
    OrderProductNotFoundError,
)
from app.schemas.order import CreateOrderRequest, OrderRead
from app.workflows.create_order import CreateOrderWorkflow
from app.workflows.get_order import GetOrderWorkflow

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def place_order(
    order_in: CreateOrderRequest,
    workflow: CreateOrderWorkflow = Depends(get_create_order_workflow),
) -> OrderRead:
    try:
        return workflow.execute(order_in)
    except InsufficientStockError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc
    except OrderProductNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except EmptyOrderError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item",
        ) from exc
    except DuplicateOrderLineError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Duplicate product lines are not allowed",
        ) from exc


@router.get("/{order_id}", response_model=OrderRead)
def get_order(
    order_id: int,
    workflow: GetOrderWorkflow = Depends(get_get_order_workflow),
) -> OrderRead:
    order = workflow.execute(order_id)
    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order {order_id} not found",
        )
    return order
