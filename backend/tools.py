from database import get_faqs, get_diseases, add_appointment

def search_hospital_faq(query: str) -> dict:
    """Searches hospital FAQ database for visiting hours, departments, and services."""
    faqs = get_faqs()
    query_lower = query.lower()
    matches = [faq for faq in faqs if any(kw in faq["question"].lower() or kw in faq["answer"].lower() for kw in query_lower.split())]
    if not matches:
        return {"status": "success", "results": faqs[:3]}
    return {"status": "success", "results": matches}

def get_disease_info(condition: str) -> dict:
    """Provides clear, patient-friendly descriptions, symptoms, and preventive measures."""
    diseases = get_diseases()
    query_lower = condition.lower()
    for d in diseases:
        if query_lower in d["condition"].lower() or any(w in d["condition"].lower() for w in query_lower.split()):
            return {"status": "success", "data": d}
    return {"status": "not_found", "message": f"Condition '{condition}' not found in database."}

def book_appointment(patient_name: str, department: str, doctor_name: str, date: str, time: str, contact: str) -> dict:
    """Books an appointment across Cardiology, Neurology, Pediatrics, General Medicine, Orthopedics."""
    valid_departments = ["Cardiology", "Neurology", "Pediatrics", "General Medicine", "Orthopedics"]
    if department not in valid_departments:
        return {"status": "error", "message": f"Invalid department. Choose from: {', '.join(valid_departments)}"}
    
    record = {
        "patient_name": patient_name,
        "department": department,
        "doctor_name": doctor_name,
        "date": date,
        "time": time,
        "contact": contact,
        "status": "Confirmed"
    }
    saved = add_appointment(record)
    return {"status": "success", "message": f"Appointment booked with Dr. {doctor_name} ({department}) on {date}.", "appointment": saved}

def evaluate_guardrail(prompt: str) -> dict:
    """Detects medical emergencies or non-medical queries."""
    emergency_keywords = ["chest pain", "suicide", "bleeding heavily", "unconscious", "stroke", "severe trauma", "can't breathe", "heart attack"]
    prompt_lower = prompt.lower()
    for kw in emergency_keywords:
        if kw in prompt_lower:
            return {
                "is_emergency": True,
                "response": "🚨 EMERGENCY DETECTED: If you or someone else is experiencing a life-threatening medical emergency, please call emergency services immediately (911 / 112) or go to the nearest hospital Emergency Department."
            }
    return {"is_emergency": False}