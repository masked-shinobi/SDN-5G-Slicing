import { SliceInfo, StandardSliceType } from "./types";

/**
 * Format Slice Differentiator (SD) to 6-hex-digit representation
 * Example: 1 -> "000001", "1" -> "000001", "000002" -> "000002"
 */
export function formatSd(sd: string | number | undefined): string {
  if (sd === undefined || sd === null || sd === "") return "000000";
  const str = String(sd).trim().replace(/^0x/i, "");
  return str.padStart(6, "0").toUpperCase();
}

/**
 * Parse SD from 6-digit hex string or number to integer
 */
export function parseSd(sd: string | number): number {
  if (typeof sd === "number") return sd;
  return parseInt(sd, 16) || 0;
}

/**
 * Formats SST and SD into standard 3GPP S-NSSAI string representation
 * Example: SST 1, SD "000001" -> "SST: 1 / SD: 000001"
 */
export function formatSnssai(sst: number, sd?: string | number): string {
  const formattedSd = formatSd(sd);
  return `SST: ${sst} | SD: ${formattedSd}`;
}

/**
 * Classifies 3GPP SST number into standardized slice category
 * SST 1 = eMBB (Enhanced Mobile Broadband)
 * SST 2 = URLLC (Ultra-Reliable Low-Latency Communication)
 * SST 3 = MIoT / mMTC (Massive IoT / Machine Type Comm)
 * SST 4 = V2X (Vehicle-to-Everything)
 */
export function getSliceTypeBySst(sst: number): StandardSliceType {
  switch (sst) {
    case 1:
      return "eMBB";
    case 2:
      return "URLLC";
    case 3:
      return "mMTC";
    case 4:
      return "V2X";
    default:
      return "Custom";
  }
}

/**
 * Default slices configured for this project
 */
export const DEFAULT_SLICES: SliceInfo[] = [
  {
    id: "A",
    name: "Slice A (eMBB)",
    type: "eMBB",
    sst: 1,
    sd: "000001",
    snssai: "SST: 1 | SD: 000001",
    dnn: "internet",
    ipPool: "10.45.0.0/24",
    assignedIp: "10.45.0.2",
    interface: "uesimtun0",
    status: "active",
    description: "Enhanced Mobile Broadband for high-throughput 4K video, cloud gaming, and general high-bandwidth data.",
    targetKpi: {
      latency: "~10-20 ms",
      throughput: "Up to 1-20 Gbps",
      reliability: "99.9%",
    },
  },
  {
    id: "B",
    name: "Slice B (URLLC)",
    type: "URLLC",
    sst: 2,
    sd: "000002",
    snssai: "SST: 2 | SD: 000002",
    dnn: "internet2",
    ipPool: "10.46.0.0/24",
    assignedIp: "10.46.0.2",
    interface: "uesimtun1",
    status: "active",
    description: "Ultra-Reliable Low-Latency Communication for industrial automation, robotics, and critical tele-operations.",
    targetKpi: {
      latency: "< 1 ms target",
      throughput: "Deterministic 10-100 Mbps",
      reliability: "99.999%",
    },
  },
];
