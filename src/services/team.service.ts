import { supabaseAdmin } from '../config/supabase';
import { TeamMember } from '../types';

// Conversão entre snake_case (DB) e camelCase (API)
const toSnakeCase = (obj: any): any => {
  if (!obj) return obj;
  const result: any = {};
  
  // Mapear apenas os campos que existem
  if (obj.id) result.id = obj.id;
  if (obj.name) result.name = obj.name;
  if (obj.role) result.role = obj.role;
  if (obj.active !== undefined) result.active = obj.active;
  if (obj.individualGoal !== undefined) result.individual_goal = obj.individualGoal;
  if (obj.createdAt) result.created_at = obj.createdAt;
  if (obj.updatedAt) result.updated_at = obj.updatedAt;
  
  return result;
};

const toCamelCase = (obj: any): any => {
  if (!obj) return obj;
  return {
    ...obj,
    individualGoal: obj.individual_goal,
    createdAt: obj.created_at,
    updatedAt: obj.updated_at
  };
};

export class TeamService {
  private table = 'team_members';

  async getAll(): Promise<TeamMember[]> {
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(toCamelCase);
  }

  async getById(id: string): Promise<TeamMember | null> {
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? toCamelCase(data) : null;
  }

  async create(member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMember> {
    const snakeCaseMember = toSnakeCase(member);
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .insert([snakeCaseMember])
      .select()
      .single();

    if (error) throw error;
    return toCamelCase(data);
  }

  async update(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    const snakeCaseUpdates = toSnakeCase(updates);
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .update(snakeCaseUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toCamelCase(data);
  }

  async deleteTeamMember(id: string): Promise<void> {
    // Verificar se é super admin
    const { data: member } = await supabaseAdmin
      .from('team_members')
      .select('is_super_admin, name')
      .eq('id', id)
      .single();

    if (member?.is_super_admin) {
      throw new Error('Não é possível deletar o Super Admin');
    }

    const { error } = await supabaseAdmin
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async toggleTeamMemberStatus(id: string): Promise<any> {
    // Buscar membro atual
    const { data: currentMember, error: fetchError } = await supabaseAdmin
      .from('team_members')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Verificar se é super admin e está tentando desativar
    if (currentMember.is_super_admin && currentMember.active) {
      throw new Error('Não é possível desativar o Super Admin');
    }

    // Alternar status
    const { data, error } = await supabaseAdmin
      .from('team_members')
      .update({ active: !currentMember.active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toCamelCase(data);
  }

  async toggleStatus(id: string): Promise<TeamMember> {
    const member = await this.getById(id);
    if (!member) throw new Error('Member not found');

    return this.update(id, { active: !member.active });
  }

  // Alias para compatibilidade com as rotas
  async delete(id: string): Promise<void> {
    return this.deleteTeamMember(id);
  }
}

export default new TeamService();
