import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Table names matching the snake_case in Supabase
export const TABLES = {
  APPLICATIONS: 'certificate_applications',
  AUDIT_LOGS: 'audit_logs',
  RATE_LIMITS: 'rate_limits',
} as const;

// Lazy singleton — only creates the client when first called at runtime
let _supabase: SupabaseClient | null = null;

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set.');
  return url;
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set.');
  return key;
}

function getServiceKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || getSupabaseAnonKey();
}

// Server-side client with service role for admin operations
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(getSupabaseUrl(), getServiceKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _supabase;
}

// Convenience alias used throughout the codebase
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabase();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

// Public client for client-side use (if needed)
let _supabasePublic: SupabaseClient | null = null;

export function getSupabasePublic(): SupabaseClient {
  if (!_supabasePublic) {
    _supabasePublic = createClient(getSupabaseUrl(), getSupabaseAnonKey());
  }
  return _supabasePublic;
}

export const supabasePublic = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabasePublic();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
