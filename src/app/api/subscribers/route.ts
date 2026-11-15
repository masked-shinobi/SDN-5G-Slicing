import { NextResponse } from "next/server";
import {
  AddSliceSchema,
  DeleteSliceSchema,
  ImsiSchema,
} from "@/lib/subscriber-schema";
import {
  getSubscriber,
  addSliceToSubscriber,
  removeSliceFromSubscriber,
} from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/**
 * GET /api/subscribers?imsi=999700000000001
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawImsi = searchParams.get("imsi") || "999700000000001";
    const imsi = ImsiSchema.parse(rawImsi);

    const subscriber = await getSubscriber(imsi);
    return NextResponse.json({
      success: true,
      subscriber,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch subscriber",
        details: error?.errors || error?.message || String(error),
      },
      { status: 400 }
    );
  }
}

/**
 * POST /api/subscribers
 * Body: { imsi: "999700000000001", slice: { sst: 3, sd: "000003", dnn: "iot", ... } }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = AddSliceSchema.parse(body);

    const updatedSubscriber = await addSliceToSubscriber(validated.imsi, validated.slice);

    return NextResponse.json({
      success: true,
      message: `S-NSSAI (SST: ${validated.slice.sst}, SD: ${validated.slice.sd}) successfully provisioned`,
      subscriber: updatedSubscriber,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation error or failed to add slice",
        details: error?.errors || error?.message || String(error),
      },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/subscribers
 * Body: { imsi: "999700000000001", sst: 3, sd: "000003" }
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const validated = DeleteSliceSchema.parse(body);

    const updatedSubscriber = await removeSliceFromSubscriber(
      validated.imsi,
      validated.sst,
      validated.sd
    );

    return NextResponse.json({
      success: true,
      message: `S-NSSAI (SST: ${validated.sst}, SD: ${validated.sd}) deprovisioned`,
      subscriber: updatedSubscriber,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation error or failed to remove slice",
        details: error?.errors || error?.message || String(error),
      },
      { status: 400 }
    );
  }
}
