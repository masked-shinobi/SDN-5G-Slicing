import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("OpenAPI 3.0 Specification Validation", () => {
  it("verifies openapi.yaml exists in project root", () => {
    const openapiPath = path.join(process.cwd(), "openapi.yaml");
    expect(fs.existsSync(openapiPath)).toBe(true);
    const content = fs.readFileSync(openapiPath, "utf-8");
    expect(content.length).toBeGreaterThan(500);
  });

  it("contains all required 5G slicing bridge API endpoints", () => {
    const openapiPath = path.join(process.cwd(), "openapi.yaml");
    const content = fs.readFileSync(openapiPath, "utf-8");

    const requiredEndpoints = [
      "/api/status",
      "/api/slices",
      "/api/subscribers",
      "/api/ping",
      "/api/gnb",
      "/api/ue",
      "/api/test-lab/negative",
      "/api/logs",
    ];

    for (const endpoint of requiredEndpoints) {
      expect(content).toContain(endpoint);
    }
  });

  it("specifies correct 3GPP parameters and cause codes", () => {
    const openapiPath = path.join(process.cwd(), "openapi.yaml");
    const content = fs.readFileSync(openapiPath, "utf-8");

    expect(content).toContain("uesimtun0");
    expect(content).toContain("uesimtun1");
    expect(content).toContain("999700000000001");
    expect(content).toContain("3GPP 5GMM Cause #62");
  });
});
