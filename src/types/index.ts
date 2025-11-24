// Database Types - Match com o schema do Supabase

export interface TeamMember {
  id: string;
  name: string;
  role: 'Admin' | 'Closer' | 'SDR';
  active: boolean;
  individual_goal?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Lead {
  id: string;
  call_date: string;
  owner: string;
  client_name: string;
  company_name?: string;
  phone?: string;
  meeting_stage: 'R1' | 'R2' | 'R3' | 'Fechado' | 'No Show' | 'Perdido';
  deal_status: 'Em andamento' | 'Ganho' | 'Perdido';
  client_revenue?: number;
  partner_participated: 'Sim' | 'Não';
  proposal_sent: boolean;
  plan_of_interest?: string;
  proposed_value?: number;
  closed_value?: number;
  main_objection?: string;
  sdr_name?: string;
  down_payment_made: boolean;
  down_payment_value?: number;
  utm_source?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SdrDailyMetric {
  id: string;
  date: string;
  sdr_name: string;
  leads_contacted: number;
  calls_made: number;
  meetings_booked: number;
  no_shows: number;
  created_at?: string;
  updated_at?: string;
}

export interface MarketingData {
  id: string;
  date: string;
  platform: string;
  status: string;
  creative_name: string;
  ad_set_name: string;
  campaign_name: string;
  utm_source?: string;
  spend: number;
  impressions: number;
  clicks: number;
  hook_rate?: number;
  body_rate?: number;
  connect_rate?: number;
  page_conversion_rate?: number;
  cpm?: number;
  ctr?: number;
  cac?: number;
  roas?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  action: 'create' | 'update' | 'delete' | 'toggle' | 'sync';
  entity_type: 'lead' | 'sdr_log' | 'team_member' | 'marketing_data';
  entity_id: string;
  entity_name?: string;
  changes?: Record<string, { old: any; new: any }>;
  description: string;
  created_at?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
