-- Migration 001: Team Members (Gestão de Equipe)
-- Tabela para gerenciar membros da equipe (Admins, Closers, SDRs)

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

-- Index para busca por role
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(active);

-- Trigger para updated_at
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

-- Row Level Security
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Política: permitir tudo (ajuste conforme necessário em produção)
CREATE POLICY "Enable all for authenticated users" ON team_members
FOR ALL USING (true);

-- Seed data inicial (opcional)
INSERT INTO team_members (name, role, active, individual_goal) VALUES
  ('Dr. Admin', 'Admin', true, 0),
  ('Ana Silva', 'Closer', true, 50000),
  ('Carlos Santos', 'Closer', true, 45000),
  ('Maria Oliveira', 'SDR', true, 30000),
  ('João Costa', 'SDR', true, 28000)
ON CONFLICT DO NOTHING;
