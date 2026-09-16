from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_serializer


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)


class CreateOrderRequest(BaseModel):
    customer_name: str = Field(min_length=1, max_length=100)
    customer_email: EmailStr
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: int
    product_name: str
    unit_price: Decimal
    quantity: int

    @field_serializer("unit_price")
    def serialize_unit_price(self, value: Decimal) -> str:
        return f"{value:.2f}"


class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_name: str
    customer_email: str
    total: Decimal
    created_at: datetime
    items: list[OrderItemRead]

    @field_serializer("total")
    def serialize_total(self, value: Decimal) -> str:
        return f"{value:.2f}"
