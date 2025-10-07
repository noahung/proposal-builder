// Debug utility to check environment variables in browser console
// Open browser console and paste this to verify Supabase config

console.log('🔍 Environment Variables Check:');
console.log('================================');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  console.log('✅ VITE_SUPABASE_URL:', supabaseUrl);
  console.log('✅ VITE_SUPABASE_ANON_KEY:', supabaseKey.substring(0, 20) + '...');
  console.log('✅ Environment variables are loaded correctly!');
} else {
  console.error('❌ Missing environment variables:');
  if (!supabaseUrl) console.error('  - VITE_SUPABASE_URL is missing');
  if (!supabaseKey) console.error('  - VITE_SUPABASE_ANON_KEY is missing');
  console.error('');
  console.error('💡 Solution:');
  console.error('  1. Stop the dev server (Ctrl+C)');
  console.error('  2. Make sure .env.local exists in project root');
  console.error('  3. Restart: npm run dev');
}

console.log('');
console.log('🧹 Local Storage Check:');
console.log('================================');
console.log('Supabase Auth:', localStorage.getItem('sb-tforlcfzrlzguqlcxryq-auth-token') ? '⚠️ Found (may be stale)' : '✅ Clean');
console.log('');
console.log('💡 If stuck on loading screen:');
console.log('  1. Clear Application → Local Storage');
console.log('  2. Clear Application → Session Storage');
console.log('  3. Refresh the page (F5)');
