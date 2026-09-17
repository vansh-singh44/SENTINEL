// src/services/api.js
// Centralized API Service for SENTINEL AI Threat Detection Platform

import { SIMULATOR_PRESETS, MODEL_METRICS } from '../data/sampleData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const DEFAULT_TIMEOUT_MS = 3000;

/**
 * Helper to execute fetch requests with configurable timeout
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export const api = {
  /**
   * Check backend health and ping latency
   */
  async getHealth() {
    const startTime = performance.now();
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/health`, {}, 2500);
      const latencyMs = Math.round(performance.now() - startTime);

      if (res.ok) {
        const data = await res.json();
        return {
          online: true,
          status: data.status || 'healthy',
          service: data.service || 'SENTINEL API',
          timestamp: data.timestamp || new Date().toISOString(),
          latencyMs
        };
      }
      return {
        online: false,
        status: 'degraded',
        error: `HTTP ${res.status}`,
        latencyMs
      };
    } catch (err) {
      return {
        online: false,
        status: 'offline',
        error: err.name === 'AbortError' ? 'Connection timed out' : 'BACKEND OFFLINE',
        latencyMs: null
      };
    }
  },

  /**
   * Fetch aggregated threat statistics
   */
  async getStats() {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/stats`);
      if (res.ok) {
        const data = await res.json();
        return {
          online: true,
          data
        };
      }
    } catch (_err) {
      // Fallback
    }

    return {
      online: false,
      data: {
        total_events: 82332,
        threats: 34132,
        benign: 48200,
        low: 14200,
        medium: 10450,
        high: 7120,
        critical: 2430
      }
    };
  },

  /**
   * Fetch a sample network event from the backend
   */
  async getSampleEvent() {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/sample_event`);
      if (res.ok) {
        const data = await res.json();
        return {
          online: true,
          event: {
            source_ip: data.source_ip || '192.168.1.10',
            destination_ip: data.destination_ip || '10.0.0.5',
            protocol: data.protocol || 'TCP',
            port: data.port || 443,
            packet_size: data.packet_size || 512,
            duration: 1.2,
            service: 'http',
            state: 'FIN'
          }
        };
      }
    } catch (_err) {
      // Fallback
    }

    // Pick a random preset from realistic UNSW-NB15 presets
    const randomPreset = SIMULATOR_PRESETS[Math.floor(Math.random() * SIMULATOR_PRESETS.length)];
    return {
      online: false,
      event: {
        source_ip: randomPreset.source_ip,
        destination_ip: randomPreset.destination_ip,
        protocol: randomPreset.protocol,
        port: randomPreset.port,
        packet_size: randomPreset.packet_size,
        duration: randomPreset.duration || 2.4,
        service: randomPreset.service || 'http',
        state: randomPreset.state || 'CON'
      }
    };
  },

  /**
   * Analyze threat event using POST /predict
   */
  async predictThreat(event) {
    const payload = {
      source_ip: event.source_ip || '192.168.1.1',
      destination_ip: event.destination_ip || '10.0.0.1',
      protocol: event.protocol || 'TCP',
      port: parseInt(event.port, 10) || 80,
      packet_size: parseFloat(event.packet_size) || 512
    };

    try {
      const res = await fetchWithTimeout(`${BASE_URL}/predict`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        
        // Enrich backend prediction into full SOC assessment
        const severity = (result.prediction || 'Benign').toUpperCase();
        return enrichPrediction(result, severity, true);
      }
    } catch (_err) {
      // Offline fallback prediction
    }

    // Deterministic fallback based on UNSW-NB15 flow characteristics
    let determinedSeverity = 'BENIGN';
    let predictedCategory = 'Normal';
    let confidence = 95.2;
    let riskScore = 8;
    let priority = 'P4';
    let recommendation = 'Normal legitimate network traffic. No analyst action required.';

    const port = payload.port;
    const pSize = payload.packet_size;

    if (port === 22) {
      predictedCategory = 'Reconnaissance';
      determinedSeverity = 'HIGH';
      confidence = 94.6;
      riskScore = 86;
      priority = 'P1';
      recommendation = 'Investigate source IP for SSH brute-force credential stuffing; review bastion access logs.';
    } else if (port === 3389) {
      predictedCategory = 'Backdoor';
      determinedSeverity = 'HIGH';
      confidence = 92.4;
      riskScore = 85;
      priority = 'P2';
      recommendation = 'Review internal workstation for unauthorized RDP connection attempt to domain controller.';
    } else if (port === 80 && pSize < 128) {
      predictedCategory = 'DoS';
      determinedSeverity = 'CRITICAL';
      confidence = 97.8;
      riskScore = 95;
      priority = 'P1';
      recommendation = 'Investigate high-rate TCP SYN flood; review perimeter firewall rate-limiting and upstream ISP filtering.';
    } else if (port === 8080 || port === 445) {
      predictedCategory = 'Exploits';
      determinedSeverity = 'CRITICAL';
      confidence = 96.1;
      riskScore = 93;
      priority = 'P1';
      recommendation = 'Inspect target host web/SMB service logs for known exploit syntax and payload injection; assess vulnerability patch status.';
    } else if (port === 53 && pSize > 400) {
      predictedCategory = 'Analysis';
      determinedSeverity = 'MEDIUM';
      confidence = 88.5;
      riskScore = 65;
      priority = 'P2';
      recommendation = 'Inspect DNS query resolution history; review requested domain names for high-entropy exfiltration patterns.';
    } else if (pSize > 4000) {
      predictedCategory = 'Generic';
      determinedSeverity = 'MEDIUM';
      confidence = 85.0;
      riskScore = 58;
      priority = 'P3';
      recommendation = 'Inspect anomalous jumbo payload against expected protocol baseline for application.';
    }

    return {
      online: false,
      backend_source: 'offline_fallback',
      prediction: predictedCategory,
      attack_category: predictedCategory,
      severity: determinedSeverity,
      confidence,
      risk_score: riskScore,
      priority,
      recommendation,
      source_ip: payload.source_ip,
      destination_ip: payload.destination_ip,
      protocol: payload.protocol,
      port: payload.port,
      packet_size: payload.packet_size,
      timestamp: new Date().toLocaleTimeString()
    };
  },

  /**
   * Batch threat analysis
   */
  async predictBatch(events) {
    const results = [];
    for (const evt of events) {
      const res = await this.predictThreat(evt);
      results.push(res);
    }
    return results;
  },

  /**
   * Get Live Feed status
   */
  async getLiveFeed() {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/live_feed`);
      if (res.ok) {
        return await res.json();
      }
    } catch (_err) {
      // Fallback
    }
    return {
      status: 'active',
      message: 'SENTINEL live threat feed is running (Simulated stream)'
    };
  },

  /**
   * Get Model metadata & UNSW-NB15 specs
   */
  async getModelInfo() {
    return MODEL_METRICS;
  }
};

/**
 * Enriches a raw backend prediction into complete SOC evaluation
 */
function enrichPrediction(backendResult, severity, online) {
  let attackCategory = 'Normal';
  let riskScore = 10;
  let priority = 'P4';
  let confidence = 94.5;
  let recommendation = 'Monitor session telemetry; no immediate action required.';

  if (severity === 'CRITICAL' || severity === 'HIGH') {
    if (backendResult.port === 22) {
      attackCategory = 'Reconnaissance';
      recommendation = 'Investigate source IP for SSH brute-force trials; review bastion authentication logs.';
    } else if (backendResult.port === 3389) {
      attackCategory = 'Backdoor';
      recommendation = 'Review host for unauthorized RDP connection attempt; verify user authorization.';
    } else if (backendResult.port === 80) {
      attackCategory = 'DoS';
      recommendation = 'Investigate potential HTTP SYN flood volume; review rate limit thresholds.';
    } else {
      attackCategory = 'Exploits';
      recommendation = 'Inspect affected host logs for exploit payload patterns; review service patch status.';
    }
    riskScore = severity === 'CRITICAL' ? 92 : 84;
    priority = 'P1';
    confidence = 96.2;
  } else if (severity === 'MEDIUM') {
    attackCategory = 'Generic';
    riskScore = 55;
    priority = 'P2';
    confidence = 88.0;
    recommendation = 'Inspect anomalous network session payload against host service baseline.';
  } else {
    severity = 'BENIGN';
    attackCategory = 'Normal';
    riskScore = 5;
    priority = 'P4';
    confidence = 99.0;
    recommendation = 'Normal legitimate traffic. No analyst action required.';
  }

  return {
    online,
    backend_source: 'live_backend',
    prediction: attackCategory,
    attack_category: attackCategory,
    severity,
    confidence,
    risk_score: riskScore,
    priority,
    recommendation,
    source_ip: backendResult.source_ip,
    destination_ip: backendResult.destination_ip,
    protocol: backendResult.protocol,
    port: backendResult.port,
    timestamp: backendResult.timestamp ? new Date(backendResult.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()
  };
}
