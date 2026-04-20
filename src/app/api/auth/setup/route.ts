import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { supabase, TABLES } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, setupKey } = await request.json();

    // Simple setup key to prevent unauthorized account creation
    if (setupKey !== 'bvi-cert-setup-2026') {
      return NextResponse.json({ error: 'Invalid setup key.' }, { status: 403 });
    }

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    // Check if any users already exist
    const { data: existing, error: countError } = await supabase
      .from(TABLES.USERS)
      .select('id')
      .limit(1);

    if (countError) {
      return NextResponse.json({ error: 'Database error.' }, { status: 500 });
    }

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Setup already completed. Use the admin panel to create users.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const { data: user, error: insertError } = await supabase
      .from(TABLES.USERS)
      .insert({
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        full_name: fullName.trim(),
        role: 'super_admin',
        department: 'RVIPF',
        district: 'Tortola',
        is_active: true,
      })
      .select('id, email, full_name, role')
      .single();

    if (insertError) {
      console.error('Setup error:', insertError);
      return NextResponse.json({ error: 'Failed to create admin user. Email may already exist.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Super admin created successfully. You can now log in.',
      user,
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
