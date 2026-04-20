import { NextRequest, NextResponse } from 'next/server';
import { getSession, canApprove, canBulkAction } from '@/lib/auth';
import { supabase, TABLES } from '@/lib/supabase';

// GET /api/applications - List applications (with filters)
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const district = searchParams.get('district');
    const priority = searchParams.get('priority');
    const assigned = searchParams.get('assigned');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');

    let query = supabase
      .from(TABLES.APPLICATIONS)
      .select(`
        *,
        assigned_user:users!certificate_applications_assigned_to_fkey(id, full_name, email, role),
        reviewed_by_user:users!certificate_applications_reviewed_by_fkey(id, full_name)
      `)
      .order('created_at', { ascending: false });

    // Staff only sees their assigned
    if (session.role === 'staff') {
      query = query.eq('assigned_to', session.userId);
    }

    if (status && status !== 'all') query = query.eq('status', status);
    if (type && type !== 'all') query = query.eq('type', type);
    if (district && district !== 'all') query = query.eq('district', district);
    if (priority && priority !== 'all') query = query.eq('internal_priority', priority);
    if (assigned === 'me') query = query.eq('assigned_to', session.userId);
    if (assigned === 'unassigned') query = query.is('assigned_to', null);

    if (search) {
      query = query.or(`surname.ilike.%${search}%,given_names.ilike.%${search}%,tracking_number.ilike.%${search}%`);
    }

    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Applications list error:', error);
      return NextResponse.json({ error: 'Failed to load applications' }, { status: 500 });
    }

    return NextResponse.json({
      applications: data || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Applications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/applications - Update application (status, assign, notes)
export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!canApprove(session.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, status, assignedTo, notes, priority, rejectionReason } = body;

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (status) updates.status = status;
    if (assignedTo !== undefined) updates.assigned_to = assignedTo || null;
    if (notes !== undefined) updates.notes = notes;
    if (priority) updates.internal_priority = priority;
    if (rejectionReason) updates.rejection_reason = rejectionReason;
    if (status === 'approved' || status === 'rejected' || status === 'issued') {
      updates.reviewed_by = session.userId;
      updates.reviewed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from(TABLES.APPLICATIONS)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }

    // Audit
    await supabase.from(TABLES.AUDIT_LOGS).insert({
      action: `Application ${status ? `status changed to ${status}` : 'updated'}: ${id}`,
      details: `Updated by ${session.email}. Changes: ${JSON.stringify(updates)}`,
      ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1',
      user_id: session.userId,
      table_name: 'certificate_applications',
      record_id: String(id),
      action_type: 'update',
    });

    return NextResponse.json({ success: true, application: data });
  } catch (error) {
    console.error('Application update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
