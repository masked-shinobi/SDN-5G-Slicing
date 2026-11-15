import { NextResponse } from "next/server";
import { ProcessActionSchema, manageUeProcess, getProcessStates } from "@/lib/process-manager";

export const dynamic = "force-dynamic";

export async function GET() {
  const states = getProcessStates();
  return NextResponse.json({ success: true, ue: states.ue });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = ProcessActionSchema.parse(body);
    const result = await manageUeProcess(validated.action);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Invalid UE control action" },
      { status: 400 }
    );
  }
}
