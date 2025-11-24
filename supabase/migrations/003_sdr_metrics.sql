-- Migration 003: SDR Daily Metrics (Gestão de SDRs)
-- Tabela para métricas diárias de produtividade dos SDRs

CREATE TABLE IF NOT EXISTS sdr_daily_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  sdr_name TEXT NOT NULL,
  leads_contacted INTEGER DEFAULT 0,
  calls_made INTEGER DEFAULT 0,
  meetings_booked INTEGER DEFAULT 0,
  no_shows INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, sdr_name)
);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_sdr_metrics_date ON sdr_daily_metrics(date);
CREATE INDEX IF NOT EXISTS idx_sdr_metrics_sdr_name ON sdr_daily_metrics(sdr_name);
CREATE INDEX IF NOT EXISTS idx_sdr_metrics_date_sdr ON sdr_daily_metrics(date, sdr_name);

-- Trigger para updated_at
CREATE TRIGGER update_sdr_daily_metrics_updated_at 
BEFORE UPDATE ON sdr_daily_metrics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE sdr_daily_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated users" ON sdr_daily_metrics
FOR ALL USING (true);

-- Seed data inicial (opcional - métricas de exemplo)
INSERT INTO sdr_daily_metrics (date, sdr_name, leads_contacted, calls_made, meetings_booked, no_shows) VALUES
  ('2025-11-20', 'Maria Oliveira', 25, 40, 8, 1),
  ('2025-11-20', 'João Costa', 20, 35, 6, 2),
  ('2025-11-21', 'Maria Oliveira', 30, 45, 10, 0),
  ('2025-11-21', 'João Costa', 22, 38, 7, 1),
  ('2025-11-22', 'Maria Oliveira', 28, 42, 9, 1),
  ('2025-11-22', 'João Costa', 24, 40, 8, 0)
ON CONFLICT (date, sdr_name) DO NOTHING;
