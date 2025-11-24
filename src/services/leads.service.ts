import { supabaseAdmin } from '../config/supabase';
import { Lead } from '../types';

// Conversão entre snake_case (DB) e camelCase (API)
const toSnakeCase = (obj: any): any => {
  if (!obj) return obj;
  const converted: any = { ...obj };
  if (obj.callDate) converted.call_date = obj.callDate;
  if (obj.clientName) converted.client_name = obj.clientName;
  if (obj.companyName) converted.company_name = obj.companyName;
  if (obj.meetingStage) converted.meeting_stage = obj.meetingStage;
  if (obj.dealStatus) converted.deal_status = obj.dealStatus;
  if (obj.clientRevenue !== undefined) converted.client_revenue = obj.clientRevenue;
  if (obj.partnerParticipated) converted.partner_participated = obj.partnerParticipated;
  if (obj.proposalSent !== undefined) converted.proposal_sent = obj.proposalSent;
  if (obj.planOfInterest) converted.plan_of_interest = obj.planOfInterest;
  if (obj.proposedValue !== undefined) converted.proposed_value = obj.proposedValue;
  if (obj.closedValue !== undefined) converted.closed_value = obj.closedValue;
  if (obj.mainObjection) converted.main_objection = obj.mainObjection;
  if (obj.sdrName) converted.sdr_name = obj.sdrName;
  if (obj.downPaymentMade !== undefined) converted.down_payment_made = obj.downPaymentMade;
  if (obj.downPaymentValue !== undefined) converted.down_payment_value = obj.downPaymentValue;
  if (obj.utmSource) converted.utm_source = obj.utmSource;
  if (obj.createdAt) converted.created_at = obj.createdAt;
  if (obj.updatedAt) converted.updated_at = obj.updatedAt;
  return converted;
};

const toCamelCase = (obj: any): any => {
  if (!obj) return obj;
  return {
    ...obj,
    callDate: obj.call_date,
    clientName: obj.client_name,
    companyName: obj.company_name,
    meetingStage: obj.meeting_stage,
    dealStatus: obj.deal_status,
    clientRevenue: obj.client_revenue,
    partnerParticipated: obj.partner_participated,
    proposalSent: obj.proposal_sent,
    planOfInterest: obj.plan_of_interest,
    proposedValue: obj.proposed_value,
    closedValue: obj.closed_value,
    mainObjection: obj.main_objection,
    sdrName: obj.sdr_name,
    downPaymentMade: obj.down_payment_made,
    downPaymentValue: obj.down_payment_value,
    utmSource: obj.utm_source,
    createdAt: obj.created_at,
    updatedAt: obj.updated_at
  };
};

export class LeadsService {
  private table = 'leads';

  async getAll(filters?: { 
    startDate?: string; 
    endDate?: string; 
    owner?: string;
    sdrName?: string;
  }): Promise<Lead[]> {
    let query = supabaseAdmin
      .from(this.table)
      .select('*')
      .order('call_date', { ascending: false });

    if (filters?.startDate && filters?.endDate) {
      query = query
        .gte('call_date', filters.startDate)
        .lte('call_date', filters.endDate);
    }

    if (filters?.owner) {
      query = query.eq('owner', filters.owner);
    }

    if (filters?.sdrName) {
      query = query.eq('sdr_name', filters.sdrName);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(toCamelCase);
  }

  async getById(id: string): Promise<Lead | null> {
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? toCamelCase(data) : null;
  }

  async create(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const snakeCaseLead = toSnakeCase(lead);
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .insert([snakeCaseLead])
      .select()
      .single();

    if (error) throw error;
    return toCamelCase(data);
  }

  async update(id: string, updates: Partial<Lead>): Promise<Lead> {
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

  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export default new LeadsService();
