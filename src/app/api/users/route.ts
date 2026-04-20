import { NextRequest, NextResponse } from 'next/server';
import { getSession, canManageUsers, hashPassword } from '@/lib/auth';
import { supabase, TABLES } from '@/lib/supabase';

// GET /api/users - List users (admin only)
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!canManageUsers(session.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  try {
    let query = supabase
      .from(TABLES.USERS)
      .select('id, email, full_name, badge_number, role, department, district, phone, is_active, last_login, created_at')
      .order('created_at', { ascending: false });

    // Staff only sees themselves (but they shouldn't have access anyway)
    if (session.role === 'staff' || session.role === 'viewer') {
      query = query.eq('id', session.userId);
    }
    // Admin sees their staff + themselves
    if (session.role === 'admin') {
      query = query.or(`id.eq.${session.userId},role.eq.staff,role.eq.viewer`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Users list error:', error);
      return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
    }

    // Get delegate assignments for admins
    const { data: delegates } = await supabase
      .from(TABLES.DELEGATES)
      .select('admin_id, staff_id, assigned_at, staff:users!delegate_assignments_staff_id_fkey(id, full_name, email, role)');

    return NextResponse.json({ users: data || [], delegates: delegates || [] });
  } catch (error) {
    console.error('Users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/users - Create user (admin only)
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!canManageUsers(session.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  try {
    const { email, password, fullName, badgeNumber, role, department, district, phone } = await request.json();

    if (!email || !password || !fullName || !role) {
      return NextResponse.json({ error: 'All required fields must be provided.' }, { status: 400 });
    }

    // Only super_admin can create admin accounts
    if (role === 'admin' && session.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only Super Administrators can create admin accounts.' }, { status: 403 });
    }
    if (role === 'super_admin') {
      return NextResponse.json({ error: 'Cannot create super admin accounts.' }, { status: 403 });
    }

    const passwordHash = await hashPassword(password);

    const { data: user, error } = await supabase
      .from(TABLES.USERS)
      .insert({
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        full_name: fullName.trim(),
        badge_number: badgeNumber || null,
        role,
        department: department || 'RVIPF',
        district: district || 'Tortola',
        phone: phone || null,
        is_active: true,
      })
      .select('id, email, full_name, role, department, district')
      .single();

    if (error) {
      console.error('Create user error:', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
    }

    await supabase.from(TABLES.AUDIT_LOGS).insert({
      action: `User created: ${user.email} (${user.role})`,
      details: `Created by ${session.email}`,
      ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1',
      user_id: session.userId,
      table_name: 'users',
      record_id: user.id,
      action_type: 'create',
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// PATCH /api/users - Update user
export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || !canManageUsers(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, fullName, badgeNumber, role, department, district, phone, isActive } = await request.json();
    if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (fullName) updates.full_name = fullName;
    if (badgeNumber !== undefined) updates.badge_number = badgeNumber;
    if (department) updates.department = department;
    if (district) updates.district = district;
    if (phone !== undefined) updates.phone = phone;
    if (isActive !== undefined) updates.is_active = isActive;

    // Role change only by super_admin
    if (role && session.role === 'super_admin') {
      updates.role = role;
    }

    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', id)
      .select('id, email, full_name, role, is_active')
      .single();

    if (error) return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
