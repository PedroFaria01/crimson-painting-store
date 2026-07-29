// Builds a Stripe Checkout Session from a cart.
//
// Prices, stock, and totals are always recomputed here from the database —
// the client only ever sends product ids and quantities. This is the one
// place in the whole system that is allowed to decide what something costs.
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createAdminClient } from '../_shared/supabaseAdmin.ts'
import { createStripeClient } from '../_shared/stripe.ts'

const FREE_SHIPPING_THRESHOLD_CENTS = 5000
const SHIPPING_CENTS = 500
const MAX_ITEM_QUANTITY = 20

interface CartItemInput {
  productId: string
  quantity: number
}

interface CheckoutRequestBody {
  items: CartItemInput[]
  customer: {
    name: string
    email: string
    address: string
    city: string
    postalCode: string
  }
  successUrl: string
  cancelUrl: string
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// This function has verify_jwt disabled (guest checkout must work with no
// session at all), so any auth is resolved by hand: if the caller sent a
// real user's access token, link the order to them; anything else
// (no header, the anon key, an expired token) just falls back to guest.
async function resolveUserId(
  req: Request,
  supabase: ReturnType<typeof createAdminClient>
): Promise<string | null> {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '')
  if (!token) return null

  try {
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data.user) return null
    return data.user.id
  } catch {
    return null
  }
}

function validateBody(body: Partial<CheckoutRequestBody>): string | null {
  if (!Array.isArray(body.items) || body.items.length === 0) return 'Cart is empty.'
  for (const item of body.items) {
    if (typeof item.productId !== 'string' || !item.productId) return 'Invalid product in cart.'
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_ITEM_QUANTITY) {
      return 'Invalid quantity in cart.'
    }
  }
  const c = body.customer
  if (!c || !c.name || !c.email || !c.address || !c.city || !c.postalCode) {
    return 'Missing customer/shipping details.'
  }
  if (!body.successUrl || !body.cancelUrl) return 'Missing redirect URLs.'
  return null
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  let body: Partial<CheckoutRequestBody>
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400)
  }

  const validationError = validateBody(body)
  if (validationError) {
    return jsonResponse({ error: validationError }, 400)
  }

  const { items, customer, successUrl, cancelUrl } = body as CheckoutRequestBody
  const supabase = createAdminClient()
  const userId = await resolveUserId(req, supabase)

  const productIds = items.map((i) => i.productId)
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, price_cents, currency, stock, is_active')
    .in('id', productIds)

  if (productsError) {
    console.error('Failed to load products for checkout', productsError)
    return jsonResponse({ error: 'Could not load products.' }, 500)
  }

  const productById = new Map(products.map((p) => [p.id, p]))
  const orderItems: {
    product_id: string
    product_name: string
    unit_price_cents: number
    quantity: number
  }[] = []

  for (const item of items) {
    const product = productById.get(item.productId)
    if (!product || !product.is_active) {
      return jsonResponse({ error: `Product ${item.productId} is not available.` }, 400)
    }
    if (product.stock < item.quantity) {
      return jsonResponse({ error: `Not enough stock for "${product.name}".` }, 409)
    }
    orderItems.push({
      product_id: product.id,
      product_name: product.name,
      unit_price_cents: product.price_cents,
      quantity: item.quantity,
    })
  }

  const currency = products[0]?.currency ?? 'EUR'
  const subtotalCents = orderItems.reduce((sum, i) => sum + i.unit_price_cents * i.quantity, 0)
  const shippingCents = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS
  const totalCents = subtotalCents + shippingCents

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      customer_email: customer.email,
      customer_name: customer.name,
      shipping_address: {
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode,
      },
      status: 'pending',
      subtotal_cents: subtotalCents,
      shipping_cents: shippingCents,
      total_cents: totalCents,
      currency,
    })
    .select('id, order_number')
    .single()

  if (orderError || !order) {
    console.error('Failed to create order', orderError)
    return jsonResponse({ error: 'Could not create order.' }, 500)
  }

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems.map((i) => ({ ...i, order_id: order.id })))

  if (itemsError) {
    console.error('Failed to create order items', itemsError)
    return jsonResponse({ error: 'Could not create order.' }, 500)
  }

  const stripe = createStripeClient()
  const lineItems = orderItems.map((i) => ({
    quantity: i.quantity,
    price_data: {
      currency: currency.toLowerCase(),
      unit_amount: i.unit_price_cents,
      product_data: { name: i.product_name },
    },
  }))

  if (shippingCents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: currency.toLowerCase(),
        unit_amount: shippingCents,
        product_data: { name: 'Shipping' },
      },
    })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: customer.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { order_id: order.id, order_number: order.order_number },
    })

    await supabase
      .from('orders')
      .update({ stripe_checkout_session_id: session.id })
      .eq('id', order.id)

    return jsonResponse({ url: session.url, orderNumber: order.order_number })
  } catch (err) {
    console.error('Stripe session creation failed', err)
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id)
    return jsonResponse({ error: 'Could not start payment session.' }, 502)
  }
})
