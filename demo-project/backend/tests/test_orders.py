def test_create_order(client):
    response = client.post(
        "/orders",
        json={
            "customer_name": "Ada Lovelace",
            "customer_email": "ada@example.com",
            "items": [{"product_id": 1, "quantity": 2}],
        },
    )
    assert response.status_code == 201
    order = response.json()
    assert order["id"] == 1
    assert order["customer_name"] == "Ada Lovelace"
    assert order["customer_email"] == "ada@example.com"
    assert order["total"] == "9.98"
    assert len(order["items"]) == 1
    assert order["items"][0]["product_name"] == "Notebook"
    assert order["items"][0]["unit_price"] == "4.99"
    assert order["items"][0]["quantity"] == 2

    product_response = client.get("/products/1")
    assert product_response.json()["stock"] == 48


def test_get_order(client):
    create_response = client.post(
        "/orders",
        json={
            "customer_name": "Ada Lovelace",
            "customer_email": "ada@example.com",
            "items": [{"product_id": 2, "quantity": 1}],
        },
    )
    order_id = create_response.json()["id"]

    response = client.get(f"/orders/{order_id}")
    assert response.status_code == 200
    order = response.json()
    assert order["total"] == "12.50"
    assert order["items"][0]["product_name"] == "Pen Set"


def test_create_order_insufficient_stock(client):
    response = client.post(
        "/orders",
        json={
            "customer_name": "Ada Lovelace",
            "customer_email": "ada@example.com",
            "items": [{"product_id": 3, "quantity": 100}],
        },
    )
    assert response.status_code == 409
    assert "Insufficient stock" in response.json()["detail"]

    product_response = client.get("/products/3")
    assert product_response.json()["stock"] == 15


def test_create_order_empty_items(client):
    response = client.post(
        "/orders",
        json={
            "customer_name": "Ada Lovelace",
            "customer_email": "ada@example.com",
            "items": [],
        },
    )
    assert response.status_code == 422


def test_create_order_product_not_found(client):
    response = client.post(
        "/orders",
        json={
            "customer_name": "Ada Lovelace",
            "customer_email": "ada@example.com",
            "items": [{"product_id": 999, "quantity": 1}],
        },
    )
    assert response.status_code == 404


def test_get_order_not_found(client):
    response = client.get("/orders/999")
    assert response.status_code == 404
