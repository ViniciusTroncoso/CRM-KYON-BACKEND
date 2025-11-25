-- ========================================
-- CORRIGIR E CRIAR TABELAS FALTANTES
-- ========================================

-- Garantir que a extensão UUID existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar função update_updated_at se não existir
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar tabela leads se não existir
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_date DATE NOT NULL,
  owner TEXT NOT NULL,
  client_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  meeting_stage TEXT NOT NULL,
  deal_status TEXT NOT NULL,
  client_revenue NUMERIC(10, 2) DEFAULT 0,
  partner_participated TEXT,
  proposal_sent BOOLEAN DEFAULT false,
  plan_of_interest TEXT,
  proposed_value NUMERIC(10, 2) DEFAULT 0,
  closed_value NUMERIC(10, 2) DEFAULT 0,
  main_objection TEXT,
  sdr_name TEXT,
  down_payment_made BOOLEAN DEFAULT false,
  down_payment_value NUMERIC(10, 2) DEFAULT 0,
  utm_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_leads_call_date ON leads(call_date);
CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads(owner);
CREATE INDEX IF NOT EXISTS idx_leads_sdr_name ON leads(sdr_name);
CREATE INDEX IF NOT EXISTS idx_leads_deal_status ON leads(deal_status);
CREATE INDEX IF NOT EXISTS idx_leads_meeting_stage ON leads(meeting_stage);
CREATE INDEX IF NOT EXISTS idx_leads_utm_source ON leads(utm_source);

-- Criar trigger para leads (drop antes se existir)
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at 
BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Criar política se não existir (drop antes)
DROP POLICY IF EXISTS "Enable all for authenticated users" ON leads;
CREATE POLICY "Enable all for authenticated users" ON leads
FOR ALL USING (true);

-- Criar tabela sdr_daily_metrics se não existir
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

CREATE INDEX IF NOT EXISTS idx_sdr_metrics_date ON sdr_daily_metrics(date);
CREATE INDEX IF NOT EXISTS idx_sdr_metrics_sdr_name ON sdr_daily_metrics(sdr_name);

DROP TRIGGER IF EXISTS update_sdr_metrics_updated_at ON sdr_daily_metrics;
CREATE TRIGGER update_sdr_metrics_updated_at 
BEFORE UPDATE ON sdr_daily_metrics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE sdr_daily_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for authenticated users" ON sdr_daily_metrics;
CREATE POLICY "Enable all for authenticated users" ON sdr_daily_metrics
FOR ALL USING (true);

-- Criar tabela marketing_data se não existir
CREATE TABLE IF NOT EXISTS marketing_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  platform TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  ad_spend NUMERIC(10, 2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue NUMERIC(10, 2) DEFAULT 0,
  utm_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_date ON marketing_data(date);
CREATE INDEX IF NOT EXISTS idx_marketing_platform ON marketing_data(platform);
CREATE INDEX IF NOT EXISTS idx_marketing_campaign ON marketing_data(campaign_name);
CREATE INDEX IF NOT EXISTS idx_marketing_utm_source ON marketing_data(utm_source);

DROP TRIGGER IF EXISTS update_marketing_data_updated_at ON marketing_data;
CREATE TRIGGER update_marketing_data_updated_at 
BEFORE UPDATE ON marketing_data
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE marketing_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for authenticated users" ON marketing_data;
CREATE POLICY "Enable all for authenticated users" ON marketing_data
FOR ALL USING (true);

-- Criar tabela activity_logs se não existir
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  entity_name TEXT,
  description TEXT,
  changes JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for authenticated users" ON activity_logs;
CREATE POLICY "Enable all for authenticated users" ON activity_logs
FOR ALL USING (true);

-- ========================================
-- CONCLUÍDO!
-- ========================================
