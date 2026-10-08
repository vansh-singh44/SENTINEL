// src/context/SocContext.jsx
// Central SOC State Management for SENTINEL

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api } from "../services/api";

import {
  INITIAL_LIVE_EVENTS,
  INITIAL_ALERTS,
  SIMULATOR_PRESETS,
  INITIAL_HOURLY_ACTIVITY,
  INITIAL_ATTACK_DISTRIBUTION,
  INITIAL_SEVERITY_DISTRIBUTION,
  INITIAL_PROTOCOL_DISTRIBUTION,
  INITIAL_TOP_PORTS,
  MODEL_METRICS,
} from "../data/sampleData";

const SocContext = createContext(null);

const INITIAL_STATS = {
  totalEvents: 82332,
  threatsDetected: 34132,
  criticalAlerts: 2430,
  modelAccuracy: MODEL_METRICS?.accuracy ?? 94.82,
};

function isThreatEvent(event) {
  return (
    String(event?.severity || "").toUpperCase() !== "BENIGN" &&
    String(event?.prediction || "").toLowerCase() !== "normal"
  );
}

function isCriticalEvent(event) {
  return String(event?.severity || "").toUpperCase() === "CRITICAL";
}

function createDemoEvent() {
  const preset =
    SIMULATOR_PRESETS[
      Math.floor(Math.random() * SIMULATOR_PRESETS.length)
    ];

  const randomOctet =
    Math.floor(Math.random() * 254) + 1;

  const sourceIp =
    preset.source_ip?.replace(
      /\.\d+$/,
      `.${randomOctet}`
    ) || "192.168.1.100";

  const newId = `evt-${Date.now().toString().slice(-6)}`;

  return {
    id: newId,

    timestamp: new Date().toLocaleTimeString(),

    source_ip: sourceIp,

    destination_ip:
      preset.destination_ip || "10.0.0.1",

    protocol:
      preset.protocol || "TCP",

    port:
      preset.port ?? 443,

    packet_size:
      Math.max(
        64,
        (preset.packet_size || 512) +
          Math.floor(Math.random() * 80) -
          40
      ),

    attack_category:
      preset.expected_category || "Normal",

    prediction:
      preset.expected_category || "Normal",

    confidence:
      preset.expected_confidence ?? 95,

    risk_score:
      preset.expected_risk ?? 10,

    severity:
      preset.expected_severity || "BENIGN",

    priority:
      preset.expected_priority || "P4",

    status:
      preset.expected_severity === "CRITICAL" ||
      preset.expected_severity === "HIGH"
        ? "Active"
        : "Resolved",

    source: "Demo Mode",

    type: "Simulated Network Event",

    features: {
      dur: preset.duration || 1.5,

      sbytes:
        preset.packet_size || 512,

      dbytes:
        Math.round(
          (preset.packet_size || 512) * 0.4
        ),

      spkts:
        Math.floor(Math.random() * 20) + 4,

      dpkts:
        Math.floor(Math.random() * 15) + 2,

      service:
        preset.service || "http",

      state:
        preset.state || "CON",

      rate:
        Math.round(
          (Math.random() * 2000 + 100) * 10
        ) / 10,

      sttl: 64,

      dttl: 64,
    },

    recommendation:
      preset.recommendation ||
      "Continue monitoring the network event.",
  };
}

function createAlertFromEvent(event) {
  return {
    id: `ALT-${event.id.toUpperCase()}`,

    title: `${event.attack_category || "Threat"} detected on port ${
      event.port ?? "N/A"
    }`,

    attack_category:
      event.attack_category || event.prediction,

    severity:
      event.severity || "HIGH",

    priority:
      event.priority || "P2",

    source:
      event.source_ip,

    destination:
      event.destination_ip,

    port:
      event.port,

    confidence:
      event.confidence,

    risk:
      event.risk_score,

    timestamp:
      event.timestamp,

    status: "Active",

    description:
      `SENTINEL detected ${
        event.attack_category || "suspicious activity"
      } with ${event.confidence ?? 0}% confidence.`,

    recommendation:
      event.recommendation ||
      "Investigate the affected source and destination.",
  };
}

export function SocProvider({ children }) {
  // --------------------------------------------------
  // Navigation
  // --------------------------------------------------

  const [activePage, setActivePage] =
    useState("overview");

  // --------------------------------------------------
  // Selected Threat
  // --------------------------------------------------

  const [selectedThreat, setSelectedThreat] =
    useState(INITIAL_LIVE_EVENTS[0] || null);

  // --------------------------------------------------
  // Live Feed
  // --------------------------------------------------

  const [liveEvents, setLiveEvents] =
    useState(INITIAL_LIVE_EVENTS);

  const [isFeedPaused, setIsFeedPaused] =
    useState(false);

  const [streamSpeedMs, setStreamSpeedMs] =
    useState(5000);

  // --------------------------------------------------
  // Alerts
  // --------------------------------------------------

  const [alerts, setAlerts] =
    useState(INITIAL_ALERTS);

  // --------------------------------------------------
  // Backend / Demo Mode
  // --------------------------------------------------

  const [apiHealth, setApiHealth] = useState({
    online: false,
    status: "checking",
    latencyMs: null,
    service: "SENTINEL API",
    lastChecked: null,
    mode: "DEMO",
  });

  // --------------------------------------------------
  // KPI Stats
  // --------------------------------------------------

  const [stats, setStats] =
    useState(INITIAL_STATS);

  // --------------------------------------------------
  // UI State
  // --------------------------------------------------

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  // --------------------------------------------------
  // Backend Health
  // --------------------------------------------------

  const checkBackendHealth = async () => {
    try {
      const health = await api.getHealth();

      setApiHealth({
        ...health,

        lastChecked:
          new Date().toLocaleTimeString(),

        mode:
          health?.online
            ? "LIVE"
            : "DEMO",
      });
    } catch (error) {
      console.error(
        "SENTINEL health check failed:",
        error
      );

      setApiHealth({
        online: false,
        status: "offline",
        latencyMs: null,
        service: "SENTINEL API",
        lastChecked:
          new Date().toLocaleTimeString(),
        mode: "DEMO",
      });
    }
  };

  // --------------------------------------------------
  // Start Health Checking
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const runHealthCheck = async () => {
      try {
        const health =
          await api.getHealth();

        if (!mounted) return;

        setApiHealth({
          ...health,

          lastChecked:
            new Date().toLocaleTimeString(),

          mode:
            health?.online
              ? "LIVE"
              : "DEMO",
        });
      } catch (error) {
        if (!mounted) return;

        setApiHealth({
          online: false,
          status: "offline",
          latencyMs: null,
          service: "SENTINEL API",
          lastChecked:
            new Date().toLocaleTimeString(),
          mode: "DEMO",
        });
      }
    };

    runHealthCheck();

    const interval = setInterval(
      runHealthCheck,
      10000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // --------------------------------------------------
  // DEMO MODE LIVE STREAM
  // --------------------------------------------------

  useEffect(() => {
    if (isFeedPaused) {
      return undefined;
    }

    const timer = setInterval(() => {
      const newEvent =
        createDemoEvent();

      setLiveEvents((previous) => [
        newEvent,
        ...previous.slice(0, 49),
      ]);

      setStats((previous) => ({
        ...previous,

        totalEvents:
          previous.totalEvents + 1,

        threatsDetected:
          isThreatEvent(newEvent)
            ? previous.threatsDetected + 1
            : previous.threatsDetected,

        criticalAlerts:
          isCriticalEvent(newEvent)
            ? previous.criticalAlerts + 1
            : previous.criticalAlerts,
      }));

      if (
        isCriticalEvent(newEvent)
      ) {
        const newAlert =
          createAlertFromEvent(
            newEvent
          );

        setAlerts((previous) => [
          newAlert,
          ...previous.slice(0, 19),
        ]);
      }
    }, streamSpeedMs);

    return () => {
      clearInterval(timer);
    };
  }, [
    isFeedPaused,
    streamSpeedMs,
  ]);

  // --------------------------------------------------
  // LIVE EVENTS ALIASES
  // These make the redesigned pages compatible
  // with the original SOC state architecture.
  // --------------------------------------------------

  const events = liveEvents;

  const threatEvents = useMemo(
    () =>
      liveEvents.filter(
        (event) =>
          String(
            event?.severity || ""
          ).toUpperCase() !== "BENIGN"
      ),
    [liveEvents]
  );

  // --------------------------------------------------
  // GRAPH DATA
  // --------------------------------------------------

  const threatData = useMemo(() => {
    const base =
      INITIAL_HOURLY_ACTIVITY.map(
        (item) => ({
          ...item,
        })
      );

    if (!liveEvents.length) {
      return base;
    }

    const recentThreats =
      liveEvents.filter(
        isThreatEvent
      ).length;

    const recentCritical =
      liveEvents.filter(
        isCriticalEvent
      ).length;

    const recentTotal =
      liveEvents.length;

    const lastIndex =
      base.length - 1;

    base[lastIndex] = {
      ...base[lastIndex],

      total:
        base[lastIndex].total +
        recentTotal,

      threats:
        base[lastIndex].threats +
        recentThreats,

      critical:
        base[lastIndex].critical +
        recentCritical,
    };

    return base;
  }, [liveEvents]);

  const severityData = useMemo(() => {
    const base =
      INITIAL_SEVERITY_DISTRIBUTION.map(
        (item) => ({
          ...item,
        })
      );

    const counts = {
      BENIGN: 0,
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    };

    liveEvents.forEach((event) => {
      const severity =
        String(
          event?.severity || "BENIGN"
        ).toUpperCase();

      if (
        counts[severity] !== undefined
      ) {
        counts[severity] += 1;
      }
    });

    return base.map((item) => {
      const key =
        item.name.toUpperCase();

      return {
        ...item,

        value:
          (item.count || 0) +
          (counts[key] || 0),

        count:
          (item.count || 0) +
          (counts[key] || 0),
      };
    });
  }, [liveEvents]);

  const attackData = useMemo(() => {
    const base =
      INITIAL_ATTACK_DISTRIBUTION.map(
        (item) => ({
          ...item,
        })
      );

    const counts = {};

    liveEvents.forEach((event) => {
      const category =
        event?.attack_category ||
        event?.prediction ||
        "Normal";

      counts[category] =
        (counts[category] || 0) + 1;
    });

    return base.map((item) => {
      const additional =
        counts[item.category] || 0;

      return {
        ...item,

        value:
          (item.count || 0) +
          additional,

        count:
          (item.count || 0) +
          additional,

        label:
          item.category,
      };
    });
  }, [liveEvents]);

  const protocolData = useMemo(() => {
    const base =
      INITIAL_PROTOCOL_DISTRIBUTION.map(
        (item) => ({
          ...item,
        })
      );

    const counts = {};

    liveEvents.forEach((event) => {
      const protocol =
        event?.protocol || "TCP";

      counts[protocol] =
        (counts[protocol] || 0) + 1;
    });

    return base.map((item) => ({
      ...item,

      value:
        (item.count || 0) +
        (counts[item.protocol] || 0),

      count:
        (item.count || 0) +
        (counts[item.protocol] || 0),
    }));
  }, [liveEvents]);

  // --------------------------------------------------
  // TOP PORT DATA
  // --------------------------------------------------

  const topPorts = useMemo(() => {
    const base =
      INITIAL_TOP_PORTS.map(
        (item) => ({
          ...item,
        })
      );

    const counts = {};

    liveEvents.forEach((event) => {
      const port =
        Number(event?.port);

      if (!Number.isNaN(port)) {
        counts[port] =
          (counts[port] || 0) + 1;
      }
    });

    return base.map((item) => ({
      ...item,

      count:
        (item.count || 0) +
        (counts[item.port] || 0),
    }));
  }, [liveEvents]);

  // --------------------------------------------------
  // SYSTEM HEALTH
  // --------------------------------------------------

  const systemHealth = useMemo(
    () => ({
      api: apiHealth.online
        ? "Operational"
        : "Demo Mode",

      model: "Operational",

      feed: isFeedPaused
        ? "Paused"
        : "Running",

      database: "Operational",

      overall: "Operational",

      apiOnline:
        apiHealth.online,

      feedRunning:
        !isFeedPaused,
    }),
    [
      apiHealth.online,
      isFeedPaused,
    ]
  );

  // --------------------------------------------------
  // ACTIONS
  // --------------------------------------------------

  const pauseFeed = () => {
    setIsFeedPaused(true);
  };

  const resumeFeed = () => {
    setIsFeedPaused(false);
  };

  const clearFeed = () => {
    setLiveEvents([]);
  };

  const inspectEvent = (event) => {
    setSelectedThreat(event);

    setActivePage(
      "threat-analysis"
    );
  };

  const resolveAlert = (id) => {
    setAlerts((previous) =>
      previous.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              status: "Resolved",
            }
          : alert
      )
    );
  };

  const acknowledgeAlert = (id) => {
    setAlerts((previous) =>
      previous.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              status: "Investigating",
            }
          : alert
      )
    );
  };

  // --------------------------------------------------
  // SIMULATOR -> LIVE FEED
  // --------------------------------------------------

  const addSimulatedThreatToFeed = (
    threatResult
  ) => {
    if (!threatResult) {
      return;
    }

    const newId =
      `evt-${Date.now().toString().slice(-6)}`;

    const newEvent = {
      id: newId,

      timestamp:
        threatResult.timestamp ||
        new Date().toLocaleTimeString(),

      source_ip:
        threatResult.source_ip,

      destination_ip:
        threatResult.destination_ip,

      protocol:
        threatResult.protocol,

      port:
        threatResult.port,

      packet_size:
        threatResult.packet_size || 512,

      attack_category:
        threatResult.attack_category ||
        threatResult.prediction ||
        "Normal",

      prediction:
        threatResult.prediction ||
        "Normal",

      confidence:
        threatResult.confidence ??
        95,

      risk_score:
        threatResult.risk_score ??
        10,

      severity:
        threatResult.severity ||
        "BENIGN",

      priority:
        threatResult.priority ||
        "P4",

      status: "Active",

      source:
        threatResult.online
          ? "Live Backend"
          : "Demo Mode",

      type:
        "Threat Simulator",

      features: {
        dur:
          threatResult.duration ||
          2.1,

        sbytes:
          threatResult.packet_size ||
          512,

        dbytes: 256,

        spkts: 12,

        dpkts: 6,

        service:
          threatResult.protocol
            ?.toLowerCase() ||
          "http",

        state: "CON",

        rate: 850,

        sttl: 64,

        dttl: 64,
      },

      recommendation:
        threatResult.recommendation ||
        "Continue monitoring the event.",
    };

    setLiveEvents((previous) => [
      newEvent,
      ...previous.slice(0, 49),
    ]);

    setSelectedThreat(newEvent);

    setStats((previous) => ({
      ...previous,

      totalEvents:
        previous.totalEvents + 1,

      threatsDetected:
        isThreatEvent(newEvent)
          ? previous.threatsDetected + 1
          : previous.threatsDetected,

      criticalAlerts:
        isCriticalEvent(newEvent)
          ? previous.criticalAlerts + 1
          : previous.criticalAlerts,
    }));

    if (
      isCriticalEvent(newEvent)
    ) {
      const newAlert =
        createAlertFromEvent(
          newEvent
        );

      setAlerts((previous) => [
        newAlert,
        ...previous.slice(0, 19),
      ]);
    }
  };

  // --------------------------------------------------
  // CONTEXT VALUE
  // --------------------------------------------------

  const value = {
    // Navigation
    activePage,
    setActivePage,

    // Selected threat
    selectedThreat,
    setSelectedThreat,

    // Feed
    liveEvents,
    events,
    threatEvents,

    isFeedPaused,
    pauseFeed,
    resumeFeed,
    clearFeed,

    streamSpeedMs,
    setStreamSpeedMs,

    // Alerts
    alerts,
    resolveAlert,
    acknowledgeAlert,

    // Backend
    apiHealth,
    checkBackendHealth,

    // Demo mode
    demoMode: !apiHealth.online,

    // Stats
    stats,

    // Graph data
    threatData,
    severityData,
    attackData,
    protocolData,
    topPorts,

    // System status
    systemHealth,

    // Simulator / inspection
    inspectEvent,
    addSimulatedThreatToFeed,

    // UI
    settingsOpen,
    setSettingsOpen,

    notificationsOpen,
    setNotificationsOpen,
  };

  return (
    <SocContext.Provider value={value}>
      {children}
    </SocContext.Provider>
  );
}

export function useSoc() {
  const context =
    useContext(SocContext);

  if (!context) {
    throw new Error(
      "useSoc must be used within a SocProvider"
    );
  }

  return context;
}
