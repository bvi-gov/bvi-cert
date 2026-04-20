import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabase, TABLES } from '@/lib/supabase';

// GET /api/notifications - Get user notifications
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.NOTIFICATIONS)
      .select('*')
      .eq('user_id', session.userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Notifications error:', error);
      return NextResponse.json({ error: 'Failed to load notifications' }, { status: 500 });
    }

    const unreadCount = (data || []).filter((n: { is_read: boolean }) => !n.is_read).length;

    return NextResponse.json({
      success: true,
      notifications: data || [],
      unreadCount,
    });
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, markAllRead } = await request.json();

    if (markAllRead) {
      const { error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .update({ is_read: true })
        .eq('user_id', session.userId)
        .eq('is_read', false);

      if (error) return NextResponse.json({ error: 'Failed to mark all as read' }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    if (id) {
      const { error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', session.userId);

      if (error) return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'No id or markAllRead provided' }, { status: 400 });
  } catch (error) {
    console.error('Notification update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
