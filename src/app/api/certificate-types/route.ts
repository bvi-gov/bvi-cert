import { NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from(TABLES.CERTIFICATE_TYPES)
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to load certificate types' }, { status: 500 });
  }

  const types = (data || []).map(t => ({
    code: t.code,
    name: t.name,
    description: t.description,
    fee: t.fee_amount,
    days: t.processing_days,
    is_active: t.is_active,
    is_coming_soon: t.is_coming_soon,
    icon: t.icon,
    color: t.color,
  }));

  return NextResponse.json({ types });
}
