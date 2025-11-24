-- Migration 007: Proteger Super Admin
-- Adiciona coluna is_super_admin e proteção contra deleção

-- Adicionar coluna is_super_admin
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;

-- Marcar Vinícius CEO como super admin
UPDATE team_members 
SET is_super_admin = true 
WHERE email = 'vinitroncoso@gmail.com';

-- Criar função que previne deleção do super admin
CREATE OR REPLACE FUNCTION prevent_super_admin_deletion()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_super_admin = true THEN
    RAISE EXCEPTION 'Não é possível deletar o Super Admin';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para prevenir deleção
DROP TRIGGER IF EXISTS protect_super_admin ON team_members;
CREATE TRIGGER protect_super_admin
  BEFORE DELETE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION prevent_super_admin_deletion();

-- Criar função que previne desativação do super admin
CREATE OR REPLACE FUNCTION prevent_super_admin_deactivation()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_super_admin = true AND NEW.active = false THEN
    RAISE EXCEPTION 'Não é possível desativar o Super Admin';
  END IF;
  IF OLD.is_super_admin = true AND NEW.is_super_admin = false THEN
    RAISE EXCEPTION 'Não é possível remover privilégios de Super Admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para prevenir desativação
DROP TRIGGER IF EXISTS protect_super_admin_status ON team_members;
CREATE TRIGGER protect_super_admin_status
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION prevent_super_admin_deactivation();

-- Comentários
COMMENT ON COLUMN team_members.is_super_admin IS 'Super Admin que não pode ser deletado ou desativado';
