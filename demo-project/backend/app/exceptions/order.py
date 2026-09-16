class InsufficientStockError(Exception):
    def __init__(self, product_name: str, requested: int, available: int):
        self.product_name = product_name
        self.requested = requested
        self.available = available
        super().__init__(
            f"Insufficient stock for '{product_name}': requested {requested}, available {available}"
        )


class EmptyOrderError(Exception):
    pass


class DuplicateOrderLineError(Exception):
    pass


class OrderProductNotFoundError(Exception):
    def __init__(self, product_id: int):
        self.product_id = product_id
        super().__init__(f"Product {product_id} not found")
