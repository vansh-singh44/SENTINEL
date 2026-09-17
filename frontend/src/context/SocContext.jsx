// src/context/SocContext.jsx
// Central SOC State Management for SENTINEL

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { INITIAL_LIVE_EVENTS, INITIAL_ALERTS, SIMULATOR_PRESETS } from '../data/sampleData';

const SocContext = createContext(null);

export function SocProvider({ children }) {
  // Navigation State
  const [activePage, setActivePage] = useState('overview');

  // Currently inspected threat in Threat Analysis
  const [selectedThreat, setSelectedThreat] = useState(INITIAL_LIVE_EVENTS[0]);

  // Live feed events stream
  const [liveEvents, setLiveEvents] = useState(INITIAL_LIVE_EVENTS);
  const [isFeedPaused, setIsFeedPaused] = useState(false);
  const [streamSpeedMs, setStreamSpeedMs] = useState(5000);

  // Security Alerts
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  // API and Engine Health
  const [apiHealth, setApiHealth] = useState({
    online: false,
    status: 'checking',
    latencyMs: null,
    service: 'SENTINEL API',
    lastChecked: null
  });

  // Global KPI Stats
  const [stats, setStats] = useState({
    totalEvents: 82332,
    threatsDetected: 34132,
    criticalAlerts: 2430,
    modelAccuracy: 94.8
  });

  // UI Drawers / Modals
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Polling backend health with cleanup
  const checkBackendHealth = async () => {
    const health = await api.getHealth();
    setApiHealth({
      ...health,
      lastChecked: new Date().toLocaleTimeString()
    });
  };

  useEffect(() => {
    let isMounted = true;

    const runHealthCheck = async () => {
      const health = await api.getHealth();
      if (isMounted) {
        setApiHealth({
          ...health,
          lastChecked: new Date().toLocaleTimeString()
        });
      }
    };

    runHealthCheck();
    const interval = setInterval(runHealthCheck, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Live feed event generation ticker when not paused
  useEffect(() => {
    if (isFeedPaused) return;

    const timer = setInterval(() => {
      // Pick a random preset to generate a realistic new live event
      const preset = SIMULATOR_PRESETS[Math.floor(Math.random() * SIMULATOR_PRESETS.length)];
      const randomOctet = Math.floor(Math.random() * 254) + 1;
      const srcIp = preset.source_ip.replace(/\.\d+$/, `.${randomOctet}`);
      const newId = `evt-${Date.now().toString().slice(-4)}`;

      const newEvent = {
        id: newId,
        timestamp: new Date().toLocaleTimeString(),
        source_ip: srcIp,
        destination_ip: preset.destination_ip,
        protocol: preset.protocol,
        port: preset.port,
        packet_size: preset.packet_size + Math.floor(Math.random() * 80) - 40,
        attack_category: preset.expected_category,
        prediction: preset.expected_category,
        confidence: preset.expected_confidence,
        risk_score: preset.expected_risk,
        severity: preset.expected_severity,
        priority: preset.expected_priority,
        status: preset.expected_severity === 'CRITICAL' || preset.expected_severity === 'HIGH' ? 'Active' : 'Resolved',
        features: {
          dur: preset.duration || 1.5,
          sbytes: preset.packet_size,
          dbytes: Math.round(preset.packet_size * 0.4),
          spkts: Math.floor(Math.random() * 20) + 4,
          dpkts: Math.floor(Math.random() * 15) + 2,
          service: preset.service || 'http',
          state: preset.state || 'CON',
          rate: Math.round((Math.random() * 2000 + 100) * 10) / 10,
          sttl: 64,
          dttl: 64
        },
        recommendation: preset.recommendation
      };

      setLiveEvents(prev => [newEvent, ...prev.slice(0, 49)]); // Keep last 50
      setStats(prev => ({
        ...prev,
        totalEvents: prev.totalEvents + 1,
        threatsDetected: newEvent.severity !== 'BENIGN' ? prev.threatsDetected + 1 : prev.threatsDetected,
        criticalAlerts: newEvent.severity === 'CRITICAL' ? prev.criticalAlerts + 1 : prev.criticalAlerts
      }));

      // If critical, auto-add to active alerts
      if (newEvent.severity === 'CRITICAL') {
        const newAlert = {
          id: `ALT-${newId.toUpperCase()}`,
          title: `${newEvent.attack_category} Detection on Port ${newEvent.port}`,
          attack_category: newEvent.attack_category,
          severity: 'CRITICAL',
          priority: 'P1',
          source: newEvent.source_ip,
          destination: newEvent.destination_ip,
          port: newEvent.port,
          confidence: newEvent.confidence,
          risk: newEvent.risk_score,
          timestamp: newEvent.timestamp,
          status: 'Active',
          description: `Automatic SOC threat ingestion: ${newEvent.attack_category} signature identified with ${newEvent.confidence}% confidence.`,
          recommendation: newEvent.recommendation
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 19)]);
      }
    }, streamSpeedMs);

    return () => clearInterval(timer);
  }, [isFeedPaused, streamSpeedMs]);

  // Actions
  const pauseFeed = () => setIsFeedPaused(true);
  const resumeFeed = () => setIsFeedPaused(false);
  const clearFeed = () => setLiveEvents([]);

  const inspectEvent = (event) => {
    setSelectedThreat(event);
    setActivePage('threat-analysis');
  };

  const resolveAlert = (id) => {
    setAlerts(prev =>
      prev.map(alert => (alert.id === id ? { ...alert, status: 'Resolved' } : alert))
    );
  };

  const acknowledgeAlert = (id) => {
    setAlerts(prev =>
      prev.map(alert => (alert.id === id ? { ...alert, status: 'Investigating' } : alert))
    );
  };

  const addSimulatedThreatToFeed = (threatResult) => {
    const newId = `evt-${Date.now().toString().slice(-4)}`;
    const newEvent = {
      id: newId,
      timestamp: threatResult.timestamp || new Date().toLocaleTimeString(),
      source_ip: threatResult.source_ip,
      destination_ip: threatResult.destination_ip,
      protocol: threatResult.protocol,
      port: threatResult.port,
      packet_size: threatResult.packet_size || 512,
      attack_category: threatResult.attack_category || threatResult.prediction,
      prediction: threatResult.prediction,
      confidence: threatResult.confidence,
      risk_score: threatResult.risk_score,
      severity: threatResult.severity,
      priority: threatResult.priority,
      status: 'Active',
      features: {
        dur: 2.1,
        sbytes: threatResult.packet_size || 512,
        dbytes: 256,
        spkts: 12,
        dpkts: 6,
        service: threatResult.protocol.toLowerCase(),
        state: 'CON',
        rate: 850.0,
        sttl: 64,
        dttl: 64
      },
      recommendation: threatResult.recommendation
    };

    setLiveEvents(prev => [newEvent, ...prev]);
    setSelectedThreat(newEvent);
  };

  const value = {
    activePage,
    setActivePage,
    selectedThreat,
    setSelectedThreat,
    liveEvents,
    isFeedPaused,
    pauseFeed,
    resumeFeed,
    clearFeed,
    streamSpeedMs,
    setStreamSpeedMs,
    alerts,
    resolveAlert,
    acknowledgeAlert,
    apiHealth,
    checkBackendHealth,
    stats,
    inspectEvent,
    addSimulatedThreatToFeed,
    settingsOpen,
    setSettingsOpen,
    notificationsOpen,
    setNotificationsOpen
  };

  return <SocContext.Provider value={value}>{children}</SocContext.Provider>;
}

export function useSoc() {
  const context = useContext(SocContext);
  if (!context) {
    throw new Error('useSoc must be used within a SocProvider');
  }
  return context;
}
