import { NextResponse } from "next/server";
import { PingRequestSchema, executeSlicePing } from "@/lib/ping-runner";

export const dynamic = "force-dynamic";

/**
 * POST /api/ping
 * Body: { slice: "A" | "B", target?: "8.8.8.8" }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = PingRequestSchema.parse(body);

    const result = await executeSlicePing(validated.slice, validated.target);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to execute ping",
        details: error?.errors || String(error),
      },
      { status: 400 }
    );
  }
}
