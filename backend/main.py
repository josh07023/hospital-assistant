from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="AuraCare AI Health Hub API")

class ChatRequest(BaseModel):
    message: str

# Expanded Factual Hospital FAQs Database
FAQS_DB = [
    {
        "id": 1,
        "question": "What are the general visiting hours and ICU visitation rules?",
        "answer": "General ward visiting hours are strictly daily from 10:00 AM to 8:00 PM (maximum 2 visitors per patient). ICU visiting hours are limited to 11:00 AM - 12:00 PM and 5:00 PM - 6:00 PM with required sterile gowning.",
        "department": "General & ICU",
        "citation": "AuraCare Policy Sec 4.2"
    },
    {
        "id": 2,
        "question": "Where is the emergency department and how does triage work?",
        "answer": "The Emergency Department is located on the Ground Floor, East Wing, accessible 24/7. Patients are triaged using the Emergency Severity Index (ESI) Level 1 (Immediate/Life-Threatening) to Level 5 (Non-Urgent).",
        "department": "Emergency",
        "citation": "Clinical Triage Protocol E-1"
    },
    {
        "id": 3,
        "question": "Which medical departments are available at the hospital?",
        "answer": "AuraCare houses Cardiology, Neurology, Orthopedics, Pediatrics, Oncology, General Surgery, Emergency Medicine, and Outpatient Internal Medicine clinics.",
        "department": "Administration",
        "citation": "Hospital Directory 2026"
    },
    {
        "id": 4,
        "question": "What are the common symptoms and prevention methods for Migraines?",
        "answer": "Migraines involve throbbing unilateral headache, nausea, and sensitivity to light/sound. Prevention includes identifying triggers, stress management, hydration, regular sleep cycles, and preventive medications like beta-blockers or CGRP inhibitors.",
        "department": "Neurology",
        "citation": "Neurology Clinical Guide N-8"
    },
    {
        "id": 5,
        "question": "How can I prevent Hypertension and manage high blood pressure?",
        "answer": "Hypertension prevention involves restricting dietary sodium to under 2,000 mg/day (DASH diet), exercising 150 min/week, maintaining healthy BMI, limiting alcohol, and avoiding tobacco products.",
        "department": "Cardiology",
        "citation": "Cardiovascular Prevention Manual C-3"
    },
    {
        "id": 6,
        "question": "What items should I bring for inpatient surgical admission?",
        "answer": "Bring official government ID, health insurance cards, current prescription medication bottles, comfortable non-slip footwear, and personal toiletries. Leave valuables and jewelry at home.",
        "department": "Admissions",
        "citation": "Patient Admission Checklist A-1"
    }
]

DISEASES_DB = [
    {
        "id": 1,
        "condition": "Hypertension (High Blood Pressure)",
        "description": "A chronic medical condition where long-term force of blood against arterial walls is sufficiently high to cause health problems.",
        "symptoms": ["Frequent headaches", "Shortness of breath", "Dizziness", "Visual disturbances"],
        "prevention": ["Sodium restriction (<2g/day)", "Regular aerobic exercise", "DASH Diet Plan"],
        "department": "Cardiology"
    },
    {
        "id": 2,
        "condition": "Migraine Headache Disorder",
        "description": "A neurological condition characterized by recurrent, moderate-to-severe throbbing headaches typically affecting one side of the head.",
        "symptoms": ["Unilateral throbbing pain", "Nausea/Vomiting", "Photophobia", "Aura vision"],
        "prevention": ["Consistent sleep routine", "Hydration", "Magnesium supplements"],
        "department": "Neurology"
    }
]

APPOINTMENTS_DB = []

@app.get("/")
def root():
    return {"status": "online", "service": "AuraCare AI Health Assistant API"}

@app.get("/api/faqs")
def get_faqs():
    return FAQS_DB

@app.get("/api/diseases")
def get_diseases():
    return DISEASES_DB

@app.get("/api/appointments")
def get_appointments():
    return APPOINTMENTS_DB

@app.post("/api/appointments")
def create_appointment(appointment: dict):
    appointment["id"] = len(APPOINTMENTS_DB) + 1
    appointment["status"] = "Confirmed"
    APPOINTMENTS_DB.append(appointment)
    return {"message": "Appointment created successfully", "appointment": appointment}

@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    msg = req.message.lower()
    
    # Query intent matchers
    if "visiting" in msg or "hours" in msg or "icu" in msg:
        return {
            "response": FAQS_DB[0]["answer"],
            "citation": FAQS_DB[0]["citation"],
            "tool_used": "FAQ Retrieval Engine"
        }
    elif "emergency" in msg or "triage" in msg or "er" in msg:
        return {
            "response": FAQS_DB[1]["answer"],
            "citation": FAQS_DB[1]["citation"],
            "tool_used": "Emergency Router"
        }
    elif "department" in msg or "specialist" in msg or "available" in msg:
        return {
            "response": FAQS_DB[2]["answer"],
            "citation": FAQS_DB[2]["citation"],
            "tool_used": "Directory Search"
        }
    elif "migraine" in msg or "headache" in msg:
        return {
            "response": FAQS_DB[3]["answer"],
            "citation": FAQS_DB[3]["citation"],
            "tool_used": "Neurology KB"
        }
    elif "hypertension" in msg or "blood pressure" in msg:
        return {
            "response": FAQS_DB[4]["answer"],
            "citation": FAQS_DB[4]["citation"],
            "tool_used": "Cardiology KB"
        }
    else:
        return {
            "response": "General outpatient consultations operate Monday through Saturday from 8:00 AM to 5:00 PM. For specific medical queries or scheduling, please select an inquiry tab or click 'Book Appointment'.",
            "citation": "AuraCare General Systems",
            "tool_used": "Clinical Assistant"
        }