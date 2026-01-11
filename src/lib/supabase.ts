import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

// We allow the app to load even if variables are missing
// The ErrorBoundary or specific page logic will catch the connection failure later
// This prevents "White Screen of Death" on module load

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);
