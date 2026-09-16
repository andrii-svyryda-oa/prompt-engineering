from decimal import Decimal

from sqlalchemy import select

from app.database import SessionLocal
from app.models import Product

SEED_PRODUCTS = [
    {
        "name": "Notebook",
        "description": "A5 ruled notebook, 80 pages.",
        "price": Decimal("4.99"),
        "stock": 50,
    },
    {
        "name": "Pen Set",
        "description": "Set of three gel pens in assorted colors.",
        "price": Decimal("12.50"),
        "stock": 30,
    },
    {
        "name": "Desk Lamp",
        "description": "Adjustable LED desk lamp with warm light.",
        "price": Decimal("29.00"),
        "stock": 15,
    },
]


def seed_products() -> None:
    db = SessionLocal()
    try:
        existing = db.scalar(select(Product.id).limit(1))
        if existing is not None:
            print("Products already seeded; skipping.")
            return

        for product_data in SEED_PRODUCTS:
            db.add(Product(**product_data))
        db.commit()
        print(f"Seeded {len(SEED_PRODUCTS)} products.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_products()
