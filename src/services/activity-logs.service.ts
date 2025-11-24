import { supabaseAdmin } from '../config/supabase';
import { ActivityLog } from '../types';
import { convertObjectToSnakeCase, convertObjectToCamelCase } from '../utils/caseConverter';

export class ActivityLogsService {
  private table = 'activity_logs';

  async getAll(filters?: { 
    startDate?: string; 
    endDate?: string; 
    userId?: string;
    entityType?: string;
    action?: string;
  }): Promise<ActivityLog[]> {
    let query = supabaseAdmin
      .from(this.table)
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1000); // Limitar para performance

    if (filters?.startDate && filters?.endDate) {
      query = query
        .gte('timestamp', filters.startDate)
        .lte('timestamp', filters.endDate);
    }

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters?.entityType) {
      query = query.eq('entity_type', filters.entityType);
    }

    if (filters?.action) {
      query = query.eq('action', filters.action);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(convertObjectToCamelCase);
  }

  async getById(id: string): Promise<ActivityLog | null> {
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? convertObjectToCamelCase(data) : null;
  }

  async create(log: Omit<ActivityLog, 'id' | 'timestamp' | 'createdAt'>): Promise<ActivityLog> {
    const snakeCaseLog = convertObjectToSnakeCase(log);
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .insert([snakeCaseLog])
      .select()
      .single();

    if (error) throw error;
    return convertObjectToCamelCase(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Método auxiliar para criar log de forma simplificada
  async logAction(
    userId: string,
    userName: string,
    action: ActivityLog['action'],
    entityType: ActivityLog['entity_type'],
    entityId: string,
    entityName: string,
    description: string,
    changes?: Record<string, { old: any; new: any }>
  ): Promise<ActivityLog> {
    return this.create({
      user_id: userId,
      user_name: userName,
      action,
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName,
      description,
      changes
    });
  }
}

export default new ActivityLogsService();
