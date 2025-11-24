-- CRM Kyon - Supabase Schema
-- Execute este SQL no SQL Editor do Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Closer', 'SDR')),
  active BOOLEAN DEFAULT true,
  individual_goal NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_date DATE NOT NULL,
  owner TEXT NOT NULL,
  client_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  meeting_stage TEXT NOT NULL CHECK (meeting_stage IN ('R1', 'R2', 'R3', 'Fechado', 'No Show', 'Perdido')),
  deal_status TEXT NOT NULL CHECK (deal_status IN ('Em andamento', 'Ganho', 'Perdido')),
  client_revenue NUMERIC(10, 2) DEFAULT 0,
  partner_participated TEXT CHECK (partner_participated IN ('Sim', 'Não')),
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

-- SDR Daily Metrics Table
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

-- Marketing Data Table
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
CREATE INDEX IF NOT EXISTS idx_leads_call_date ON leads(call_date);
CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads(owner);
CREATE INDEX IF NOT EXISTS idx_leads_sdr_name ON leads(sdr_name);
CREATE INDEX IF NOT EXISTS idx_leads_deal_status ON leads(deal_status);
CREATE INDEX IF NOT EXISTS idx_sdr_metrics_date ON sdr_daily_metrics(date);
CREATE INDEX IF NOT EXISTS idx_sdr_metrics_sdr_name ON sdr_daily_metrics(sdr_name);
CREATE INDEX IF NOT EXISTS idx_marketing_date ON marketing_data(date);
CREATE INDEX IF NOT EXISTS idx_marketing_utm ON marketing_data(utm_source);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sdr_daily_metrics_updated_at BEFORE UPDATE ON sdr_daily_metrics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_data_updated_at BEFORE UPDATE ON marketing_data
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Desabilitado por enquanto para simplificar
-- Em produção, configure políticas adequadas
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sdr_daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_data ENABLE ROW LEVEL SECURITY;

-- Política temporária: permitir tudo (ajuste conforme necessário)
CREATE POLICY "Enable all for service role" ON team_members FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON leads FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON sdr_daily_metrics FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON marketing_data FOR ALL USING (true);
