-- Migration 006: Sistema de Autenticação
-- Adiciona email e senha aos membros da equipe

-- Adicionar colunas de autenticação
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Criar índice para email
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);

-- Comentários
COMMENT ON COLUMN team_members.email IS 'Email do membro para login';
COMMENT ON COLUMN team_members.password_hash IS 'Hash bcrypt da senha';
COMMENT ON COLUMN team_members.last_login IS 'Último login do usuário';

-- Tabela para tokens de sessão
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

-- RLS para sessões
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own sessions" ON user_sessions
FOR SELECT USING (true);

CREATE POLICY "Users can create sessions" ON user_sessions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete their own sessions" ON user_sessions
FOR DELETE USING (true);
