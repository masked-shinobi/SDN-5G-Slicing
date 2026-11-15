import { NextResponse } from "next/server";
import { ProcessActionSchema, manageGnbProcess, getProcessStates } from "@/lib/process-manager";

export const dynamic = "force-dynamic";

export async function GET() {
  const states = getProcessStates();
  return NextResponse.json({ success: true, gnb: states.gnb });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = ProcessActionSchema.parse(body);
    const result = await manageGnbProcess(validated.action);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Invalid gNB control action" },
      { status: 400 }
    );
  }
}
