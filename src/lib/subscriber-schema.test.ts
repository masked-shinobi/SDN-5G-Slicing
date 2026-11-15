import { describe, it, expect } from "vitest";
import {
  ImsiSchema,
  SliceItemSchema,
  AddSliceSchema,
  DeleteSliceSchema,
} from "./subscriber-schema";
import {
  getSubscriber,
  addSliceToSubscriber,
  removeSliceFromSubscriber,
} from "./mongodb";

describe("Subscriber Schema & Validation", () => {
  it("validates valid 15-digit 3GPP IMSI", () => {
    expect(() => ImsiSchema.parse("999700000000001")).not.toThrow();
    expect(ImsiSchema.parse("999700000000001")).toBe("999700000000001");
  });

  it("rejects invalid IMSI with non-digits or wrong length", () => {
    expect(() => ImsiSchema.parse("12345")).toThrow("exactly 15 numeric digits");
    expect(() => ImsiSchema.parse("99970000000000A")).toThrow("exactly 15 numeric digits");
  });

  it("validates 3GPP slice with SST, 6-digit hex SD, and DNN", () => {
    const validSlice = {
      sst: 1,
      sd: "000001",
      dnn: "internet",
      default_indicator: true,
      ambrDownlink: "1 Gbps",
      ambrUplink: "500 Mbps",
      fiveQi: 9,
    };
    expect(() => SliceItemSchema.parse(validSlice)).not.toThrow();
  });

  it("rejects invalid SD format", () => {
    const invalidSlice = {
      sst: 1,
      sd: "XYZ", // Not 6-digit hex
      dnn: "internet",
    };
    expect(() => SliceItemSchema.parse(invalidSlice)).toThrow("6-digit hexadecimal");
  });

  it("validates AddSlice payload", () => {
    const payload = {
      imsi: "999700000000001",
      slice: {
        sst: 3,
        sd: "000003",
        dnn: "iot-network",
      },
    };
    expect(() => AddSliceSchema.parse(payload)).not.toThrow();
  });

  it("validates DeleteSlice payload", () => {
    const payload = {
      imsi: "999700000000001",
      sst: 3,
      sd: "000003",
    };
    expect(() => DeleteSliceSchema.parse(payload)).not.toThrow();
  });

  it("fetches default subscriber slices", async () => {
    const sub = await getSubscriber();
    expect(sub.imsi).toBe("999700000000001");
    expect(sub.slices.length).toBeGreaterThanOrEqual(2);
  });

  it("adds and removes slice dynamically in subscriber store", async () => {
    const newSlice = {
      sst: 4,
      sd: "000004",
      dnn: "v2x-telemetry",
      default_indicator: false,
      ipPool: "10.48.0.0/24",
      ambrDownlink: "50 Mbps",
      ambrUplink: "20 Mbps",
      fiveQi: 5,
    };

    const afterAdd = await addSliceToSubscriber("999700000000001", newSlice);
    const added = afterAdd.slices.find((s) => s.sst === 4 && s.sd === "000004");
    expect(added).toBeDefined();
    expect(added?.dnn).toBe("v2x-telemetry");

    const afterDelete = await removeSliceFromSubscriber("999700000000001", 4, "000004");
    const deleted = afterDelete.slices.find((s) => s.sst === 4 && s.sd === "000004");
    expect(deleted).toBeUndefined();
  });
});
