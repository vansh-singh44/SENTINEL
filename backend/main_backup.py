from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(
    title="SENTINEL API",
    description="Intelligent Threat Detection and Response API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# Request Model
# -------------------------

class ThreatEvent(BaseModel):
    source_ip: str
    destination_ip: str
    protocol: str
    port: int
    packet_size: float


# -------------------------
# Root
# -------------------------

@app.get("/")
def root():
    return {
        "message": "SENTINEL Backend is running",
        "status": "online"
    }


# -------------------------
# Health Check
# -------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "SENTINEL API",
        "timestamp": datetime.now().isoformat()
    }


# -------------------------
# Sample Event
# -------------------------

@app.get("/sample_event")
def sample_event():
    return {
        "source_ip": "192.168.1.10",
        "destination_ip": "10.0.0.5",
        "protocol": "TCP",
        "port": 443,
        "packet_size": 512
    }


# -------------------------
# Threat Prediction
# -------------------------

@app.post("/predict")
def predict(event: ThreatEvent):

    # Temporary prediction logic.
    # We will replace this with the actual ML model later.

    if event.port in [22, 23, 3389]:
        severity = "High"
    elif event.packet_size > 5000:
        severity = "Medium"
    else:
        severity = "Benign"

    return {
        "prediction": severity,
        "source_ip": event.source_ip,
        "destination_ip": event.destination_ip,
        "protocol": event.protocol,
        "port": event.port,
        "timestamp": datetime.now().isoformat()
    }


# -------------------------
# Statistics
# -------------------------

@app.get("/stats")
def stats():
    return {
        "total_events": 0,
        "benign": 0,
        "low": 0,
        "medium": 0,
        "high": 0,
        "critical": 0
    }


# -------------------------
# Live Feed
# -------------------------

@app.get("/live_feed")
def live_feed():
    return {
        "status": "active",
        "message": "SENTINEL live threat feed is running"
    }