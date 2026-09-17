// src/data/sampleData.js
// UNSW-NB15 Dataset Constants and Benchmark SOC Telemetry

export const ATTACK_CATEGORIES = [
  'Normal',
  'Generic',
  'Exploits',
  'Fuzzers',
  'DoS',
  'Reconnaissance',
  'Analysis',
  'Backdoor',
  'Shellcode',
  'Worms'
];

export const SEVERITY_LEVELS = ['BENIGN', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const MODEL_METRICS = {
  model_name: 'Random Forest Classifier',
  dataset: 'UNSW-NB15',
  estimators: 150,
  max_depth: 20,
  training_samples: 140272,
  testing_samples: 35068,
  features_count: 42,
  classes_count: 10,
  accuracy: 94.82,
  precision: 93.65,
  recall: 95.14,
  f1_score: 94.39,
  trained_model_file: 'sentinel_model.joblib',
  class_performance: [
    { category: 'Normal', precision: 97.2, recall: 96.8, f1: 97.0, support: 18200 },
    { category: 'Generic', precision: 95.4, recall: 96.1, f1: 95.7, support: 5880 },
    { category: 'Exploits', precision: 92.8, recall: 91.5, f1: 92.1, support: 4450 },
    { category: 'Fuzzers', precision: 91.2, recall: 90.8, f1: 91.0, support: 2420 },
    { category: 'DoS', precision: 94.0, recall: 93.4, f1: 93.7, support: 1980 },
    { category: 'Reconnaissance', precision: 93.5, recall: 94.2, f1: 93.8, support: 1490 },
    { category: 'Analysis', precision: 88.4, recall: 87.1, f1: 87.7, support: 260 },
    { category: 'Backdoor', precision: 86.9, recall: 85.2, f1: 86.0, support: 210 },
    { category: 'Shellcode', precision: 89.1, recall: 88.0, f1: 88.5, support: 140 },
    { category: 'Worms', precision: 85.0, recall: 84.6, f1: 84.8, support: 38 }
  ]
};

export const CONFUSION_MATRIX = {
  labels: ['Normal', 'Generic', 'Exploits', 'Fuzzers', 'DoS', 'Recon'],
  matrix: [
    [17618, 240, 180, 80, 52, 30],
    [190, 5651, 18, 12, 5, 4],
    [210, 42, 4072, 85, 26, 15],
    [115, 20, 78, 2197, 8, 2],
    [64, 8, 32, 14, 1849, 13],
    [52, 6, 19, 4, 9, 1400]
  ]
};

export const DETECTION_PIPELINE_STAGES = [
  {
    id: 1,
    title: 'NETWORK EVENT',
    subtitle: 'Packet Ingestion',
    description: 'Raw network telemetry captured across edge sensors and firewall taps.',
    meta: 'IPs, Ports, Protocols, Packet Sizes'
  },
  {
    id: 2,
    title: 'FEATURE PREPROCESSING',
    subtitle: 'Flow Vectorization',
    description: 'Standardization and One-Hot encoding of UNSW-NB15 flow parameters.',
    meta: '42 Extracted Features (dur, sbytes, rate)'
  },
  {
    id: 3,
    title: 'MACHINE LEARNING MODEL',
    subtitle: 'Random Forest Ensemble',
    description: '150 decision trees evaluate non-linear multi-class threat signatures.',
    meta: 'Parallel Gini Impurity Trees'
  },
  {
    id: 4,
    title: 'ATTACK CLASSIFICATION',
    subtitle: 'Probability Distribution',
    description: 'Categorization into Normal, Exploits, DoS, Fuzzers, or Reconnaissance.',
    meta: '10 Attack Class Probabilities'
  },
  {
    id: 5,
    title: 'CONFIDENCE SCORE',
    subtitle: 'Calibrated Certainty',
    description: 'Ensemble voting consensus determines confidence metric from 0% to 100%.',
    meta: 'Consensus Threshold Filtering'
  },
  {
    id: 6,
    title: 'THREAT ASSESSMENT',
    subtitle: 'Context Evaluation',
    description: 'Cross-referencing destination asset criticality and exposure posture.',
    meta: 'Port Exposure & Asset Weight'
  },
  {
    id: 7,
    title: 'RISK + SEVERITY',
    subtitle: 'Matrix Computation',
    description: 'Quantifying risk score (0-100) and severity rating (BENIGN to CRITICAL).',
    meta: 'BENIGN / LOW / MED / HIGH / CRIT'
  },
  {
    id: 8,
    title: 'ALERT PRIORITIZATION',
    subtitle: 'SOC Queue Assignment',
    description: 'Triage prioritization into P1 (Urgent) through P4 (Informational).',
    meta: 'P1 / P2 / P3 / P4 Incident Queues'
  },
  {
    id: 9,
    title: 'RESPONSE RECOMMENDATION',
    subtitle: 'Analyst Action Plan',
    description: 'Actionable investigation steps curated for the security analyst team.',
    meta: 'Investigate, Quarantine, Inspect Host'
  }
];

export const INITIAL_HOURLY_ACTIVITY = [
  { time: '04:00', total: 1420, threats: 120, critical: 12 },
  { time: '06:00', total: 2180, threats: 190, critical: 18 },
  { time: '08:00', total: 4890, threats: 410, critical: 42 },
  { time: '10:00', total: 6720, threats: 580, critical: 64 },
  { time: '12:00', total: 7850, threats: 640, critical: 71 },
  { time: '14:00', total: 7210, threats: 590, critical: 58 },
  { time: '16:00', total: 8430, threats: 710, critical: 84 },
  { time: '18:00', total: 6920, threats: 530, critical: 49 },
  { time: '20:00', total: 5310, threats: 390, critical: 38 },
  { time: '22:00', total: 3940, threats: 280, critical: 26 },
  { time: '00:00', total: 2450, threats: 180, critical: 15 },
  { time: '02:00', total: 1680, threats: 135, critical: 11 }
];

export const INITIAL_ATTACK_DISTRIBUTION = [
  { category: 'Normal',        count: 48200, percent: 58.5, color: '#22c55e' },
  { category: 'Generic',       count: 12400, percent: 15.0, color: '#6c63ff' },
  { category: 'Exploits',      count: 9150,  percent: 11.1, color: '#f97316' },
  { category: 'Fuzzers',       count: 5200,  percent: 6.3,  color: '#f59e0b' },
  { category: 'DoS',           count: 3950,  percent: 4.8,  color: '#ef4444' },
  { category: 'Reconnaissance',count: 2800,  percent: 3.4,  color: '#a78bfa' },
  { category: 'Analysis',      count: 420,   percent: 0.5,  color: '#ec4899' },
  { category: 'Backdoor',      count: 310,   percent: 0.4,  color: '#dc2626' },
  { category: 'Shellcode',     count: 180,   percent: 0.2,  color: '#b91c1c' },
  { category: 'Worms',         count: 65,    percent: 0.1,  color: '#991b1b' }
];

export const INITIAL_SEVERITY_DISTRIBUTION = [
  { name: 'Benign', count: 48200, percent: 58.5, color: '#10b981' },
  { name: 'Low', count: 14200, percent: 17.2, color: '#0ea5e9' },
  { name: 'Medium', count: 10450, percent: 12.7, color: '#f59e0b' },
  { name: 'High', count: 7120, percent: 8.6, color: '#f97316' },
  { name: 'Critical', count: 2430, percent: 3.0, color: '#ef4444' }
];

export const INITIAL_PROTOCOL_DISTRIBUTION = [
  { protocol: 'TCP',        count: 56120, percent: 67.8, color: '#6c63ff' },
  { protocol: 'UDP',        count: 21450, percent: 25.9, color: '#60a5fa' },
  { protocol: 'ICMP',       count: 3890,  percent: 4.7,  color: '#a78bfa' },
  { protocol: 'ARP / Other',count: 1340,  percent: 1.6,  color: '#475569' }
];

export const INITIAL_TOP_PORTS = [
  { port: 22, service: 'SSH', count: 3420, risk: 'High' },
  { port: 443, service: 'HTTPS', count: 2890, risk: 'Medium' },
  { port: 80, service: 'HTTP', count: 2410, risk: 'Medium' },
  { port: 3389, service: 'RDP', count: 1980, risk: 'Critical' },
  { port: 53, service: 'DNS', count: 1420, risk: 'Low' },
  { port: 8080, service: 'HTTP-Alt', count: 1150, risk: 'High' }
];

// Presets for the Threat Simulator
export const SIMULATOR_PRESETS = [
  {
    name: 'SSH Brute Force Attack',
    source_ip: '198.51.100.42',
    destination_ip: '10.0.1.15',
    protocol: 'TCP',
    port: 22,
    packet_size: 1024,
    duration: 14.8,
    service: 'ssh',
    state: 'CON',
    description: 'Rapid dictionary authentication attempts against SOC bastion SSH daemon.',
    expected_category: 'Reconnaissance',
    expected_severity: 'HIGH',
    expected_confidence: 96.4,
    expected_risk: 88,
    expected_priority: 'P1',
    recommendation: 'Investigate source IP 198.51.100.42 for credential-stuffing attempts; review bastion SSH authentication logs; check for compromised accounts.'
  },
  {
    name: 'Distributed SYN Flood DoS',
    source_ip: '203.0.113.88',
    destination_ip: '10.0.0.1',
    protocol: 'TCP',
    port: 80,
    packet_size: 64,
    duration: 0.12,
    service: 'http',
    state: 'INT',
    description: 'High-frequency half-open SYN packets depleting TCP backlog queues.',
    expected_category: 'DoS',
    expected_severity: 'CRITICAL',
    expected_confidence: 98.2,
    expected_risk: 94,
    expected_priority: 'P1',
    recommendation: 'Investigate incoming SYN rates; review border load balancer SYN cookies posture; inspect upstream ISP mitigation options.'
  },
  {
    name: 'Remote Code Execution / Exploit',
    source_ip: '185.220.101.5',
    destination_ip: '10.0.2.45',
    protocol: 'TCP',
    port: 8080,
    packet_size: 4096,
    duration: 2.3,
    service: 'http',
    state: 'FIN',
    description: 'Malformed HTTP payload attempting arbitrary command injection in API microservice.',
    expected_category: 'Exploits',
    expected_severity: 'CRITICAL',
    expected_confidence: 95.8,
    expected_risk: 92,
    expected_priority: 'P1',
    recommendation: 'Inspect affected web service at 10.0.2.45:8080; check web server logs for injected command syntax; review application patch level.'
  },
  {
    name: 'RDP Lateral Movement Probe',
    source_ip: '10.0.5.12',
    destination_ip: '10.0.1.200',
    protocol: 'TCP',
    port: 3389,
    packet_size: 1514,
    duration: 8.5,
    service: 'rdp',
    state: 'CON',
    description: 'Internal host scanning sensitive subnet servers for unauthenticated RDP sessions.',
    expected_category: 'Backdoor',
    expected_severity: 'HIGH',
    expected_confidence: 91.5,
    expected_risk: 84,
    expected_priority: 'P2',
    recommendation: 'Review internal host 10.0.5.12 for potential initial compromise; check security event logs (Event ID 4624/4625) on destination host.'
  },
  {
    name: 'Benign Corporate HTTPS Session',
    source_ip: '10.0.3.50',
    destination_ip: '142.250.190.46',
    protocol: 'TCP',
    port: 443,
    packet_size: 1420,
    duration: 35.2,
    service: 'ssl',
    state: 'FIN',
    description: 'Standard TLS 1.3 encrypted browser communication with Google CDN.',
    expected_category: 'Normal',
    expected_severity: 'BENIGN',
    expected_confidence: 99.1,
    expected_risk: 4,
    expected_priority: 'P4',
    recommendation: 'Normal legitimate network traffic. No analyst action required.'
  },
  {
    name: 'DNS Query Flood / Tunneling',
    source_ip: '198.51.100.19',
    destination_ip: '10.0.0.53',
    protocol: 'UDP',
    port: 53,
    packet_size: 512,
    duration: 0.8,
    service: 'dns',
    state: 'INT',
    description: 'High-entropy base64 subdomains querying internal recursive DNS resolver.',
    expected_category: 'Analysis',
    expected_severity: 'MEDIUM',
    expected_confidence: 89.4,
    expected_risk: 68,
    expected_priority: 'P2',
    recommendation: 'Inspect DNS query resolution history on resolver 10.0.0.53; check domain entropy scores; review for covert channel data exfiltration.'
  }
];

export const INITIAL_LIVE_EVENTS = [
  {
    id: 'evt-1092',
    timestamp: '15:23:44',
    source_ip: '185.220.101.5',
    destination_ip: '10.0.2.45',
    protocol: 'TCP',
    port: 8080,
    packet_size: 4096,
    attack_category: 'Exploits',
    prediction: 'Exploits',
    confidence: 95.8,
    risk_score: 92,
    severity: 'CRITICAL',
    priority: 'P1',
    status: 'Active',
    features: {
      dur: 2.3,
      sbytes: 4096,
      dbytes: 812,
      spkts: 14,
      dpkts: 8,
      service: 'http',
      state: 'FIN',
      rate: 1780.8,
      sttl: 64,
      dttl: 252
    },
    recommendation: 'Inspect affected web service at 10.0.2.45:8080; check web server logs for injected command syntax; review application patch level.'
  },
  {
    id: 'evt-1091',
    timestamp: '15:23:38',
    source_ip: '203.0.113.88',
    destination_ip: '10.0.0.1',
    protocol: 'TCP',
    port: 80,
    packet_size: 64,
    attack_category: 'DoS',
    prediction: 'DoS',
    confidence: 98.2,
    risk_score: 94,
    severity: 'CRITICAL',
    priority: 'P1',
    status: 'Active',
    features: {
      dur: 0.12,
      sbytes: 64,
      dbytes: 0,
      spkts: 120,
      dpkts: 0,
      service: 'http',
      state: 'INT',
      rate: 9840.0,
      sttl: 254,
      dttl: 0
    },
    recommendation: 'Investigate incoming SYN rates; review border load balancer SYN cookies posture; inspect upstream ISP mitigation options.'
  },
  {
    id: 'evt-1090',
    timestamp: '15:23:25',
    source_ip: '198.51.100.42',
    destination_ip: '10.0.1.15',
    protocol: 'TCP',
    port: 22,
    packet_size: 1024,
    attack_category: 'Reconnaissance',
    prediction: 'Reconnaissance',
    confidence: 96.4,
    risk_score: 88,
    severity: 'HIGH',
    priority: 'P1',
    status: 'Investigating',
    features: {
      dur: 14.8,
      sbytes: 1024,
      dbytes: 412,
      spkts: 22,
      dpkts: 16,
      service: 'ssh',
      state: 'CON',
      rate: 69.1,
      sttl: 60,
      dttl: 64
    },
    recommendation: 'Investigate source IP 198.51.100.42 for credential-stuffing attempts; review bastion SSH authentication logs; check for compromised accounts.'
  },
  {
    id: 'evt-1089',
    timestamp: '15:23:12',
    source_ip: '10.0.5.12',
    destination_ip: '10.0.1.200',
    protocol: 'TCP',
    port: 3389,
    packet_size: 1514,
    attack_category: 'Backdoor',
    prediction: 'Backdoor',
    confidence: 91.5,
    risk_score: 84,
    severity: 'HIGH',
    priority: 'P2',
    status: 'Investigating',
    features: {
      dur: 8.5,
      sbytes: 1514,
      dbytes: 840,
      spkts: 18,
      dpkts: 12,
      service: 'rdp',
      state: 'CON',
      rate: 178.1,
      sttl: 128,
      dttl: 128
    },
    recommendation: 'Review internal host 10.0.5.12 for potential initial compromise; check security event logs (Event ID 4624/4625) on destination host.'
  },
  {
    id: 'evt-1088',
    timestamp: '15:23:01',
    source_ip: '198.51.100.19',
    destination_ip: '10.0.0.53',
    protocol: 'UDP',
    port: 53,
    packet_size: 512,
    attack_category: 'Analysis',
    prediction: 'Analysis',
    confidence: 89.4,
    risk_score: 68,
    severity: 'MEDIUM',
    priority: 'P2',
    status: 'Active',
    features: {
      dur: 0.8,
      sbytes: 512,
      dbytes: 512,
      spkts: 4,
      dpkts: 4,
      service: 'dns',
      state: 'INT',
      rate: 640.0,
      sttl: 64,
      dttl: 64
    },
    recommendation: 'Inspect DNS query resolution history on resolver 10.0.0.53; check domain entropy scores; review for covert channel data exfiltration.'
  },
  {
    id: 'evt-1087',
    timestamp: '15:22:50',
    source_ip: '45.154.255.8',
    destination_ip: '10.0.2.10',
    protocol: 'TCP',
    port: 443,
    packet_size: 2048,
    attack_category: 'Generic',
    prediction: 'Generic',
    confidence: 86.2,
    risk_score: 55,
    severity: 'MEDIUM',
    priority: 'P3',
    status: 'Active',
    features: {
      dur: 4.1,
      sbytes: 2048,
      dbytes: 1024,
      spkts: 10,
      dpkts: 8,
      service: 'ssl',
      state: 'FIN',
      rate: 499.5,
      sttl: 55,
      dttl: 64
    },
    recommendation: 'Review SSL certificate validation and renegotiation events; verify target host certificate bundle.'
  },
  {
    id: 'evt-1086',
    timestamp: '15:22:34',
    source_ip: '192.168.10.45',
    destination_ip: '192.168.10.1',
    protocol: 'ICMP',
    port: 0,
    packet_size: 84,
    attack_category: 'Fuzzers',
    prediction: 'Fuzzers',
    confidence: 88.0,
    risk_score: 42,
    severity: 'LOW',
    priority: 'P3',
    status: 'Active',
    features: {
      dur: 0.05,
      sbytes: 84,
      dbytes: 84,
      spkts: 2,
      dpkts: 2,
      service: 'icmp',
      state: 'CON',
      rate: 1680.0,
      sttl: 64,
      dttl: 64
    },
    recommendation: 'Review ICMP type/code fields; verify if probe originates from authorized network monitoring scanner.'
  },
  {
    id: 'evt-1085',
    timestamp: '15:22:15',
    source_ip: '10.0.3.50',
    destination_ip: '142.250.190.46',
    protocol: 'TCP',
    port: 443,
    packet_size: 1420,
    attack_category: 'Normal',
    prediction: 'Normal',
    confidence: 99.1,
    risk_score: 4,
    severity: 'BENIGN',
    priority: 'P4',
    status: 'Resolved',
    features: {
      dur: 35.2,
      sbytes: 1420,
      dbytes: 6540,
      spkts: 28,
      dpkts: 34,
      service: 'ssl',
      state: 'FIN',
      rate: 40.3,
      sttl: 64,
      dttl: 118
    },
    recommendation: 'Normal legitimate network traffic. No analyst action required.'
  },
  {
    id: 'evt-1084',
    timestamp: '15:21:58',
    source_ip: '10.0.3.72',
    destination_ip: '172.217.16.206',
    protocol: 'TCP',
    port: 443,
    packet_size: 1180,
    attack_category: 'Normal',
    prediction: 'Normal',
    confidence: 99.4,
    risk_score: 3,
    severity: 'BENIGN',
    priority: 'P4',
    status: 'Resolved',
    features: {
      dur: 18.4,
      sbytes: 1180,
      dbytes: 4230,
      spkts: 16,
      dpkts: 20,
      service: 'ssl',
      state: 'FIN',
      rate: 64.1,
      sttl: 64,
      dttl: 116
    },
    recommendation: 'Normal legitimate network traffic. No analyst action required.'
  },
  {
    id: 'evt-1083',
    timestamp: '15:21:40',
    source_ip: '103.245.222.10',
    destination_ip: '10.0.1.5',
    protocol: 'TCP',
    port: 445,
    packet_size: 3200,
    attack_category: 'Exploits',
    prediction: 'Exploits',
    confidence: 94.1,
    risk_score: 90,
    severity: 'CRITICAL',
    priority: 'P1',
    status: 'Active',
    features: {
      dur: 1.1,
      sbytes: 3200,
      dbytes: 400,
      spkts: 12,
      dpkts: 4,
      service: 'smb',
      state: 'FIN',
      rate: 2909.1,
      sttl: 60,
      dttl: 64
    },
    recommendation: 'Investigate SMBv1/v2 traffic; inspect endpoint at 10.0.1.5 for known MS17-010 EternalBlue vulnerability signatures; restrict port 445 access.'
  }
];

export const INITIAL_ALERTS = [
  {
    id: 'ALT-4081',
    title: 'Distributed Denial of Service (SYN Flood)',
    attack_category: 'DoS',
    severity: 'CRITICAL',
    priority: 'P1',
    source: '203.0.113.88',
    destination: '10.0.0.1 (Web Gateway)',
    port: 80,
    confidence: 98.2,
    risk: 94,
    timestamp: '15:23:38',
    status: 'Active',
    description: 'High-volume SYN flood targeting edge web gateway. Ingress bandwidth spiked above 45 Mbps with 9,840 pkt/sec.',
    recommendation: 'Investigate incoming SYN rates; review border load balancer SYN cookies posture; inspect upstream ISP mitigation options.'
  },
  {
    id: 'ALT-4080',
    title: 'Remote Command Injection Exploit Attempt',
    attack_category: 'Exploits',
    severity: 'CRITICAL',
    priority: 'P1',
    source: '185.220.101.5',
    destination: '10.0.2.45 (API Cluster)',
    port: 8080,
    confidence: 95.8,
    risk: 92,
    timestamp: '15:23:44',
    status: 'Active',
    description: 'Malformed HTTP payload targeting CVE-2023 command execution vectors in internal REST API gateway.',
    recommendation: 'Inspect affected web service at 10.0.2.45:8080; check web server logs for injected command syntax; review application patch level.'
  },
  {
    id: 'ALT-4079',
    title: 'Brute-Force SSH Credential Stuffing',
    attack_category: 'Reconnaissance',
    severity: 'HIGH',
    priority: 'P1',
    source: '198.51.100.42',
    destination: '10.0.1.15 (Bastion Host)',
    port: 22,
    confidence: 96.4,
    risk: 88,
    timestamp: '15:23:25',
    status: 'Investigating',
    description: 'Persistent automated authentication trials detected across multiple administrative usernames.',
    recommendation: 'Investigate source IP 198.51.100.42 for credential-stuffing attempts; review bastion SSH authentication logs; check for compromised accounts.'
  },
  {
    id: 'ALT-4078',
    title: 'Lateral Movement via Unauthorized RDP',
    attack_category: 'Backdoor',
    severity: 'HIGH',
    priority: 'P2',
    source: '10.0.5.12 (Internal Workstation)',
    destination: '10.0.1.200 (Domain Controller)',
    port: 3389,
    confidence: 91.5,
    risk: 84,
    timestamp: '15:23:12',
    status: 'Investigating',
    description: 'Internal workstation initiating direct RDP handshake with primary domain controller outside maintenance window.',
    recommendation: 'Review internal host 10.0.5.12 for potential initial compromise; check security event logs (Event ID 4624/4625) on destination host.'
  },
  {
    id: 'ALT-4077',
    title: 'Suspicious DNS Entropy Query Spike',
    attack_category: 'Analysis',
    severity: 'MEDIUM',
    priority: 'P2',
    source: '198.51.100.19',
    destination: '10.0.0.53 (Internal DNS)',
    port: 53,
    confidence: 89.4,
    risk: 68,
    timestamp: '15:23:01',
    status: 'Active',
    description: 'High rate of high-entropy TXT records queried against local nameserver, indicative of data tunneling.',
    recommendation: 'Inspect DNS query resolution history on resolver 10.0.0.53; check domain entropy scores; review for covert channel data exfiltration.'
  },
  {
    id: 'ALT-4076',
    title: 'Repeated ICMP Protocol Fuzzing',
    attack_category: 'Fuzzers',
    severity: 'LOW',
    priority: 'P3',
    source: '192.168.10.45',
    destination: '192.168.10.1 (Core Gateway)',
    port: 0,
    confidence: 88.0,
    risk: 42,
    timestamp: '15:22:34',
    status: 'Resolved',
    description: 'Abnormal ICMP echo request packets with variable padding payload lengths observed during audit.',
    recommendation: 'Review ICMP type/code fields; verify if probe originates from authorized network monitoring scanner.'
  }
];
