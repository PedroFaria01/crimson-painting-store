// Access-Control-Allow-Origin is intentionally permissive: these functions expose
// no user-specific data to the caller (create-checkout-session validates and prices
// everything server-side; stripe-webhook is never called from a browser). Restrict
// this to your storefront's origin if that assumption changes.
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  return null
}
