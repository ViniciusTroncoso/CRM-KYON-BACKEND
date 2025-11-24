import { supabaseAdmin } from '../config/supabase';
import { SdrDailyMetric } from '../types';
import { convertObjectToSnakeCase, convertObjectToCamelCase } from '../utils/caseConverter';

export class SdrLogsService {
  private table = 'sdr_daily_metrics';

  async getAll(filters?: { 
    startDate?: string; 
    endDate?: string; 
    sdrName?: string;
  }): Promise<SdrDailyMetric[]> {
    let query = supabaseAdmin
      .from(this.table)
      .select('*')
      .order('date', { ascending: false });

    if (filters?.startDate && filters?.endDate) {
      query = query
        .gte('date', filters.startDate)
        .lte('date', filters.endDate);
    }

    if (filters?.sdrName) {
      query = query.eq('sdr_name', filters.sdrName);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(convertObjectToCamelCase);
  }

  async getById(id: string): Promise<SdrDailyMetric | null> {
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? convertObjectToCamelCase(data) : null;
  }

  async create(log: Omit<SdrDailyMetric, 'id' | 'createdAt' | 'updatedAt'>): Promise<SdrDailyMetric> {
    const snakeCaseLog = convertObjectToSnakeCase(log);
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .insert([snakeCaseLog])
      .select()
      .single();

    if (error) throw error;
    return convertObjectToCamelCase(data);
  }

  async update(id: string, updates: Partial<SdrDailyMetric>): Promise<SdrDailyMetric> {
    const snakeCaseUpdates = convertObjectToSnakeCase(updates);
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .update(snakeCaseUpdates)
      .eq('id', id)
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
}

export default new SdrLogsService();
