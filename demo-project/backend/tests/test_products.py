def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_products(client):
    response = client.get("/products")
    assert response.status_code == 200
    products = response.json()
    assert len(products) == 3
    names = {product["name"] for product in products}
    assert names == {"Notebook", "Pen Set", "Desk Lamp"}
    for product in products:
        assert "price" in product
        assert "stock" in product
        assert "." in product["price"]


def test_get_product(client):
    response = client.get("/products/1")
    assert response.status_code == 200
    product = response.json()
    assert product["name"] == "Notebook"
    assert product["price"] == "4.99"
    assert product["stock"] == 50


def test_get_product_not_found(client):
    response = client.get("/products/999")
    assert response.status_code == 404
