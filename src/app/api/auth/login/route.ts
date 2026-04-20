import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';
import { verifyPassword, createToken, setSessionCookie } from '@/lib/auth';
import { sanitizeInput } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const cleanEmail = sanitizeInput(email).toLowerCase().trim();

    const { data: user, error: userError } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('email', cleanEmail)
      .eq('is_active', true)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
    });

    await setSessionCookie(token);

    await supabase
      .from(TABLES.USERS)
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    await supabase.from(TABLES.AUDIT_LOGS).insert({
      action: `User logged in: ${user.email}`,
      details: 'Login successful',
      ip_address: ip,
      user_agent: request.headers.get('user-agent') || undefined,
      user_id: user.id,
      table_name: 'users',
      record_id: user.id,
      action_type: 'login',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        department: user.department,
        district: user.district,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
