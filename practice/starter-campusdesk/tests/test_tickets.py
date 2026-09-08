from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_lists_seed_ticket() -> None:
    response = client.get("/tickets")
    assert response.status_code == 200
    tickets = response.json()
    assert len(tickets) >= 1
    assert tickets[0]["title"].startswith("Wi-Fi")


def test_create_and_fetch_ticket() -> None:
    created = client.post(
        "/tickets",
        json={
            "title": "Projector in Hall B is blank",
            "description": "HDMI input shows no signal after 10 minutes.",
            "requester": "lee@campus.edu",
            "priority": "medium",
        },
    )
    assert created.status_code == 201
    ticket_id = created.json()["id"]

    fetched = client.get(f"/tickets/{ticket_id}")
    assert fetched.status_code == 200
    assert fetched.json()["status"] == "open"


def test_update_status_and_comment() -> None:
    created = client.post(
        "/tickets",
        json={
            "title": "Cannot print from lab 4",
            "description": "Queue is stuck on the west printer.",
            "requester": "sam@campus.edu",
        },
    )
    ticket_id = created.json()["id"]

    updated = client.patch(f"/tickets/{ticket_id}", json={"status": "in_progress"})
    assert updated.json()["status"] == "in_progress"

    comment = client.post(
        f"/tickets/{ticket_id}/comments",
        json={"author": "it-oncall", "body": "Restarted the spooler."},
    )
    assert comment.status_code == 201

    fetched = client.get(f"/tickets/{ticket_id}")
    assert len(fetched.json()["comments"]) == 1


def test_missing_ticket_is_404() -> None:
    response = client.get("/tickets/9999")
    assert response.status_code == 404
