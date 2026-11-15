import { execFile } from "child_process";
import { promisify } from "util";
import { z } from "zod";
import { isLinuxEnvironment } from "./command-runner";
import { PingResult } from "./types";

const execFileAsync = promisify(execFile);

/**
 * Zod schema for ping execution requests
 */
export const PingRequestSchema = z.object({
  slice: z.enum(["A", "B"]),
  target: z.string().regex(/^[\w.-]+$/, "Invalid target host").default("8.8.8.8"),
});

export type PingRequest = z.infer<typeof PingRequestSchema>;

/**
 * Strict allow-list mapping of slices to virtual interfaces
 */
export const SLICE_INTERFACE_MAP: Record<"A" | "B", { iface: "uesimtun0" | "uesimtun1"; pool: string; dnn: string }> = {
  A: {
    iface: "uesimtun0",
    pool: "10.45.0.0/24",
    dnn: "internet",
  },
  B: {
    iface: "uesimtun1",
    pool: "10.46.0.0/24",
    dnn: "internet2",
  },
};

/**
 * Parse standard Linux ping terminal output into structured metrics
 */
export function parsePingOutput(rawOutput: string, slice: "A" | "B", iface: string, target: string): PingResult {
  let packetsSent = 4;
  let packetsReceived = 4;
  let packetLossPercent = 0;
  let rttMinMs = 0;
  let rttAvgMs = 0;
  let rttMaxMs = 0;
  let rttMdevMs = 0;

  // Example: 4 packets transmitted, 4 received, 0% packet loss, time 3004ms
  const statsMatch = rawOutput.match(/(\d+)\s+packets transmitted,\s+(\d+)\s+(?:packets\s+)?received,\s+([\d.]+)%\s+packet loss/i);
  if (statsMatch) {
    packetsSent = parseInt(statsMatch[1], 10);
    packetsReceived = parseInt(statsMatch[2], 10);
    packetLossPercent = parseFloat(statsMatch[3]);
  }

  // Example: rtt min/avg/max/mdev = 12.431/15.228/18.910/2.411 ms
  const rttMatch = rawOutput.match(/(?:rtt|round-trip)\s+min\/avg\/max\/(?:mdev|stddev)\s*=\s*([\d.]+)\/([\d.]+)\/([\d.]+)\/([\d.]+)\s*ms/i);
  if (rttMatch) {
    rttMinMs = parseFloat(rttMatch[1]);
    rttAvgMs = parseFloat(rttMatch[2]);
    rttMaxMs = parseFloat(rttMatch[3]);
    rttMdevMs = parseFloat(rttMatch[4]);
  }

  return {
    slice,
    interface: iface,
    target,
    packetsSent,
    packetsReceived,
    packetLossPercent,
    rttMinMs,
    rttAvgMs,
    rttMaxMs,
    rttMdevMs,
    rawOutput,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate simulated authentic ping output when outside Linux host
 */
function generateMockPingOutput(slice: "A" | "B", iface: string, target: string): string {
  // Slice A (eMBB) baseline ~14ms; Slice B (URLLC) baseline ~12ms with minor variance
  const base = slice === "A" ? 14.2 : 12.1;
  const seq1 = (base + (Math.random() * 2 - 1)).toFixed(2);
  const seq2 = (base + (Math.random() * 2 - 1)).toFixed(2);
  const seq3 = (base + (Math.random() * 2 - 1)).toFixed(2);
  const seq4 = (base + (Math.random() * 2 - 1)).toFixed(2);

  const samples = [parseFloat(seq1), parseFloat(seq2), parseFloat(seq3), parseFloat(seq4)];
  const min = Math.min(...samples).toFixed(3);
  const max = Math.max(...samples).toFixed(3);
  const avg = (samples.reduce((a, b) => a + b, 0) / 4).toFixed(3);
  const mdev = (Math.abs(parseFloat(max) - parseFloat(min)) / 2).toFixed(3);

  return `PING ${target} (${target}) from ${iface}: 56(84) bytes of data.
64 bytes from ${target}: icmp_seq=1 ttl=117 time=${seq1} ms
64 bytes from ${target}: icmp_seq=2 ttl=117 time=${seq2} ms
64 bytes from ${target}: icmp_seq=3 ttl=117 time=${seq3} ms
64 bytes from ${target}: icmp_seq=4 ttl=117 time=${seq4} ms

--- ${target} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = ${min}/${avg}/${max}/${mdev} ms`;
}

/**
 * Execute ping strictly through allow-listed interface
 */
export async function executeSlicePing(slice: "A" | "B", target: string = "8.8.8.8"): Promise<PingResult> {
  const config = SLICE_INTERFACE_MAP[slice];
  if (!config) {
    throw new Error(`Slice '${slice}' is not authorized.`);
  }

  const iface = config.iface;

  if (!isLinuxEnvironment()) {
    // Generate realistic simulated ping
    const mockOutput = generateMockPingOutput(slice, iface, target);
    return parsePingOutput(mockOutput, slice, iface, target);
  }

  try {
    // Strictly invoke ping -I <iface> -c 4 <target> via execFile with argument array
    const { stdout, stderr } = await execFileAsync("ping", ["-I", iface, "-c", "4", target], {
      timeout: 10000,
    });
    return parsePingOutput(stdout || stderr, slice, iface, target);
  } catch (error: any) {
    if (error && typeof error.stdout === "string" && error.stdout.includes("ping statistics")) {
      return parsePingOutput(error.stdout, slice, iface, target);
    }
    throw new Error(error?.message || `Failed to execute ping on interface ${iface}`);
  }
}
