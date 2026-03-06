-- James-Rescue-911: core tables

-- Disturbers (騷擾成員設定)
CREATE TABLE IF NOT EXISTS disturbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Seed default disturbers (idempotent)
INSERT INTO disturbers (code, display_name, color, description)
VALUES
  ('B', 'B', '#f59e0b', 'B 的騷擾需求說明'),
  ('Todd', 'Todd', '#f43f5e', 'Todd 的騷擾需求說明'),
  ('CJ', 'CJ', '#8b5cf6', 'CJ 的騷擾需求說明'),
  ('M', 'M', '#10b981', 'M 的騷擾需求說明')
ON CONFLICT (code) DO NOTHING;

-- Disturbance events
CREATE TABLE IF NOT EXISTS disturbance_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  disturber_id UUID REFERENCES disturbers(id),
  disturber_name TEXT NOT NULL,
  request_type TEXT NOT NULL DEFAULT 'Emergency' CHECK (request_type IN ('Emergency', 'Normal', 'Low')),
  description TEXT,
  conversation TEXT,
  source TEXT NOT NULL DEFAULT 'web' CHECK (source IN ('web', 'webhook', 'mqtt')),
  level TEXT NOT NULL DEFAULT 'Emergency'
);

-- Indexes for query optimization (IF NOT EXISTS so migration can be re-run safely)
CREATE INDEX IF NOT EXISTS idx_disturbance_events_timestamp ON disturbance_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_disturbance_events_disturber_name ON disturbance_events(disturber_name);
CREATE INDEX IF NOT EXISTS idx_disturbance_events_disturber_timestamp ON disturbance_events(disturber_name, timestamp);

-- Enable Realtime: In Supabase Dashboard, go to Database > Replication
-- and add disturbance_events to the supabase_realtime publication.

-- RLS: Allow anonymous read/write for development (customize for production)
ALTER TABLE disturbance_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON disturbance_events;
CREATE POLICY "Allow public read" ON disturbance_events
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert" ON disturbance_events;
CREATE POLICY "Allow public insert" ON disturbance_events
  FOR INSERT WITH CHECK (true);

-- 若有手動加過 disturber_name 的 CHECK（只允許固定名單），會導致「騷擾成員管理」新增的成員無法寫入事件，故移除。
-- 合法名稱由 disturbers 表 + 應用層控管即可。
ALTER TABLE disturbance_events
  DROP CONSTRAINT IF EXISTS disturbance_events_disturber_name_check;
