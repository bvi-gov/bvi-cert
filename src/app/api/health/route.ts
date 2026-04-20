import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "operational",
    service: "BVI Cert",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}
