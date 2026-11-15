import { describe, it, expect } from "vitest";
import {
  LogQuerySchema,
  parseRawLogLine,
  get5gCoreLogs,
} from "./log-reader";

describe("Log Reader & 5G Event Parser", () => {
  it("validates log query schema defaults and limits", () => {
    expect(() => LogQuerySchema.parse({})).not.toThrow();
    const parsed = LogQuerySchema.parse({ service: "amf", limit: "50" });
    expect(parsed.service).toBe("amf");
    expect(parsed.limit).toBe(50);
  });

  it("identifies NSSAI and S-NSSAI in raw log lines", () => {
    const raw = "[amf] INFO: Registration Accept sent with Allowed NSSAI: [SST:1, SD:000001]";
    const parsed = parseRawLogLine(raw, "amf");
    expect(parsed).not.toBeNull();
    expect(parsed?.isNssaiRelated).toBe(true);
    expect(parsed?.tags).toContain("NSSAI");
    expect(parsed?.tags).toContain("Registration");
  });

  it("filters logs by NSSAI keyword", async () => {
    const logs = await get5gCoreLogs("all", "NSSAI");
    expect(logs.length).toBeGreaterThan(0);
    logs.forEach((log) => {
      const match =
        log.message.toLowerCase().includes("nssai") ||
        log.tags.some((t) => t.toLowerCase().includes("nssai"));
      expect(match).toBe(true);
    });
  });

  it("filters logs by service", async () => {
    const amfLogs = await get5gCoreLogs("amf");
    expect(amfLogs.length).toBeGreaterThan(0);
    amfLogs.forEach((l) => expect(l.service).toBe("amf"));

    const smfLogs = await get5gCoreLogs("smf");
    expect(smfLogs.length).toBeGreaterThan(0);
    smfLogs.forEach((l) => expect(l.service).toBe("smf"));
  });
});
