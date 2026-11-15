import { execFile } from "child_process";
import { promisify } from "util";
import { DEFAULT_SLICES } from "./slicing-utils";
import { ServiceHealth, SliceInfo } from "./types";

const execFileAsync = promisify(execFile);

/**
 * Allow-listed Open5GS systemd services
 */
export const ALLOWED_SERVICES = [
  "open5gs-amfd",
  "open5gs-smfd",
  "open5gs-upfd",
  "open5gs-nrfd",
  "open5gs-udmd",
  "open5gs-udrd",
  "open5gs-pcfd",
  "open5gs-nssfd",
  "open5gs-ausfd",
  "mongod",
] as const;

export type AllowedService = (typeof ALLOWED_SERVICES)[number];

/**
 * Allow-listed 5G interfaces
 */
export const ALLOWED_INTERFACES = ["uesimtun0", "uesimtun1"] as const;
export type AllowedInterface = (typeof ALLOWED_INTERFACES)[number];

/**
 * Check if running on a native Linux host with systemctl
 */
export function isLinuxEnvironment(): boolean {
  return process.platform === "linux";
}

/**
 * Query systemd service status safely using execFile
 */
export async function getServiceStatus(service: AllowedService): Promise<"active" | "inactive" | "failed" | "unknown"> {
  if (!ALLOWED_SERVICES.includes(service)) {
    throw new Error(`Service '${service}' is not in the security allow-list.`);
  }

  if (!isLinuxEnvironment()) {
    // Non-Linux or development fallback: returns active for authentic simulation
    return "active";
  }

  try {
    const { stdout } = await execFileAsync("systemctl", ["is-active", service]);
    const trimmed = stdout.trim();
    if (trimmed === "active") return "active";
    if (trimmed === "inactive") return "inactive";
    if (trimmed === "failed") return "failed";
    return "unknown";
  } catch (error: any) {
    if (error && typeof error.stdout === "string" && error.stdout.trim() === "inactive") {
      return "inactive";
    }
    return "inactive";
  }
}

/**
 * Check health of all Open5GS core services
 */
export async function getAllCoreServicesHealth(): Promise<ServiceHealth[]> {
  const serviceRoles: Record<AllowedService, { role: string; description: string }> = {
    "open5gs-amfd": { role: "AMF", description: "Access and Mobility Management Function (NAS signaling & Registration)" },
    "open5gs-smfd": { role: "SMF", description: "Session Management Function (PDU Session & S-NSSAI selection)" },
    "open5gs-upfd": { role: "UPF", description: "User Plane Function (GTP-U packet routing & tunnel termination)" },
    "open5gs-nrfd": { role: "NRF", description: "Network Repository Function (Service discovery & registration)" },
    "open5gs-udmd": { role: "UDM", description: "Unified Data Management (Subscriber authentication & credential management)" },
    "open5gs-udrd": { role: "UDR", description: "Unified Data Repository (Database backend for subscription data)" },
    "open5gs-pcfd": { role: "PCF", description: "Policy Control Function (QoS flow control & slicing policy)" },
    "open5gs-nssfd": { role: "NSSF", description: "Network Slice Selection Function (Allowed NSSAI assistance)" },
    "open5gs-ausfd": { role: "AUSF", description: "Authentication Server Function (5G AKA authentication vectors)" },
    "mongod": { role: "MongoDB", description: "Open5GS subscriber database store" },
  };

  const results: ServiceHealth[] = [];

  for (const service of ALLOWED_SERVICES) {
    const status = await getServiceStatus(service);
    const meta = serviceRoles[service];
    results.push({
      name: service,
      role: meta.role,
      status,
      description: meta.description,
    });
  }

  return results;
}

/**
 * Read IP address assigned to a specific slice interface
 */
export async function getInterfaceIp(iface: AllowedInterface): Promise<string | undefined> {
  if (!ALLOWED_INTERFACES.includes(iface)) {
    throw new Error(`Interface '${iface}' is not in the security allow-list.`);
  }

  if (!isLinuxEnvironment()) {
    return iface === "uesimtun0" ? "10.45.0.2" : "10.46.0.2";
  }

  try {
    const { stdout } = await execFileAsync("ip", ["-4", "addr", "show", iface]);
    const match = stdout.match(/inet\s+(\d+\.\d+\.\d+\.\d+)/);
    return match ? match[1] : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Fetch slices merged with real or simulated interface states
 */
export async function getActiveSlices(): Promise<SliceInfo[]> {
  const slices = [...DEFAULT_SLICES];

  for (const slice of slices) {
    const iface = slice.interface as AllowedInterface;
    const ip = await getInterfaceIp(iface);
    if (ip) {
      slice.assignedIp = ip;
      slice.status = "active";
    } else {
      slice.status = isLinuxEnvironment() ? "inactive" : "active";
    }
  }

  return slices;
}
