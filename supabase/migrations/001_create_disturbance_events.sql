-- James-Rescue-911: disturbance_events table
CREATE TABLE IF NOT EXISTS disturbance_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  disturber_name TEXT NOT NULL CHECK (disturber_name IN ('B', 'Todd', 'CJ')),
  request_type TEXT NOT NULL DEFAULT 'Emergency' CHECK (request_type IN ('Emergency', 'Normal', 'Low')),
  description TEXT,
  source TEXT NOT NULL DEFAULT 'web' CHECK (source IN ('web', 'webhook', 'mqtt')),
  level TEXT NOT NULL DEFAULT 'Emergency'
);

-- Indexes for query optimization
CREATE INDEX idx_disturbance_events_timestamp ON disturbance_events(timestamp);
CREATE INDEX idx_disturbance_events_disturber_name ON disturbance_events(disturber_name);
CREATE INDEX idx_disturbance_events_disturber_timestamp ON disturbance_events(disturber_name, timestamp);

-- Enable Realtime: In Supabase Dashboard, go to Database > Replication
-- and add disturbance_events to the supabase_realtime publication.

-- RLS: Allow anonymous read/write for development (customize for production)
ALTER TABLE disturbance_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON disturbance_events
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON disturbance_events
  FOR INSERT WITH CHECK (true);
