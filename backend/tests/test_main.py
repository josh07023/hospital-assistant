import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.tools import evaluate_guardrail, book_appointment

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_get_faqs():
    response = client.get("/api/faqs")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_guardrail_emergency():
    res = evaluate_guardrail("I have severe chest pain and can't breathe")
    assert res["is_emergency"] is True

def test_book_appointment_valid():
    res = book_appointment("Jane Doe", "Cardiology", "Dr. Smith", "2026-10-20", "10:30 AM", "jane@example.com")
    assert res["status"] == "success"