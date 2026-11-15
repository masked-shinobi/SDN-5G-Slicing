import { describe, it, expect } from "vitest";
import { SIGNALING_STEPS } from "./signaling-flow";

describe("3GPP Signaling Flow Model", () => {
  it("contains all 6 mandatory registration and slice creation steps", () => {
    expect(SIGNALING_STEPS.length).toBe(6);
    expect(SIGNALING_STEPS[0].stepNumber).toBe(1);
    expect(SIGNALING_STEPS[5].stepNumber).toBe(6);
  });

  it("includes Requested NSSAI in step 1", () => {
    const step1 = SIGNALING_STEPS[0];
    const nssai = step1.informationElements.find((ie) => ie.name === "Requested NSSAI");
    expect(nssai).toBeDefined();
    expect(nssai?.value).toContain("SST: 1");
    expect(nssai?.value).toContain("SST: 2");
  });

  it("includes Allowed NSSAI in step 4", () => {
    const step4 = SIGNALING_STEPS[3];
    const allowed = step4.informationElements.find((ie) => ie.name.includes("Allowed NSSAI"));
    expect(allowed).toBeDefined();
    expect(allowed?.value).toContain("000001");
    expect(allowed?.value).toContain("000002");
  });

  it("establishes both uesimtun0 and uesimtun1 in step 6", () => {
    const step6 = SIGNALING_STEPS[5];
    const sliceA = step6.informationElements.find((ie) => ie.name.includes("Slice A Tunnel"));
    const sliceB = step6.informationElements.find((ie) => ie.name.includes("Slice B Tunnel"));
    expect(sliceA?.value).toContain("uesimtun0");
    expect(sliceA?.value).toContain("10.45.0.2");
    expect(sliceB?.value).toContain("uesimtun1");
    expect(sliceB?.value).toContain("10.46.0.2");
  });
});
