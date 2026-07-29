import { createClient } from 'npm:@supabase/supabase-js@2'

// Service-role client: bypasses RLS. Only ever used inside Edge Functions,
// never exposed to the browser. Requires SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY to be set as function secrets.
export function createAdminClient() {
  const url = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!url || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY function secrets')
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
