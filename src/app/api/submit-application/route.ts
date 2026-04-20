import { NextRequest, NextResponse } from "next/server";
import { supabase, TABLES } from "@/lib/supabase";
import { certificateApplicationSchema } from "@/lib/validation";
import {
  sanitizeInput,
  checkRateLimit,
  getClientIp,
  generateTrackingNumber,
  logAudit,
} from "@/lib/security";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function handleFileUpload(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 5MB limit.");
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Only JPEG, PNG, and WebP images are accepted.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const timestamp = Date.now();
  const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const pathModule = await import("path");
  const uploadDir = pathModule.join(process.cwd(), "upload", "certificates");

  const fsModule = await import("fs");
  if (!fsModule.existsSync(uploadDir)) {
    fsModule.mkdirSync(uploadDir, { recursive: true });
  }

  const filepath = pathModule.join(uploadDir, filename);
  fsModule.writeFileSync(filepath, buffer);

  return `certificates/${filename}`;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // Rate limiting: max 5 submissions per IP per hour
    const allowed = await checkRateLimit(ip, "submit-application", 5, 60);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many submissions. Please try again later. Maximum 5 submissions per hour.",
        },
        { status: 429 }
      );
    }

    const formData = await request.formData();

    // Extract and sanitize text fields
    const rawData: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        rawData[key] = sanitizeInput(value);
      } else {
        rawData[key] = value;
      }
    }

    // Parse certificate count
    if (rawData.certificateCount) {
      rawData.certificateCount =
        parseInt(String(rawData.certificateCount), 10) || 1;
    }

    // Combine purpose with purposeOther
    if (rawData.purpose === "Other" && rawData.purposeOther) {
      rawData.purpose = `Other - ${rawData.purposeOther}`;
    }

    // Validate with Zod
    const result = certificateApplicationSchema.safeParse(rawData);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return NextResponse.json(
        { success: false, error: "Validation failed.", errors },
        { status: 400 }
      );
    }

    const validated = result.data;

    // Handle file uploads
    const passportPhoto = formData.get("passportPhoto") as File | null;
    const passportCopy = formData.get("passportCopy") as File | null;

    const passportPhotoPath = await handleFileUpload(passportPhoto);
    const passportCopyPath = await handleFileUpload(passportCopy);

    // Generate tracking number
    let trackingNumber = generateTrackingNumber();

    // Ensure uniqueness in Supabase
    let exists = await supabase
      .from(TABLES.APPLICATIONS)
      .select("id")
      .eq("tracking_number", trackingNumber)
      .maybeSingle();
    while (exists.data) {
      trackingNumber = generateTrackingNumber();
      exists = await supabase
        .from(TABLES.APPLICATIONS)
        .select("id")
        .eq("tracking_number", trackingNumber)
        .maybeSingle();
    }

    // Calculate age from dateOfBirth
    const dob = new Date(validated.dateOfBirth);
    const today = new Date();
    let age = "";
    if (!isNaN(dob.getTime())) {
      const calculatedAge = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      const adjustedAge =
        m < 0 || (m === 0 && today.getDate() < dob.getDate())
          ? calculatedAge - 1
          : calculatedAge;
      age = String(adjustedAge);
    }

    // Create application in Supabase
    const { data: application, error: dbError } = await supabase
      .from(TABLES.APPLICATIONS)
      .insert({
        tracking_number: trackingNumber,
        type: validated.type,
        surname: validated.surname,
        given_names: validated.givenNames,
        sex: validated.sex,
        date_of_birth: validated.dateOfBirth,
        age,
        place_of_birth: validated.placeOfBirth,
        nationality: validated.nationality,
        occupation: validated.occupation,
        physical_address: validated.physicalAddress,
        premises_owner: validated.premisesOwner || null,
        contact_number: validated.contactNumber,
        email: validated.email || null,
        countries_before: validated.countriesBefore || null,
        date_arrived_bvi: validated.dateArrivedBVI || null,
        purpose: validated.purpose,
        certificate_count: validated.certificateCount,
        convicted: validated.convicted,
        conviction_details:
          validated.convicted === "Yes"
            ? validated.convictionDetails || null
            : null,
        passport_photo_path: passportPhotoPath || null,
        passport_copy_path: passportCopyPath || null,
        ip_address: ip,
        user_agent: request.headers.get("user-agent") || undefined,
      })
      .select("tracking_number")
      .single();

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save application. Please try again.",
        },
        { status: 500 }
      );
    }

    await logAudit(
      "APPLICATION_SUBMITTED",
      `Certificate application submitted: ${trackingNumber}`,
      ip
    );

    return NextResponse.json({
      success: true,
      trackingNumber: application?.tracking_number || trackingNumber,
      message: "Application submitted successfully.",
    });
  } catch (error: unknown) {
    console.error("Application submission error:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
