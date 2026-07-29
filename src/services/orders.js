import { supabase } from '../lib/supabaseClient'

// Calls the create-checkout-session Edge Function, which re-prices the cart
// server-side, opens a pending order, and returns a Stripe Checkout URL.
export async function startCheckout({ items, customer, successUrl, cancelUrl }) {
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { items, customer, successUrl, cancelUrl },
  })

  if (error) {
    // Supabase wraps non-2xx responses in a FunctionsHttpError; the actual
    // { error: "message" } body from our function is on error.context.
    const message = await extractFunctionErrorMessage(error)
    throw new Error(message)
  }

  return data
}

async function extractFunctionErrorMessage(error) {
  try {
    const body = await error.context?.json?.()
    return body?.error || error.message
  } catch {
    return error.message
  }
}

// Orders placed while signed in — RLS only returns rows owned by the
// current user (or everything, if the caller happens to be an admin).
export async function fetchMyOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// --- Admin-only ---

export async function fetchOrdersForAdmin() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
