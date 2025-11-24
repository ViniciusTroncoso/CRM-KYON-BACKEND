import { supabaseAdmin } from '../config/supabase';
import { MarketingData } from '../types';
import { convertObjectToSnakeCase, convertObjectToCamelCase } from '../utils/caseConverter';

export class MarketingService {
  private table = 'marketing_data';

  async getAll(filters?: { 
    startDate?: string; 
    endDate?: string; 
    platform?: string;
  }): Promise<MarketingData[]> {
    let query = supabaseAdmin
      .from(this.table)
      .select('*')
      .order('date', { ascending: false });

    if (filters?.startDate && filters?.endDate) {
      query = query
        .gte('date', filters.startDate)
        .lte('date', filters.endDate);
    }

    if (filters?.platform) {
      query = query.eq('platform', filters.platform);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(convertObjectToCamelCase);
  }

  async getById(id: string): Promise<MarketingData | null> {
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? convertObjectToCamelCase(data) : null;
  }

  async create(item: Omit<MarketingData, 'id' | 'createdAt' | 'updatedAt'>): Promise<MarketingData> {
    const snakeCaseItem = convertObjectToSnakeCase(item);
    const { data, error} = await supabaseAdmin
      .from(this.table)
      .insert([snakeCaseItem])
      .select()
      .single();

    if (error) throw error;
    return convertObjectToCamelCase(data);
  }

  async bulkCreate(items: Omit<MarketingData, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<MarketingData[]> {
    const snakeCaseItems = items.map(convertObjectToSnakeCase);
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .insert(snakeCaseItems)
      .select();

    if (error) throw error;
    return (data || []).map(convertObjectToCamelCase);
  }

  async update(id: string, updates: Partial<MarketingData>): Promise<MarketingData> {
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

export default new MarketingService();
