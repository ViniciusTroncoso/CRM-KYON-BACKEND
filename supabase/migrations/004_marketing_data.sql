-- Migration 004: Marketing Data (Criativos & Ads)
-- Tabela para dados de campanhas, conjuntos de anúncios e criativos

CREATE TABLE IF NOT EXISTS marketing_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  platform TEXT NOT NULL,
  status TEXT NOT NULL,
  creative_name TEXT NOT NULL,
  ad_set_name TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  utm_source TEXT,
  spend NUMERIC(10, 2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  hook_rate NUMERIC(5, 2) DEFAULT 0,
  body_rate NUMERIC(5, 2) DEFAULT 0,
  connect_rate NUMERIC(5, 2) DEFAULT 0,
  page_conversion_rate NUMERIC(5, 2) DEFAULT 0,
  cpm NUMERIC(10, 2) DEFAULT 0,
  ctr NUMERIC(5, 2) DEFAULT 0,
  cac NUMERIC(10, 2) DEFAULT 0,
  roas NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_marketing_date ON marketing_data(date);
CREATE INDEX IF NOT EXISTS idx_marketing_platform ON marketing_data(platform);
CREATE INDEX IF NOT EXISTS idx_marketing_utm ON marketing_data(utm_source);
CREATE INDEX IF NOT EXISTS idx_marketing_campaign ON marketing_data(campaign_name);
CREATE INDEX IF NOT EXISTS idx_marketing_ad_set ON marketing_data(ad_set_name);

-- Trigger para updated_at
CREATE TRIGGER update_marketing_data_updated_at 
BEFORE UPDATE ON marketing_data
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE marketing_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated users" ON marketing_data
FOR ALL USING (true);

-- Seed data inicial (opcional - dados de exemplo)
INSERT INTO marketing_data (date, platform, status, creative_name, ad_set_name, campaign_name, utm_source, spend, impressions, clicks, cpm, ctr) VALUES
  ('2025-11-20', 'Meta', 'Active', 'Médicos Estética - Conv', 'Médicos Estética', 'Médicos Estética - Conv', 'facebook_ad_001', 450.00, 12500, 380, 36.00, 3.04),
  ('2025-11-21', 'Meta', 'Active', 'Clínicas Gerais - Search', 'Clínicas Gerais', 'Clínicas Gerais - Search', 'facebook_ad_002', 380.00, 10200, 310, 37.25, 3.04),
  ('2025-11-22', 'Meta', 'Active', 'B2B Parcerias', 'B2B Parcerias', 'B2B Parcerias', 'facebook_ad_003', 520.00, 15000, 420, 34.67, 2.80)
ON CONFLICT DO NOTHING;
