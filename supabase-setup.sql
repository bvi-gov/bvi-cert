-- ============================================================
-- BVI CERT - COMPLETE DATABASE SCHEMA
-- Royal Virgin Islands Police Force - Certificate Management Portal
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USERS & AUTHENTICATION
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  badge_number TEXT,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('super_admin', 'admin', 'staff', 'viewer')),
  department TEXT DEFAULT 'RVIPF',
  district TEXT DEFAULT 'Tortola',
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. DELEGATE ASSIGNMENTS (Admin → Staff hierarchy)
-- ============================================================

CREATE TABLE IF NOT EXISTS delegate_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(admin_id, staff_id)
);

-- ============================================================
-- 3. CERTIFICATE TYPES
-- ============================================================

CREATE TABLE IF NOT EXISTS certificate_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  fee_amount DECIMAL(10,2) DEFAULT 0,
  processing_days INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  is_coming_soon BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  icon TEXT DEFAULT 'FileText',
  color TEXT DEFAULT '#009B3A',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert all certificate types
INSERT INTO certificate_types (code, name, description, fee_amount, processing_days, is_active, is_coming_soon, display_order, icon, color) VALUES
('police', 'Police Certificate', 'Certificate of Police Character - required for employment, immigration, and visa processing', 20.00, 3, true, false, 1, 'Shield', '#009B3A'),
('character', 'Character Certificate', 'Certificate of Good Character - for adoption, education, and professional licensing', 20.00, 3, true, false, 2, 'ClipboardList', '#FFD100'),
('firearms', 'Firearms License', 'Firearms Ownership License - authorization to possess and carry firearms', 100.00, 14, true, true, 3, 'Crosshair', '#0C1B2A'),
('event_permit', 'Event Permit', 'Public Event and Special Activity Permit - for organizing public gatherings', 50.00, 7, true, true, 4, 'Calendar', '#009B3A'),
('business', 'Business License Clearance', 'Police Business License Clearance - required for business registration', 75.00, 10, true, true, 5, 'Building2', '#FFD100'),
('vehicle', 'Vehicle Inspection Certificate', 'Police Vehicle Inspection Certificate - mandatory vehicle safety inspection', 35.00, 5, true, true, 6, 'Car', '#0C1B2A'),
('security', 'Security Guard License', 'Private Security Guard License - for private security personnel', 60.00, 10, true, true, 7, 'ShieldAlert', '#009B3A'),
('clearance', 'Immigration Clearance', 'Police Clearance for Immigration Purposes - for visa and residency applications', 25.00, 5, true, true, 8, 'Plane', '#FFD100')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 4. CERTIFICATE APPLICATIONS (enhanced existing table)
-- ============================================================

-- Add new columns to existing table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificate_applications' AND column_name = 'certificate_type_id') THEN
    ALTER TABLE certificate_applications ADD COLUMN certificate_type_id UUID REFERENCES certificate_types(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificate_applications' AND column_name = 'assigned_to') THEN
    ALTER TABLE certificate_applications ADD COLUMN assigned_to UUID REFERENCES users(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificate_applications' AND column_name = 'reviewed_by') THEN
    ALTER TABLE certificate_applications ADD COLUMN reviewed_by UUID REFERENCES users(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificate_applications' AND column_name = 'reviewed_at') THEN
    ALTER TABLE certificate_applications ADD COLUMN reviewed_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificate_applications' AND column_name = 'notes') THEN
    ALTER TABLE certificate_applications ADD COLUMN notes TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificate_applications' AND column_name = 'internal_priority') THEN
    ALTER TABLE certificate_applications ADD COLUMN internal_priority TEXT DEFAULT 'normal' CHECK (internal_priority IN ('low', 'normal', 'high', 'urgent'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificate_applications' AND column_name = 'rejection_reason') THEN
    ALTER TABLE certificate_applications ADD COLUMN rejection_reason TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificate_applications' AND column_name = 'district') THEN
    ALTER TABLE certificate_applications ADD COLUMN district TEXT;
  END IF;
END $$;

-- ============================================================
-- 5. ARCHIVED RECORDS (bulk import + OCR)
-- ============================================================

CREATE TABLE IF NOT EXISTS archived_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_type TEXT NOT NULL,
  record_year INTEGER,
  district TEXT,
  community TEXT,
  surname TEXT,
  given_names TEXT,
  date_of_birth DATE,
  date_of_event DATE,
  event_type TEXT,
  certificate_number TEXT,
  details JSONB DEFAULT '{}',
  source_file TEXT,
  source_type TEXT DEFAULT 'import',
  ocr_confidence DECIMAL(5,2),
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES users(id),
  tags TEXT[] DEFAULT '{}',
  search_vector TSVECTOR,
  folder_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  imported_by UUID REFERENCES users(id)
);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_archived_search ON archived_records USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_archived_type ON archived_records(record_type);
CREATE INDEX IF NOT EXISTS idx_archived_year ON archived_records(record_year);
CREATE INDEX IF NOT EXISTS idx_archived_district ON archived_records(district);
CREATE INDEX IF NOT EXISTS idx_archived_community ON archived_records(community);
CREATE INDEX IF NOT EXISTS idx_archived_surname ON archived_records(surname);
CREATE INDEX IF NOT EXISTS idx_archived_verified ON archived_records(is_verified);

-- ============================================================
-- 6. IMPORT JOBS
-- ============================================================

CREATE TABLE IF NOT EXISTS import_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  total_rows INTEGER DEFAULT 0,
  imported_rows INTEGER DEFAULT 0,
  failed_rows INTEGER DEFAULT 0,
  skipped_rows INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  error_log JSONB DEFAULT '[]',
  column_mapping JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'system')),
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- ============================================================
-- 8. SESSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- ============================================================
-- 9. AUDIT LOGS (enhanced existing)
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'user_id') THEN
    ALTER TABLE audit_logs ADD COLUMN user_id UUID REFERENCES users(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'table_name') THEN
    ALTER TABLE audit_logs ADD COLUMN table_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'record_id') THEN
    ALTER TABLE audit_logs ADD COLUMN record_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'action_type') THEN
    ALTER TABLE audit_logs ADD COLUMN action_type TEXT CHECK (action_type IN ('create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'import'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'old_values') THEN
    ALTER TABLE audit_logs ADD COLUMN old_values JSONB;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'new_values') THEN
    ALTER TABLE audit_logs ADD COLUMN new_values JSONB;
  END IF;
END $$;

-- ============================================================
-- 10. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE delegate_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE archived_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Public: citizens can see active certificate types and track by tracking number
CREATE POLICY "Public read certificate_types" ON certificate_types FOR SELECT USING (is_active = true);
CREATE POLICY "Public track applications" ON certificate_applications FOR SELECT USING (true);

-- Service role has full access (server-side API uses service key)
CREATE POLICY "Service full access users" ON users FOR ALL USING (true);
CREATE POLICY "Service full access delegates" ON delegate_assignments FOR ALL USING (true);
CREATE POLICY "Service full access applications" ON certificate_applications FOR ALL USING (true);
CREATE POLICY "Service full access archived" ON archived_records FOR ALL USING (true);
CREATE POLICY "Service full access imports" ON import_jobs FOR ALL USING (true);
CREATE POLICY "Service full access notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Service full access audit" ON audit_logs FOR ALL USING (true);
CREATE POLICY "Service full access sessions" ON sessions FOR ALL USING (true);

-- ============================================================
-- 11. FULL-TEXT SEARCH TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.surname, '') || ' ' ||
    COALESCE(NEW.given_names, '') || ' ' ||
    COALESCE(NEW.record_type, '') || ' ' ||
    COALESCE(NEW.district, '') || ' ' ||
    COALESCE(NEW.community, '') || ' ' ||
    COALESCE(NEW.event_type, '') || ' ' ||
    COALESCE(NEW.certificate_number, '') || ' ' ||
    COALESCE(NEW.details::text, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_search_vector ON archived_records;
CREATE TRIGGER trg_update_search_vector BEFORE INSERT OR UPDATE ON archived_records
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- ============================================================
-- 12. DEFAULT SUPER ADMIN USER
-- Password: BVI@dm1n2026!
-- ============================================================

INSERT INTO users (email, password_hash, full_name, role, department, district, is_active)
VALUES (
  'admin@bvicert.gov.vg',
  '$2a$12$LJ3m9bMk9JGYvBCuOwWPJexJGnJHB9Gq8qK5pXfYbQx1zL0M5S6Kq',
  'System Administrator',
  'super_admin',
  'RVIPF',
  'Tortola',
  true
) ON CONFLICT (email) DO NOTHING;

-- NOTE: Run this to generate proper hash after deployment:
-- In Node.js: const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword', 12)
-- Then UPDATE users SET password_hash = '...' WHERE email = 'admin@bvicert.gov.vg';
