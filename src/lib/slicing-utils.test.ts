import { describe, it, expect } from "vitest";
import {
  formatSd,
  parseSd,
  formatSnssai,
  getSliceTypeBySst,
  DEFAULT_SLICES,
} from "./slicing-utils";

describe("5G Slicing Utilities", () => {
  it("formats SD into 6-digit hex string with leading zeros", () => {
    expect(formatSd(1)).toBe("000001");
    expect(formatSd("1")).toBe("000001");
    expect(formatSd("000002")).toBe("000002");
    expect(formatSd("0x00000A")).toBe("00000A");
    expect(formatSd(undefined)).toBe("000000");
  });

  it("parses SD hex string to integer", () => {
    expect(parseSd("000001")).toBe(1);
    expect(parseSd("00000A")).toBe(10);
    expect(parseSd(2)).toBe(2);
  });

  it("formats standard S-NSSAI string", () => {
    expect(formatSnssai(1, "000001")).toBe("SST: 1 | SD: 000001");
    expect(formatSnssai(2, 2)).toBe("SST: 2 | SD: 000002");
  });

  it("maps SST numbers to 3GPP slice categories", () => {
    expect(getSliceTypeBySst(1)).toBe("eMBB");
    expect(getSliceTypeBySst(2)).toBe("URLLC");
    expect(getSliceTypeBySst(3)).toBe("mMTC");
    expect(getSliceTypeBySst(4)).toBe("V2X");
    expect(getSliceTypeBySst(99)).toBe("Custom");
  });

  it("contains default project slices A and B", () => {
    expect(DEFAULT_SLICES.length).toBe(2);
    expect(DEFAULT_SLICES[0].interface).toBe("uesimtun0");
    expect(DEFAULT_SLICES[0].sst).toBe(1);
    expect(DEFAULT_SLICES[1].interface).toBe("uesimtun1");
    expect(DEFAULT_SLICES[1].sst).toBe(2);
  });
});
