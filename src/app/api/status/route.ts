import { NextResponse } from "next/server";
import { getAllCoreServicesHealth, getActiveSlices } from "@/lib/command-runner";
import { SystemMetrics } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await getAllCoreServicesHealth();
    const slices = await getActiveSlices();

    const activeServicesCount = services.filter((s) => s.status === "active").length;
    let coreHealth: "healthy" | "warning" | "offline" = "healthy";

    if (activeServicesCount === 0) {
      coreHealth = "offline";
    } else if (activeServicesCount < services.length) {
      coreHealth = "warning";
    }

    const responseData: SystemMetrics = {
      timestamp: new Date().toISOString(),
      coreHealth,
      activeSubscribers: 1,
      activePduSessions: slices.filter((s) => s.status === "active").length,
      gnbConnected: true,
      ueRegistered: true,
      services,
      slices,
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to query 5G Core system status",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
