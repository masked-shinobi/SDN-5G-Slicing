import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "openapi.yaml");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return new NextResponse(content, {
        status: 200,
        headers: {
          "Content-Type": "text/yaml; charset=utf-8",
          "Content-Disposition": "inline; filename=\"openapi.yaml\"",
        },
      });
    }
    return NextResponse.json({ error: "OpenAPI specification file not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read OpenAPI specification", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
