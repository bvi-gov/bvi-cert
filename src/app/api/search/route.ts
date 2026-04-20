import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabase, TABLES } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    const district = searchParams.get('district') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!q.trim()) {
      return NextResponse.json({ results: [], total: 0, query: q });
    }

    const results: Record<string, unknown[]> = {
      applications: [],
      archived: [],
      users: [],
    };
    let totalResults = 0;

    // Search applications
    if (type === 'all' || type === 'applications') {
      let query = supabase
        .from(TABLES.APPLICATIONS)
        .select('id, tracking_number, type, status, surname, given_names, created_at, district')
        .or(`surname.ilike.%${q}%,given_names.ilike.%${q}%,tracking_number.ilike.%${q}%,email.ilike.%${q}%`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (district) query = query.eq('district', district);

      const { data } = await query;
      results.applications = data || [];
      totalResults += results.applications.length;
    }

    // Search archived records (full-text search)
    if (type === 'all' || type === 'archived') {
      let query = supabase
        .from(TABLES.ARCHIVED)
        .select('id, record_type, surname, given_names, district, community, record_year, certificate_number, is_verified')
        .or(`surname.ilike.%${q}%,given_names.ilike.%${q}%,certificate_number.ilike.%${q}%,district.ilike.%${q}%,community.ilike.%${q}%`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (district) query = query.eq('district', district);

      const { data } = await query;
      results.archived = data || [];
      totalResults += results.archived.length;
    }

    // Search users (admin only)
    if ((session.role === 'admin' || session.role === 'super_admin') && (type === 'all' || type === 'users')) {
      const { data } = await supabase
        .from(TABLES.USERS)
        .select('id, email, full_name, role, department, district, is_active')
        .or(`full_name.ilike.%${q}%,email.ilike.%${q}%,badge_number.ilike.%${q}%`)
        .limit(10);

      results.users = data || [];
      totalResults += results.users.length;
    }

    return NextResponse.json({
      results,
      total: totalResults,
      query: q,
      page,
      limit,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
