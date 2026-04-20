import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const TABLES = {
  USERS: 'users',
  DELEGATES: 'delegate_assignments',
  CERTIFICATE_TYPES: 'certificate_types',
  APPLICATIONS: 'certificate_applications',
  ARCHIVED: 'archived_records',
  IMPORT_JOBS: 'import_jobs',
  NOTIFICATIONS: 'notifications',
  AUDIT_LOGS: 'audit_logs',
  SESSIONS: 'sessions',
  RATE_LIMITS: 'rate_limits',
} as const;

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    _supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop, receiver) {
    const client = getSupabase();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') return value.bind(client);
    return value;
  },
});
