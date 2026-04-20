import { supabase, TABLES } from "@/lib/supabase";
import { type NextRequest } from "next/server";

/**
 * Sanitize a string by stripping HTML tags and trimming whitespace
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>'";&(){}[\]\\]/g, "")
    .trim();
}

/**
 * Check rate limit for an IP/endpoint combination
 * Returns true if the request is allowed, false if rate limited
 */
export async function checkRateLimit(
  ip: string,
  endpoint: string,
  maxRequests: number,
  windowMinutes: number
): Promise<boolean> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);

  // Clean up old records
  await supabase
    .from(TABLES.RATE_LIMITS)
    .delete()
    .or(`reset_at.lt.${windowStart.toISOString()},created_at.lt.${windowStart.toISOString()}`);

  // Find existing rate limit record
  const { data: existing } = await supabase
    .from(TABLES.RATE_LIMITS)
    .select("id,count")
    .eq("ip_address", ip)
    .eq("endpoint", endpoint)
    .gt("reset_at", now.toISOString())
    .maybeSingle();

  if (existing) {
    if (existing.count >= maxRequests) {
      return false;
    }
    await supabase
      .from(TABLES.RATE_LIMITS)
      .update({ count: existing.count + 1 })
      .eq("id", existing.id);
    return true;
  }

  // Create new rate limit record
  const resetAt = new Date(now.getTime() + windowMinutes * 60 * 1000);
  await supabase.from(TABLES.RATE_LIMITS).insert({
    ip_address: ip,
    endpoint,
    count: 1,
    reset_at: resetAt.toISOString(),
  });

  return true;
}

/**
 * Get client IP from request
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "127.0.0.1";
}

/**
 * Generate a tracking number: BVI-YYYY-XXXXXX
 */
export function generateTrackingNumber(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BVI-${year}-${code}`;
}

/**
 * Log an audit event
 */
export async function logAudit(
  action: string,
  details?: string,
  ipAddress?: string
): Promise<void> {
  await supabase.from(TABLES.AUDIT_LOGS).insert({
    action,
    details,
    ip_address: ipAddress,
  });
}
