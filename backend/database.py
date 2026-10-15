import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

def load_json(filename):
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def save_json(filename, data):
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def get_faqs():
    return load_json("faqs.json")

def get_diseases():
    return load_json("diseases.json")

def get_appointments():
    return load_json("appointments.json")

def add_appointment(appointment: dict):
    appointments = get_appointments()
    appointment["id"] = len(appointments) + 1
    appointments.append(appointment)
    save_json("appointments.json", appointments)
    return appointment