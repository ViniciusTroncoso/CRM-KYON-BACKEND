import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Cliente admin (bypassa RLS - usado para todas as operações)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Exporta como padrão também
export const supabase = supabaseAdmin;

export default supabaseAdmin;
