import { describe, it, expect } from "vitest";
import {
  SLICE_QOS_PROFILES,
  generateThroughputBenchmark,
} from "./qos-throughput";

describe("5G QoS Profiles (5QI) and Throughput Benchmark Engine", () => {
  it("defines standard 3GPP QoS profile for Slice A (eMBB 5QI=9)", () => {
    const profileA = SLICE_QOS_PROFILES["A"];
    expect(profileA.fiveQi).toBe(9);
    expect(profileA.resourceType).toBe("Non-GBR");
    expect(profileA.defaultAmbr.downlinkMbps).toBeGreaterThanOrEqual(100);
    expect(profileA.packetDelayBudgetMs).toBe(300);
  });

  it("defines standard 3GPP QoS profile for Slice B (URLLC 5QI=82)", () => {
    const profileB = SLICE_QOS_PROFILES["B"];
    expect(profileB.fiveQi).toBe(82);
    expect(profileB.resourceType).toBe("Delay-critical GBR");
    expect(profileB.packetDelayBudgetMs).toBe(10);
    expect(profileB.defaultAmbr.downlinkMbps).toBe(50);
  });

  it("generates 6-second throughput benchmark for Slice A", () => {
    const benchmark = generateThroughputBenchmark("A", 6);
    expect(benchmark.sliceId).toBe("A");
    expect(benchmark.interfaceName).toBe("uesimtun0");
    expect(benchmark.intervals).toHaveLength(6);
    expect(benchmark.summary.avgThroughputMbps).toBeGreaterThan(50);
    expect(benchmark.summary.peakThroughputMbps).toBeGreaterThan(benchmark.summary.minThroughputMbps);
  });

  it("generates deterministic low-jitter benchmark for Slice B", () => {
    const benchmark = generateThroughputBenchmark("B", 6);
    expect(benchmark.sliceId).toBe("B");
    expect(benchmark.interfaceName).toBe("uesimtun1");
    expect(benchmark.intervals).toHaveLength(6);
    // URLLC jitter must be ultra low (< 1ms)
    expect(benchmark.summary.avgJitterMs).toBeLessThan(1.0);
    // URLLC packet loss must be 0%
    expect(benchmark.summary.packetLossPercent).toBe(0.0);
  });
});
