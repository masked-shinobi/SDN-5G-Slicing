/**
 * 5G Network Slicing Educational Knowledge Base & 3GPP Standards References
 * Based on 3GPP TS 23.501, TS 23.502, and ITU-R IMT-2020 Recommendations.
 */

export interface StandardSliceDefinition {
  sst: number;
  name: string;
  fullName: string;
  standardBody: string;
  focus: string;
  targetKpi: {
    latency: string;
    throughput: string;
    reliability: string;
    density?: string;
    batteryLife?: string;
  };
  exampleUses: string[];
  color: string;
  badgeClass: string;
  borderClass: string;
}

export const STANDARD_SLICES: StandardSliceDefinition[] = [
  {
    sst: 1,
    name: "eMBB",
    fullName: "Enhanced Mobile Broadband",
    standardBody: "ITU-R IMT-2020 / 3GPP Rel-15",
    focus: "Ultra-fast data transfer, peak bandwidth, and wide-area uninterrupted coverage.",
    targetKpi: {
      throughput: "20 Gbps peak / 100 Mbps user-experienced",
      latency: "4 ms (user plane)",
      reliability: "99.9% (best-effort high speed)",
    },
    exampleUses: [
      "4K/8K UHD mobile streaming",
      "Cloud & edge VR/AR gaming",
      "High-density stadium connectivity",
      "Enterprise video collaboration",
    ],
    color: "#3b82f6",
    badgeClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    borderClass: "border-blue-500/30 hover:border-blue-500/60",
  },
  {
    sst: 2,
    name: "URLLC",
    fullName: "Ultra-Reliable Low-Latency Communication",
    standardBody: "ITU-R IMT-2020 / 3GPP Rel-15",
    focus: "Sub-millisecond data delivery with mission-critical packet delivery guarantee.",
    targetKpi: {
      latency: "0.5 - 1 ms (user plane)",
      throughput: "Deterministic 10-100 Mbps",
      reliability: "99.999% to 99.9999% (five-to-six 9s)",
    },
    exampleUses: [
      "Factory robotics & closed-loop motion control",
      "Remote telesurgery & tactile internet",
      "Smart electrical grid protection & synchrophasors",
      "Autonomous automated guided vehicles (AGV)",
    ],
    color: "#a855f7",
    badgeClass: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    borderClass: "border-purple-500/30 hover:border-purple-500/60",
  },
  {
    sst: 3,
    name: "MIoT / mMTC",
    fullName: "Massive IoT / Massive Machine-Type Comm.",
    standardBody: "3GPP Rel-15 (MIoT) / ITU-R (mMTC)",
    focus: "High device connection density with ultra-low power consumption and small, infrequent telemetry bursts.",
    targetKpi: {
      density: "Up to 1,000,000 devices / km²",
      batteryLife: "10-15+ years on AA battery",
      throughput: "Few Kbps to ~1 Mbps bursts",
      latency: "Tolerant (seconds to minutes)",
      reliability: "99%",
    },
    exampleUses: [
      "Smart city water & gas utility metering",
      "Agricultural soil & microclimate sensors",
      "Supply chain asset tracking & logistics",
      "Environmental pollution monitoring",
    ],
    color: "#10b981",
    badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    borderClass: "border-emerald-500/30 hover:border-emerald-500/60",
  },
  {
    sst: 4,
    name: "V2X",
    fullName: "Vehicle-to-Everything Communication",
    standardBody: "3GPP Rel-16 V2X",
    focus: "Direct and network-coordinated vehicular telematics, safety beaconing, and platooning.",
    targetKpi: {
      latency: "3 - 10 ms",
      reliability: "99.99%",
      throughput: "10 - 50 Mbps",
    },
    exampleUses: [
      "Cooperative autonomous driving & platooning",
      "Intersection collision avoidance warning",
      "Real-time sensor sharing between vehicles",
      "Tele-operated remote driving assistance",
    ],
    color: "#f59e0b",
    badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    borderClass: "border-amber-500/30 hover:border-amber-500/60",
  },
  {
    sst: 5,
    name: "HMTC",
    fullName: "High-performance Machine-Type Comm.",
    standardBody: "3GPP Rel-17 RedCap / HMTC",
    focus: "Mid-tier industrial IoT balancing cost, battery efficiency, and moderate throughput without full 5G NR complexity.",
    targetKpi: {
      throughput: "50 - 150 Mbps downlink",
      latency: "5 - 20 ms",
      reliability: "99.9%",
    },
    exampleUses: [
      "Industrial smart surveillance cameras",
      "Wearables (smart watches, AR glasses)",
      "High-end smart grid sensors",
    ],
    color: "#ec4899",
    badgeClass: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    borderClass: "border-pink-500/30 hover:border-pink-500/60",
  },
];

export interface NssaiCategoryInfo {
  category: "Subscribed" | "Configured" | "Requested" | "Allowed";
  whereStored: string;
  signalingRole: string;
  description: string;
  maxCount: number;
}

export const NSSAI_CATEGORIES: NssaiCategoryInfo[] = [
  {
    category: "Subscribed",
    whereStored: "UDM / UDR (Unified Data Repository)",
    signalingRole: "Reference ground truth for user subscription entitlement",
    description: "The set of S-NSSAIs that a subscriber is contractually allowed to access per PLMN. Stored in MongoDB open5gs.subscribers.",
    maxCount: 8,
  },
  {
    category: "Configured",
    whereStored: "UE ME / USIM (Home PLMN provisioned)",
    signalingRole: "Pre-configured baseline slices provisioned into device",
    description: "The list of S-NSSAIs configured in the UE by the serving network. Valid in the serving PLMN for which it was provided.",
    maxCount: 8,
  },
  {
    category: "Requested",
    whereStored: "Transmitted in NAS 5GS Registration Request",
    signalingRole: "What the mobile UE asks to use for this session",
    description: "The S-NSSAIs requested by the UE during initial registration. Must be a subset of Configured or Subscribed NSSAI.",
    maxCount: 8,
  },
  {
    category: "Allowed",
    whereStored: "Returned in NAS 5GS Registration Accept",
    signalingRole: "The officially authorized slices the UE may open PDU sessions with",
    description: "The S-NSSAIs authorized by the AMF/NSSF after verifying PLMN capability, cell coverage, and UDM subscription.",
    maxCount: 8,
  },
];

export interface DecodedSnssai {
  sst: number;
  sdHex: string;
  sdDec: number;
  snssaiString: string;
  sliceCategory: string;
  isStandardSst: boolean;
  wireOctets: string; // e.g. "0x01 0x00 0x00 0x01"
  totalBits: number;
  validationError?: string;
}

/**
 * Decodes and calculates 3GPP wire encoding for an SST and SD pair
 */
export function decodeSnssai(rawSst: number | string, rawSd?: string | number): DecodedSnssai {
  const sstNum = typeof rawSst === "number" ? rawSst : parseInt(String(rawSst), 10);
  
  if (isNaN(sstNum) || sstNum < 0 || sstNum > 255) {
    return {
      sst: 0,
      sdHex: "000000",
      sdDec: 0,
      snssaiString: "Invalid",
      sliceCategory: "Invalid SST (must be 0-255)",
      isStandardSst: false,
      wireOctets: "0x00",
      totalBits: 8,
      validationError: "SST must be an 8-bit integer between 0 and 255.",
    };
  }

  // Format SD
  let sdStr = "000000";
  let sdNum = 0;
  if (rawSd !== undefined && rawSd !== null && rawSd !== "") {
    const cleaned = String(rawSd).trim().replace(/^0x/i, "");
    sdStr = cleaned.padStart(6, "0").toUpperCase();
    if (!/^[0-9A-F]{1,6}$/i.test(cleaned)) {
      return {
        sst: sstNum,
        sdHex: "000000",
        sdDec: 0,
        snssaiString: `SST: ${sstNum}`,
        sliceCategory: "Invalid SD",
        isStandardSst: sstNum <= 4,
        wireOctets: `0x${sstNum.toString(16).padStart(2, "0").toUpperCase()}`,
        totalBits: 8,
        validationError: "SD must be a valid 24-bit hex value (up to 6 hex characters).",
      };
    }
    sdNum = parseInt(sdStr, 16);
  }

  const isStandard = sstNum >= 1 && sstNum <= 5;
  let category = "Operator-Specific Custom Slice";
  if (sstNum === 1) category = "eMBB (Enhanced Mobile Broadband)";
  else if (sstNum === 2) category = "URLLC (Ultra-Reliable Low-Latency Comm)";
  else if (sstNum === 3) category = "MIoT / mMTC (Massive IoT)";
  else if (sstNum === 4) category = "V2X (Vehicle-to-Everything)";
  else if (sstNum === 5) category = "HMTC (High-performance Machine Comm)";
  else if (sstNum >= 128 && sstNum <= 255) category = "Operator-Specific Private Enterprise Slice";

  const sstHex = sstNum.toString(16).padStart(2, "0").toUpperCase();
  const octet1 = sdStr.substring(0, 2);
  const octet2 = sdStr.substring(2, 4);
  const octet3 = sdStr.substring(4, 6);

  return {
    sst: sstNum,
    sdHex: sdStr,
    sdDec: sdNum,
    snssaiString: `SST: ${sstNum} | SD: ${sdStr}`,
    sliceCategory: category,
    isStandardSst: isStandard,
    wireOctets: `0x${sstHex} 0x${octet1} 0x${octet2} 0x${octet3}`,
    totalBits: 32,
  };
}
