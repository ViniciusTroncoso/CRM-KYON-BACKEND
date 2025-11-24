-- Migration 002: Leads (Gestão de Closers)
-- Tabela para gerenciar leads, calls e pipeline de vendas

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

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_leads_call_date ON leads(call_date);
CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads(owner);
CREATE INDEX IF NOT EXISTS idx_leads_sdr_name ON leads(sdr_name);
CREATE INDEX IF NOT EXISTS idx_leads_deal_status ON leads(deal_status);
CREATE INDEX IF NOT EXISTS idx_leads_meeting_stage ON leads(meeting_stage);
CREATE INDEX IF NOT EXISTS idx_leads_utm_source ON leads(utm_source);

-- Trigger para updated_at
CREATE TRIGGER update_leads_updated_at 
BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated users" ON leads
FOR ALL USING (true);

-- Seed data inicial (opcional - alguns leads de exemplo)
INSERT INTO leads (call_date, owner, client_name, company_name, phone, meeting_stage, deal_status, proposed_value, closed_value, sdr_name, utm_source) VALUES
  ('2025-11-20', 'Ana Silva', 'João Pedro', 'Tech Solutions', '11999999999', 'Fechado', 'Ganho', 15000, 15000, 'Maria Oliveira', 'facebook_ad_001'),
  ('2025-11-21', 'Carlos Santos', 'Maria Costa', 'Marketing Pro', '11988888888', 'R2', 'Em andamento', 12000, 0, 'João Costa', 'google_ad_002'),
  ('2025-11-22', 'Ana Silva', 'Pedro Silva', 'Consultoria XYZ', '11977777777', 'R1', 'Em andamento', 20000, 0, 'Maria Oliveira', 'facebook_ad_003')
ON CONFLICT DO NOTHING;
