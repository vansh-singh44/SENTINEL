from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import datetime
from pathlib import Path
from typing import Optional
from collections import deque
import joblib
import pandas as pd


# ============================================================
# SENTINEL - Intelligent Threat Detection API
# ============================================================

app = FastAPI(
    title="SENTINEL API",
    description="AI-powered Network Threat Detection and Analysis API",
    version="2.0.0"
)

# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# MODEL LOADING
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
for candidate in [
    BASE_DIR / "sentinel_model.joblib",
    BASE_DIR.parent / "sentinel_model.joblib",
]:
    if candidate.exists():
        MODEL_PATH = candidate
        break
else:
    MODEL_PATH = BASE_DIR / "sentinel_model.joblib"

try:
    model = joblib.load(MODEL_PATH)
    MODEL_STATUS = "loaded"
    print(f"[SENTINEL] Model loaded successfully: {MODEL_PATH}")
except Exception as e:
    model = None
    MODEL_STATUS = "error"
    print(f"[SENTINEL] Model loading failed: {e}")


# ============================================================
# MODEL FEATURES
# ============================================================

MODEL_FEATURES = [
    "id",
    "dur",
    "proto",
    "service",
    "state",
    "spkts",
    "dpkts",
    "sbytes",
    "dbytes",
    "rate",
    "sttl",
    "dttl",
    "sload",
    "dload",
    "sloss",
    "dloss",
    "sinpkt",
    "dinpkt",
    "sjit",
    "djit",
    "swin",
    "stcpb",
    "dtcpb",
    "dwin",
    "tcprtt",
    "synack",
    "ackdat",
    "smean",
    "dmean",
    "trans_depth",
    "response_body_len",
    "ct_srv_src",
    "ct_state_ttl",
    "ct_dst_ltm",
    "ct_src_dport_ltm",
    "ct_dst_sport_ltm",
    "ct_dst_src_ltm",
    "is_ftp_login",
    "ct_ftp_cmd",
    "ct_flw_http_mthd",
    "ct_src_ltm",
    "ct_srv_dst",
    "is_sm_ips_ports"
]


# ============================================================
# THREAT INPUT MODEL
# ============================================================

class ThreatEvent(BaseModel):

    id: int = 1
    dur: float = 0.0

    proto: str = "tcp"
    service: str = "-"
    state: str = "CON"

    spkts: int = 10
    dpkts: int = 10

    sbytes: int = 1000
    dbytes: int = 1000

    rate: float = 100.0

    sttl: int = 64
    dttl: int = 64

    sload: float = 1000.0
    dload: float = 1000.0

    sloss: int = 0
    dloss: int = 0

    sinpkt: float = 10.0
    dinpkt: float = 10.0

    sjit: float = 0.0
    djit: float = 0.0

    swin: int = 255
    stcpb: int = 0
    dtcpb: int = 0
    dwin: int = 255

    tcprtt: float = 0.0
    synack: float = 0.0
    ackdat: float = 0.0

    smean: int = 100
    dmean: int = 100

    trans_depth: int = 0
    response_body_len: int = 0

    ct_srv_src: int = 1
    ct_state_ttl: int = 1
    ct_dst_ltm: int = 1
    ct_src_dport_ltm: int = 1
    ct_dst_sport_ltm: int = 1
    ct_dst_src_ltm: int = 1

    is_ftp_login: int = 0
    ct_ftp_cmd: int = 0
    ct_flw_http_mthd: int = 0

    ct_src_ltm: int = 1
    ct_srv_dst: int = 1
    is_sm_ips_ports: int = 0

    # Optional frontend-friendly information
    source_ip: Optional[str] = "192.168.1.10"
    destination_ip: Optional[str] = "10.0.0.5"
    port: Optional[int] = 443
    packet_size: Optional[float] = 512


# ============================================================
# IN-MEMORY STATISTICS
# ============================================================

statistics = {
    "total_events": 0,
    "benign": 0,
    "low": 0,
    "medium": 0,
    "high": 0,
    "critical": 0
}

recent_events = deque(maxlen=100)


# ============================================================
# SEVERITY MAPPING
# ============================================================

def get_severity(attack_category: str) -> str:

    category = str(attack_category).strip().lower()

    if category in ["normal", "benign"]:
        return "Benign"

    if category in [
        "analysis",
        "reconnaissance"
    ]:
        return "Low"

    if category in [
        "fuzzers",
        "generic"
    ]:
        return "Medium"

    if category in [
        "dos",
        "exploits"
    ]:
        return "High"

    if category in [
        "backdoor",
        "shellcode",
        "worms"
    ]:
        return "Critical"

    return "Medium"


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "SENTINEL Backend is running",
        "status": "online",
        "model_status": MODEL_STATUS,
        "model": "Random Forest",
        "dataset": "UNSW-NB15"
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy" if model is not None else "degraded",
        "service": "SENTINEL API",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    }


# ============================================================
# SAMPLE EVENT
# ============================================================

@app.get("/sample_event")
def sample_event():

    return {
        "id": 1,
        "dur": 0.001,
        "proto": "tcp",
        "service": "http",
        "state": "CON",
        "spkts": 10,
        "dpkts": 8,
        "sbytes": 1000,
        "dbytes": 800,
        "rate": 100.0,
        "sttl": 64,
        "dttl": 64,
        "sload": 1000.0,
        "dload": 800.0,
        "sloss": 0,
        "dloss": 0,
        "sinpkt": 10.0,
        "dinpkt": 10.0,
        "sjit": 0.0,
        "djit": 0.0,
        "swin": 255,
        "stcpb": 0,
        "dtcpb": 0,
        "dwin": 255,
        "tcprtt": 0.0,
        "synack": 0.0,
        "ackdat": 0.0,
        "smean": 100,
        "dmean": 100,
        "trans_depth": 0,
        "response_body_len": 0,
        "ct_srv_src": 1,
        "ct_state_ttl": 1,
        "ct_dst_ltm": 1,
        "ct_src_dport_ltm": 1,
        "ct_dst_sport_ltm": 1,
        "ct_dst_src_ltm": 1,
        "is_ftp_login": 0,
        "ct_ftp_cmd": 0,
        "ct_flw_http_mthd": 0,
        "ct_src_ltm": 1,
        "ct_srv_dst": 1,
        "is_sm_ips_ports": 0,

        "source_ip": "192.168.1.10",
        "destination_ip": "10.0.0.5",
        "port": 443,
        "packet_size": 512
    }


# ============================================================
# AI THREAT PREDICTION
# ============================================================

@app.post("/predict")
def predict(event: ThreatEvent):

    if model is None:
        raise HTTPException(
            status_code=500,
            detail="SENTINEL AI model is not loaded."
        )

    try:

        # Convert Pydantic request into dictionary
        event_data = event.model_dump()

        # Create DataFrame containing ONLY the features
        # used during model training.
        input_data = {
            feature: event_data.get(feature)
            for feature in MODEL_FEATURES
        }

        input_df = pd.DataFrame([input_data])

        # Make prediction
        prediction = model.predict(input_df)[0]

        attack_category = str(prediction)

        # Convert attack category into application severity
        severity = get_severity(attack_category)

        # Confidence if supported by model
        confidence = None

        if hasattr(model, "predict_proba"):
            try:
                probabilities = model.predict_proba(input_df)[0]
                confidence = float(max(probabilities))
            except Exception:
                confidence = None

        # Update statistics
        statistics["total_events"] += 1
        statistics[severity.lower()] += 1

        timestamp = datetime.now().isoformat()

        result = {
            "prediction": severity,
            "attack_category": attack_category,
            "confidence": round(confidence * 100, 2)
            if confidence is not None else None,

            "source_ip": event.source_ip,
            "destination_ip": event.destination_ip,
            "protocol": event.proto,
            "port": event.port,
            "packet_size": event.packet_size,

            "timestamp": timestamp,
            "model": "Random Forest",
            "dataset": "UNSW-NB15"
        }

        # Add to live feed
        recent_events.appendleft(result)

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


# ============================================================
# BATCH PREDICTION
# ============================================================

@app.post("/predict_batch")
def predict_batch(events: list[ThreatEvent]):

    if model is None:
        raise HTTPException(
            status_code=500,
            detail="SENTINEL AI model is not loaded."
        )

    results = []

    for event in events:

        try:

            event_data = event.model_dump()

            input_data = {
                feature: event_data.get(feature)
                for feature in MODEL_FEATURES
            }

            input_df = pd.DataFrame([input_data])

            prediction = model.predict(input_df)[0]

            attack_category = str(prediction)
            severity = get_severity(attack_category)

            confidence = None

            if hasattr(model, "predict_proba"):
                try:
                    probabilities = model.predict_proba(input_df)[0]
                    confidence = float(max(probabilities))
                except Exception:
                    pass

            statistics["total_events"] += 1
            statistics[severity.lower()] += 1

            result = {
                "prediction": severity,
                "attack_category": attack_category,
                "confidence": round(confidence * 100, 2)
                if confidence is not None else None,
                "source_ip": event.source_ip,
                "destination_ip": event.destination_ip,
                "protocol": event.proto,
                "port": event.port,
                "timestamp": datetime.now().isoformat()
            }

            recent_events.appendleft(result)
            results.append(result)

        except Exception as e:

            results.append({
                "error": str(e)
            })

    return {
        "total": len(results),
        "results": results
    }


# ============================================================
# STATISTICS
# ============================================================

@app.get("/stats")
def stats():

    return {
        **statistics,
        "model_status": MODEL_STATUS,
        "model": "Random Forest",
        "dataset": "UNSW-NB15"
    }


# ============================================================
# LIVE FEED
# ============================================================

@app.get("/live_feed")
def live_feed():

    return {
        "status": "active",
        "events": list(recent_events),
        "count": len(recent_events)
    }


# ============================================================
# MODEL INFORMATION
# ============================================================

@app.get("/model_info")
def model_info():

    return {
        "model_loaded": model is not None,
        "model_type": "RandomForestClassifier",
        "pipeline": "ColumnTransformer + OneHotEncoder + RandomForestClassifier",
        "dataset": "UNSW-NB15",
        "features": MODEL_FEATURES,
        "feature_count": len(MODEL_FEATURES),
        "attack_categories": [
            "Normal",
            "Generic",
            "Exploits",
            "Fuzzers",
            "DoS",
            "Reconnaissance",
            "Analysis",
            "Backdoor",
            "Shellcode",
            "Worms"
        ]
    }


# ============================================================
# SERVER
# ============================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )