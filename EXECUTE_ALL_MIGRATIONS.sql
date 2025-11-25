-- ========================================
-- EXECUTE TODAS AS MIGRAÇÕES DO CRM KYON
-- ========================================
-- Execute este arquivo no Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Cole este código > Run

-- Migration 001: Team Members
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Closer', 'SDR')),
  active BOOLEAN DEFAULT true,
  individual_goal NUMERIC(10, 2) DEFAULT 0,
  is_super_admin BOOLEAN DEFAULT false,
  email TEXT UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(active);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_team_members_updated_at 
BEFORE UPDATE ON team_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated users" ON team_members
FOR ALL USING (true);

-- Migration 002: Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_date DATE NOT NULL,
  owner TEXT NOT NULL,
  client_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  meeting_stage TEXT NOT NULL CHECK (meeting_stage IN ('R1', 'R2', 'R3', 'Follow up', 'Fechado', 'No Show', 'Perdido')),
  deal_status TEXT NOT NULL CHECK (deal_status IN ('Em andamento', 'Ganho', 'Perdido')),
  client_revenue NUMERIC(10, 2) DEFAULT 0,
  partner_participated TEXT CHECK (partner_participated IN ('Sim', 'Não', 'Não tem sócios')),
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

CREATE INDEX IF NOT EXISTS idx_leads_call_date ON leads(call_date);
CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads(owner);
CREATE INDEX IF NOT EXISTS idx_leads_sdr_name ON leads(sdr_name);
CREATE INDEX IF NOT EXISTS idx_leads_deal_status ON leads(deal_status);
CREATE INDEX IF NOT EXISTS idx_leads_meeting_stage ON leads(meeting_stage);
CREATE INDEX IF NOT EXISTS idx_leads_utm_source ON leads(utm_source);

CREATE TRIGGER update_leads_updated_at 
BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated users" ON leads
FOR ALL USING (true);

-- Migration 003: SDR Metrics
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

CREATE TRIGGER update_sdr_metrics_updated_at 
BEFORE UPDATE ON sdr_daily_metrics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE sdr_daily_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated users" ON sdr_daily_metrics
FOR ALL USING (true);

-- Migration 004: Marketing Data
CREATE TABLE IF NOT EXISTS marketing_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('Facebook', 'Google', 'Instagram', 'TikTok', 'LinkedIn', 'Outro')),
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

CREATE TRIGGER update_marketing_data_updated_at 
BEFORE UPDATE ON marketing_data
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE marketing_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated users" ON marketing_data
FOR ALL USING (true);

-- Migration 005: Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'toggle', 'sync')),
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

CREATE POLICY "Enable all for authenticated users" ON activity_logs
FOR ALL USING (true);

-- Migration 007: Protect Super Admin
CREATE OR REPLACE FUNCTION prevent_super_admin_deletion()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_super_admin = true THEN
    RAISE EXCEPTION 'Não é possível deletar o Super Admin';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_super_admin_deletion_trigger
BEFORE DELETE ON team_members
FOR EACH ROW EXECUTE FUNCTION prevent_super_admin_deletion();

CREATE OR REPLACE FUNCTION prevent_super_admin_deactivation()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_super_admin = true AND NEW.active = false THEN
    RAISE EXCEPTION 'Não é possível desativar o Super Admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_super_admin_deactivation_trigger
BEFORE UPDATE ON team_members
FOR EACH ROW EXECUTE FUNCTION prevent_super_admin_deactivation();

-- ========================================
-- CONCLUÍDO!
-- ========================================
-- Todas as tabelas foram criadas com sucesso!
