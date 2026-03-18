CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cash_on_delivery_enabled BOOLEAN NOT NULL DEFAULT false,
  online_payment_enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admins) to read settings
CREATE POLICY "Allow read access for authenticated users" ON payment_settings
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert settings (for seeding)
CREATE POLICY "Allow insert access for authenticated users" ON payment_settings
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to update settings
CREATE POLICY "Allow update access for authenticated users" ON payment_settings
  FOR UPDATE TO authenticated USING (true);