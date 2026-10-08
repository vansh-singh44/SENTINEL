# SENTINEL — AI-Powered Cybersecurity Threat Detection Platform

<p align="center">
  <strong>Detect. Analyze. Respond.</strong>
</p>

<p align="center">
  An AI-powered Security Operations Center (SOC) platform for network threat detection, analysis, simulation, and real-time security monitoring.
</p>

<p align="center">
  <a href="https://sentinel-eight-navy.vercel.app/">Live Dashboard</a> •
  <a href="https://sentinelbackend.vercel.app/">Backend API</a>
</p>

---

## Overview

**SENTINEL** is an AI-powered cybersecurity threat detection and monitoring platform designed to provide a centralized Security Operations Center (SOC) interface for analyzing network activity and identifying potential threats.

The platform combines a modern security dashboard with a machine-learning-powered backend to:

- Analyze network events
- Detect potentially malicious traffic
- Classify events as normal or attack traffic
- Assign application-level severity and risk scores
- Monitor incoming security events
- Simulate different attack scenarios
- Display security analytics and trends
- Manage and investigate alerts
- Provide model and system health information

SENTINEL can operate using the deployed backend API or **Demo Mode**, allowing the complete dashboard and simulator workflow to remain functional even when the backend is unavailable.

---

## Key Features

### 🛡️ Security Overview

The main dashboard provides a centralized view of the security environment.

It displays:

- Total network events
- Detected threats
- Critical alerts
- Model performance
- Threat activity trends
- Severity distribution
- Attack distribution
- System health
- Backend/API status

---

### 📡 Live Threat Feed

SENTINEL provides a continuously updating event feed for monitoring network activity.

Each event can contain information such as:

- Source IP
- Destination IP
- Protocol
- Port
- Packet size
- Detection result
- Severity
- Confidence
- Risk score
- Timestamp

The feed supports:

- Live updates
- Pause/resume
- Event inspection
- Threat filtering
- Security event visualization

---

### 🔍 Threat Analysis

The Threat Analysis section provides deeper insight into detected security events.

It helps analyze:

- Threat frequency
- Severity levels
- Detection results
- Risk scores
- Attack patterns
- Recent security activity

The dashboard separates normal traffic from suspicious activity to make investigation easier.

---

### 🤖 Machine Learning Detection

The backend uses a machine-learning classification pipeline trained on network traffic data.

The current model is a:

**Random Forest Classifier**

with:

- `150` estimators
- `max_depth = 20`
- `class_weight = balanced`
- `n_jobs = -1`
- `random_state = 42`

The model performs binary classification:

```text
0 → Normal Traffic
1 → Attack Traffic
