import { createClient } from '@supabase/supabase-js';

// Runtime guard: prevent this module from ever running in a browser.
// If a developer accidentally imports it from a "use client" component,
// this will throw immediately instead of leaking the SERVICE_ROLE_KEY.
if (typeof window !== 'undefined') {
  throw new Error(
    'CRITICAL: supabase-admin.ts must NEVER be imported in client-side code. ' +
    'The SUPABASE_SERVICE_ROLE_KEY would be exposed to the browser.'
  );
}

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
