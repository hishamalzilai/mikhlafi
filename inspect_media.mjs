import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function inspect() {
  const { data, error } = await supabase.from('media_library').select('*').limit(1);
  if (error) {
    console.error('Error fetching from media_library:', error);
  } else {
    console.log('Sample Data:', data[0]);
    console.log('Columns:', Object.keys(data[0] || {}));
  }
}

inspect();
