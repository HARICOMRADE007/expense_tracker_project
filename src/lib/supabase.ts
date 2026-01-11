import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iosfvdviyfnhqflpuzqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvc2Z2ZHZpeWZuaHFmbHB1enFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNjA4NDMsImV4cCI6MjA4MzYzNjg0M30.OacQ60QSK9qjvJ3Y7WX_NjAkm3K85WKnw1fLHQ6_Dzc';

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);
