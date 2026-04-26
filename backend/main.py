from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import numpy as np
import requests

app = FastAPI()

# -------- DATA --------
db = []

class CycleData(BaseModel):
    start_date: str
    end_date: str
    symptoms: List[str]
    cycle_length: int

# -------- ROUTES --------
@app.get("/")
def home():
    return {"msg": "Backend running"}

@app.post("/cycle")
def add_cycle(data: CycleData):
    db.append(data.dict())
    return {"msg": "added"}

@app.get("/predict")
def predict():
    if len(db) < 2:
        return {"prediction_range": "Not enough data"}

    lengths = [c["cycle_length"] for c in db]
    avg = int(np.mean(lengths))
    std = int(np.std(lengths))

    return {
        "prediction_range": f"{avg-std} - {avg+std} days",
        "confidence": "Medium"
    }

@app.get("/pcod-risk")
def pcod():
    if len(db) < 2:
        return {"level": "Low"}

    lengths = [c["cycle_length"] for c in db]
    risk = 0

    if max(lengths) > 35:
        risk += 30
    if np.std(lengths) > 5:
        risk += 30

    level = "Low"
    if risk > 60:
        level = "High"
    elif risk > 30:
        level = "Medium"

    return {"level": level, "score": risk}

# -------- CHATBOT --------
OPENAI_API_KEY = "PUT_YOUR_KEY_HERE"

@app.post("/chat")
def chat(data: dict):
    msg = data.get("message")

    res = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a caring women's health assistant."},
                {"role": "user", "content": msg}
            ]
        }
    )

    reply = res.json()["choices"][0]["message"]["content"]
    return {"reply": reply}