import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, getSession } from '@/lib/auth';
import { supabase, TABLES } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (session) {
      // Audit log
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
      await supabase.from(TABLES.AUDIT_LOGS).insert({
        action: 'logout',
        details: `User logged out: ${session.email}`,
        ip_address: ip,
        user_agent: request.headers.get('user-agent') || undefined,
        user_id: session.userId,
        table_name: 'users',
        record_id: session.userId,
        action_type: 'logout',
      });
    }

    await clearSessionCookie();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
