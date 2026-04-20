import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { supabase, TABLES } from '@/lib/supabase';

// GET /api/audit - List audit log entries (admin only)
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isAdmin(session.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const actionType = searchParams.get('action_type') || '';
    const from = (page - 1) * limit;

    let query = supabase
      .from(TABLES.AUDIT_LOGS)
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (actionType) {
      query = query.eq('action_type', actionType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Audit list error:', error);
      return NextResponse.json({ error: 'Failed to load audit entries' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      entries: data || [],
      total: (data || []).length,
    });
  } catch (error) {
    console.error('Audit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
