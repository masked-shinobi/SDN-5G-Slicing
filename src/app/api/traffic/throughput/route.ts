import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateThroughputBenchmark, SLICE_QOS_PROFILES } from "@/lib/qos-throughput";

const ThroughputRequestSchema = z.object({
  slice: z.enum(["A", "B"]),
  durationSeconds: z.number().int().min(3).max(10).optional().default(6),
});

export async function GET() {
  return NextResponse.json({
    profiles: SLICE_QOS_PROFILES,
    description: "5G QoS Profiles (5QI) and AMBR rate parameters for Slice A and Slice B",
  });
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = ThroughputRequestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid throughput benchmark parameters", issues: parsed.error.format() },
        { status: 400 }
      );
    }

    const { slice, durationSeconds } = parsed.data;
    const result = generateThroughputBenchmark(slice, durationSeconds);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error during throughput execution", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
