import { describe, it, expect } from "vitest";
import { decodeSnssai, STANDARD_SLICES, NSSAI_CATEGORIES } from "./learn-data";

describe("5G Learn Knowledge Base & S-NSSAI Decoder", () => {
  it("provides standard slice definitions for eMBB, URLLC, MIoT, V2X, HMTC", () => {
    expect(STANDARD_SLICES).toHaveLength(5);
    const embb = STANDARD_SLICES.find((s) => s.sst === 1);
    expect(embb).toBeDefined();
    expect(embb?.name).toBe("eMBB");

    const urllc = STANDARD_SLICES.find((s) => s.sst === 2);
    expect(urllc).toBeDefined();
    expect(urllc?.name).toBe("URLLC");

    const miot = STANDARD_SLICES.find((s) => s.sst === 3);
    expect(miot).toBeDefined();
    expect(miot?.name).toContain("MIoT");
  });

  it("provides 4 NSSAI categories matching 3GPP TS 23.501", () => {
    expect(NSSAI_CATEGORIES).toHaveLength(4);
    const categories = NSSAI_CATEGORIES.map((c) => c.category);
    expect(categories).toEqual(["Subscribed", "Configured", "Requested", "Allowed"]);
  });

  it("decodes valid Slice A (SST=1, SD=000001) into 3GPP wire representation", () => {
    const decoded = decodeSnssai(1, "000001");
    expect(decoded.sst).toBe(1);
    expect(decoded.sdHex).toBe("000001");
    expect(decoded.sdDec).toBe(1);
    expect(decoded.wireOctets).toBe("0x01 0x00 0x00 0x01");
    expect(decoded.totalBits).toBe(32);
    expect(decoded.isStandardSst).toBe(true);
    expect(decoded.sliceCategory).toContain("eMBB");
  });

  it("decodes valid Slice B (SST=2, SD=000002) correctly", () => {
    const decoded = decodeSnssai(2, "000002");
    expect(decoded.sst).toBe(2);
    expect(decoded.sdHex).toBe("000002");
    expect(decoded.sdDec).toBe(2);
    expect(decoded.wireOctets).toBe("0x02 0x00 0x00 0x02");
    expect(decoded.sliceCategory).toContain("URLLC");
  });

  it("handles operator-specific private slice (SST=130, SD=ABCDEF)", () => {
    const decoded = decodeSnssai(130, "ABCDEF");
    expect(decoded.sst).toBe(130);
    expect(decoded.sdHex).toBe("ABCDEF");
    expect(decoded.wireOctets).toBe("0x82 0xAB 0xCD 0xEF");
    expect(decoded.isStandardSst).toBe(false);
    expect(decoded.sliceCategory).toContain("Operator-Specific");
  });

  it("handles invalid SST gracefully", () => {
    const decoded = decodeSnssai(300, "000001");
    expect(decoded.validationError).toBeDefined();
    expect(decoded.validationError).toContain("8-bit integer between 0 and 255");
  });

  it("handles invalid SD gracefully", () => {
    const decoded = decodeSnssai(1, "NOT_HEX");
    expect(decoded.validationError).toBeDefined();
    expect(decoded.validationError).toContain("24-bit hex");
  });
});
