import { NextResponse } from "next/server";
import { getActiveSlices } from "@/lib/command-runner";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slices = await getActiveSlices();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      plmn: {
        mcc: "999",
        mnc: "70",
      },
      count: slices.length,
      slices,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve network slices",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
