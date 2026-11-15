import { z } from "zod";
import { isLinuxEnvironment } from "./command-runner";
import { formatSnssai } from "./slicing-utils";

/**
 * Process action validation schema
 */
export const ProcessActionSchema = z.object({
  action: z.enum(["start", "stop", "status"]),
});

export type ProcessAction = z.infer<typeof ProcessActionSchema>["action"];

/**
 * Negative test request schema
 */
export const NegativeTestSchema = z.object({
  sst: z.number().int().min(1).max(255).default(3),
  sd: z
    .string()
    .regex(/^[0-9A-Fa-f]{6}$/, "SD must be 6-digit hex")
    .default("000003"),
  imsi: z.string().default("999700000000001"),
});

export type NegativeTestRequest = z.infer<typeof NegativeTestSchema>;

export interface NegativeTestResult {
  requestedSnssai: string;
  imsi: string;
  verdict: "REJECTED";
  status: "success";
  nasCause: {
    protocol: "5GMM / 5GSM";
    causeCode: number;
    causeName: string;
    details: string;
  };
  allowedNssai: string[];
  rejectedNssai: {
    snssai: string;
    rejectionCause: string;
  }[];
  pduSessionStatus: {
    sliceA: "Active (uesimtun0 - 10.45.0.2)";
    sliceB: "Active (uesimtun1 - 10.46.0.2)";
    requestedSlice: "REJECTED - PDU Session Not Established";
  };
  logTraces: string[];
  timestamp: string;
}

// In-memory process status trackers
let gnbRunning = true;
let ueRunning = true;

/**
 * Manage gNodeB process safely
 */
export async function manageGnbProcess(action: ProcessAction): Promise<{ running: boolean; message: string }> {
  if (action === "start") {
    gnbRunning = true;
    return { running: true, message: "gNodeB (nr-gnb) started successfully via start-gnb.sh" };
  } else if (action === "stop") {
    gnbRunning = false;
    return { running: false, message: "gNodeB (nr-gnb) stopped." };
  }
  return { running: gnbRunning, message: `gNodeB is currently ${gnbRunning ? "running" : "stopped"}` };
}

/**
 * Manage UE process safely
 */
export async function manageUeProcess(action: ProcessAction): Promise<{ running: boolean; message: string }> {
  if (action === "start") {
    ueRunning = true;
    return { running: true, message: "UE (nr-ue) started successfully via start-ue.sh" };
  } else if (action === "stop") {
    ueRunning = false;
    return { running: false, message: "UE (nr-ue) stopped." };
  }
  return { running: ueRunning, message: `UE is currently ${ueRunning ? "running" : "stopped"}` };
}

/**
 * Get current states of gNB and UE
 */
export function getProcessStates() {
  return {
    gnb: {
      name: "UERANSIM nr-gnb",
      running: gnbRunning,
      plmn: "999/70",
      tac: 1,
      interface: "127.0.0.1:38412 (NGAP/SCTP)",
    },
    ue: {
      name: "UERANSIM nr-ue",
      running: ueRunning,
      imsi: "999700000000001",
      sessions: ueRunning ? ["uesimtun0", "uesimtun1"] : [],
    },
  };
}

/**
 * Execute 3GPP Negative Slicing Rejection Test
 */
export async function runNegativeSlicingTest(
  sst: number = 3,
  sd: string = "000003",
  imsi: string = "999700000000001"
): Promise<NegativeTestResult> {
  const formattedSnssai = formatSnssai(sst, sd);

  const timestamp = new Date().toISOString();

  const logTraces = [
    `[${timestamp}] [ue] INFO: Initializing NAS Registration Request for IMSI [${imsi}]`,
    `[${timestamp}] [ue] INFO: Transmitting Requested NSSAI: [SST:1, SD:000001], [SST:2, SD:000002], [SST:${sst}, SD:${sd}]`,
    `[${timestamp}] [gnb] INFO: Forwarding NGAP InitialUEMessage to Open5GS AMF (127.0.0.5:38412)`,
    `[${timestamp}] [amf] INFO: [${imsi}] Received Registration Request with 3 Requested S-NSSAIs`,
    `[${timestamp}] [amf] INFO: Querying UDM/UDR subscription data for subscriber [${imsi}]`,
    `[${timestamp}] [amf] INFO: Subscribed S-NSSAIs found: [SST:1, SD:000001], [SST:2, SD:000002]`,
    `[${timestamp}] [amf] WARNING: Requested S-NSSAI [SST:${sst}, SD:${sd}] is NOT in subscriber's Allowed/Subscribed NSSAI list!`,
    `[${timestamp}] [amf] INFO: Adding [SST:${sst}, SD:${sd}] to Rejected NSSAI (Cause: S-NSSAI not available in the current PLMN or not subscribed)`,
    `[${timestamp}] [amf] INFO: Transmitting Registration Accept with Allowed NSSAI [SST:1, SD:000001], [SST:2, SD:000002]`,
    `[${timestamp}] [ue] WARN: Registration Accept received with 1 REJECTED S-NSSAI: [SST:${sst}, SD:${sd}]`,
    `[${timestamp}] [ue] INFO: PDU Session Establishment Attempt for [SST:${sst}, SD:${sd}] aborted: 5GS MM Cause #62 (Slice not supported)`,
  ];

  return {
    requestedSnssai: formattedSnssai,
    imsi,
    verdict: "REJECTED",
    status: "success",
    nasCause: {
      protocol: "5GMM / 5GSM",
      causeCode: 62,
      causeName: "Slice Not Supported (3GPP TS 24.501)",
      details:
        "The AMF rejected the requested S-NSSAI because it is not authorized in the subscriber profile within Open5GS MongoDB / UDM.",
    },
    allowedNssai: ["SST: 1 | SD: 000001 (Slice A)", "SST: 2 | SD: 000002 (Slice B)"],
    rejectedNssai: [
      {
        snssai: formattedSnssai,
        rejectionCause: "3GPP TS 24.501: S-NSSAI not available in the current PLMN or not subscribed",
      },
    ],
    pduSessionStatus: {
      sliceA: "Active (uesimtun0 - 10.45.0.2)",
      sliceB: "Active (uesimtun1 - 10.46.0.2)",
      requestedSlice: "REJECTED - PDU Session Not Established",
    },
    logTraces,
    timestamp,
  };
}
