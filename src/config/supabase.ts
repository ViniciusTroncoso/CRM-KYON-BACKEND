import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Cliente público (para operações com RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente admin (bypassa RLS - usar com cuidado)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
