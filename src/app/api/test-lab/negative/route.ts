import { NextResponse } from "next/server";
import { NegativeTestSchema, runNegativeSlicingTest } from "@/lib/process-manager";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = NegativeTestSchema.parse(body);

    const result = await runNegativeSlicingTest(
      validated.sst,
      validated.sd,
      validated.imsi
    );

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to execute negative slicing test",
        details: error?.errors || String(error),
      },
      { status: 400 }
    );
  }
}
