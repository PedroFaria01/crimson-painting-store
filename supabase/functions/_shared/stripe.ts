import Stripe from 'npm:stripe@17'

export function createStripeClient() {
  const secretKey = Deno.env.get('STRIPE_SECRET_KEY')
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY function secret')
  }

  // httpClient must be the Fetch-based one — Stripe's default Node http client
  // isn't available in the Deno Edge Function runtime.
  return new Stripe(secretKey, {
    apiVersion: '2024-06-20',
    httpClient: Stripe.createFetchHttpClient(),
  })
}
