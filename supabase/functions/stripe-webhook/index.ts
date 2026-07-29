// Confirms orders once Stripe reports the payment as settled.
//
// This is the ONLY place stock gets decremented and orders move to "paid" —
// never on checkout-session creation, so an abandoned or failed checkout
// never touches inventory.
import { corsHeaders } from '../_shared/cors.ts'
import { createAdminClient } from '../_shared/supabaseAdmin.ts'
import { createStripeClient } from '../_shared/stripe.ts'
import { sendOrderConfirmationEmail } from '../_shared/resend.ts'

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  if (!signature || !webhookSecret) {
    return new Response('Missing signature or webhook secret', { status: 400 })
  }

  const stripe = createStripeClient()
  const payload = await req.text()

  let event
  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed', err)
    return new Response('Invalid signature', { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const session = event.data.object as {
    id: string
    payment_intent: string | null
    metadata: Record<string, string> | null
  }

  const supabase = createAdminClient()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(
      'id, status, order_number, customer_email, customer_name, subtotal_cents, shipping_cents, total_cents, currency'
    )
    .eq('stripe_checkout_session_id', session.id)
    .maybeSingle()

  if (orderError) {
    console.error('Failed to load order for webhook', orderError)
    return new Response('Internal error', { status: 500 })
  }

  if (!order) {
    console.error('No order found for Stripe session', session.id)
    // Acknowledge anyway — retrying won't make the order appear.
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Idempotency: Stripe may deliver the same event more than once.
  if (order.status === 'paid') {
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: 'paid', stripe_payment_intent_id: session.payment_intent })
    .eq('id', order.id)

  if (updateError) {
    console.error('Failed to mark order as paid', updateError)
    return new Response('Internal error', { status: 500 })
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('product_id, product_name, unit_price_cents, quantity')
    .eq('order_id', order.id)

  if (itemsError) {
    console.error('Failed to load order items for stock decrement', itemsError)
  } else {
    for (const item of items) {
      if (!item.product_id) continue
      const { error: stockError } = await supabase.rpc('decrement_product_stock', {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      })
      if (stockError) {
        console.error(`Failed to decrement stock for product ${item.product_id}`, stockError)
      }
    }

    // Best-effort: a failed email should never fail the webhook — Stripe
    // would just retry and re-decrement stock (the RPC is floor-at-zero,
    // but re-sending emails on every retry is a worse failure mode).
    try {
      await sendOrderConfirmationEmail(order, items)
    } catch (err) {
      console.error('Failed to send order confirmation email', err)
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
