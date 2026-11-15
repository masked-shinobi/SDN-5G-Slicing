import { describe, it, expect } from "vitest";
import {
  PingRequestSchema,
  SLICE_INTERFACE_MAP,
  parsePingOutput,
  executeSlicePing,
} from "./ping-runner";

describe("Ping Runner & Output Parser", () => {
  it("validates allowed slice identifiers A and B", () => {
    expect(() => PingRequestSchema.parse({ slice: "A" })).not.toThrow();
    expect(() => PingRequestSchema.parse({ slice: "B" })).not.toThrow();
    expect(() => PingRequestSchema.parse({ slice: "C" as any })).toThrow();
  });

  it("maps Slice A to uesimtun0 and Slice B to uesimtun1", () => {
    expect(SLICE_INTERFACE_MAP.A.iface).toBe("uesimtun0");
    expect(SLICE_INTERFACE_MAP.A.pool).toBe("10.45.0.0/24");
    expect(SLICE_INTERFACE_MAP.B.iface).toBe("uesimtun1");
    expect(SLICE_INTERFACE_MAP.B.pool).toBe("10.46.0.0/24");
  });

  it("accurately parses Linux ping terminal output", () => {
    const rawOutput = `PING 8.8.8.8 (8.8.8.8) from uesimtun0: 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=14.21 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=13.88 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=117 time=15.10 ms
64 bytes from 8.8.8.8: icmp_seq=4 ttl=117 time=14.50 ms

--- 8.8.8.8 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 13.880/14.422/15.100/0.443 ms`;

    const parsed = parsePingOutput(rawOutput, "A", "uesimtun0", "8.8.8.8");
    expect(parsed.slice).toBe("A");
    expect(parsed.interface).toBe("uesimtun0");
    expect(parsed.packetsSent).toBe(4);
    expect(parsed.packetsReceived).toBe(4);
    expect(parsed.packetLossPercent).toBe(0);
    expect(parsed.rttMinMs).toBe(13.88);
    expect(parsed.rttAvgMs).toBe(14.422);
    expect(parsed.rttMaxMs).toBe(15.1);
    expect(parsed.rttMdevMs).toBe(0.443);
  });

  it("executes simulated ping for Slice A and Slice B successfully", async () => {
    const resA = await executeSlicePing("A", "8.8.8.8");
    expect(resA.slice).toBe("A");
    expect(resA.interface).toBe("uesimtun0");
    expect(resA.rttAvgMs).toBeGreaterThan(0);

    const resB = await executeSlicePing("B", "8.8.8.8");
    expect(resB.slice).toBe("B");
    expect(resB.interface).toBe("uesimtun1");
    expect(resB.rttAvgMs).toBeGreaterThan(0);
  });
});
