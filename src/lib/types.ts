// 5G Network Slicing & Open5GS Types

export type StandardSliceType = "eMBB" | "URLLC" | "mMTC" | "V2X" | "Custom";

export interface SliceInfo {
  id: "A" | "B" | string;
  name: string;
  type: StandardSliceType;
  sst: number; // Slice/Service Type: 1 (eMBB), 2 (URLLC), 3 (MIoT/mMTC), 4 (V2X)
  sd: string;  // Slice Differentiator (e.g., "000001", "000002")
  snssai: string; // Formatted SST-SD, e.g., "1-000001"
  dnn: string; // Data Network Name: "internet", "internet2"
  ipPool: string; // e.g. "10.45.0.0/24"
  assignedIp?: string; // e.g. "10.45.0.2"
  interface: string; // "uesimtun0", "uesimtun1"
  status: "active" | "inactive" | "degraded";
  description: string;
  targetKpi: {
    latency: string;
    throughput: string;
    reliability: string;
  };
}

export interface ServiceHealth {
  name: string;
  role: string;
  status: "active" | "inactive" | "failed" | "unknown";
  description: string;
}

export interface SystemMetrics {
  timestamp: string;
  coreHealth: "healthy" | "warning" | "offline";
  activeSubscribers: number;
  activePduSessions: number;
  gnbConnected: boolean;
  ueRegistered: boolean;
  services: ServiceHealth[];
  slices: SliceInfo[];
}

export interface PingResult {
  slice: "A" | "B";
  interface: string;
  target: string;
  packetsSent: number;
  packetsReceived: number;
  packetLossPercent: number;
  rttMinMs: number;
  rttAvgMs: number;
  rttMaxMs: number;
  rttMdevMs: number;
  rawOutput: string;
  timestamp: string;
}
