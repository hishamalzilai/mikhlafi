import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase Admin environment variables are missing! Admin operations will fail.");
}

// Initialize the Supabase Admin client with fail-safe values for build time
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseServiceKey || 'placeholder', 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
