-- BVI Cert - Supabase Database Setup
-- Run this in: Supabase Dashboard > SQL Editor > New Query > Paste & Run

-- 1. Certificate Applications Table
CREATE TABLE IF NOT EXISTS certificate_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'police',
  status TEXT NOT NULL DEFAULT 'pending',
  surname TEXT NOT NULL,
  given_names TEXT NOT NULL,
  sex TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  age TEXT,
  place_of_birth TEXT NOT NULL,
  nationality TEXT NOT NULL,
  occupation TEXT NOT NULL,
  physical_address TEXT NOT NULL,
  premises_owner TEXT,
  contact_number TEXT NOT NULL,
  email TEXT,
  countries_before TEXT,
  date_arrived_bvi TEXT,
  purpose TEXT NOT NULL,
  certificate_count INTEGER DEFAULT 1,
  convicted TEXT DEFAULT 'No',
  conviction_details TEXT,
  submitted_by_name TEXT,
  submitted_by_signature TEXT,
  passport_photo_path TEXT,
  passport_copy_path TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_amount REAL DEFAULT 20.0,
  payment_method TEXT,
  payment_date TIMESTAMPTZ,
  receipt_number TEXT,
  certificate_number TEXT,
  date_issued TIMESTAMPTZ,
  date_expires TIMESTAMPTZ,
  issued_by TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Rate Limits Table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  reset_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security
ALTER TABLE certificate_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies (allow public access for the portal)
CREATE POLICY "Allow public insert applications" ON certificate_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select applications" ON certificate_applications FOR SELECT USING (true);
CREATE POLICY "Allow public update applications" ON certificate_applications FOR UPDATE USING (true);

CREATE POLICY "Allow public insert audit" ON audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select audit" ON audit_logs FOR SELECT USING (true);

CREATE POLICY "Allow public insert rate" ON rate_limits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select rate" ON rate_limits FOR SELECT USING (true);
CREATE POLICY "Allow public update rate" ON rate_limits FOR UPDATE USING (true);
CREATE POLICY "Allow public delete rate" ON rate_limits FOR DELETE USING (true);

-- 6. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_app_tracking ON certificate_applications(tracking_number);
CREATE INDEX IF NOT EXISTS idx_app_status ON certificate_applications(status);
CREATE INDEX IF NOT EXISTS idx_rl_ip_endpoint ON rate_limits(ip_address, endpoint);

-- 7. Add Updated_At Trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON certificate_applications;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON certificate_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Done! Tables are ready.
