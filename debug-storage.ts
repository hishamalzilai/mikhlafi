import { supabaseAdmin } from './src/lib/supabase-admin';

async function debug() {
  console.log("--- DEBUGGING STORAGE ---");
  
  // 1. Check existing News URLs
  const { data: news } = await supabaseAdmin.from('news').select('id, title, image_url').limit(5);
  console.log("Recent News URLs:");
  news?.forEach(n => console.log(`[${n.id}] ${n.title}: ${n.image_url}`));

  // 2. Check existing Library URLs
  const { data: library } = await supabaseAdmin.from('media_library').select('id, title, thumbnail_url').limit(5);
  console.log("\nRecent Library URLs:");
  library?.forEach(l => console.log(`[${l.id}] ${l.title}: ${l.thumbnail_url}`));

  // 3. Check bucket settings
  const { data: buckets, error: bucketError } = await supabaseAdmin.storage.listBuckets();
  if (bucketError) {
    console.error("Error listing buckets:", bucketError);
  } else {
    console.log("\nAvailable Buckets:");
    buckets.forEach(b => console.log(`- ${b.name} (Public: ${b.public})`));
  }
}

debug();
