import { describe, it, expect } from "vitest";
import {
  ProcessActionSchema,
  NegativeTestSchema,
  manageGnbProcess,
  manageUeProcess,
  getProcessStates,
  runNegativeSlicingTest,
} from "./process-manager";

describe("Process Manager & Negative Slicing Engine", () => {
  it("validates process actions strictly", () => {
    expect(() => ProcessActionSchema.parse({ action: "start" })).not.toThrow();
    expect(() => ProcessActionSchema.parse({ action: "stop" })).not.toThrow();
    expect(() => ProcessActionSchema.parse({ action: "restart" as any })).toThrow();
  });

  it("validates negative test schema", () => {
    expect(() => NegativeTestSchema.parse({ sst: 3, sd: "000003" })).not.toThrow();
    expect(() => NegativeTestSchema.parse({ sst: 999 })).toThrow();
  });

  it("starts and stops gNB and UE states", async () => {
    const startGnb = await manageGnbProcess("start");
    expect(startGnb.running).toBe(true);

    const stopGnb = await manageGnbProcess("stop");
    expect(stopGnb.running).toBe(false);

    const states = getProcessStates();
    expect(states.gnb.running).toBe(false);

    // Reset back to running for demo
    await manageGnbProcess("start");
  });

  it("executes 3GPP negative slicing test and returns rejection cause code", async () => {
    const result = await runNegativeSlicingTest(3, "000003", "999700000000001");
    expect(result.verdict).toBe("REJECTED");
    expect(result.nasCause.causeCode).toBe(62);
    expect(result.rejectedNssai.length).toBe(1);
    expect(result.rejectedNssai[0].snssai).toContain("SST: 3 | SD: 000003");
    expect(result.allowedNssai.length).toBe(2);
    expect(result.logTraces.length).toBeGreaterThan(5);
  });
});
