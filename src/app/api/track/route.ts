import { NextRequest, NextResponse } from "next/server";
import { supabase, TABLES } from "@/lib/supabase";
import { trackingSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp, logAudit } from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // Rate limiting: max 20 lookups per IP per hour
    const allowed = await checkRateLimit(ip, "track", 20, 60);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many lookup attempts. Please try again later.",
        },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get("tracking");

    if (!trackingNumber) {
      return NextResponse.json(
        { success: false, error: "Tracking number is required." },
        { status: 400 }
      );
    }

    // Validate tracking number format
    const result = trackingSchema.safeParse({ trackingNumber });
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid tracking number format. Expected format: BVI-YYYY-XXXXXX",
        },
        { status: 400 }
      );
    }

    const { data: application, error } = await supabase
      .from(TABLES.APPLICATIONS)
      .select(
        "tracking_number,type,status,surname,given_names,created_at,updated_at,payment_status,payment_amount,date_issued,date_expires,certificate_number"
      )
      .eq("tracking_number", result.data.trackingNumber)
      .single();

    if (error || !application) {
      return NextResponse.json(
        { success: false, error: "Application not found." },
        { status: 404 }
      );
    }

    // Convert snake_case to camelCase for the frontend
    const camelApp = {
      trackingNumber: application.tracking_number,
      type: application.type,
      status: application.status,
      surname: application.surname,
      givenNames: application.given_names,
      createdAt: application.created_at,
      updatedAt: application.updated_at,
      paymentStatus: application.payment_status,
      paymentAmount: application.payment_amount,
      dateIssued: application.date_issued,
      dateExpires: application.date_expires,
      certificateNumber: application.certificate_number,
    };

    await logAudit(
      "APPLICATION_TRACKED",
      `Application tracked: ${trackingNumber}`,
      ip
    );

    return NextResponse.json({
      success: true,
      application: camelApp,
    });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
