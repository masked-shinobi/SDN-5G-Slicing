import { NextResponse } from "next/server";
import { LogQuerySchema, get5gCoreLogs } from "@/lib/log-reader";

export const dynamic = "force-dynamic";

/**
 * GET /api/logs?service=amf|smf|all&filter=NSSAI&limit=100
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validated = LogQuerySchema.parse({
      service: searchParams.get("service") || "all",
      filter: searchParams.get("filter") || "",
      limit: searchParams.get("limit") || 100,
    });

    const logs = await get5gCoreLogs(
      validated.service,
      validated.filter,
      validated.limit
    );

    return NextResponse.json({
      success: true,
      service: validated.service,
      filter: validated.filter,
      count: logs.length,
      logs,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to retrieve 5G logs",
      },
      { status: 400 }
    );
  }
}
