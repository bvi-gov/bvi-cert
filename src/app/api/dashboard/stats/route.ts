import { NextResponse } from 'next/server';
import { getSession, canApprove } from '@/lib/auth';
import { supabase, TABLES } from '@/lib/supabase';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // If staff, only show their assigned applications
    const query = canApprove(session.role) && session.role !== 'staff'
      ? supabase.from(TABLES.APPLICATIONS).select('*')
      : supabase.from(TABLES.APPLICATIONS).select('*').eq('assigned_to', session.userId);

    const { data: allApps, error } = await query;

    if (error) {
      console.error('Stats error:', error);
      return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
    }

    const apps = allApps || [];

    const total = apps.length;
    const pending = apps.filter(a => a.status === 'pending').length;
    const processing = apps.filter(a => a.status === 'processing').length;
    const approved = apps.filter(a => a.status === 'approved').length;
    const issued = apps.filter(a => a.status === 'issued').length;
    const rejected = apps.filter(a => a.status === 'rejected').length;
    const collected = apps.filter(a => a.status === 'collected').length;

    // Stats by type
    const byType: Record<string, number> = {};
    apps.forEach(a => {
      const t = a.type || 'unknown';
      byType[t] = (byType[t] || 0) + 1;
    });

    // Stats by district
    const byDistrict: Record<string, number> = {};
    apps.forEach(a => {
      const d = a.district || 'Unknown';
      byDistrict[d] = (byDistrict[d] || 0) + 1;
    });

    // This week applications
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = apps.filter(a => new Date(a.created_at) >= oneWeekAgo).length;

    // Today applications
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = apps.filter(a => new Date(a.created_at) >= today).length;

    // Urgent/priority
    const urgent = apps.filter(a => a.internal_priority === 'urgent' || a.internal_priority === 'high').length;

    // Total users
    const { count: userCount } = await supabase
      .from(TABLES.USERS)
      .select('*', { count: 'exact', head: true });

    // Total archived records
    const { count: archivedCount } = await supabase
      .from(TABLES.ARCHIVED)
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      total,
      pending,
      processing,
      approved,
      issued,
      rejected,
      collected,
      byType,
      byDistrict,
      thisWeek,
      today: todayCount,
      urgent,
      userCount: userCount || 0,
      archivedCount: archivedCount || 0,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
