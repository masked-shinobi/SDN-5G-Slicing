import { describe, it, expect } from "vitest";
import {
  ALLOWED_SERVICES,
  ALLOWED_INTERFACES,
  getServiceStatus,
  getInterfaceIp,
  getAllCoreServicesHealth,
  getActiveSlices,
} from "./command-runner";

describe("Command Runner & Security Allow-lists", () => {
  it("defines all 10 required Open5GS and database services", () => {
    expect(ALLOWED_SERVICES).toContain("open5gs-amfd");
    expect(ALLOWED_SERVICES).toContain("open5gs-smfd");
    expect(ALLOWED_SERVICES).toContain("open5gs-upfd");
    expect(ALLOWED_SERVICES).toContain("mongod");
    expect(ALLOWED_SERVICES.length).toBe(10);
  });

  it("defines both slice virtual interfaces uesimtun0 and uesimtun1", () => {
    expect(ALLOWED_INTERFACES).toContain("uesimtun0");
    expect(ALLOWED_INTERFACES).toContain("uesimtun1");
    expect(ALLOWED_INTERFACES.length).toBe(2);
  });

  it("rejects unauthorized services with security exception", async () => {
    await expect(getServiceStatus("apache2" as any)).rejects.toThrow(
      "not in the security allow-list"
    );
  });

  it("rejects unauthorized network interfaces with security exception", async () => {
    await expect(getInterfaceIp("eth0" as any)).rejects.toThrow(
      "not in the security allow-list"
    );
  });

  it("returns core health information with 3GPP network function roles", async () => {
    const services = await getAllCoreServicesHealth();
    expect(services.length).toBe(10);
    const amf = services.find((s) => s.role === "AMF");
    expect(amf).toBeDefined();
    expect(amf?.name).toBe("open5gs-amfd");
  });

  it("retrieves active slices with assigned IP pools", async () => {
    const slices = await getActiveSlices();
    expect(slices.length).toBe(2);
    expect(slices[0].dnn).toBe("internet");
    expect(slices[0].ipPool).toBe("10.45.0.0/24");
    expect(slices[1].dnn).toBe("internet2");
    expect(slices[1].ipPool).toBe("10.46.0.0/24");
  });
});
